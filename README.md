# 🇳🇬 Sovereign Ledger: National Land Registry on-chain

**Sovereign Ledger** is a next-generation, decentralized land registry system designed for the Federal Republic of Nigeria. It integrates blockchain technology, high-precision GIS mapping, and National Identity (NIN) verification to eliminate land fraud, automate title transfers, and provide total transparency for the Nigerian housing market.

---

## 🏛️ System Architecture

The system operates on a 4-layer security model:
1.  **Identity Layer**: Cross-references National Identity (NIN) via biometric zero-knowledge circuits.
2.  **Geospatial Layer**: Real-time RTK-GNSS satellite boundary verification for all parcels.
3.  **Governance Layer**: Multi-signature approval workflow involving Surveyors, Legal Verifiers, and Registrars.
4.  **Consensus Layer**: Permanent, immutable title storage on the **Polygon Amoy Testnet**.

---

## 🚀 Key Features

### 👑 Sovereign Dashboards
*   **Governor Command Center**: National oversight, emergency asset freezing, and litigation monitoring.
*   **Registrar Portal**: Official title deed minting and ledger maintenance.
*   **Legal Verifier Audit**: Automated statutory compliance checking.
*   **Surveyor GIS Mapping**: High-precision boundary delta monitoring.
*   **LandOwner Asset Registry**: Peer-to-peer title transfer and portfolio management.

### 🛡️ Hardened Security
*   **RBAC (Role-Based Access Control)**: Enforced via Supabase RLS and Smart Contract modifiers.
*   **No Dead Clicks**: 100% feedback coverage with global toast notifications for all background processes.
*   **Blockchain Integrity**: Title history and ownership changes are cryptographically verifiable on-chain.

---

## 🛠️ Technology Stack

*   **Frontend**: React 18, Vite, Framer Motion (Animations), Lucide (Icons), Tailwind CSS.
*   **Blockchain**: Solidity (Hardhat), Wagmi/Viem, Polygon Amoy.
*   **Backend**: Python (Flask), Supabase (PostgreSQL, Auth, Real-time).
*   **GIS**: Leaflet.js, OpenStreetMap, Spatial Analytics.

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- Python 3.10+
- MetaMask with Polygon Amoy Testnet funds

### 1. Initialize Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

### 2. Initialize Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Configuration
Ensure your `.env` file contains the following:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_LAND_REGISTRY_ADDRESS`

---

## 📜 Academic Attribution
This project is part of the **Final Year Research Project** at the **African University of Science & Technology (AUST)**.

---

## ⚖️ Legal Disclaimer
This is a research prototype. Title transfers on the testnet have no legal weight in traditional Nigerian courts until gazetted by the relevant State Ministry of Lands.
