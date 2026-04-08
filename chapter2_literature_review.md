# CHAPTER TWO: LITERATURE REVIEW

## 2.0 Introduction

This chapter presents a structured review of existing literature relevant to the design of a blockchain-based land ownership verification system for Nigeria. The review is organised thematically across six areas: (1) land administration systems and their documented limitations; (2) blockchain technology fundamentals, including a critical assessment of when the technology is and is not justified; (3) blockchain applications in land registration, examined through global case studies; (4) the legal and regulatory framework governing land in Nigeria and its implications for system design; (5) smart contract design and security; and (6) off-chain and decentralised storage technologies. The chapter then establishes the theoretical and conceptual frameworks guiding the project, presents a gap analysis drawn from both the literature and the predecessor work to this project, and concludes by defining the specific research gap that this study addresses. The synthesis of these themes is not a neutral catalogue — it is a directed argument about what the existing body of work has established, what it has missed, and why the design choices in Chapter Three follow with necessity from both.


## 2.1 Land Administration Systems and Their Limitations

### 2.1.1 Global Context

Land administration encompasses the processes by which information about land — its ownership, value, use, and boundaries — is determined, recorded, and made accessible to social actors (Zevenbergen et al., 2013). In high-income countries, land registries are typically digitised, centrally maintained, legally backed by robust statutory frameworks, and supported by trained personnel and reliable digital infrastructure. Sweden's Lantmäteriet, for instance, manages a fully digital land registry with a high degree of public trust, rapid processing times, and integration with national identity systems (Lantmäteriet & ChromaWay, 2017). These systems function well in large part because the underlying institutional conditions — clear property rights, transparent governance, and capable bureaucracies — already exist.

In developing nations, and particularly across Sub-Saharan Africa, these preconditions are frequently absent. Ibrahim et al. (2021) conducted a systematic review of land administration systems in Nigeria and identified four persistent, structurally embedded failures: reliance on manual, paper-based records that are susceptible to loss, alteration, and physical destruction; centralised control structures that create single points of corruption and administrative failure; the absence of interoperability between state-level registries, which prevents cross-boundary land rights from being consistently recognised; and chronic deficits in trained personnel and digital infrastructure. These failures are not incidental; they are the product of specific historical decisions about how land was to be administered, decisions that were made under colonial and post-colonial conditions that did not anticipate the demands of a modern, urbanising economy.

### 2.1.2 Nigeria's Land Use Act of 1978 and Its Consequences

The Land Use Act of 1978 — incorporated as supreme law into the 1999 Constitution of the Federal Republic of Nigeria under Section 315 and Schedule 5, making it unamendable without a constitutional referendum — remains the primary legal framework governing land ownership across all levels of Nigerian society. The Act nationalises all land within each state and places its administration under the authority of the state governor, who grants Statutory Rights of Occupancy for urban land and Customary Rights of Occupancy for rural land through Certificates of Occupancy (C of O) and Letters of Administration respectively.

Babalola and Hull (2019) conducted a close empirical study in Ekiti State, documenting the mechanisms through which the Act produces dysfunction. Three failures in particular stand out. First, the governor's unilateral authority to grant, refuse, and revoke rights of occupancy — under Section 28, revocation is permissible "for overriding public interest," a phrase that is defined so vaguely as to be judicially unenforceable as a meaningful constraint — creates structural opportunities for political manipulation. Second, the consent requirement under Section 22, which applies to virtually every land transaction, produces bottlenecks that in practice require 12 to 24 months to navigate and impose costs that most citizens cannot absorb. Third, the Act coexists awkwardly with the customary tenure systems that predate it and remain the dominant form of land holding in rural Nigeria, producing legal ambiguity and persistent disputes between statutory grantees and customary holders whose prior rights the Act formally extinguished without adequate compensation.

Salawu (2025) extended this analysis to examine the corruption dimension in detail. The author documented what they call "institutional corruption channels" in Nigerian land administration: the routine bribery of registry officials to advance processing queues, the political allocation of prime urban land to allies of the governing party, the falsification of title documents through collusion between private applicants and registry staff, and the strategic exploitation of the Act's ambiguous provisions to threaten revocation unless unofficial payments are made. This is not corruption at the margins of the system; it is corruption that operates through the system's own design features.

### 2.1.3 The Economic Cost of Dysfunctional Land Administration

The macroeconomic consequences of this dysfunction have been estimated at a scale that justifies urgent reform. The World Bank's 2025 Nigeria Development Update characterises the untitled 90% of Nigerian land as "dead capital" — assets that cannot be leveraged for credit, transferred with legal certainty, or taxed to generate state revenue — and estimates the aggregate value of this unrealised economic potential at between $150 billion and $300 billion (World Bank, 2025). The Federal Ministry of Housing and Urban Development's National Land Registration, Documentation, and Titling Programme (Land4Growth), launched in 2024 and targeting the issuance of over one million digital land titles across 18 to 20 reform-ready states, represents the government's attempt to begin addressing this deficit through administrative reform rather than waiting for legislative change (Federal Ministry of Housing and Urban Development, 2024).

The scale of this problem provides the motivating context for a technology intervention. The question is not whether intervention is needed; it is whether blockchain-based intervention, specifically, will add value beyond what a well-designed centralised digital system would achieve on its own.


## 2.2 Blockchain Technology Fundamentals

### 2.2.1 Definition and Core Properties

Blockchain is a distributed ledger technology (DLT) in which transactions are recorded in cryptographically linked blocks, forming an append-only, tamper-evident data structure replicated across all participating nodes in a network. The National Institute of Standards and Technology (NIST) defines blockchain as "a distributed digital ledger of cryptographically signed transactions that are grouped into blocks" (Yaga et al., 2019, NISTIR 8202). While this definition is technically precise, its significance for land administration lies in what the architecture prevents rather than what it enables.

The properties most directly relevant to land registry design are as follows:

| Property | definition | Application to Land Registry |
|---|---|---|
| **Immutability** | Once a block is confirmed by consensus and appended to the chain, its contents cannot be altered without invalidating every subsequent block and requiring agreement from a majority of the network | Land ownership records written to the chain cannot be retroactively modified, eliminating the most common mechanism for title fraud |
| **Transparency** | All transactions are visible to authorised participants; on public blockchains, to all participants | Ownership history can be independently verified by any stakeholder with access, without relying on the word or goodwill of a registry official |
| **Decentralisation** | No single entity controls the ledger; copies are maintained and validated across multiple nodes | Eliminates single points of failure — both technical and political — and distributes the risk of corruption across the network |
| **Consensus** | Transactions are only added to the chain when a defined majority of participants agree on their validity | Prevents unilateral registration or transfer of land titles without multi-party agreement |
| **Auditability** | A complete, timestamped history of all transactions is maintained permanently | Provides a verifiable audit trail that no individual actor can suppress or alter after the fact |

### 2.2.2 Types of Blockchain Networks

The choice of blockchain network type is one of the most consequential architectural decisions for a land registry application, because different network types involve fundamentally different trade-offs between transparency, privacy, performance, and cost. Junaid et al. (2023) conducted a systematic review of blockchain-enabled land management systems and organised the available options into three primary categories.

**Public blockchains**, typified by the Ethereum mainnet, are open to all participants without restriction. They offer the maximum degree of transparency and decentralisation, but they are inappropriate for most government land registry applications for several reasons: transaction costs on Ethereum mainnet can range from a few dollars to tens of dollars per operation depending on network congestion, throughput is limited to approximately 15–30 transactions per second, and all data written to a public blockchain is permanently and publicly readable — which creates serious privacy concerns for sensitive land and identity records.

**Private blockchains**, such as those built on Hyperledger Fabric, restrict participation to explicitly authorised entities. They offer high throughput (Hyperledger Fabric can achieve over 2,000 transactions per second in optimised configurations), near-zero transaction costs, and granular privacy controls through channel architecture (Androulaki et al., 2018). These characteristics make private blockchains architecturally well-suited for government applications where data confidentiality is a legal requirement. However, Hyperledger Fabric requires a substantially more complex infrastructure setup than Ethereum-compatible chains, which makes it less practical for a final year project prototype.

**Consortium or permissioned blockchains** occupy a middle ground in which a pre-selected group of organisations — for a land registry application, this might include the government land bureau, licensed survey agencies, and authorised banks — jointly operate and validate the network. This model is increasingly recommended for land administration precisely because it balances the transparency and immutability benefits of public blockchain with the privacy and performance requirements of institutional data management (Ansah et al., 2023). Polygon, the Layer 2 network selected for this project, provides a practical route to this model: its Solidity-compatible smart contracts, negligible transaction costs, and high throughput make it suitable for prototype development, while its architecture supports a migration path to a fully permissioned consortium model for production deployment.

### 2.2.3 Critical Assessment: When Blockchain Is and Is Not Justified

A critical question must be addressed directly before proceeding further. Is blockchain genuinely necessary for a Nigerian land registry application, or would a well-designed centralised database with role-based access control and a comprehensive audit log achieve equivalent outcomes at lower cost and complexity?

The weight of the evidence supports blockchain as justified specifically for this use case, but only when three conditions are simultaneously present: multiple mutually distrusting parties must share a ledger without relying on any single authority; a tamper-proof audit trail is essential, typically because of a measurable anti-corruption mandate; and no single trusted authority exists that can reliably and impartially maintain the records over time.

In Nigeria's land administration system, all three conditions are demonstrably met. The stakeholders in any land transaction — government officials, private landowners, licensed surveyors, banks providing mortgages, and legal practitioners — are parties with potentially conflicting interests and no pre-existing shared source of truth. Institutional trust in land registries, as documented by Salawu (2025) and Transparency International (2025), is critically low. And Babalola and Hull (2019) have shown empirically that centralised registries are systematically manipulated. In this environment, a centralised digital database would simply digitalise the corruption rather than structurally constrain it.

However, not every component of the system benefits from blockchain. The following table identifies sub-components of the overall system where centralised approaches are more appropriate:

| Scenario | More Appropriate Alternative |
|---|---|
| Internal workflow management within a single government department | Centralised database with audit logs and role-based access control |
| User authentication and session management | OAuth2 and JWT standard approaches |
| Storage of large survey documents, maps, and photographs | IPFS or cloud storage with hash verification — not on-chain |
| Government-internal approval routing and case management | Digital signature workflow systems |
| Reporting, analytics, and search | PostgreSQL with indexed query structures |

This project's position is explicit: blockchain provides one layer — the immutable verification and audit layer — in a multi-layered reform. Without legal reform, institutional buy-in, and comprehensive data digitisation, the blockchain layer increases architectural complexity without adding proportionate value. The SecureLand Registry system is deliberately positioned as a complementary verification tool, not a replacement for any of the institutional reforms that Nigeria's land administration genuinely requires.


## 2.3 Blockchain Applications in Land Registration

### 2.3.1 Global Case Studies

The most significant global experiments with blockchain-based land registration are synthesised in the following table, drawing on Ansah et al. (2023), Shang and Price (2019), and supplementary sources:

| Country | Year | Platform | Current Status | Key Outcome | Key Lesson |
|---|---|---|---|---|---|
| Georgia | 2016 | Bitcoin (Bitfury) | Operational | Over 1.5 million title hashes recorded; public trust substantially restored | Success depended on prior institutional reforms; blockchain was the final layer added to an already-reformed system (Shang & Price, 2019) |
| Sweden | 2016 | ChromaWay (private) | Pilot completed | Demonstrated potential annual savings exceeding €100 million through streamlined property transactions | Legal framework gaps, particularly around digital signature validity, delayed and complicated the rollout (Lantmäteriet & ChromaWay, 2017) |
| Honduras | 2015 | Factom | Failed | Never launched; collapsed within months of initiation | Insufficient political will and an unreliable baseline land database made implementation impossible (Lemieux, 2017) |
| Ghana (BenBen) | 2017 | Custom platform | Ongoing | Digitised titles linked to bank financing; adoption progressing | Customary land integration remains the central unresolved challenge |
| Ghana (Bitland) | 2016 | Ethereum | Stalled | Worked directly with rural farmers on customary land documentation | Grassroots adoption without formal government backing proved insufficient to sustain operations |
| India (Andhra Pradesh) | 2017 | ChromaWay / Ethereum | Pilot | City-level property registration tested in Panchkula | Data migration from paper records proved to be the most resource-intensive phase by a wide margin |
| Rwanda | 2018 | WISeKey / Microsoft | In progress | Digital authentication being piloted within the national land registry | Partnership with established technology companies provided institutional credibility that domestic efforts lacked |
| Nigeria (Lagos) | 2024 | Undisclosed | Initiated | Tokenisation of properties; 18-month rollout planned | Demonstrates that political will for blockchain land administration exists at the state level in Nigeria (NQLB, 2024) |

### 2.3.2 Critical Analysis of Case Studies

Ansah et al. (2023) conducted a systematic review of institutional success factors across blockchain land registry implementations, identifying 18 factors distributed across regulatory, organisational, and cultural dimensions. Their analysis converges on three findings. First, regulatory readiness — specifically the legal recognition of digital records and the existence of clear governance frameworks — is the single most important predictor of successful implementation. Second, data quality determines the integrity of any blockchain-based system from the outset; a blockchain that records fraudulent or inaccurate baseline data preserves those inaccuracies with the same immutability it applies to accurate information. Third, sustained institutional commitment — characterised as the combination of political will and effective inter-agency coordination — is necessary for long-term viability in ways that no technical architecture can compensate for.

The Honduras case is particularly instructive for the Nigerian context. Despite initial political enthusiasm, the Factom-led initiative failed because the government lacked both the will to challenge the entrenched interests that profited from land registry opacity and a reliable existing land database from which to migrate records (Lemieux, 2017). This trajectory — technology deployed before the institutional preconditions are in place — is precisely the failure mode that this project's phased implementation model (described in Section 1.6) is designed to avoid. Blockchain cannot substitute for institutional reform; it can only amplify the effectiveness of institutions that have already been reformed.

### 2.3.3 Synthesis and Implications for This Project

Three conclusions from the global case study literature directly inform the design of SecureLand Registry. First, the most successful implementations used blockchain as the final integrity layer on top of a pre-existing reform programme, not as the initiating intervention — this supports the phased deployment model. Second, legal framework development and technical development must proceed in parallel, not sequentially — this supports the project's explicit framing as a verification layer within, not a replacement for, the existing legal framework. Third, multi-stakeholder governance — the involvement of government, civil society, and technically relevant professionals in the system's operation — is a predictor of sustainability — this directly supports the multi-signature workflow design in which landowner, surveyor, and registrar approval are all required for any transfer.


## 2.4 Legal and Regulatory Analysis

### 2.4.1 The Land Use Act 1978: Implications for Smart Contract Design

Every design decision in a blockchain land registry for Nigeria must be evaluated against the Land Use Act of 1978, because the Act is the constitutional superior of any technical system that operates within Nigerian law. The following table maps the Act's most consequential provisions to corresponding design requirements in the SecureLand Registry system:

| Act Provision | Implication for Blockchain Design | Design Response in SLR |
|---|---|---|
| **Section 1:** All land vested in the State Governor | Blockchain cannot supersede or bypass gubernatorial authority under any circumstances | A `GOVERNOR_ROLE` is defined in the smart contract, with override and revocation capabilities that no other role can countermand |
| **Section 22:** Governor's consent required for all transfers, mortgages, and subleases | Every ownership transfer executed by the system must carry the authority of the government | The multi-signature transfer workflow mandates `REGISTRAR_ROLE` approval, with the registrar understood as acting under the governor's delegated authority |
| **Section 28:** Governor may revoke any right of occupancy for overriding public interest | Even registered titles on the blockchain can be legally revoked | A `revokeTitle()` function is accessible only to `GOVERNOR_ROLE`, and a time-lock mechanism is applied to prevent abuse |
| **Section 36:** Customary rights of occupancy for rural land | Customary land has a different legal status and transfer process from statutory land | The data model includes a parcel type field that distinguishes statutory from customary parcels, each with an appropriately designed approval workflow |
| **Certificate of Occupancy** as the statutory legal instrument of land rights | A blockchain token is not, under current Nigerian law, equivalent to a C of O | SLR generates a blockchain-verified record that accompanies and corroborates the traditional C of O process — it does not replace it |

### 2.4.2 The Legal Recognition Gap

Nigeria currently has no legislation that recognises blockchain records as primary legal proof of land ownership. The Evidence Act 2011, Section 84, accepts computer-generated evidence in legal proceedings, but this provision was not drafted with distributed ledgers in mind and has not been judicially interpreted to extend to blockchain-specific records. This is not a limitation peculiar to this project; it is the central legal challenge facing any blockchain land registry in Nigeria and the primary reason that the system is framed, throughout this report, as a verification and audit layer rather than a replacement for the statutory Certificate of Occupancy process.

### 2.4.3 Required Legal Reforms for Full Adoption

For the SLR system to transition from prototype to legally operational deployment in Nigeria, four categories of legislative change would be required:

1. Amendments to the Land Use Act specifically recognising digital and blockchain-recorded land rights as admissible and binding evidence of ownership.
2. Amendments to the Electronic Transactions Act establishing the legal enforceability of smart contracts under Nigerian law.
3. A specific compliance framework under the Nigeria Data Protection Act 2023 governing land data, including defined retention periods, access rights, and inter-agency data sharing provisions.
4. Inter-state data sharing agreements, given that land rights, inheritance disputes, and boundary conflicts frequently involve parcels that span state boundaries or are governed by differing state-level regulations.

### 2.4.4 Nigeria Data Protection Act 2023 (NDPA) Compliance

The NDPA 2023 establishes principles of data minimisation, purpose limitation, transparency, and consent as the governing framework for personal data processing in Nigeria. The SecureLand Registry system is designed for compliance with these principles from the architecture level: on the blockchain, only pseudonymous data is stored — wallet addresses and cryptographic document hashes, with no personally identifiable information written to any on-chain state variable or event. Sensitive data, including user identity records, KYC verification status, and authentication credentials, is stored exclusively in the encrypted PostgreSQL off-chain database, protected by AES-256 encryption at rest and TLS 1.3 in transit. No raw biometric or national identity data is retained at any layer of the system; only a verification status flag (verified or unverified) is maintained.


## 2.5 Smart Contract Design and Security

### 2.5.1 Design Patterns for Land Registry Smart Contracts

A smart contract is a self-executing programme stored on a blockchain that automatically enforces agreed-upon rules when predefined conditions are met, without requiring the involvement of a trusted intermediary (Buterin, 2014). In practice, a smart contract written in Solidity for the Ethereum Virtual Machine (EVM) is a deterministic programme whose logic, once deployed, executes identically for all participants regardless of who initiates a transaction. This property is particularly valuable for land administration, where the consistency and impartiality of enforcement are precisely what the existing system fails to provide.

For land registry applications, smart contracts most commonly follow either the state-machine pattern — where a parcel advances through defined states (registered, active, disputed, frozen, transferred) and transitions between states require specified authorisations — or the token-based pattern, where each parcel is represented as a non-fungible token (NFT) using the ERC-721 standard. The SLR system employs the state-machine pattern as the primary ownership management mechanism, with role-based access control implemented through OpenZeppelin's `AccessControl` library rather than a single owner address. This eliminates the single-point-of-compromise vulnerability inherent in designs where one private key controls the entire system (Androulaki et al., 2018).

### 2.5.2 Smart Contract Security Vulnerabilities

Atzei et al. (2017) conducted a foundational survey of attack classes against Ethereum smart contracts, establishing a taxonomy that remains the standard reference for smart contract security analysis. The vulnerabilities most relevant to a land registry contract are:

| Vulnerability Class | Description | Mitigation Strategy |
|---|---|---|
| **Reentrancy** | An external call allows a malicious contract to re-enter the calling function before state variables have been updated, enabling double-spending or state corruption | Adopt the checks-effects-interactions pattern; use OpenZeppelin's `ReentrancyGuard` modifier |
| **Access control failure** | Missing or incorrectly implemented role checks allow unauthorised users to execute privileged functions such as land registration or title revocation | Use OpenZeppelin's `AccessControl` with explicitly defined role constants and modifier enforcement on all sensitive functions |
| **Integer overflow/underflow** | Arithmetic operations that exceed the representational range of the data type produce unexpected results (mitigated by default in Solidity ≥0.8.0) | Use Solidity 0.8.x or higher; all arithmetic is overflow-checked by default |
| **Denial of service via unbounded loops** | A function that iterates over an array of unbounded length can exhaust the block gas limit, making the function permanently uncallable | Avoid unbounded iterations; use mappings instead of arrays where possible; implement pagination |
| **Front-running** | Miners or validators observe pending transactions and reorder them to extract value before a legitimate transaction is confirmed | Low risk for land title transfers due to their non-fungible nature; private mempools available for production if needed |

For the SLR system, security is addressed through a layered approach: the use of OpenZeppelin's audited contract libraries exclusively; static analysis of the compiled contract using Slither, targeting zero high or medium-severity findings before testnet deployment; symbolic execution with Mythril; and comprehensive unit testing with Hardhat targeting greater than 90% code coverage across all contract functions.


## 2.6 Off-Chain and Decentralised Storage

### 2.6.1 The Hybrid Storage Rationale

On-chain storage on Ethereum-compatible blockchains is expensive by design. Writing one kilobyte of data to the Ethereum mainnet can cost multiple dollars in gas fees depending on network congestion; storing a survey document or title deed, which may be several megabytes in size, would cost hundreds or thousands of dollars per document. This makes on-chain document storage entirely impractical for a land registry system that must accommodate large numbers of parcels and their associated documentation. The solution is a hybrid storage model in which only the minimum data necessary for verification and auditability — parcel identifiers, owner addresses, cryptographic document hashes, status flags, and timestamps — is stored on-chain, while the documents themselves are stored off-chain in a system that preserves tamper-evidence through cryptographic content addressing (Junaid et al., 2023).

### 2.6.2 IPFS: InterPlanetary File System

IPFS is a peer-to-peer distributed file system that identifies and retrieves content by its cryptographic hash — called a Content Identifier, or CID — rather than by its server location (Benet, 2014). When a document is uploaded to IPFS, its content is hashed to produce a unique CID. Any change to the document, even a single character, produces a completely different CID, making content-addressed storage inherently tamper-evident. When the CID is stored on the blockchain, the blockchain provides an immutable pointer to a specific document state: if the document is altered after the CID has been registered, the mismatch between the stored CID and the newly computed CID of the modified document is immediately detectable.

IPFS addresses a significant limitation of centralised off-chain storage: a centralised server is both a single point of failure and a single point of attack. If the server hosting a title deed is destroyed or compromised, the document is lost or corrupted. IPFS distributes copies across a network of nodes, and permanent retention can be ensured through Filecoin incentives or through pinning services such as Pinata, which guarantee that at least one node in the network maintains a persistent copy for as long as the pinning subscription is active.

### 2.6.3 PostgreSQL for Sensitive and Relational Data

Sensitive user data — personal identification information, KYC verification records, authentication credentials, session data, and application logs — must not be stored on any blockchain or public IPFS network. This is both a privacy best practice and a legal requirement under the NDPA 2023. PostgreSQL, a mature open-source relational database management system, is used for this category of data. Its support for role-based access control, row-level security, JSON data types, and geospatial extensions (PostGIS) makes it well-suited to the complex, multi-entity data model of a land registry system. Encryption at rest (AES-256) and in transit (TLS 1.3) are applied to the PostgreSQL instance to comply with the NDPA's security requirements.


## 2.7 Theoretical Framework

This project is grounded in two complementary theoretical frameworks, each of which contributes a distinct analytical lens to the system design.

**Institutional Trust Theory.** Institutional trust refers to citizens' confidence in public institutions to act fairly, competently, and in the public interest (Ølnes et al., 2017). In Nigeria, institutional trust in land registries is not merely low — it is structurally rational for it to be low, given the documented pattern of manipulation and corruption. Blockchain's "trustless" architecture — where trust is placed in mathematical properties of cryptographic systems rather than in the integrity of any individual or office — offers a mechanism for rebuilding confidence in land records without requiring confidence in any single government actor. This framework directly motivates the design choice of decentralised consensus and multi-stakeholder approval workflows over centralised administration.

**The Land Administration Domain Model (LADM).** ISO 19152:2012 provides an internationally standardised conceptual model for describing land administration, defining the relationships between parties (rights holders), rights (what they hold), restrictions (what limits those rights), responsibilities (obligations attached to rights), and spatial units (the physical land parcels the rights apply to) (Zevenbergen et al., 2013). The LADM provides the conceptual basis for the system's data model, ensuring that the prototype's representation of land parcels, ownership rights, and administrative processes uses standard terminology and relationship structures that are interoperable with international land administration systems and can be understood by specialists in the field.


## 2.8 Conceptual Framework

The conceptual framework below illustrates how the system's components interact to achieve the project's objectives. The five-layer architecture — from user-facing presentation through to the blockchain and external integrations — reflects the design principle that blockchain operates as the trust layer within a broader system, not as the entire system.

```
┌─────────────────────────────────────────────────────────────────────┐
│                       LAYER 1: PRESENTATION                          │
│   Web Application (Progressive Web App) │ USSD Gateway (feature     │
│   Role-Based Dashboards             phones, rural access)            │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS requests (JWT authenticated)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LAYER 2: API GATEWAY                              │
│   Flask REST API — Authentication, Rate Limiting,                    │
│   RBAC Middleware, Request Validation                                │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LAYER 3: SERVICE LAYER                            │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────────┐  │
│  │ Identity/KYC│ │ Land Registry│ │  Dispute   │ │ Notification │  │
│  │  Service    │ │  Service     │ │  Resolution│ │  Service     │  │
│  └─────────────┘ └──────────────┘ └────────────┘ └──────────────┘  │
│  ┌─────────────┐ ┌──────────────┐                                   │
│  │ GIS/Mapping │ │  Document    │                                    │
│  │  Service    │ │  Service     │                                    │
│  └─────────────┘ └──────────────┘                                   │
└──────────┬─────────────┬──────────────────┬───────────────────────┘
           │             │                  │
           ▼             ▼                  ▼
┌──────────────┐  ┌────────────┐  ┌──────────────────────────────┐
│ PostgreSQL   │  │    IPFS    │  │  SMART CONTRACTS              │
│ User data,   │  │ Title deeds│  │  (Polygon Amoy Testnet)       │
│ KYC, sessions│  │ Survey     │  │  Ownership records, transfer  │
│ API logs     │  │ plans,     │  │  logic, dispute flags,        │
│              │  │ evidence   │  │  event log                    │
└──────────────┘  └────────────┘  └──────────────────────────────┘
                                           LAYER 4: DATA LAYER
┌─────────────────────────────────────────────────────────────────────┐
│                   LAYER 5: EXTERNAL INTEGRATIONS                     │
│  NIMC (NIN verification) │ State Land Bureaus │ Survey Agencies      │
│  (simulated in prototype)  (future integration) (cadastral data)     │
└─────────────────────────────────────────────────────────────────────┘
```

The positioning of the blockchain layer as one component within a five-layer architecture reflects a deliberate architectural philosophy. Blockchain handles the functions it is uniquely suited to — immutable record-keeping, decentralised consensus, and tamper-evident audit trails — while conventional technologies handle the functions they handle better: relational queries (PostgreSQL), large file storage (IPFS), user interface rendering (web application), and API orchestration (Flask). This is not a compromise; it is the architecturally correct approach to a hybrid system.


## 2.9 Critical Gap Analysis

The following gaps were identified both in the existing academic literature and in the predecessor project documents that this work supersedes. They directly motivate the design decisions in Chapter Three.

### 2.9.1 Functional Gaps in Existing Blockchain Land Registry Prototypes

| Gap | Severity | Required State |
|---|---|---|
| GIS and land mapping integration | Critical | Spatial coordinates and boundary definitions are required to prevent boundary fraud — the registration of the same physical parcel under slightly different GPS coordinates |
| Digital identity and KYC pipeline | Critical | Full KYC using NIN and BVN is required; a hash of a national ID number alone is insufficient to establish identity or prevent impersonation |
| Multi-signature approval workflow | Critical | A single registrar controlling all state changes creates a single point of compromise. Surveyor, registrar, and owner approval must all be independently required |
| IPFS and off-chain document storage | Major | Content-addressed storage on IPFS provides tamper-evidence that a centralised database does not; it must be integrated, not optional |
| Full dispute resolution workflow | Major | A simple boolean `isDisputed` flag is architecturally inadequate; evidence submission, review tracking, and resolution recording with notes are required |
| Public audit trail and transparency dashboard | Major | Transparency requires that stakeholders other than administrators can independently verify the history of any parcel |

### 2.9.2 Technical Gaps

| Gap | Specific Problem |
|---|---|
| Blockchain platform selection unjustified | Projects that reference Ethereum and Hyperledger Fabric without comparative analysis or a decision rationale are architecturally undefined; the choice must be explicitly justified |
| No gas cost analysis | Ethereum mainnet gas costs are prohibitive for high-volume land transactions; any prototype that ignores gas economics cannot be considered production-aware |
| Single-key administration | A design where one wallet address controls all write operations means that key theft equates to total system compromise |
| No oracle architecture | Injecting off-chain data — survey results, identity verification — into the smart contract without a verified oracle mechanism creates a manipulation vector |

### 2.9.3 Legal Gaps

| Gap | Impact |
|---|---|
| Land Use Act provisions not reflected in technical design | The Act's gubernatorial consent requirement fundamentally constrains all transfer logic; a system that ignores this produces transfers that are technically valid on-chain but legally void in Nigeria |
| Legal status of blockchain records assumed | The Evidence Act 2011's Section 84 does not clearly extend to blockchain records; the project must be framed accordingly |
| Dual tenure system ignored | Nigeria's customary land tenure system represents the majority of rural landholdings; omitting it produces a system that is legally incomplete for most of the country |

### 2.9.4 Socio-Political Gaps

| Gap | Reality |
|---|---|
| Government resistance unaddressed | Transparency directly and materially threatens officials who profit from the current system's opacity; this cannot be assumed away |
| Digital literacy claimed but not operationalised | Assertions of "user-friendliness" are insufficient; concrete design choices — USSD support, Pidgin English labels, simplified workflows — are required |
| Infrastructure constraints unmodelled | Nigeria's internet penetration is approximately 55% (Nigerian Communications Commission, 2024); intermittent power supply affects blockchain client availability in significant parts of the country |
| Economic sustainability absent | No existing prototype addresses who funds the system — government budget, transaction fees, international development grants — and without this, no prototype can claim real-world viability |


## 2.10 Research Gap

Despite the growing body of literature on blockchain applications in land administration, the systematic review by Ansah et al. (2023) — the most comprehensive to date — acknowledges that most existing implementations are in initial, development, or pilot testing phases and have been designed for environments with reliable digital infrastructure, clear legal frameworks, and pre-existing digital baseline databases. Junaid et al. (2023), reviewing blockchain-enabled land management systems comprehensively, identified a concentration of implementations in high-income contexts and a notable absence of prototypes designed for the specific combination of constraints characteristic of Sub-Saharan Africa.

Specifically, no study or prototype in the literature simultaneously addresses all five constraints that define the Nigerian context for a blockchain land registry:

1. **Moderate hardware infrastructure** — the system must be deployable and testable on standard consumer-grade hardware without enterprise-grade servers or dedicated blockchain nodes.
2. **Low digital literacy** — the interface must be navigable by users with limited technical experience. Nigeria targets 70% digital literacy by 2027 (ITU & NITDA, 2024), but the current baseline is substantially lower in rural and peri-urban areas.
3. **Dual land tenure system** — the data model must accommodate both statutory rights of occupancy (C of O) and customary rights, with appropriately differentiated workflows for each.
4. **Gubernatorial consent requirement** — the transfer workflow must incorporate government approval as a mandatory step, rather than proposing to bypass or replace it.
5. **Multi-stakeholder verification** — land transactions in Nigeria involve landowners, licensed surveyors, government registrars, and legal professionals, all of whom must be actively represented in the approval workflow if the system is to be legally aligned.

This project addresses this compound gap by delivering a functional prototype that is technically designed for moderate hardware, legally aligned with the Land Use Act's requirements, architecturally inclusive of both tenure types, and built with a user interface designed for varying levels of digital literacy.


## 2.11 Summary of Chapter

This chapter reviewed the current state of land administration in Nigeria, establishing both the historical origins and the contemporary consequences of the Land Use Act's centralised, bureaucracy-driven model. It examined blockchain technology's core properties and critically assessed the conditions under which the technology genuinely adds value over centralised alternatives — concluding that Nigeria's land administration context meets those conditions, but only as a verification and audit layer within a broader reform programme. Global case studies were synthesised to extract the key lessons of both success (Georgia, Sweden) and failure (Honduras, Bitland), with direct implications drawn for the design of this project. A legal and regulatory analysis mapped the Land Use Act's provisions to specific smart contract design requirements and identified the legislative changes that would be necessary for a production deployment. The smart contract security landscape was reviewed with reference to the foundational work of Atzei et al. (2017), and the hybrid storage model using IPFS and PostgreSQL was justified. The chapter concluded with a structured gap analysis identifying the functional, technical, legal, and socio-political gaps in existing literature and implementations that this project is designed to address. These gaps, taken together, constitute the research gap that the SecureLand Registry prototype fills. Chapter Three presents the system design that responds to this gap.
