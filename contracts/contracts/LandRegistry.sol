// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title LandRegistry
 * @dev Production-grade Land Registry for Nigeria, aligned with the Land Use Act (1978).
 * Features: Multi-step transfer workflow, Governor-level override, Dispute staked mechanism,
 * and OpenZeppelin v5 AccessControlDefaultAdminRules for the highest security in ownership transfer.
 */
contract LandRegistry is AccessControlDefaultAdminRules, ReentrancyGuard, Pausable {
    
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant SURVEYOR_ROLE = keccak256("SURVEYOR_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");

    enum ParcelStatus { Active, Frozen, Disputed }
    enum TransferStatus { None, Initiated, SurveyorVerified, LegallyValidated, Completed }

    // --- Custom Errors ---
    error ParcelDoesNotExist(uint256 parcelId);
    error ParcelNotActive(uint256 parcelId);
    error UnauthorizedSender();
    error InvalidAddress();
    error InsufficientFee(uint256 required, uint256 provided);

    struct LandParcel {
        uint256 parcelId;
        string gpsCoordinates;
        uint256 area;
        string ipfsHash;
        address currentOwner;
        ParcelStatus status;
        uint256 registrationTimestamp;
    }

    struct TransferRequest {
        uint256 parcelId;
        address from;
        address to;
        TransferStatus status;
        bool surveyorApproved;
        bool verifierApproved;
        bool registrarApproved;
    }

    // --- State Variables ---
    uint256 private _nextParcelId = 1;
    uint256 public registrationFee;
    uint256 public disputeFee;

    mapping(uint256 => LandParcel) public parcels;
    mapping(uint256 => TransferRequest) public transferRequests;
    mapping(uint256 => string) public disputeReason;
    mapping(uint256 => address) public disputeClaimants;
    mapping(bytes32 => bool) public gpsRegistered;

    // --- Events ---
    event LandRegistered(uint256 indexed parcelId, address indexed owner, string ipfsHash);
    event TransferInitiated(uint256 indexed parcelId, address indexed from, address indexed to);
    event TransferApproved(uint256 indexed parcelId, bytes32 role);
    event TransferCompleted(uint256 indexed parcelId, address indexed from, address indexed to);
    event TransferRejected(uint256 indexed parcelId, address indexed rejectedBy, string reason);
    event TransferRevoked(uint256 indexed parcelId, address indexed owner);
    event DisputeFiled(uint256 indexed parcelId, address indexed claimant, string reason);
    event DisputeResolved(uint256 indexed parcelId, ParcelStatus resolvedStatus);
    event ParcelFrozen(uint256 indexed parcelId, address indexed actor);
    event MetadataUpdated(uint256 indexed parcelId, string newIpfsHash, address indexed updatedBy);
    event FeesUpdated(uint256 registrationFee, uint256 disputeFee);

    /**
     * @dev Initialize the contract setting the default admin and initial delays.
     * @param initialDelay The time delay for transferring the default admin role.
     * @param admin The address to be granted the DEFAULT_ADMIN_ROLE.
     */
    constructor(
        uint48 initialDelay,
        address admin
    ) AccessControlDefaultAdminRules(initialDelay, admin) {
        // Set default fees (can be updated later)
        registrationFee = 0.01 ether; // e.g., MATIC
        disputeFee = 0.05 ether;
    }

    // --- Modifiers ---
    modifier parcelExists(uint256 parcelId) {
        if (parcels[parcelId].parcelId == 0) revert ParcelDoesNotExist(parcelId);
        _;
    }

    // --- Core Functions ---

    /**
     * @dev Registers a new land parcel. Only callable by the Registrar and requires the registration fee.
     * @param owner The initial owner of the land.
     * @param gps The physical GPS coordinates or boundaries (Merkle root or string).
     * @param area The area of the land in SQM.
     * @param ipfsHash The CID of the title deed on IPFS.
     */
    function registerLand(
        address owner,
        string memory gps,
        uint256 area,
        string memory ipfsHash
    ) external payable onlyRole(REGISTRAR_ROLE) whenNotPaused {
        require(msg.value >= registrationFee, "Insufficient registration fee");
        require(owner != address(0), "Invalid owner address");
        
        // Prevent double registration
        bytes32 gpsHash = keccak256(abi.encodePacked(gps));
        require(!gpsRegistered[gpsHash], "Land with these coordinates already registered");

        uint256 parcelId = _nextParcelId++;
        
        parcels[parcelId] = LandParcel({
            parcelId: parcelId,
            gpsCoordinates: gps,
            area: area,
            ipfsHash: ipfsHash,
            currentOwner: owner,
            status: ParcelStatus.Active,
            registrationTimestamp: block.timestamp
        });

        gpsRegistered[gpsHash] = true;

        emit LandRegistered(parcelId, owner, ipfsHash);

        // Refund excess fee
        if (msg.value > registrationFee) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - registrationFee}("");
            require(success, "Refund failed");
        }
    }

    /**
     * @dev Updates parcel metadata. Only callable by REGISTRAR_ROLE.
     */
    function updateMetadata(uint256 parcelId, string calldata newIpfsHash) external onlyRole(REGISTRAR_ROLE) parcelExists(parcelId) whenNotPaused {
        parcels[parcelId].ipfsHash = newIpfsHash;
        emit MetadataUpdated(parcelId, newIpfsHash, msg.sender);
    }

    /**
     * @dev Step 1 of Transfer: Initiates an ownership transfer. Callable by the current owner.
     */
    function initiateTransfer(uint256 parcelId, address to) external nonReentrant parcelExists(parcelId) whenNotPaused {
        if (parcels[parcelId].currentOwner != msg.sender) revert UnauthorizedSender();
        if (parcels[parcelId].status != ParcelStatus.Active) revert ParcelNotActive(parcelId);
        if (to == address(0) || to == msg.sender) revert InvalidAddress();
        require(transferRequests[parcelId].status == TransferStatus.None, "Transfer already in progress");

        transferRequests[parcelId] = TransferRequest({
            parcelId: parcelId,
            from: msg.sender,
            to: to,
            status: TransferStatus.Initiated,
            surveyorApproved: false,
            verifierApproved: false,
            registrarApproved: false
        });

        emit TransferInitiated(parcelId, msg.sender, to);
    }

    /**
     * @dev Owner can revoke a pending transfer before it is completed.
     */
    function revokeTransfer(uint256 parcelId) external nonReentrant parcelExists(parcelId) whenNotPaused {
        require(parcels[parcelId].currentOwner == msg.sender, "Not the parcel owner");
        require(
            transferRequests[parcelId].status != TransferStatus.None && 
            transferRequests[parcelId].status != TransferStatus.Completed, 
            "No active transfer to revoke"
        );

        delete transferRequests[parcelId];
        emit TransferRevoked(parcelId, msg.sender);
    }

    /**
     * @dev Step 2 of Transfer: Surveyor verifies the physical boundaries.
     */
    function verifySurvey(uint256 parcelId) external onlyRole(SURVEYOR_ROLE) parcelExists(parcelId) whenNotPaused {
        require(transferRequests[parcelId].status == TransferStatus.Initiated, "Transfer not initiated");
        if (parcels[parcelId].status != ParcelStatus.Active) revert ParcelNotActive(parcelId);
        
        transferRequests[parcelId].surveyorApproved = true;
        transferRequests[parcelId].status = TransferStatus.SurveyorVerified;

        emit TransferApproved(parcelId, SURVEYOR_ROLE);
    }

    /**
     * @dev Step 3 of Transfer: Verifier role validates legal documents.
     */
    function validateLegal(uint256 parcelId) external onlyRole(VERIFIER_ROLE) parcelExists(parcelId) whenNotPaused {
        require(transferRequests[parcelId].status == TransferStatus.SurveyorVerified, "Pending surveyor verification");
        if (parcels[parcelId].status != ParcelStatus.Active) revert ParcelNotActive(parcelId);

        transferRequests[parcelId].verifierApproved = true;
        transferRequests[parcelId].status = TransferStatus.LegallyValidated;

        emit TransferApproved(parcelId, VERIFIER_ROLE);
    }

    /**
     * @dev Step 4 of Transfer: Registrar officially approves and finalizes the ownership transfer.
     */
    function approveTransfer(uint256 parcelId) external onlyRole(REGISTRAR_ROLE) nonReentrant parcelExists(parcelId) whenNotPaused {
        TransferRequest storage request = transferRequests[parcelId];
        require(request.status == TransferStatus.LegallyValidated, "Pending legal validation");
        if (parcels[parcelId].status != ParcelStatus.Active) revert ParcelNotActive(parcelId);
        
        request.registrarApproved = true;
        request.status = TransferStatus.Completed;
        
        address oldOwner = parcels[parcelId].currentOwner;
        address newOwner = request.to;
        
        parcels[parcelId].currentOwner = newOwner;

        emit TransferApproved(parcelId, REGISTRAR_ROLE);
        emit TransferCompleted(parcelId, oldOwner, newOwner);
        
        delete transferRequests[parcelId];
    }

    /**
     * @dev Reject a transfer at any point by the Surveyor, Verifier, or Registrar.
     */
    function rejectTransfer(uint256 parcelId, string calldata reason) external nonReentrant parcelExists(parcelId) whenNotPaused {
        require(
            hasRole(SURVEYOR_ROLE, msg.sender) || 
            hasRole(VERIFIER_ROLE, msg.sender) || 
            hasRole(REGISTRAR_ROLE, msg.sender), 
            "Unauthorized to reject"
        );
        require(
            transferRequests[parcelId].status != TransferStatus.None && 
            transferRequests[parcelId].status != TransferStatus.Completed, 
            "No active transfer to reject"
        );

        delete transferRequests[parcelId];
        emit TransferRejected(parcelId, msg.sender, reason);
    }

    // --- Dispute & Governance ---

    /**
     * @dev Files an official dispute against a parcel.
     * To prevent DoS, the caller must pay a high anti-spam fee (staked), 
     * which deters baseless disputes freezing land.
     */
    function fileDispute(uint256 parcelId, string calldata reason) external payable parcelExists(parcelId) {
        // Staked dispute resolution workaround to prevent DoS attacks on Land Owners
        require(msg.value >= disputeFee, "Insufficient dispute fee");
        require(parcels[parcelId].status == ParcelStatus.Active, "Parcel is not active or already disputed");
        
        parcels[parcelId].status = ParcelStatus.Disputed;
        disputeReason[parcelId] = reason;
        disputeClaimants[parcelId] = msg.sender;

        emit DisputeFiled(parcelId, msg.sender, reason);

        if (msg.value > disputeFee) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - disputeFee}("");
            require(success, "Refund failed");
        }
    }

    /**
     * @dev Resolves a dispute. Only callable by Governor.
     * Can optionally reward the staked fee back to the claimant or confiscate it.
     */
    function resolveDispute(uint256 parcelId, ParcelStatus resolvedStatus, bool refundClaimant) external onlyRole(GOVERNOR_ROLE) parcelExists(parcelId) {
        require(parcels[parcelId].status == ParcelStatus.Disputed, "Parcel not disputed");
        
        parcels[parcelId].status = resolvedStatus;
        
        address claimant = disputeClaimants[parcelId];
        
        delete disputeReason[parcelId];
        delete disputeClaimants[parcelId];

        emit DisputeResolved(parcelId, resolvedStatus);

        // Refund logic
        if (refundClaimant && claimant != address(0)) {
            (bool success, ) = payable(claimant).call{value: disputeFee}("");
            require(success, "Refund failed");
        }
    }

    /**
     * @dev Emergency freeze by the Governor or Admin. Instantly locks the parcel.
     */
    function emergencyFreeze(uint256 parcelId) external parcelExists(parcelId) {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(GOVERNOR_ROLE, msg.sender), "Unauthorized");
        parcels[parcelId].status = ParcelStatus.Frozen;
        emit ParcelFrozen(parcelId, msg.sender);
    }

    /**
     * @dev Governor can forcefully reassign ownership (eminent domain / supreme court order).
     */
    function forceTransfer(uint256 parcelId, address newOwner) external onlyRole(GOVERNOR_ROLE) parcelExists(parcelId) {
        address oldOwner = parcels[parcelId].currentOwner;
        parcels[parcelId].currentOwner = newOwner;
        
        // Clear any pending transfers
        delete transferRequests[parcelId];

        emit TransferCompleted(parcelId, oldOwner, newOwner);
    }

    // --- Admin Operations ---

    function setFees(uint256 _registrationFee, uint256 _disputeFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        registrationFee = _registrationFee;
        disputeFee = _disputeFee;
        emit FeesUpdated(_registrationFee, _disputeFee);
    }

    function withdrawFees(address payable to) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(to != address(0), "Invalid address");
        uint256 amount = address(this).balance;
        (bool success, ) = to.call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
