# CHAPTER THREE: ANALYSIS AND DESIGN

## 3.0 Introduction

This chapter translates the requirements identified in the literature review into a concrete, implementable system design. It presents the functional and non-functional requirements of the SecureLand Registry (SLR) system, analyses the stakeholders and their interactions through use case descriptions, defines the system architecture across five technology layers, specifies the detailed structure of the smart contracts, articulates the data management strategy, and establishes the security and privacy framework. The chapter also identifies the distinction between core prototype features and advanced post-MVP capabilities, and provides the implementation roadmap that governs the project's execution timeline. Together, these elements constitute a complete design specification from which a developer — or a future researcher continuing this work — can build, evaluate, and extend the system without ambiguity.

The design throughout this chapter is governed by three principles derived from the Chapter Two analysis. First, every design decision must be legally grounded in the Land Use Act of 1978, not working around it. Second, the system must be technically functional on moderate hardware, consistent with the resource constraints of the Nigerian prototype context. Third, blockchain provides one layer in the system — the immutable trust layer — and every other component uses the most appropriate technology for its function.


## 3.1 System Requirements

### 3.1.1 Functional Requirements

The following table defines the functional requirements of the SLR system. Each requirement is assigned a unique identifier, a priority level (High, Medium, or Low), and a description sufficient for implementation.

Table 3.1: Functional Requirements

| ID | Requirement | Description | Priority |
|---|---|---|---|
| FR01 | User Registration and Authentication | Stakeholders register with a unique identifier — a simulated NIN hash — and receive a role assignment. JWT-based session management governs all subsequent access. | High |
| FR02 | Role-Based Access Control (RBAC) | Four roles are defined: LandOwner, Surveyor, Registrar, and Verifier. Each role has a distinct set of permitted actions enforced at both the API and smart contract levels. | High |
| FR03 | Land Title Registration | A Registrar creates a new on-chain land parcel record containing the owner's wallet address, document hash, survey plan hash, GPS coordinates, area in square metres, Local Government Area, and state. | High |
| FR04 | Ownership Transfer with Multi-Signature Approval | The owner initiates the transfer request; the Surveyor verifies physical boundaries; the Registrar provides legal approval; only when all three approvals are recorded does the smart contract execute the transfer. | High |
| FR05 | Record Verification | Any authenticated user can query a parcel's current owner, document hash, current status, and complete transfer history directly from on-chain data. | High |
| FR06 | Dispute Flagging and Resolution | Any authenticated user can file a dispute against a parcel, which automatically changes the parcel's status to DISPUTED and blocks all pending transfers. Resolution requires Registrar approval. | High |
| FR07 | Document Upload to IPFS | Title deeds and survey plans uploaded via the API are stored on IPFS through Pinata; the returned Content Identifier (CID) is stored on-chain as a tamper-evident reference. | Medium |
| FR08 | Audit Trail Dashboard | A complete log of all on-chain transactions — with timestamps, actor wallet addresses, roles, and transaction hashes — is accessible to authorised users via the web interface. | Medium |
| FR09 | Land Search | Users can search registered parcels by parcel ID, owner wallet address, LGA, or state, with results drawn from the off-chain PostgreSQL index for performance. | Medium |
| FR10 | Notification | Email and SMS notifications are generated for ownership changes, dispute filings, and transfer approvals. These are simulated via console logging in the prototype. | Low |

### 3.1.2 Non-Functional Requirements

Table 3.2: Non-Functional Requirements

| Requirement Category | Specification | Rationale |
|---|---|---|
| **Performance** | Transaction confirmation on testnet within 15 seconds; API response within 2 seconds for all non-blockchain operations | Ensures usability in low-bandwidth environments consistent with Nigerian internet conditions |
| **Security** | SHA-256 document hashing; OpenZeppelin access control libraries; Slither and Mythril security analysis targeting zero high or medium-severity findings before testnet deployment | Directly addresses the fraud risk that motivates the system |
| **Usability** | System Usability Scale (SUS) target score of 70 or above (the recognised threshold for "acceptable" usability); minimal required data entry; clear visual indicators for workflow stage | Accommodates users with limited digital literacy consistent with the identified research gap |
| **Scalability** | Hybrid storage model (on-chain metadata, off-chain documents) capable of handling at least 1,000 test parcels in prototype evaluation | Demonstrates architectural viability for larger-scale deployment without requiring enterprise hardware |
| **Privacy** | Personally identifiable information stored only in encrypted PostgreSQL; no PII written to the blockchain or public IPFS at any point | Compliance with the Nigeria Data Protection Act 2023 |
| **Availability** | Application layer available continuously; blockchain layer inherits Polygon Amoy network uptime | Supports asynchronous access by users across different locations and time zones |
| **Maintainability** | Modular code structure following the Model-View-Controller (MVC) pattern; all API endpoints documented with request and response schemas | Facilitates future development, code review, and project handover |

### 3.1.3 MVP Features vs. Advanced Post-MVP Features

The prototype is scoped to deliver six core features. These constitute the Minimum Viable Product (MVP) — the minimum set of capabilities necessary to evaluate the system's technical feasibility and core value proposition.

**Core MVP Features Required for Prototype Evaluation:**

1. **Simulated identity verification.** A NIN verification status flag is stored. The mock NIMC API response is used to set this flag; no real-world identity data is accessed or retained.
2. **GIS map integration.** Leaflet.js is integrated with OpenStreetMap tiles to provide interactive parcel visualisation. Registered parcels display at their recorded GPS coordinates with boundary polygons where survey data is available.
3. **IPFS document storage.** Title deeds and survey plans are uploaded to IPFS via the Pinata API. The returned CID is stored on-chain for subsequent verification.
4. **Multi-signature transfer workflow.** The full three-step approval chain — owner initiates, Surveyor verifies, Registrar approves — is implemented and enforced in the smart contract.
5. **Audit trail dashboard.** Every state-changing transaction is logged on-chain with a timestamp, the actor's wallet address, their role, and the transaction hash. This log is displayed in the web interface.
6. **Role-based dashboards.** Four distinct dashboard views are implemented, each surfacing the actions and data relevant to that role: LandOwner, Registrar, Surveyor, and Verifier.

**Advanced Post-MVP Features:**

The following features represent the next development phase and are designed to be architecturally compatible with the MVP but are not implemented in the prototype:

Table 3.3: MVP vs. Advanced Post-MVP Features

| Feature | Description | Strategic Value |
|---|---|---|
| Land Tokenisation (ERC-721) | Each parcel represented as a non-fungible token with complete on-chain metadata | Enables DeFi collateralisation and directly addresses the dead capital problem |
| Fractional Ownership (ERC-1155) | Tokens represent percentage shares in a parcel | Supports community land and family inheritance models common in Nigerian customary tenure |
| Mortgage Integration | Banks verify title and place liens directly via smart contract | Creates a formal mortgage market for previously unregisterable land |
| Government Override with Time-Lock | Emergency freeze and unfreeze by the GOVERNOR_ROLE with a 48-hour time-lock | Legal compliance with Land Use Act Section 28 revocation provisions |
| Public Transparency Dashboard | Real-time public statistics on registrations, transfers, disputes, and average processing times | Creates a measurable, publicly visible anti-corruption metric |
| Offline Sync | Local transaction queue with automatic submission retry when connectivity is restored | Addresses rural accessibility in areas with intermittent internet |
| SMS and USSD Interface | Text-based land verification for feature phones via a USSD gateway | Extends access to the estimated 45%+ of Nigerians who lack reliable broadband (Nigerian Communications Commission, 2024) |


## 3.2 Use Case Analysis

The use cases and relationships between system actors are illustrated in Figure 3.1.

```
# Figure 3.1: Use Case Diagram — SecureLand Registry (SLR)
[Use Case Diagram Placeholder - Showing Registrar (Register Title, Resolve Dispute), LandOwner (Transfer Title, File Dispute), Surveyor (Verify Boundaries), Verifier (Verify Title)]
```

### 3.2.1 Actors

Table 3.4: System Actors

| Actor | Role Description |
|---|---|
| **Land Owner** | A citizen who owns, seeks to register, or intends to transfer a land parcel. The primary end user of the system. |
| **Surveyor** | A licensed professional who physically verifies that a parcel's recorded GPS boundaries match the physical boundaries on the ground. |
| **Registrar** | A government official — acting under the delegated authority of the state governor — who approves registrations and transfers, and resolves disputes. The Registrar is the institutional fulcrum of the system. |
| **Verifier** | A third party — typically a bank, a legal practitioner, or a prospective buyer — who needs to confirm the authenticity and ownership status of a title without initiating any state change. |
| **System Administrator** | A technical role responsible for off-chain database maintenance, user role assignment, and system monitoring. The System Administrator does not hold a role in the smart contract. |

### 3.2.2 Use Case Descriptions

**UC1: Register New Land Title**

- **Primary Actor:** Registrar
- **Secondary Actor:** Land Owner
- **Precondition:** The Land Owner is authenticated; the parcel to be registered has not previously been recorded in the system.
- **Main Flow:**
  1. The Registrar logs in and opens the land registration form.
  2. The Registrar enters the parcel's details: GPS boundary coordinates, area in square metres, LGA, state, and the Land Owner's wallet address.
  3. The Registrar uploads the title deed and survey plan via the file upload interface.
  4. The system uploads both documents to IPFS via Pinata and returns their CIDs.
  5. The system computes SHA-256 hashes of both documents.
  6. The system constructs and submits a `registerLand()` transaction to the smart contract, signed by the Registrar's wallet.
  7. The smart contract validates that the caller holds the REGISTRAR_ROLE, creates a new `LandParcel` struct, records all metadata, sets the status to ACTIVE, and emits a `LandRegistered` event.
  8. The Flask backend listens for the event, updates the PostgreSQL off-chain index, and returns a confirmation to the Registrar including the on-chain transaction hash.
- **Postcondition:** The parcel exists on-chain with status ACTIVE. Its title deed and survey plan are accessible via their IPFS CIDs. The Registrar has a verifiable confirmation.

**UC2: Transfer Ownership (Multi-Signature)**

- **Primary Actor:** Land Owner
- **Secondary Actors:** Surveyor (Approval Step 1), Registrar (Approval Step 2)
- **Precondition:** The parcel has status ACTIVE (not disputed or frozen). The Land Owner is authenticated and is the recorded current owner on-chain.
- **Main Flow:**
  1. The Land Owner opens the transfer request form and enters the wallet address of the intended new owner.
  2. The system submits a `requestTransfer()` transaction. The smart contract creates a `TransferRequest` record with status PENDING, recording the originating and target addresses.
  3. The Surveyor logs in, reviews the boundary data, completes physical verification, and calls `approveTransferAsSurveyor()`. The smart contract records the Surveyor's approval.
  4. The Registrar reviews the legal documentation and calls `approveTransferAsRegistrar()`. The smart contract verifies that all three approvals are recorded; if so, it executes the ownership update, changes the parcel's `currentOwner` to the new address, and emits a `TransferCompleted` event.
  5. The Flask backend detects the event, updates the PostgreSQL record, and sends notifications to both parties.
- **Postcondition:** The parcel's `currentOwner` is updated on-chain. The transfer is permanently recorded in the parcel's history. Both parties receive confirmation.

The sequence of approval steps for ownership transfer is shown in Figure 3.2.

```
# Figure 3.2: UC2 Multi-Signature Transfer Approval Flow
[Multi-Signature Transfer Flow Diagram Placeholder - Showing Owner Request -> Surveyor Verification -> Registrar Approval -> Smart Contract Ownership Update]
```

**UC3: Verify Land Record**

- **Primary Actor:** Verifier
- **Precondition:** The Verifier is authenticated. The parcel ID to be verified is known.
- **Main Flow:**
  1. The Verifier enters a parcel ID in the search interface.
  2. The system queries the smart contract's `getLandDetails()` function — a view function that reads on-chain state without submitting a transaction.
  3. The system retrieves the stored document CIDs from IPFS, recomputes the SHA-256 hashes of the retrieved documents, and compares each recomputed hash against the on-chain hash.
  4. The system displays a verification result: "Verified — document matches on-chain record" or "Mismatch detected — document may have been altered," along with the parcel's current owner, status, and full transaction history.
- **Postcondition:** The Verifier has cryptographic proof of the document's integrity at the point of registration and of the current ownership state without requiring trust in any single authority.

**UC4: File and Resolve a Dispute**

- **Primary Actor (Filing):** Any authenticated user
- **Primary Actor (Resolving):** Registrar
- **Precondition (Filing):** The parcel exists and has status ACTIVE.
- **Main Flow (Filing):**
  1. The claimant fills the dispute form, specifying the parcel ID, a description of the claim, and any supporting evidence documents.
  2. The evidence documents are uploaded to IPFS; the returned CIDs are stored in the dispute record.
  3. The system submits a `fileDispute()` transaction. The smart contract records the dispute, changes the parcel's status to DISPUTED, and blocks all pending Transfer Requests for this parcel automatically.
  4. The Registrar is notified of the new dispute via the notification service.
- **Main Flow (Resolution):**
  1. The Registrar reviews the dispute record, the evidence CIDs, and the parcel's transaction history.
  2. The Registrar calls `resolveDispute()`, recording an outcome (RESOLVED_VALID or RESOLVED_INVALID) and resolution notes.
  3. The smart contract updates the dispute status, and — if the original ownership is confirmed — changes the parcel's status back to ACTIVE. If the dispute is valid, further action (including title correction) is initiated outside the prototype scope.
- **Postcondition:** The dispute record is permanently on-chain. If resolved in favour of the original owner, the parcel is unfrozen. All dispute actions are visible in the audit trail.

The dispute filing and resolution lifecycle is shown in Figure 3.3.

```
# Figure 3.3: UC4 Dispute Filing and Resolution Flow
[Dispute Resolution Flow Diagram Placeholder - Showing Claimant Filing -> Parcel Frozen (Disputed Status) -> Registrar Review -> Registrar Resolution -> Parcel Reactivated]
```

## 3.3 System Architecture

### 3.3.1 Architecture Overview

The SLR system adopts a five-layer hybrid architecture that separates concerns clearly: each layer's technology choices are driven by what that layer must do well, rather than by a single technology imposed across the whole system. A three-tier conceptual view — Presentation, Application, and Blockchain — is expanded into five operational layers to accommodate the service-level decomposition and the external integration requirements.

The three conceptual tiers remain useful for high-level description:
- **Presentation Tier** — the web interface serving role-based dashboards and the map view
- **Application Tier** — the Flask REST API, PostgreSQL, IPFS integration, and service modules
- **Blockchain Tier** — the Solidity smart contracts deployed on Polygon Amoy, responsible for all immutable state changes

### 3.3.2 Blockchain Platform Selection Justification

The choice of blockchain platform is one of the most consequential and frequently under-justified decisions in blockchain land registry literature. The following comparative analysis justifies the selection of Polygon over both Ethereum mainnet and Hyperledger Fabric:

Table 3.5: Blockchain Platform Comparison

| Criterion | Ethereum Mainnet | Hyperledger Fabric | Polygon Amoy (Selected) |
|---|---|---|---|
| **Permission Model** | Permissionless — open to all | Fully permissioned — enterprise access control | Permissioned Layer 2 on Ethereum — consortium-compatible |
| **Transaction cost** | $1 to $50+ per transaction depending on network congestion | Near zero for permissioned deployments | Under $0.01 per transaction on testnet |
| **Throughput** | Approximately 15–30 TPS | 2,000+ TPS in optimised configurations | Approximately 7,000 TPS |
| **Smart Contract Language** | Solidity | Go or Java chaincode | Solidity (fully EVM-compatible) |
| **Developer Ecosystem** | Massive; OpenZeppelin, Hardhat, ethers.js all native | Smaller; enterprise-focused | Large — inherits the entire Ethereum tooling ecosystem |
| **Privacy** | Low — all data publicly readable | High — private channels between consortium members | Moderate — zero-knowledge proof extensions available |
| **Setup Complexity for FYP** | Low — testnets freely available | High — requires enterprise infrastructure setup | Low — Amoy testnet freely available |
| **Production Migration Path** | Not recommended for government deployment | Recommended for consortium government model | Compatible — Polygon architecture can migrate to permissioned Hyperledger for production |

**Decision rationale:** Polygon Amoy testnet is selected for the prototype. It provides Ethereum's Solidity tooling, OpenZeppelin library compatibility, and the full Hardhat development environment, with negligible transaction costs and fast block finality. For a real-world government production deployment, the recommended migration target would be Hyperledger Fabric, whose permissioned architecture aligns more closely with government data governance requirements. This migration path is architecturally supported by the fact that the core business logic resides in Solidity contracts that can be reimplemented in Hyperledger Go chaincode with the same functional interface.

### 3.3.3 Technology Stack

Table 3.6: Technology Stack

| Component | Technology | Justification |
|---|---|---|
| **Smart Contracts** | Solidity 0.8.x | Industry standard for EVM-compatible blockchains; extensive tooling and the OpenZeppelin audited library ecosystem |
| **Blockchain Network** | Polygon Amoy testnet / local Ganache | Low transaction cost, high throughput, Solidity compatibility; Ganache provides zero-cost local testing without network dependency |
| **Backend API** | Python 3.x with Flask | Lightweight and well-documented; Web3.py library provides full Ethereum interaction; suitable for moderate hardware environments |
| **Database** | PostgreSQL | Mature, open-source RDBMS with role-level security, JSON support, and PostGIS extension for spatial data when extended |
| **Document Storage** | IPFS via Pinata | Decentralised content-addressed storage ensuring document permanence and tamper-evidence; Pinata provides managed pinning |
| **Frontend** | React.js with Leaflet.js | Responsive, accessible web interface; Leaflet.js provides interactive map rendering; MetaMask integration for wallet signing |
| **Smart Contract Testing** | Hardhat | Industry-standard development environment for Ethereum smart contracts; supports forking, coverage analysis, and scripted deployment |
| **API Testing** | Pytest | Python-native testing framework compatible with Flask; supports assertion-based API testing |
| **Security Analysis** | Slither, Mythril | Slither for static analysis; Mythril for symbolic execution; both target smart contract vulnerability classes catalogued by Atzei et al. (2017) |

### 3.3.4 Five-Layer Architecture Description

The detailed interaction between components across the five system layers is shown in Figure 3.4.

```
# Figure 3.4: Five-Layer System Architecture (Detailed)
[Detailed System Architecture Diagram Placeholder - Showing presentation, API gateway, services, database/IPFS/blockchain data storage, and external APIs]
```

**Layer 1 — Presentation Layer**

The presentation layer consists of a Progressive Web App (PWA) built with React.js, providing role-based dashboards that surface contextually relevant actions and data for each actor type. The PWA approach is selected over a native mobile application because it eliminates app store distribution barriers and is accessible via any mobile browser — an important consideration given the diversity of devices in use across Nigeria. A USSD gateway interface is identified as an advanced post-MVP feature to extend access to feature phone users but is not implemented in the prototype.

**Layer 2 — API Gateway Layer**

All requests from the presentation layer pass through a Flask REST API that acts as the system's API gateway. Its responsibilities include JWT token authentication and validation, rate limiting at 100 requests per minute per IP address, role-based middleware that verifies the caller's RBAC permissions before forwarding any request to the service layer, and input validation via schema checking. The API gateway never permits a request to reach the blockchain or database layers until authentication and authorisation have been confirmed.

**Layer 3 — Service Layer**

Six discrete service modules handle specific functional domains:
- **Identity and KYC Service:** Manages user verification; in the prototype, simulates NIMC NIN verification via a mock API response and stores the resulting verification status flag in PostgreSQL.
- **Land Registry Service:** Orchestrates the full registration and transfer flows, coordinating between the smart contract interface, IPFS uploads, and PostgreSQL updates.
- **Dispute Resolution Service:** Manages the dispute lifecycle from filing through evidence upload to resolution, coordinating blockchain and database updates.
- **Notification Service:** Generates email and SMS alerts for significant system events. In the prototype, notifications are logged to the console in place of actual dispatch.
- **GIS and Mapping Service:** Integrates with Leaflet.js and OpenStreetMap to render registered parcels at their recorded coordinates.
- **Document Service:** Handles all IPFS interactions — upload, CID retrieval, and document retrieval for hash verification — via the Pinata API.

**Layer 4 — Data Layer**

Three storage systems operate in concert:
- **PostgreSQL** stores user profiles, KYC verification status, role assignments, authentication credentials, session data, API logs, and the off-chain search index for parcel queries. It is the only layer that holds personally identifiable information.
- **IPFS via Pinata** stores title deeds, survey plans, photographs, and dispute evidence documents. Documents are content-addressed by their CIDs, ensuring tamper-evidence at the storage layer.
- **Polygon Amoy smart contracts** store the authoritative ownership state: current owner address, document hash references, parcel status, GPS coordinates, transfer records, and dispute flags.

**Layer 5 — External Integrations**

In the production-ready system, the following external systems would be integrated: the NIMC API for real-time NIN/BVN verification; State Land Bureau systems for cross-referencing existing paper records; Survey Agency data feeds for cadastral boundary information; and bank or mortgage company verification endpoints for title-backed lending. In the prototype, all external integrations are simulated via mock API responses.


## 3.4 Smart Contract Design

### 3.4.1 Contract Overview

The core smart contract, `LandRegistry.sol`, manages the entire lifecycle of a land parcel within the SLR system — from initial registration through ownership transfers and dispute management to final resolution. It imports and is built upon three OpenZeppelin audited contracts: `AccessControl` for role-based permission management, `ReentrancyGuard` for protection against reentrancy attack vectors, and `Pausable` for emergency circuit-breaker capability. The use of established, audited library code is a deliberate security decision: every line of custom code introduces potential vulnerability, and limiting custom logic to land-registry-specific functions reduces the attack surface.

### 3.4.2 Role Definitions

Four blockchain-level roles are defined as `bytes32` constants using OpenZeppelin's `AccessControl` pattern:

Table 3.7: Smart Contract Role Definitions

| Role Constant | Holder | Permitted Actions |
|---|---|---|
| `REGISTRAR_ROLE` | Government registry officials | `registerLand()`, `approveTransferAsRegistrar()`, `resolveDispute()` |
| `SURVEYOR_ROLE` | Licensed surveyors | `approveTransferAsSurveyor()` |
| `GOVERNOR_ROLE` | Governor's office representative | `revokeTitle()`, override and emergency freeze functions |
| `DISPUTE_RESOLVER_ROLE` | Designated dispute resolution officer (may overlap with Registrar) | `resolveDispute()` with outcome and notes |
| `DEFAULT_ADMIN_ROLE` | System administrator | Role grants and revocations, `pause()` and `unpause()` functions |

### 3.4.3 Data Structures

The three primary data structures within the contract are as follows:

```solidity
LandParcel {
    parcelId: uint256           // Unique auto-incremented identifier
    currentOwner: address       // Ethereum wallet address of the current owner
    titleDocHash: bytes32       // SHA-256 hash of the title deed (document stored on IPFS)
    surveyPlanHash: bytes32     // SHA-256 hash of the survey plan (document stored on IPFS)
    gpsCoordinates: string      // Latitude and longitude boundary definition
    area: uint256               // Area of the parcel in square metres
    lga: string                 // Local Government Area
    state: string               // Nigerian state
    parcelType: enum            // STATUTORY or CUSTOMARY, reflecting dual tenure system
    status: enum                // REGISTERED, ACTIVE, DISPUTED, FROZEN
    registrationTimestamp: uint256
    lastTransferTimestamp: uint256
}

TransferRequest {
    transferId: uint256
    parcelId: uint256
    from: address               // Current owner's wallet address
    to: address                 // Prospective new owner's wallet address
    requestTimestamp: uint256
    ownerApproved: bool         // Confirms owner initiated; set to true on request creation
    surveyorVerified: bool      // Set to true when Surveyor calls approveTransferAsSurveyor()
    registrarApproved: bool     // Set to true when Registrar calls approveTransferAsRegistrar()
    status: enum                // PENDING, PARTIALLY_APPROVED, COMPLETED, REJECTED
}

Dispute {
    parcelId: uint256
    claimant: address
    evidenceHash: string        // IPFS CID of supporting evidence documents
    reason: string              // Description of the claim
    filedTimestamp: uint256
    status: enum                // FILED, UNDER_REVIEW, RESOLVED_VALID, RESOLVED_INVALID
    resolutionNotes: string     // Recorded by the Dispute Resolver at resolution
}
```

### 3.4.4 Key Functions

Table 3.8: Smart Contract Key Functions

| Function | Access Control | Description |
|---|---|---|
| `registerLand()` | REGISTRAR_ROLE only | Creates a new `LandParcel` struct with all provided metadata; emits `LandRegistered` event; increments `nextParcelId` |
| `requestTransfer()` | Parcel owner only (verified via `msg.sender`) | Creates a `TransferRequest` with status PENDING; sets `ownerApproved` to true; requires parcel status to be ACTIVE |
| `approveTransferAsSurveyor()` | SURVEYOR_ROLE only | Records Surveyor's physical boundary verification by setting `surveyorVerified` to true on the specified TransferRequest |
| `approveTransferAsRegistrar()` | REGISTRAR_ROLE only | Records Registrar's legal approval; if all three approvals are present, executes the ownership transfer by updating `currentOwner`, emitting `TransferCompleted`, and updating `lastTransferTimestamp` |
| `fileDispute()` | Any authenticated user | Creates a `Dispute` record; changes parcel status to DISPUTED; blocks all pending TransferRequests for this parcel; emits `DisputeFiled` event |
| `resolveDispute()` | DISPUTE_RESOLVER_ROLE only | Updates dispute status to RESOLVED_VALID or RESOLVED_INVALID with resolution notes; if RESOLVED_INVALID, restores parcel status to ACTIVE |
| `revokeTitle()` | GOVERNOR_ROLE only | Changes parcel status to FROZEN and removes the owner's rights, simulating gubernatorial revocation under Land Use Act Section 28 |
| `getLandDetails()` | Public view function | Returns current owner, document hashes, parcel type, status, GPS summary, and timestamps without consuming gas |
| `getTransferHistory()` | Public view function | Returns an array of all TransferRequest IDs associated with a parcel |
| `pause()` / `unpause()` | DEFAULT_ADMIN_ROLE only | Halts or resumes all state-changing operations in the contract; circuit-breaker for emergency situations |

### 3.4.5 Event Emissions

Every state-changing operation emits a corresponding event. Events are the primary mechanism by which the Flask backend maintains synchronisation with the blockchain without polling:

Table 3.9: Smart Contract Event Emissions

| Event | Emitted On | Indexed Parameters |
|---|---|---|
| `LandRegistered` | Successful `registerLand()` | parcelId, owner address, state, LGA |
| `TransferRequested` | Successful `requestTransfer()` | transferId, parcelId, from address, to address |
| `TransferApproved` | Each of the three approval steps | transferId, approving role |
| `TransferCompleted` | Final Registrar approval triggering execution | transferId, parcelId |
| `DisputeFiled` | Successful `fileDispute()` | parcelId, claimant address |
| `DisputeResolved` | Successful `resolveDispute()` | parcelId, outcome status |
| `TitleRevoked` | Successful `revokeTitle()` | parcelId, previous owner address |


## 3.5 Data Management Strategy

### 3.5.1 On-Chain Data (Polygon Blockchain)

Only the minimum data necessary for verification, auditability, and the enforcement of ownership rights is stored on-chain. This minimisation is driven by two considerations: gas cost (every byte of on-chain storage costs gas) and privacy (on-chain data is permanent and — on most blockchain networks — publicly accessible). The following data is stored on-chain:

- Parcel identifiers, current owner wallet addresses, document hashes (SHA-256), GPS coordinate summaries, parcel type, and status flags
- Transfer request records including all three approval states
- Dispute records including the IPFS evidence CID

### 3.5.2 Off-Chain Data: IPFS via Pinata

Documents that are too large for practical on-chain storage but must be globally accessible and tamper-evident are stored on IPFS through the Pinata pinning service. These include:

- Title deed documents (PDF scans or digital originals)
- Survey plans and boundary maps
- Photographic evidence of parcel conditions
- Dispute supporting documents

Each document's IPFS CID is stored on-chain, creating a permanent, verifiable link between the document and its on-chain record. When a Verifier checks a title, the system retrieves the document from IPFS, recomputes its SHA-256 hash, and compares the result against the on-chain hash. Any discrepancy — indicating that the document has been altered since the CID was recorded — is immediately flagged.

### 3.5.3 Off-Chain Data: PostgreSQL

Private, frequently queried, or relationally complex data is stored in PostgreSQL:

- User profiles: name, email, role, wallet address (pseudonymous link), NIN verification status flag
- Authentication: bcrypt-hashed passwords, JWT refresh token records
- Session data: active sessions, audit logs
- Off-chain search index: parcel LGA, state, status — mirrored from on-chain events for query performance

All data in PostgreSQL classified as personally identifiable is encrypted at rest using AES-256 and is accessible only through the application layer, never directly by the presentation layer.

### 3.5.4 Data Integrity Verification Process

The cross-layer data integrity verification process is as follows:

1. When a document is first uploaded, its SHA-256 hash is computed and stored on-chain via the registration or transfer transaction.
2. The document is uploaded to IPFS via Pinata; the returned CID is stored both on-chain and in PostgreSQL.
3. During any subsequent verification request, the system retrieves the document from IPFS using the stored CID, recomputes its SHA-256 hash, and compares it against the on-chain hash.
4. A hash match confirms the document is unaltered since registration. A mismatch indicates potential tampering and is displayed to the Verifier with a clear warning.

The document verification and hash checking process is shown in Figure 3.5.

```
# Figure 3.5: Data Integrity Verification Process
[Data Integrity Verification Process Placeholder - Showing PDF document upload -> Hash generation -> On-chain storage -> Retrieval -> Re-hashing -> Comparison]
```

## 3.6 Security and Privacy Design

### 3.6.1 Authentication and Authorisation

**Authentication** is implemented using JSON Web Tokens (JWT) with a 24-hour expiry and a sliding refresh token mechanism. Passwords are stored as bcrypt hashes with a work factor of 12; no plaintext or reversibly encrypted credentials are retained at any layer. All API communication occurs over HTTPS; HTTP connections are redirected.

**Authorisation** is enforced at two independent layers: at the Flask API middleware layer, where the caller's JWT is validated and their database role is checked before the request reaches any service module; and at the smart contract layer, where OpenZeppelin's `AccessControl` modifiers reject any transaction from an address that does not hold the required role. This dual enforcement means that even if the API layer were bypassed — for example, through a direct transaction submitted to the contract from an Ethereum wallet — the smart contract's role checks would still prevent unauthorised operations.

### 3.6.2 Threat Model

The following threat model is produced using the STRIDE methodology, applied specifically to the blockchain land registry deployment context in Nigeria:

Table 3.10: STRIDE Threat Model

| Threat | Attack Vector | Risk Level in Prototype | Required Mitigation |
|---|---|---|---|
| **Registrar Key Theft** | Phishing or insider threat compromises the private key of the REGISTRAR_ROLE wallet | High — single wallet controls all registrations | Hardware wallet for role keys; multi-signature admin wallet with time-lock on role grants in production |
| **Double Registration** | Same physical parcel registered twice under slightly different GPS coordinates | High — no GIS boundary overlap detection in MVP | GIS boundary overlap detection prior to accepting registration calls; implemented as post-MVP feature |
| **Identity Spoofing** | Fraudulent NIN or BVN documents presented to pass KYC | High — KYC is simulated in prototype | NIMC API integration and biometric verification required for production deployment |
| **Smart Contract Bugs** | Reentrancy attack, access control bypass, or arithmetic error | Medium — OpenZeppelin used but independent audit not yet conducted | Slither static analysis, Mythril symbolic execution, Hardhat unit tests targeting >90% coverage |
| **Oracle Manipulation** | False off-chain data (e.g. fabricated survey approval) injected into the contract | Medium — no oracle architecture in prototype | Chainlink oracle or multi-party off-chain verification required in production |
| **Network-Level Attack (51%)** | Attacker controls majority of Polygon Amoy validators | Very Low — Polygon operates with 100+ validators | Use established Layer 2 networks with proven validator sets; not a practical threat at prototype stage |
| **Data Privacy Breach** | Off-chain PostgreSQL database compromised | Medium — depends on correct encryption configuration | AES-256 encryption at rest; TLS 1.3 in transit; access logging; NDPA compliance review |

### 3.6.3 Smart Contract Security Checklist

The following checklist governs the transition of the smart contract from development to testnet deployment:

- [ ] All contract functionality built exclusively on OpenZeppelin v5.x audited libraries: `AccessControl`, `ReentrancyGuard`, and `Pausable`
- [ ] Slither static analysis executed — all high and medium severity findings resolved before testnet deployment
- [ ] Mythril symbolic execution completed — all detected violations resolved
- [ ] Hardhat unit tests written targeting greater than 90% code coverage across all contract functions and branches
- [ ] UUPS proxy upgrade pattern implemented to allow state-preserving bug fixes post-deployment
- [ ] `pause()` and `unpause()` circuit-breaker functions restricted to `DEFAULT_ADMIN_ROLE`
- [ ] Minimum 48-hour time-lock applied to sensitive administrative operations: role grants, role revocations, and fee parameter changes
- [ ] Events emitted for every state change to support off-chain monitoring and the audit trail dashboard
- [ ] No personally identifiable information stored in any state variable or event parameter

The status transitions of a land parcel in the smart contract are governed by the state machine shown in Figure 3.6.

```
# Figure 3.6: Smart Contract State Machine — LandParcel Status Transitions
[State Machine Diagram Placeholder - Showing REGISTERED -> ACTIVE -> DISPUTED -> ACTIVE, or ACTIVE -> FROZEN (Revoked)]
```

### 3.6.4 Data Privacy Design

The privacy design of the SLR system is governed by four principles drawn from the NDPA 2023: data minimisation (collecting no more data than necessary), purpose limitation (using data only for the registered purpose), security (encrypting and access-controlling all personal data), and accountability (logging all access for audit review).

On the blockchain, these principles are operationalised through the exclusive use of pseudonymous wallet addresses and cryptographic hashes, with no name, address, or national identity number ever written to an on-chain state variable. In PostgreSQL, personal data is encrypted at the column level for the most sensitive fields and at the disk level for the entire database. Access to the PostgreSQL instance is restricted to the application layer; no direct database connections are permitted from the presentation layer. Audit logs of all data access operations are retained for a minimum of two years, consistent with standard regulatory practice.


## 3.7 FYP Implementation Roadmap

The prototype is developed over a four-month timeline structured as follows:

Table 3.11: FYP Implementation Roadmap

| Month | Primary Deliverable | Key Activities |
|---|---|---|
| **Month 1** | Research and Architecture Finalisation | Complete literature review. Finalise AUST Chapters 1 and 2. Define all smart contract function signatures. Define all Flask API endpoint schemas with request/response structures. Set up the Hardhat development project. Configure the Polygon Amoy wallet and obtain testnet MATIC for gas. |
| **Month 2** | Smart Contract and Backend Development | Write `LandRegistry.sol` with full role model, multi-signature transfer workflow, and dispute management. Deploy to local Ganache for initial testing. Deploy to Polygon Amoy testnet after passing local tests. Build Flask REST API with PostgreSQL models. Integrate Pinata IPFS API for document upload and retrieval. |
| **Month 3** | Frontend Development and System Integration | Build React frontend with Leaflet.js interactive map. Integrate MetaMask or WalletConnect for wallet signing. Connect all API endpoints to the frontend components. Implement role-based dashboard routing and access gating. Add console-based notification logging for all system events. |
| **Month 4** | Testing, Evaluation, and Documentation | Execute Hardhat unit tests and record coverage report. Run Slither and Mythril security analysis. Conduct integration tests with Pytest. Conduct SUS usability survey with a minimum of 10 participants. Measure and record gas cost per operation on Polygon Amoy. Write Chapters 3, 4, and 5. |

**Prototype Technology Stack Summary:**

Table 3.12: Prototype Technology Stack Summary

| Category | Technology |
|---|---|
| Smart Contracts | Solidity 0.8.x, Hardhat, OpenZeppelin Contracts v5 |
| Blockchain | Polygon Amoy testnet (Ganache for local development) |
| Backend | Python Flask, Web3.py, PostgreSQL, Pinata IPFS API |
| Frontend | React.js, Leaflet.js, ethers.js, MetaMask integration |
| Testing | Hardhat (smart contracts), Pytest (API), Cypress (end-to-end) |
| Security Analysis | Slither (static), Mythril (symbolic execution) |


## 3.8 Summary of Chapter

This chapter presented the complete analysis and design of the SecureLand Registry system. Functional requirements were defined across ten use cases with explicitly assigned priorities and a clear separation between the six MVP features required for prototype evaluation and the seven advanced features planned for subsequent development. The use case analysis described the five system actors and provided detailed step-by-step walkthroughs of the four primary interactions: land title registration, multi-signature ownership transfer, land record verification, and dispute filing and resolution.

The system architecture was presented as a five-layer hybrid design in which blockchain serves as the immutable trust layer rather than a replacement for all other technologies. The choice of Polygon Amoy as the prototype blockchain was justified through a comparative analysis against Ethereum mainnet and Hyperledger Fabric, with a clearly defined migration path to Hyperledger for production deployment. The smart contract design introduced four role types aligned with the Land Use Act's stakeholder structure, three primary data structures covering land parcels, transfer requests, and disputes, and a full set of access-controlled functions and corresponding event emissions.

The data management strategy defined a three-tier storage model — on-chain for authoritative ownership state, IPFS for tamper-evident document storage, and PostgreSQL for sensitive relational data — with a cross-layer document integrity verification process. The security design addressed authentication and authorisation at two independent enforcement layers, presented a STRIDE-based threat model specific to the Nigerian blockchain land registry context, and specified a pre-deployment smart contract security checklist. The chapter concluded with a four-month implementation roadmap governing the prototype's development.

Every design decision in this chapter is traceable to a specific requirement identified in Chapter Two: the multi-signature workflow responds to the gubernatorial consent requirement of the Land Use Act; the IPFS document storage responds to the documented vulnerability of paper-based records to physical destruction; the dual role enforcement responds to the corruption risk from centralised single-authority control; and the MVP scoping responds to the resource constraints of the final year project context. Chapter Four will present the implementation of this design, including the specific code configurations, test outcomes, and performance measurements generated during development.
