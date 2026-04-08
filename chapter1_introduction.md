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
