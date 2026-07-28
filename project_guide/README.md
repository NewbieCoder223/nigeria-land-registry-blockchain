# Sovereign Ledger - Project Guide & Tutorials

Welcome to the **Sovereign Ledger** Land Registry system. This guide provides an overview of the system architecture, documentation on API keys and configuration, and tutorials for running, deploying, and testing each component.

---

## 1. Project Overview & Architecture

Sovereign Ledger is a decentralized land registry system customized for the Nigerian context. It ensures land ownership transparency, eliminates double-selling, and secures land titles using blockchain technology and secure decentralized storage.

### Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Ethers.js
- **Backend Service**: Python + FastAPI + Supabase (PostgreSQL Database + Auth)
- **Blockchain**: Solidity + Hardhat + Polygon Amoy Testnet (with local Hardhat Node support for development)
- **Decentralized Storage**: Pinata (IPFS) for storing land deeds, metadata, and certificates

---

## 2. API Keys & Configuration Guide

The root directory contains a `.env` file (which is git-ignored to prevent credential leaks). Below is an explanation of the configuration values needed:

### Supabase Settings
- `SUPABASE_URL`: The URL of your Supabase project instance (e.g., `https://<project-ref>.supabase.co`).
- `SUPABASE_KEY`: The client/anonymous public API key used for basic client-side authentication and queries.
- `SUPABASE_SERVICE_ROLE_KEY`: The secret service role key used by the backend to bypass Row-Level Security (RLS) for administrative tasks. **Keep this secret!**

### Authentication & Mock Services
- `SECRET_KEY`: Used by the backend to generate JWT tokens or secure session cookies.
- `NIN_PROVIDER`: Set to `mock` for local development to simulate verifying Nigerian National Identification Numbers (NIN).

### Blockchain Config
- `POLYGON_AMOY_RPC_URL`: An Alchemy or Infura RPC endpoint url for the Polygon Amoy testnet.
- `LAND_REGISTRY_ADDRESS`: The deployed contract address of `LandRegistry.sol`.
- `PRIVATE_KEY`: The hexadecimal private key of the deployer/admin wallet address. **Never share this or commit it to GitHub!**

### IPFS Storage (Pinata)
- `PINATA_API_KEY`, `PINATA_API_SECRET`, and `PINATA_JWT`: Used by the backend to upload land title documents and metadata JSON to IPFS. You can obtain these from [Pinata's dashboard](https://pinata.cloud/).

---

## 3. Tutorials & Setup Guide

### System Dependencies
Ensure you have the following installed:
1. **Node.js** (v18+ recommended)
2. **Python** (3.10+ recommended) and `pip`
3. **Hardhat** (installed as a project dependency in `contracts/`)

---

### Step 1: Smart Contracts Setup & Local Node
1. Navigate to the `contracts/` directory:
   ```bash
   cd contracts
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run a local Hardhat blockchain network:
   ```bash
   npx hardhat node
   ```
   *Keep this terminal open.*
4. Compile and deploy the contract to the local network:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   Note down the deployed contract address and update the `LAND_REGISTRY_ADDRESS` in the root `.env` file.

---

### Step 2: Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend API documentation will be available at `http://localhost:8000/docs`.

---

### Step 3: Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Run the frontend development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser. Install the MetaMask browser extension and connect it to your local Hardhat network or Polygon Amoy testnet.

---

## 4. Key Workflows & Tutorials

### A. Registering a New Land Parcel
1. Admin logins to the Dashboard.
2. Navigates to **Register Land**.
3. Inputs owner details (including NIN), parcel coordinates (latitude/longitude), and uploads the title deed (which gets pinned to IPFS).
4. Submits the transaction. MetaMask will prompt you to sign and execute the smart contract call.
5. The block confirmation records the title on the blockchain, and metadata is indexed in Supabase.

### B. Initiating a Land Transfer
1. Current owner logs in and selects the owned property.
2. Clicks **Transfer Title** and enters the recipient's wallet address and purchase details.
3. The system locks the transfer request pending registry validation (and optionally payment confirmation).
4. Once verified, the admin approves the transfer, executing the blockchain transfer function.
