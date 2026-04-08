---

# DESIGN AND IMPLEMENTATION OF A BLOCKCHAIN-BASED LAND OWNERSHIP VERIFICATION SYSTEM FOR NIGERIA

&nbsp;

A Project Presented to the Department of

Computer Science

&nbsp;

African University of Science and Technology, Abuja

&nbsp;

In Partial Fulfilment of the Requirements for a Bachelor's Degree

&nbsp;

By

&nbsp;

**Oseikhuemen Osereme Ojo**

&nbsp;

Abuja, Nigeria

&nbsp;

March, 2026.

---

*(Page i — Certification)*

## CERTIFICATION

This is to certify that the project titled **"DESIGN AND IMPLEMENTATION OF A BLOCKCHAIN-BASED LAND OWNERSHIP VERIFICATION SYSTEM FOR NIGERIA"** submitted to the School of Computing, African University of Science and Technology (AUST), Abuja, Nigeria, for the award of the Bachelor's degree is a record of original research carried out by **Oseikhuemen Osereme Ojo** in the Department of Computer Science.

&nbsp;

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Dr Obi**
Supervisor, Department of Computer Science

&nbsp;

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Head, Department of Computer Science**

&nbsp;

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Date**

---

*(Page ii — Signature Page)*

## DESIGN AND IMPLEMENTATION OF A BLOCKCHAIN-BASED LAND OWNERSHIP VERIFICATION SYSTEM FOR NIGERIA

By

**Oseikhuemen Osereme Ojo**

&nbsp;

**A PROJECT APPROVED BY THE DEPARTMENT OF COMPUTER SCIENCE**

&nbsp;

RECOMMENDED: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Dr Obi, Supervisor

&nbsp;

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Head, Department of Computer Science

&nbsp;

APPROVED: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Chief Academic Officer

&nbsp;

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

Date

---

*(Page iii — Abstract)*

## ABSTRACT

Land ownership disputes and fraudulent transactions remain significant barriers to economic stability in Nigeria, where fewer than 10% of land parcels are formally registered. This project presents the design, implementation, and evaluation of SecureLand Registry (SLR), a hybrid decentralised application integrating blockchain technology with geographic information systems (GIS) to provide transparent, secure, and verifiable land ownership records. The system employs Solidity smart contracts deployed on a Polygon testnet, a Flask backend with PostgreSQL for off-chain data management, and IPFS for decentralised document storage. A multi-signature approval workflow involving landowners, surveyors, and government registrars ensures alignment with Nigeria's Land Use Act of 1978. The architecture addresses five constraints that have been absent from existing blockchain land registry prototypes: moderate hardware infrastructure, low digital literacy, dual customary-statutory tenure systems, the gubernatorial consent requirement, and multi-stakeholder verification. Evaluation on simulated datasets demonstrates the technical viability of blockchain-augmented land administration in resource-constrained environments. The study critically examines technical limitations, legal gaps, and socio-political barriers to adoption, and contributes a practical framework for phased implementation applicable to developing nations across Sub-Saharan Africa.

**Keywords:** Blockchain, Land Registry, Smart Contracts, Nigeria, Land Use Act, IPFS, Decentralised Application, GovTech, SecureLand Registry, Polygon

---

*(Page iv — Dedication)*

## DEDICATION

To every Nigerian who has lost land through corruption, fraud, or the failure of a system that was meant to protect them.

---

*(Page v — Acknowledgements)*

## ACKNOWLEDGEMENTS

I would like to express my sincere gratitude to Dr Obi, my project supervisor, for the guidance, patience, and intellectual rigour that shaped this work from proposal to completion. I am grateful to the Department of Computer Science at the African University of Science and Technology for providing the academic environment in which this research was carried out. My thanks also go to my family for their unwavering support throughout my undergraduate studies, and to my colleagues for the discussions and debates that sharpened my thinking on the problems this project attempts to address.

---

*(Table of Contents)*

## TABLE OF CONTENTS

| Section | Page |
|---|---|
| Certification | i |
| Signature Page | ii |
| Abstract | iii |
| Dedication | iv |
| Acknowledgements | v |
| Table of Contents | vi |
| List of Tables | viii |
| List of Figures | ix |
| List of Abbreviations | x |
| **CHAPTER ONE: INTRODUCTION** | **1** |
| 1.1 Background of the Study | 1 |
| 1.2 Statement of the Problem | 5 |
| 1.3 Purpose of the Study | 8 |
| 1.4 Aim and Objectives | 8 |
| 1.5 Scope of the Project | 10 |
| 1.6 Significance of the Study | 12 |
| 1.7 Overview of Project Structure | 14 |
| **CHAPTER TWO: LITERATURE REVIEW** | **15** |
| 2.0 Introduction | 15 |
| 2.1 Land Administration Systems and Their Limitations | 15 |
| 2.2 Blockchain Technology Fundamentals | 19 |
| 2.3 Blockchain Applications in Land Registration | 24 |
| 2.4 Legal and Regulatory Analysis | 27 |
| 2.5 Smart Contract Design and Security | 31 |
| 2.6 Off-Chain and Decentralised Storage | 34 |
| 2.7 Theoretical Framework | 36 |
| 2.8 Conceptual Framework | 37 |
| 2.9 Critical Gap Analysis | 39 |
| 2.10 Research Gap | 42 |
| 2.11 Summary of Chapter | 43 |
| **CHAPTER THREE: ANALYSIS AND DESIGN** | **44** |
| 3.0 Introduction | 44 |
| 3.1 System Requirements | 44 |
| 3.2 Use Case Analysis | 50 |
| 3.3 System Architecture | 56 |
| 3.4 Smart Contract Design | 62 |
| 3.5 Data Management Strategy | 68 |
| 3.6 Security and Privacy Design | 71 |
| 3.7 FYP Implementation Roadmap | 76 |
| 3.8 Summary of Chapter | 78 |
| **REFERENCES** | **80** |

---

*(List of Tables)*

## LIST OF TABLES

| Table | Title | Page |
|---|---|---|
| Table 2.1 | Blockchain Properties Relevant to Land Registry | 20 |
| Table 2.2 | Comparison of Blockchain Network Types | 22 |
| Table 2.3 | When Blockchain Is and Is Not Justified | 23 |
| Table 2.4 | Global Blockchain Land Registry Case Studies | 25 |
| Table 2.5 | Land Use Act Provisions vs. Smart Contract Design Responses | 28 |
| Table 2.6 | Smart Contract Vulnerability Classes and Mitigations | 33 |
| Table 2.7 | Functional Gaps in Existing Blockchain Land Registry Prototypes | 40 |
| Table 2.8 | Technical Gaps in Existing Prototypes | 41 |
| Table 2.9 | Legal Gaps in Existing Prototypes | 41 |
| Table 2.10 | Socio-Political Gaps in Existing Prototypes | 42 |
| Table 3.1 | Functional Requirements | 45 |
| Table 3.2 | Non-Functional Requirements | 47 |
| Table 3.3 | MVP vs. Advanced Post-MVP Features | 49 |
| Table 3.4 | System Actors | 51 |
| Table 3.5 | Blockchain Platform Comparison | 57 |
| Table 3.6 | Technology Stack | 59 |
| Table 3.7 | Smart Contract Role Definitions | 63 |
| Table 3.8 | Smart Contract Key Functions | 65 |
| Table 3.9 | Smart Contract Event Emissions | 67 |
| Table 3.10 | STRIDE Threat Model | 72 |
| Table 3.11 | FYP Implementation Roadmap | 77 |

---

*(List of Figures)*

## LIST OF FIGURES

| Figure | Title | Page |
|---|---|---|
| Figure 2.1 | Five-Layer System Architecture Conceptual Framework | 38 |
| Figure 3.1 | Use Case Diagram — SecureLand Registry (SLR) | 52 |
| Figure 3.2 | UC2 Multi-Signature Transfer Approval Flow | 55 |
| Figure 3.3 | UC4 Dispute Filing and Resolution Flow | 56 |
| Figure 3.4 | Five-Layer System Architecture (Detailed) | 60 |
| Figure 3.5 | Data Integrity Verification Process | 70 |
| Figure 3.6 | Smart Contract State Machine — LandParcel Status Transitions | 66 |

---

*(List of Abbreviations)*

## LIST OF ABBREVIATIONS

| Abbreviation | Full Form |
|---|---|
| API | Application Programming Interface |
| AUST | African University of Science and Technology |
| BVN | Bank Verification Number |
| C of O | Certificate of Occupancy |
| CID | Content Identifier (IPFS) |
| DLT | Distributed Ledger Technology |
| ERC-721 | Ethereum Request for Comment 721 (NFT Standard) |
| EVM | Ethereum Virtual Machine |
| FCT | Federal Capital Territory |
| GIS | Geographic Information System |
| IPFS | InterPlanetary File System |
| ITU | International Telecommunication Union |
| JWT | JSON Web Token |
| KYC | Know Your Customer |
| LGA | Local Government Area |
| LADM | Land Administration Domain Model |
| MVP | Minimum Viable Product |
| NDPA | Nigeria Data Protection Act |
| NFT | Non-Fungible Token |
| NIMC | National Identity Management Commission |
| NIN | National Identification Number |
| NIST | National Institute of Standards and Technology |
| NITDA | National Information Technology Development Agency |
| NLRDTP | National Land Registration, Documentation, and Titling Programme |
| PWA | Progressive Web App |
| RBAC | Role-Based Access Control |
| REST | Representational State Transfer |
| SLR | SecureLand Registry |
| SUS | System Usability Scale |
| TLS | Transport Layer Security |
| TPS | Transactions Per Second |
| UUPS | Universal Upgradeable Proxy Standard |

---



---

# CHAPTER ONE: INTRODUCTION

## 1.1 Background of the Study

Land is arguably the most consequential economic asset in any developing nation. It underpins agriculture, housing, industrialisation, and access to formal credit, and its reliable administration is widely regarded as a prerequisite for sustained economic growth (Zevenbergen et al., 2013). In Nigeria, home to over 220 million people and the largest economy in Africa, the question of who owns land — and how that ownership is proven, transferred, and protected — carries extraordinary social and financial weight. The answer to that question is governed, for better or worse, by the Land Use Act of 1978.

The Land Use Act, enacted under General Olusegun Obasanjo's military administration and subsequently entrenched in the 1999 Constitution of the Federal Republic of Nigeria under Schedule 5, was designed to resolve a genuinely difficult problem. Before its enactment, Nigeria's land tenure system was a patchwork of colonial statutory registers, Islamic land law in the north, and a wide variety of customary tenure arrangements that differed significantly from one ethnic group and geographical region to the next. The Act attempted to bring uniformity by vesting all land within each state in the state governor, who would then allocate rights of occupancy to individuals and organisations (Land Use Act, 1978, Section 1). The governor's consent was made mandatory for virtually all land transactions — alienation, mortgage, subletting — under Section 22 of the Act.

More than four decades after it came into force, the Act's practical outcomes have diverged sharply from its stated intentions. Rather than unifying land administration, the law has concentrated enormous power in a single office while generating severe bureaucratic bottlenecks. Babalola and Hull (2019) conducted an empirical study in Ekiti State and found that the Act has created more dysfunctions than it resolved. The process of obtaining a Certificate of Occupancy (C of O) — the primary legal instrument through which a citizen can prove formal ownership of land — can take between twelve and twenty-four months and requires navigating multiple government agencies, paying numerous official and unofficial fees, and securing the personal attention of offices that are chronically understaffed (Salawu, 2025). The consequence of this dysfunction is that the overwhelming majority of landholders have simply chosen not to engage with the formal system.

The Federal Ministry of Housing and Urban Development estimates that fewer than 10% of land parcels in Nigeria are formally registered (Federal Ministry of Housing and Urban Development, 2024). The World Bank has characterised the remaining 90% as "dead capital" — land that exists and is used but cannot function as economic collateral because it lacks the documentation that formal markets require (World Bank, 2025). The estimated monetary value of this untapped potential ranges between $150 billion and $300 billion; an asset base larger than most African economies that sits locked outside the formal financial system.

Into this context, blockchain technology has emerged as a candidate solution. Originally conceptualised as the distributed ledger mechanism underlying the Bitcoin cryptocurrency by Nakamoto (2008), blockchain has since evolved into a general-purpose distributed ledger technology (DLT) applicable across sectors ranging from healthcare and supply chain management to public administration and digital identity (Ølnes et al., 2017). Its core properties — the cryptographic immutability of recorded data, the transparent auditability of all transactions, and the capacity for decentralised consensus without reliance on a single controlling authority — align directly with the structural weaknesses of Nigeria's centralised land registries (Ansah et al., 2023).

Global experience with blockchain-based land registries is instructive and, importantly, mixed. The Republic of Georgia partnered with the Bitfury Group in 2016 to publish cryptographic hashes of over 1.5 million land title records onto the Bitcoin blockchain, with results that substantially restored public confidence in the country's land registry system (Shang & Price, 2019). Sweden's national land registry authority, Lantmäteriet, ran a pilot with ChromaWay demonstrating that blockchain-enabled streamlining of property transactions could save the Swedish economy over €100 million annually (Lantmäteriet & ChromaWay, 2017). On the African continent, Ghana's BenBen initiative has made progress in digitising titles and linking them to bank financing, though customary land integration remains an ongoing challenge. Honduras, by contrast, entered a partnership with Factom in 2015 that collapsed within months, halted by insufficient political will and the absence of reliable baseline data from which to migrate records (Lemieux, 2017).

These experiences confirm what the research literature increasingly emphasises: blockchain is not a universal remedy. Its effectiveness in land administration depends critically on the quality of existing data, the degree of institutional readiness, a clear legal framework, and genuine and sustained political commitment (Ansah et al., 2023). Technology deployed without these foundations does not replace the missing foundations — it simply preserves the chaos in a more expensive format. In Nigeria, the Lagos State government's 2024 announcement of a blockchain-enabled land registry initiative signals growing political openness to the technology at the sub-national level (NQLB, 2024). The Federal Government's Land4Growth programme further demonstrates that digital land administration reform is now on the national policy agenda (Federal Ministry of Housing and Urban Development, 2024). What is currently absent is a functional, deployable prototype designed specifically for Nigeria's technical constraints, its dual statutory-customary tenure system, its digital literacy profile, and the constitutional requirement for gubernatorial consent in all land transactions.

This project addresses that specific gap. It presents the design and implementation of SecureLand Registry (SLR), a blockchain-based land ownership verification prototype built for the Nigerian context, with the intent that its architecture and lessons be applicable across Sub-Saharan Africa.


## 1.2 Statement of the Problem

Nigeria's land administration system, as it currently operates, suffers from four interrelated and mutually reinforcing failures. Each of these failures individually would be enough to undermine public trust in the system; together, they render it functionally inoperative for a large proportion of the Nigerian population.

**First: systemic fraud and corruption.** Land registries in Nigeria are consistently ranked among the most corrupt public institutions in Sub-Saharan Africa (Transparency International, 2025). The manual, paper-based record-keeping that continues to dominate most state registries creates conditions that actively enable fraud — title duplication, the unauthorised alteration of ownership records, and the outright fabrication of Certificates of Occupancy. Salawu (2025) documented how corruption in Nigerian land administration operates through what the author calls "institutional corruption channels," including bribery of registry officials, political allocation of prime urban plots, exploitation of the Act's ambiguously defined provisions for revocation under Section 28, and the constitutional immunity that protects some of the most powerful actors from prosecution.

**Second: absence of transparency.** Land records in most Nigerian states are opaque by design. Ordinary citizens cannot independently verify the authenticity or ownership history of a title. This information asymmetry creates the conditions for the widespread practice of "multiple sales" — the fraudulent sale of the same parcel to several buyers simultaneously. The Nigerian Institute of Quantity Surveyors has estimated that land disputes account for over 60% of civil litigation in Nigerian courts, a figure that reflects not only economic harm to individuals but a profound structural burden on the justice system.

**Third: prohibitive costs and delays.** The process of regularising a land transaction under the Land Use Act involves multiple government agencies — the Ministry of Lands, the Surveyor-General's office, the Governor's office, and frequently the judiciary — with each step introducing its own costs and waiting periods. Derri and Egemonu (2022) concluded that the Land Use Act has had "severe consequences" on Nigeria's land tenure system, fundamentally distorting customary landholding practices and pricing formal registration beyond the reach of most citizens. Processing times exceeding twelve months for a C of O are common; in many states, unofficial payments are required at each stage to keep a file moving.

**Fourth: vulnerability to physical destruction.** Paper-based record systems are inherently fragile. Several Nigerian states have experienced the catastrophic loss of land records due to building fires, flooding, and — in some cases — deliberate destruction intended to erase inconvenient ownership histories. With no mandated backup or digital recovery mechanism across most state registries, such losses are permanent.

Beyond these operational failures lies a deeper structural problem. While blockchain technology presents properties — immutability, distributed consensus, transparent auditability — that align directly with what the Nigerian land registry needs, the existing blockchain land registry implementations have been designed for contexts that differ fundamentally from Nigeria's. Georgia and Sweden operated in environments with advanced digital infrastructure, literate populations, and pre-existing digital land databases. Honduras and Ghana's Bitland initiative failed or stalled for exactly the reasons that apply to Nigeria: insufficient institutional preparation, inadequate baseline data, and the absence of a legal framework that recognises blockchain records as evidence of ownership. Nigeria's Evidence Act 2011, Section 84, accepts computer-generated evidence, but no blockchain-specific recognition exists in Nigerian law. The system currently operates in a legal vacuum that a prototype alone cannot resolve.

This project does not claim that blockchain technology solves Nigeria's land crisis. Instead, it occupies a clearly defined position: blockchain, when correctly designed, provides a verification and audit layer that makes it significantly more difficult to perpetuate the specific frauds that dominate the current system. The prototype, SecureLand Registry, is designed to demonstrate that this layer is practically buildable, technically viable in a resource-constrained environment, and architecturally aligned with the legal structure of the Land Use Act.


## 1.3 Purpose of the Study

The purpose of this study is to design, implement, and evaluate a blockchain-based land ownership verification system — designated SecureLand Registry (SLR) — that provides a secure, transparent, and tamper-evident mechanism for recording and verifying land titles. The system is specifically designed for the technological constraints and socio-legal realities of Nigeria, with architectural considerations that allow for applicability across Sub-Saharan Africa.

The study pursues this purpose while maintaining an honest critical position: it critically examines whether blockchain technology genuinely adds measurable value over a well-designed centralised database in this specific context, and it identifies precisely the conditions under which a blockchain-based approach is and is not justified. This critical framing is not a weakness of the project but a necessary condition for its academic credibility.


## 1.4 Aim and Objectives

### Aim

To design and implement a hybrid blockchain-based land ownership verification prototype that enhances transparency, security, and efficiency in land administration, specifically optimised for the resource-constrained and legally complex environment of Nigeria.

### Objectives

The following objectives serve as the measurable steps through which the above aim is to be achieved:

1. To conduct a comprehensive review of existing land administration systems in Nigeria and globally, identifying the specific limitations that blockchain technology can address and those it cannot, with particular attention to the failure cases documented in international literature.

2. To design a hybrid system architecture that combines on-chain smart contract logic written in Solidity and deployed on the Polygon Amoy testnet with off-chain data management using Flask and PostgreSQL, and decentralised document storage via IPFS, optimised for moderate hardware and low-bandwidth environments.

3. To implement modular smart contracts that enforce multi-stakeholder approval workflows — requiring the independent concurrence of the landowner, a licensed surveyor, and a government registrar — for land title registration and ownership transfer, in explicit alignment with the procedural requirements of Nigeria's Land Use Act.

4. To integrate a dispute flagging and resolution mechanism within the smart contract logic, designed to address the high incidence of competing land claims that characterises Nigerian land administration.

5. To develop a user-facing web interface with role-based access control that accommodates users with varying levels of digital literacy, providing functionally distinct dashboards for landowners, surveyors, registrars, and third-party verifiers.

6. To evaluate the prototype's performance — including transaction speed, data integrity verification, and estimated gas costs — and its usability, measured against the System Usability Scale, through controlled testing on a blockchain testnet environment.


## 1.5 Scope of the Project

### What the Project Will Deliver

This project delivers the following outputs:

- A functional prototype deployed on the Polygon Amoy testnet or a local Ganache blockchain environment
- Smart contracts governing land registration, multi-stakeholder ownership transfer, dispute flagging, and on-chain record verification
- A web-based frontend with role-based dashboards for landowners, registrars, surveyors, and verifiers
- Off-chain data management using PostgreSQL for sensitive user and session data, with document storage via IPFS through the Pinata pinning service
- Performance evaluation based on defined metrics: transaction confirmation speed, document hash integrity verification, gas cost per operation, and a System Usability Scale assessment
- An evidence-based critical assessment of the relative merits of blockchain versus a centralised database architecture for this specific use case

### What the Project Will Not Deliver

To maintain academic honesty and prevent scope creep, the following are explicitly outside the boundaries of this project:

- A production-ready system approved for actual government deployment
- Integration with live government identity APIs; NIN and BVN verification are simulated using mock data, as real-time access to the NIMC API is beyond the scope of a prototype
- GIS mapping with authentic cadastral survey data; the system uses demonstration coordinates and boundary representations
- Legal opinions on the enforceability of blockchain records under Nigerian law; the system is a proof-of-concept, not a legal instrument
- Migration of existing paper-based land records into the blockchain; such migration is acknowledged as a prerequisite for any real-world deployment but is outside the scope of this work

### Known Technical Limitations

The following technical limitations are stated upfront to bound the claims this project makes:

1. **Testnet performance is not equivalent to production performance.** Transaction confirmation speeds and gas cost estimates measured on the Polygon Amoy testnet may differ from conditions on the main network under real-world load.
2. **Identity verification is simulated.** The prototype uses mock API responses to represent NIN and BVN verification; no real-world identity data is accessed or stored.
3. **IPFS permanence is conditional.** Without Filecoin backing or a dedicated Pinata pinning arrangement, IPFS-stored documents may become unavailable if all pinning nodes go offline.
4. **Single-chain dependency.** Should the Polygon network experience downtime, blockchain writes will be queued; the application layer remains available during such periods.
5. **Smart contract immutability.** Errors identified after deployment cannot be corrected without implementing a UUPS proxy upgrade pattern or executing a full contract migration, both of which are planned architectural features rather than tested components of this prototype.

### Known Real-World Adoption Risks

If the system were to progress beyond prototype stage, the following adoption risks apply and must be acknowledged:

1. **Government resistance.** Officials who benefit financially from the opacity of the current registry system will resist transparency measures. This cannot be solved by technical design alone.
2. **Absence of a baseline digital database.** Nigeria currently has no comprehensive digital land database from which to migrate. Paper-to-digital conversion is a prerequisite for any real deployment, not a parallel activity.
3. **Implementation cost.** State-level real-world deployment is estimated to cost between $5 million and $15 million; no clear public funding model currently exists for such a programme.
4. **The digital divide.** Over 70% of land ownership disputes involve rural landowners who may lack smartphones, reliable internet connectivity, or the digital literacy to use a web-based application independently.
5. **Legal vacuum.** No existing Nigerian legislation recognises blockchain records as legal proof of land ownership. The system occupies the role of a verification and audit layer, not a legal replacement for the Certificate of Occupancy.


## 1.6 Significance of the Study

This project makes substantive contributions across four dimensions:

**Academic contribution.** The study addresses a clearly identified research gap: the absence of blockchain land registry prototypes specifically designed for the resource constraints, dual tenure system, and legal complexity of developing African nations. Unlike purely theoretical studies, this project delivers a functional, testable system that can be empirically evaluated. It contributes to the growing body of literature on GovTech implementation in low-resource environments.

**Practical contribution.** The prototype provides a proof-of-concept that could meaningfully inform future government-led or internationally funded initiatives. Lagos State's 2024 blockchain land registry initiative demonstrates that Nigerian policymakers are actively seeking technology-driven solutions at the sub-national level (NQLB, 2024). This project offers a technically grounded, openly documented reference implementation aligned with that intent.

**Methodological contribution.** The multi-stakeholder smart contract design — requiring the independent approval of the landowner, a licensed surveyor, and a government registrar before any transfer is executed — proposes a governance model that reconciles blockchain's tendency toward decentralisation with the legal reality of government authority over land in Nigeria. This governance model has broader applicability wherever state-mediated land administration intersects with decentralised technology.

**Social contribution.** Fraudulent land practices disproportionately harm marginalised communities: rural smallholders, widows whose husbands' land reverts under customary pressure, urban informal settlers, and first-generation homeowners without legal representation. By enhancing transparency and creating a tamper-evident audit trail, the system aims to reduce the leverage that corrupt actors currently hold over these groups.

### Real-World Implementation Pathway

The prototype is designed with a phased real-world deployment model in mind. Were the system to move beyond the academic context, the following three-phase pathway represents a viable approach:

| Phase | Duration | Key Activities |
|---|---|---|
| Phase 1: Digitisation | 6 months | Partner with one Local Government Area. Digitise all existing paper records. Build a GIS spatial database. Train registry staff on digital workflows. |
| Phase 2: Hybrid Operation | 6 months | Run the blockchain system in parallel with the existing paper-based system (dual registration). Validate blockchain records against the paper baseline for accuracy. |
| Phase 3: Blockchain Primary | 6 months | The blockchain record becomes the authoritative source of truth. The legacy system is retained as a backup. A public audit trail dashboard goes live for citizen access. |

For national scale, the proposed roadmap extends over a five-year horizon: legal framework amendment between 2026 and 2027, Lagos State and FCT Abuja pilots across 2027 and 2028, Southwest and Southeast regional expansion in 2028 and 2029, and full national integration targeted for 2029 to 2030. This roadmap mirrors the trajectory that Georgia followed — institutional reform first, then digitisation, then blockchain as the final integrity layer — rather than the technology-first approach that failed in Honduras.


## 1.7 Overview of Project Structure

This project report is organised into five chapters following the AUST format:

- **Chapter One (Introduction):** Establishes the background context for the study, the problem statement, the purpose of the research, the aim and objectives, the scope and limitations of the prototype, and the significance of the work.

- **Chapter Two (Literature Review):** Provides a structured review of existing literature across five thematic areas: land administration systems and their failures; blockchain technology and its core properties; blockchain applications in land registration drawing on global case studies; the legal and regulatory framework governing land in Nigeria; and the theoretical and conceptual frameworks that guide the system design. The chapter concludes by identifying the specific research gap that this project addresses.

- **Chapter Three (Analysis and Design):** Presents the complete system design, including functional and non-functional requirements, use case analysis with stakeholder descriptions and use case walkthroughs, the system architecture, smart contract specifications, data management strategy, and the security and privacy design framework.

- **Chapter Four (Implementation):** Details the development environment and tools, the step-by-step implementation of each system module, the testing methodology, and the evaluation results including performance metrics and usability assessment.

- **Chapter Five (Conclusion and Recommendations):** Summarises the findings of the project, evaluates the achievement of each stated objective, discusses the limitations encountered, and proposes directions for future development and research.



---

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



---

# CHAPTER THREE: ANALYSIS AND DESIGN

## 3.0 Introduction

This chapter translates the requirements identified in the literature review into a concrete, implementable system design. It presents the functional and non-functional requirements of the SecureLand Registry (SLR) system, analyses the stakeholders and their interactions through use case descriptions, defines the system architecture across five technology layers, specifies the detailed structure of the smart contracts, articulates the data management strategy, and establishes the security and privacy framework. The chapter also identifies the distinction between core prototype features and advanced post-MVP capabilities, and provides the implementation roadmap that governs the project's execution timeline. Together, these elements constitute a complete design specification from which a developer — or a future researcher continuing this work — can build, evaluate, and extend the system without ambiguity.

The design throughout this chapter is governed by three principles derived from the Chapter Two analysis. First, every design decision must be legally grounded in the Land Use Act of 1978, not working around it. Second, the system must be technically functional on moderate hardware, consistent with the resource constraints of the Nigerian prototype context. Third, blockchain provides one layer in the system — the immutable trust layer — and every other component uses the most appropriate technology for its function.


## 3.1 System Requirements

### 3.1.1 Functional Requirements

The following table defines the functional requirements of the SLR system. Each requirement is assigned a unique identifier, a priority level (High, Medium, or Low), and a description sufficient for implementation.

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

### 3.2.1 Actors

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


## 3.3 System Architecture

### 3.3.1 Architecture Overview

The SLR system adopts a five-layer hybrid architecture that separates concerns clearly: each layer's technology choices are driven by what that layer must do well, rather than by a single technology imposed across the whole system. A three-tier conceptual view — Presentation, Application, and Blockchain — is expanded into five operational layers to accommodate the service-level decomposition and the external integration requirements.

The three conceptual tiers remain useful for high-level description:
- **Presentation Tier** — the web interface serving role-based dashboards and the map view
- **Application Tier** — the Flask REST API, PostgreSQL, IPFS integration, and service modules
- **Blockchain Tier** — the Solidity smart contracts deployed on Polygon Amoy, responsible for all immutable state changes

### 3.3.2 Blockchain Platform Selection Justification

The choice of blockchain platform is one of the most consequential and frequently under-justified decisions in blockchain land registry literature. The following comparative analysis justifies the selection of Polygon over both Ethereum mainnet and Hyperledger Fabric:

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

| Role Constant | Holder | Permitted Actions |
|---|---|---|
| `REGISTRAR_ROLE` | Government registry officials | `registerLand()`, `approveTransferAsRegistrar()`, `resolveDispute()` |
| `SURVEYOR_ROLE` | Licensed surveyors | `approveTransferAsSurveyor()` |
| `GOVERNOR_ROLE` | Governor's office representative | `revokeTitle()`, override and emergency freeze functions |
| `DISPUTE_RESOLVER_ROLE` | Designated dispute resolution officer (may overlap with Registrar) | `resolveDispute()` with outcome and notes |
| `DEFAULT_ADMIN_ROLE` | System administrator | Role grants and revocations, `pause()` and `unpause()` functions |

### 3.4.3 Data Structures

The three primary data structures within the contract are as follows:

```
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


## 3.6 Security and Privacy Design

### 3.6.1 Authentication and Authorisation

**Authentication** is implemented using JSON Web Tokens (JWT) with a 24-hour expiry and a sliding refresh token mechanism. Passwords are stored as bcrypt hashes with a work factor of 12; no plaintext or reversibly encrypted credentials are retained at any layer. All API communication occurs over HTTPS; HTTP connections are redirected.

**Authorisation** is enforced at two independent layers: at the Flask API middleware layer, where the caller's JWT is validated and their database role is checked before the request reaches any service module; and at the smart contract layer, where OpenZeppelin's `AccessControl` modifiers reject any transaction from an address that does not hold the required role. This dual enforcement means that even if the API layer were bypassed — for example, through a direct transaction submitted to the contract from an Ethereum wallet — the smart contract's role checks would still prevent unauthorised operations.

### 3.6.2 Threat Model

The following threat model is produced using the STRIDE methodology, applied specifically to the blockchain land registry deployment context in Nigeria:

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

### 3.6.4 Data Privacy Design

The privacy design of the SLR system is governed by four principles drawn from the NDPA 2023: data minimisation (collecting no more data than necessary), purpose limitation (using data only for the registered purpose), security (encrypting and access-controlling all personal data), and accountability (logging all access for audit review).

On the blockchain, these principles are operationalised through the exclusive use of pseudonymous wallet addresses and cryptographic hashes, with no name, address, or national identity number ever written to an on-chain state variable. In PostgreSQL, personal data is encrypted at the column level for the most sensitive fields and at the disk level for the entire database. Access to the PostgreSQL instance is restricted to the application layer; no direct database connections are permitted from the presentation layer. Audit logs of all data access operations are retained for a minimum of two years, consistent with standard regulatory practice.


## 3.7 FYP Implementation Roadmap

The prototype is developed over a four-month timeline structured as follows:

| Month | Primary Deliverable | Key Activities |
|---|---|---|
| **Month 1** | Research and Architecture Finalisation | Complete literature review. Finalise AUST Chapters 1 and 2. Define all smart contract function signatures. Define all Flask API endpoint schemas with request/response structures. Set up the Hardhat development project. Configure the Polygon Amoy wallet and obtain testnet MATIC for gas. |
| **Month 2** | Smart Contract and Backend Development | Write `LandRegistry.sol` with full role model, multi-signature transfer workflow, and dispute management. Deploy to local Ganache for initial testing. Deploy to Polygon Amoy testnet after passing local tests. Build Flask REST API with PostgreSQL models. Integrate Pinata IPFS API for document upload and retrieval. |
| **Month 3** | Frontend Development and System Integration | Build React frontend with Leaflet.js interactive map. Integrate MetaMask or WalletConnect for wallet signing. Connect all API endpoints to the frontend components. Implement role-based dashboard routing and access gating. Add console-based notification logging for all system events. |
| **Month 4** | Testing, Evaluation, and Documentation | Execute Hardhat unit tests and record coverage report. Run Slither and Mythril security analysis. Conduct integration tests with Pytest. Conduct SUS usability survey with a minimum of 10 participants. Measure and record gas cost per operation on Polygon Amoy. Write Chapters 3, 4, and 5. |

**Prototype Technology Stack Summary:**

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



---

# REFERENCES

African Cities Research Consortium. (2024). Land and connectivity: Domain report. *ACRC Working Paper 12*.

Aker, J., & Mbiti, I. (2010). Mobile phones and economic development in Africa. *Journal of Economic Perspectives*, *24*(3), 207–232. https://doi.org/10.1257/jep.24.3.207

Androulaki, E., Barger, A., Bortnikov, V., Cachin, C., Christidis, K., De Caro, A., Enyeart, D., Ferris, C., Laventman, G., Manevich, Y., Muralidharan, S., Murthy, C., Nguyen, B., Sethi, M., Singh, G., Smith, K., Sorniotti, A., Stathakopoulou, C., Vukolić, M., … Yellick, J. (2018). Hyperledger Fabric: A distributed operating system for permissioned blockchains. *Proceedings of the Thirteenth EuroSys Conference (EuroSys '18)*, Article 30, 1–15. https://doi.org/10.1145/3190508.3190538

Ansah, B. O., Voss, W., Asiama, K. O., & Wuni, I. Y. (2023). A systematic review of the institutional success factors for blockchain-based land administration. *Land Use Policy*, *125*, Article 106473. https://doi.org/10.1016/j.landusepol.2022.106473

Atzei, N., Bartoletti, M., & Cimoli, T. (2017). A survey of attacks on Ethereum smart contracts (SoK). In *Principles of Security and Trust* (POST 2017), *LNCS 10204*, 164–186. Springer. https://doi.org/10.1007/978-3-662-54455-6_8

Babalola, K. H., & Hull, S. A. (2019). Examining the Land Use Act of 1978 and its effects on tenure security in Nigeria: A case study of Ekiti State. *Potchefstroom Electronic Law Journal*, *22*, 1–34. https://doi.org/10.17159/1727-3781/2019/v22i0a5803

Benet, J. (2014). IPFS — Content addressed, versioned, P2P file system. *arXiv preprint arXiv:1407.3561*. https://arxiv.org/abs/1407.3561

Buterin, V. (2014). *Ethereum: A next-generation smart contract and decentralized application platform*. Ethereum White Paper. https://ethereum.org/en/whitepaper/

De Filippi, P., & Wright, A. (2018). *Blockchain and the law: The rule of code*. Harvard University Press.

Derri, D. K., & Egemonu, J. N. (2022). Impact of the Land Use Act on land tenural system in Nigeria. *American Journal of Law*, *4*(1), 1–15. https://doi.org/10.47672/ajl.1226

Federal Ministry of Housing and Urban Development, Nigeria. (2024). *National Land Registration, Documentation, and Titling Programme (NLRDTP)*. Retrieved from https://fmhud.gov.ng/read/3506

Ibrahim, I., Bello, A. G., & Usman, A. A. (2021). Improvement of land administration system in Nigeria: A blockchain technology review. *International Journal of Scientific & Technology Research*, *10*(8), 1–10.

ITU & NITDA. (2024). *Assessment of skills supply and demand in Nigeria's digital economy*. International Telecommunication Union. https://www.itu.int

Junaid, L., Bilal, K., & Erbad, A. M. (2023). Blockchain-enabled land management systems. *Telecommunication Systems*, *84*, 339–365. https://doi.org/10.1007/s11235-023-01032-2

Land Use Act. (1978). Chapter L5, Laws of the Federation of Nigeria 2004. Federal Republic of Nigeria.

Lantmäteriet & ChromaWay. (2017). *The land registry in the blockchain: Testbed* [Technical Report]. Swedish Land Registry Authority.

Lemieux, V. L. (2017). Evaluating the use of blockchain in land transactions: An archival science perspective. *European Property Law Journal*, *6*(3), 392–440. https://doi.org/10.1515/eplj-2017-0019

Mabogunje, A. (2010). Land reform in Nigeria: Progress, problems and prospects. *Annual World Bank Conference on Land Policy and Administration*. World Bank Group.

Nakamoto, S. (2008). *Bitcoin: A peer-to-peer electronic cash system*. https://bitcoin.org/bitcoin.pdf

Nigeria Data Protection Act (NDPA). (2023). Federal Republic of Nigeria.

Nigerian Communications Commission (NCC). (2024). *Industry statistics: Internet subscribers data*. https://www.ncc.gov.ng

NQLB. (2024). Lagos State Government's blockchain land registry initiative. *NQLB Reports*. Retrieved from https://nqlb.co

Okoli, F. U. (2024). Blockchain technology for land registration in Nigeria. *FUDMA Journal of Sciences*, *8*(1).

Ølnes, S., Ubacht, J., & Janssen, M. (2017). Blockchain in government: Benefits and implications of distributed ledger technology for information sharing. *Government Information Quarterly*, *34*(3), 355–364. https://doi.org/10.1016/j.giq.2017.09.001

OpenZeppelin. (2023). *OpenZeppelin Contracts v5.x documentation*. https://docs.openzeppelin.com/contracts/

Paavo, J. P. (2025). Practicality of blockchain technology for land registration. *Land*, *14*(8), Article 1626.

Salawu, B. M. (2025). Corruption in land administration in Nigeria: Legal issues and challenges. *IIUM Law Journal*, *33*(1), 203–232. https://doi.org/10.31436/iiumlj.v33i1.1016

Shang, Q., & Price, A. (2019). A blockchain-based land titling project in the Republic of Georgia: Rebuilding public trust and lessons for future pilots. *Innovations: Technology, Governance, Globalization*, *12*(3–4), 72–78. https://doi.org/10.1162/inov_a_00276

Transparency International. (2025). *Corruption Perceptions Index 2025*. Transparency International. https://www.transparency.org/cpi

Tunde, Y. A., & Adefila, S. (2025). Blockchain applications in land title registration: A future outlook for southwestern Nigeria's property sector. *International Journal of Innovation Research and Advanced Studies*, *7*(2).

World Bank. (2025). *Nigeria Development Update: Unlocking land potential*. World Bank Group. https://www.worldbank.org/en/country/nigeria/publication/nigeria-development-update-ndu

Yaga, D., Mell, P., Roby, N., & Scarfone, K. (2019). Blockchain technology overview. *NISTIR 8202*, National Institute of Standards and Technology. https://doi.org/10.6028/NIST.IR.8202

Zevenbergen, J., De Vries, W., & Bennett, R. (Eds.). (2013). *Advances in responsible land administration*. CRC Press.



---

