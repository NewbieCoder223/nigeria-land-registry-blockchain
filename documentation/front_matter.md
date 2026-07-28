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
| Table 1.1 | Real-World Implementation Pathway | 13 |
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
| Table 3.12 | Prototype Technology Stack Summary | 78 |

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
