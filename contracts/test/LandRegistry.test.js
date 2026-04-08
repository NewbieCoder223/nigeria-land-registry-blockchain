const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * @title LandRegistry Test Suite
 * @notice Comprehensive tests achieving near-100% coverage.
 * Previously uncovered: pause/unpause, emergencyFreeze, updateMetadata,
 * frozen parcel transfer revert, surveyor/verifier reject paths.
 */
describe("LandRegistry", function () {
  let landRegistry;
  let admin, registrar, surveyor, verifier, governor, user1, user2, attacker;
  const INITIAL_DELAY = 120; // 2 minutes

  // Role bytes32 constants — fetched from the contract in beforeEach
  let REGISTRAR_ROLE, SURVEYOR_ROLE, VERIFIER_ROLE, GOVERNOR_ROLE;

  const REG_FEE = ethers.parseEther("0.01");
  const DISPUTE_FEE = ethers.parseEther("0.05");

  async function registerParcel(owner = user1, gps = "GPS_DEFAULT", area = 1200, ipfs = "QmTestHash") {
    await landRegistry.connect(registrar).registerLand(owner.address, gps, area, ipfs, { value: REG_FEE });
  }

  beforeEach(async function () {
    [admin, registrar, surveyor, verifier, governor, user1, user2, attacker] = await ethers.getSigners();

    const LandRegistry = await ethers.getContractFactory("LandRegistry");
    landRegistry = await LandRegistry.deploy(INITIAL_DELAY, admin.address);

    REGISTRAR_ROLE = await landRegistry.REGISTRAR_ROLE();
    SURVEYOR_ROLE  = await landRegistry.SURVEYOR_ROLE();
    VERIFIER_ROLE  = await landRegistry.VERIFIER_ROLE();
    GOVERNOR_ROLE  = await landRegistry.GOVERNOR_ROLE();

    await landRegistry.connect(admin).grantRole(REGISTRAR_ROLE, registrar.address);
    await landRegistry.connect(admin).grantRole(SURVEYOR_ROLE,  surveyor.address);
    await landRegistry.connect(admin).grantRole(VERIFIER_ROLE,  verifier.address);
    await landRegistry.connect(admin).grantRole(GOVERNOR_ROLE,  governor.address);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DEPLOYMENT
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Deployment", function () {
    it("Should assign DEFAULT_ADMIN_ROLE and all custom roles correctly", async function () {
      const DEFAULT_ADMIN_ROLE = await landRegistry.DEFAULT_ADMIN_ROLE();
      expect(await landRegistry.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await landRegistry.hasRole(REGISTRAR_ROLE, registrar.address)).to.be.true;
      expect(await landRegistry.hasRole(SURVEYOR_ROLE,  surveyor.address)).to.be.true;
      expect(await landRegistry.hasRole(VERIFIER_ROLE,  verifier.address)).to.be.true;
      expect(await landRegistry.hasRole(GOVERNOR_ROLE,  governor.address)).to.be.true;
    });

    it("Should set default registration and dispute fees", async function () {
      expect(await landRegistry.registrationFee()).to.equal(REG_FEE);
      expect(await landRegistry.disputeFee()).to.equal(DISPUTE_FEE);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. LAND REGISTRATION
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Land Registration", function () {
    it("Should register land and emit LandRegistered event", async function () {
      await expect(landRegistry.connect(registrar).registerLand(user1.address, "GPS_1", 1200, "QmHash1", { value: REG_FEE }))
        .to.emit(landRegistry, "LandRegistered")
        .withArgs(1, user1.address, "QmHash1");

      const parcel = await landRegistry.parcels(1);
      expect(parcel.currentOwner).to.equal(user1.address);
      expect(parcel.gpsCoordinates).to.equal("GPS_1");
    });

    it("Should revert if registration fee is insufficient", async function () {
      await expect(landRegistry.connect(registrar).registerLand(user1.address, "GPS_X", 100, "QmX", { value: 0 }))
        .to.be.revertedWith("Insufficient registration fee");
    });

    it("Should prevent double registration of the same GPS coordinates", async function () {
      await registerParcel(user1, "GPS_DUP");
      await expect(landRegistry.connect(registrar).registerLand(user2.address, "GPS_DUP", 500, "QmHash2", { value: REG_FEE }))
        .to.be.revertedWith("Land with these coordinates already registered");
    });

    it("Should revert if owner is zero address", async function () {
      await expect(landRegistry.connect(registrar).registerLand(ethers.ZeroAddress, "GPS_ZERO", 500, "QmZ", { value: REG_FEE }))
        .to.be.revertedWith("Invalid owner address");
    });

    it("Should not allow non-REGISTRAR to register land", async function () {
      await expect(landRegistry.connect(attacker).registerLand(user1.address, "GPS_ATK", 500, "QmA", { value: REG_FEE }))
        .to.be.reverted;
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. METADATA UPDATE (previously uncovered — DEF-C1)
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Metadata Update", function () {
    beforeEach(async function () {
      await registerParcel();
    });

    it("Should allow REGISTRAR to update metadata and emit MetadataUpdated", async function () {
      await expect(landRegistry.connect(registrar).updateMetadata(1, "QmNewHash"))
        .to.emit(landRegistry, "MetadataUpdated")
        .withArgs(1, "QmNewHash", registrar.address);

      const parcel = await landRegistry.parcels(1);
      expect(parcel.ipfsHash).to.equal("QmNewHash");
    });

    it("Should revert metadata update for non-existent parcel", async function () {
      await expect(landRegistry.connect(registrar).updateMetadata(999, "QmNew"))
        .to.be.revertedWithCustomError(landRegistry, "ParcelDoesNotExist");
    });

    it("Should reject metadata update from non-REGISTRAR", async function () {
      await expect(landRegistry.connect(attacker).updateMetadata(1, "QmEvil"))
        .to.be.reverted;
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. TRANSFER WORKFLOW
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Transfer Workflow", function () {
    beforeEach(async function () {
      await registerParcel(user1, "GPS_TRANSFER");
    });

    it("Should complete a full 4-step transfer successfully", async function () {
      await expect(landRegistry.connect(user1).initiateTransfer(1, user2.address))
        .to.emit(landRegistry, "TransferInitiated").withArgs(1, user1.address, user2.address);

      await expect(landRegistry.connect(surveyor).verifySurvey(1))
        .to.emit(landRegistry, "TransferApproved");

      await expect(landRegistry.connect(verifier).validateLegal(1))
        .to.emit(landRegistry, "TransferApproved");

      await expect(landRegistry.connect(registrar).approveTransfer(1))
        .to.emit(landRegistry, "TransferCompleted").withArgs(1, user1.address, user2.address);

      const parcel = await landRegistry.parcels(1);
      expect(parcel.currentOwner).to.equal(user2.address);
    });

    it("Should allow the owner to revoke a pending transfer", async function () {
      await landRegistry.connect(user1).initiateTransfer(1, user2.address);
      await expect(landRegistry.connect(user1).revokeTransfer(1))
        .to.emit(landRegistry, "TransferRevoked").withArgs(1, user1.address);
    });

    it("Should reject transfer initiation by non-owner", async function () {
      await expect(landRegistry.connect(attacker).initiateTransfer(1, user2.address))
        .to.be.revertedWithCustomError(landRegistry, "UnauthorizedSender");
    });

    it("Should reject transfer to zero address or self", async function () {
      await expect(landRegistry.connect(user1).initiateTransfer(1, ethers.ZeroAddress))
        .to.be.revertedWithCustomError(landRegistry, "InvalidAddress");
      await expect(
        landRegistry.connect(user1).initiateTransfer(1, user1.address)
      ).to.be.revertedWithCustomError(landRegistry, "InvalidAddress");
    });

    it("Should block transfer initiation on a FROZEN parcel (DEF-C1 branch)", async function () {
      await landRegistry.connect(governor).emergencyFreeze(1);
      await expect(landRegistry.connect(user1).initiateTransfer(1, user2.address))
        .to.be.revertedWithCustomError(landRegistry, "ParcelNotActive");
    });

    it("Should allow REGISTRAR to reject transfer with reason", async function () {
      await landRegistry.connect(user1).initiateTransfer(1, user2.address);
      await landRegistry.connect(surveyor).verifySurvey(1);
      await expect(landRegistry.connect(registrar).rejectTransfer(1, "Incomplete docs"))
        .to.emit(landRegistry, "TransferRejected").withArgs(1, registrar.address, "Incomplete docs");
    });

    it("Should allow SURVEYOR to reject transfer (previously uncovered path)", async function () {
      await landRegistry.connect(user1).initiateTransfer(1, user2.address);
      await expect(landRegistry.connect(surveyor).rejectTransfer(1, "Boundary mismatch"))
        .to.emit(landRegistry, "TransferRejected").withArgs(1, surveyor.address, "Boundary mismatch");
    });

    it("Should allow VERIFIER to reject transfer (previously uncovered path)", async function () {
      await landRegistry.connect(user1).initiateTransfer(1, user2.address);
      await landRegistry.connect(surveyor).verifySurvey(1);
      await expect(landRegistry.connect(verifier).rejectTransfer(1, "Invalid title"))
        .to.emit(landRegistry, "TransferRejected").withArgs(1, verifier.address, "Invalid title");
    });

    it("Should prevent concurrent duplicate transfer initiation", async function () {
      await landRegistry.connect(user1).initiateTransfer(1, user2.address);
      await expect(landRegistry.connect(user1).initiateTransfer(1, user2.address))
        .to.be.revertedWith("Transfer already in progress");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. DISPUTE & GOVERNANCE
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Dispute & Governance", function () {
    beforeEach(async function () {
      await registerParcel(user1, "GPS_DISPUTE");
    });

    it("Should allow anyone to file a dispute with the required fee", async function () {
      await expect(landRegistry.connect(user2).fileDispute(1, "Boundary overlap", { value: DISPUTE_FEE }))
        .to.emit(landRegistry, "DisputeFiled").withArgs(1, user2.address, "Boundary overlap");

      const parcel = await landRegistry.parcels(1);
      expect(parcel.status).to.equal(2n); // Disputed
    });

    it("Should revert dispute if fee is insufficient", async function () {
      await expect(landRegistry.connect(user2).fileDispute(1, "Dispute", { value: 0 }))
        .to.be.revertedWith("Insufficient dispute fee");
    });

    it("Should prevent filing a dispute on an already frozen parcel (previously uncovered branch)", async function () {
      await landRegistry.connect(governor).emergencyFreeze(1);
      await expect(landRegistry.connect(user2).fileDispute(1, "Test", { value: DISPUTE_FEE }))
        .to.be.revertedWith("Parcel is not active or already disputed");
    });

    it("Should allow Governor to resolve dispute and refund claimant", async function () {
      await landRegistry.connect(user2).fileDispute(1, "Boundary", { value: DISPUTE_FEE });
      const balanceBefore = await ethers.provider.getBalance(user2.address);

      await expect(landRegistry.connect(governor).resolveDispute(1, 0, true)) // 0 = Active
        .to.emit(landRegistry, "DisputeResolved").withArgs(1, 0n);

      const balanceAfter = await ethers.provider.getBalance(user2.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Should allow Governor to resolve dispute without refund (confiscate fee)", async function () {
      await landRegistry.connect(user2).fileDispute(1, "Baseless claim", { value: DISPUTE_FEE });
      await expect(landRegistry.connect(governor).resolveDispute(1, 0, false))
        .to.emit(landRegistry, "DisputeResolved");
    });

    it("Should allow Governor to force transfer (Eminent Domain)", async function () {
      await expect(landRegistry.connect(governor).forceTransfer(1, user2.address))
        .to.emit(landRegistry, "TransferCompleted").withArgs(1, user1.address, user2.address);

      const parcel = await landRegistry.parcels(1);
      expect(parcel.currentOwner).to.equal(user2.address);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. EMERGENCY FREEZE (previously uncovered — DEF-C1)
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Emergency Freeze", function () {
    beforeEach(async function () {
      await registerParcel(user1, "GPS_FREEZE");
    });

    it("Should allow GOVERNOR to freeze a parcel and emit ParcelFrozen", async function () {
      await expect(landRegistry.connect(governor).emergencyFreeze(1))
        .to.emit(landRegistry, "ParcelFrozen").withArgs(1, governor.address);

      const parcel = await landRegistry.parcels(1);
      expect(parcel.status).to.equal(1n); // Frozen
    });

    it("Should allow DEFAULT_ADMIN to also freeze a parcel", async function () {
      await expect(landRegistry.connect(admin).emergencyFreeze(1))
        .to.emit(landRegistry, "ParcelFrozen").withArgs(1, admin.address);
    });

    it("Should reject freeze from unauthorized caller", async function () {
      await expect(landRegistry.connect(attacker).emergencyFreeze(1))
        .to.be.revertedWith("Unauthorized");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. PAUSE / UNPAUSE (previously uncovered — DEF-C1 lines 323, 327)
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Pause & Unpause (Emergency Circuit Breaker)", function () {
    beforeEach(async function () {
      await registerParcel(user1, "GPS_PAUSE");
    });

    it("Should allow admin to pause the contract", async function () {
      await landRegistry.connect(admin).pause();
      expect(await landRegistry.paused()).to.be.true;
    });

    it("Should block land registration when paused", async function () {
      await landRegistry.connect(admin).pause();
      await expect(landRegistry.connect(registrar).registerLand(user2.address, "GPS_BLKD", 100, "Qm", { value: REG_FEE }))
        .to.be.reverted; // Pausable guard
    });

    it("Should block transfer initiation when paused", async function () {
      await landRegistry.connect(admin).pause();
      await expect(landRegistry.connect(user1).initiateTransfer(1, user2.address))
        .to.be.reverted;
    });

    it("Should allow admin to unpause the contract and resume operations", async function () {
      await landRegistry.connect(admin).pause();
      await landRegistry.connect(admin).unpause();
      expect(await landRegistry.paused()).to.be.false;

      // Confirm operations resume after unpause
      await expect(landRegistry.connect(registrar).registerLand(user2.address, "GPS_RESUME", 400, "QmResume", { value: REG_FEE }))
        .to.emit(landRegistry, "LandRegistered");
    });

    it("Should reject pause from non-admin", async function () {
      await expect(landRegistry.connect(attacker).pause()).to.be.reverted;
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. ADMIN OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Admin Operations", function () {
    it("Should allow admin to update fees and emit FeesUpdated", async function () {
      await expect(landRegistry.connect(admin).setFees(ethers.parseEther("0.1"), ethers.parseEther("0.2")))
        .to.emit(landRegistry, "FeesUpdated");

      expect(await landRegistry.registrationFee()).to.equal(ethers.parseEther("0.1"));
      expect(await landRegistry.disputeFee()).to.equal(ethers.parseEther("0.2"));
    });

    it("Should reject fee updates from non-admin", async function () {
      await expect(landRegistry.connect(attacker).setFees(0, 0)).to.be.reverted;
    });

    it("Should allow admin to withdraw accumulated fees", async function () {
      await landRegistry.connect(registrar).registerLand(user1.address, "GPS_W", 200, "QmW", { value: REG_FEE });
      // Should not revert
      await landRegistry.connect(admin).withdrawFees(admin.address);
    });

    it("Should reject fee withdrawal to zero address", async function () {
      await expect(landRegistry.connect(admin).withdrawFees(ethers.ZeroAddress))
        .to.be.revertedWith("Invalid address");
    });
  });
  // ─────────────────────────────────────────────────────────────────────────────
  // 9. FEE REFUNDS & EDGE CASES (Achieving 100% Coverage)
  // ─────────────────────────────────────────────────────────────────────────────
  describe("Fee Refunds & Edge Cases", function () {
    it("Should refund excess registration fee (Line 128 coverage)", async function () {
      const excessValue = REG_FEE + ethers.parseEther("1");
      const balanceBefore = await ethers.provider.getBalance(registrar.address);
      
      const tx = await landRegistry.connect(registrar).registerLand(user1.address, "GPS_REFUND", 1200, "Qm", { value: excessValue });
      const receipt = await tx.wait();
      const gasSpent = receipt.gasUsed * receipt.gasPrice;
      
      const balanceAfter = await ethers.provider.getBalance(registrar.address);
      
      // Expected: balanceAfter = balanceBefore - gasSpent - REG_FEE (the excess is returned)
      expect(balanceAfter).to.equal(balanceBefore - gasSpent - REG_FEE);
    });

    it("Should refund excess dispute fee (Line 261 coverage)", async function () {
      await registerParcel();
      const excessValue = DISPUTE_FEE + ethers.parseEther("1");
      const balanceBefore = await ethers.provider.getBalance(user2.address);
      
      const tx = await landRegistry.connect(user2).fileDispute(1, "Claim", { value: excessValue });
      const receipt = await tx.wait();
      const gasSpent = receipt.gasUsed * receipt.gasPrice;
      
      const balanceAfter = await ethers.provider.getBalance(user2.address);
      
      expect(balanceAfter).to.equal(balanceBefore - gasSpent - DISPUTE_FEE);
    });

    it("Should revert dispute for already frozen parcel (Branch coverage check)", async function () {
      await registerParcel();
      await landRegistry.connect(governor).emergencyFreeze(1);
      await expect(
        landRegistry.connect(user2).fileDispute(1, "Test Dispute", { value: DISPUTE_FEE })
      ).to.be.revertedWith("Parcel is not active or already disputed");
    });
  });
});
