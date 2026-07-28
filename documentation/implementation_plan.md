# Deep System Audit & Architectural Recovery Plan

Per your request, I have executed a deep audit of our monorepo against the rigorous requirements defined in your foundational prompts (Prompts 1 & 2) and the AUST `chapter3_analysis_design.md` specifications. 

Our core architecture is strong, but to achieve the "production-grade MVP" status you demand, several critical systems need to be strictly aligned, added, or removed.

---

## 1. Smart Contract Layer `(Polygon Amoy)`
### ✅ What is compliant:
- OpenZeppelin `AccessControlDefaultAdminRules`, `ReentrancyGuard`, `Pausable` implemented natively.
- `LandParcel` struct precisely matches your specs (ID, GPS string, area, IPFS hash, Owner, Status).
- Multi-step state machine (Initiate -> Surveyor -> Verifier -> Registrar) is structurally sound.
- Dispute system with Governor override is active.

### ❌ What is missing / Non-compliant:
1. **Coverage Shortfall:** We are currently at ~88.5% coverage. The prompt enforces "near 100% E2E test coverage". We need to add tests for pausing emergency mechanisms and metadata updates.
2. **Gas Overhead:** Returning large structs directly can be expensive. We should implement a dedicated `getParcelDetails` view function.

---

## 2. Backend Orchestrator `(Flask + PostgreSQL)`
### ✅ What is compliant:
- Models formulated (`User`, `LandParcelIndex`, `TransferHistory`).
- JWT auth route and Pinata IPFS integrations scaffolded.
- Web3.py listener (`sync.py`) configured for all V2 events.

### ❌ What is missing / Non-compliant:
1. **NIN Verification Adapter:** The prompt strictly specifies "Mock external APIs (e.g., NIN verification) using swappable adapters". Currently, `is_verified` is just hardcoded to `True`. I need to inject a mock Identity Provider class.
2. **Local Boot Blockers:** As discovered earlier, Python 3.14 lacks binary wheels for `psycopg2-binary`. I propose swapping this for `psycopg[binary]` or `pg8000` (which is pure Python) to ensure it runs out-of-the-box locally without MSVC Build Tools.
3. **Endpoint Validation:** We lack REST testing (`pytest coverage for APIs`).

---

## 3. Frontend Application `(Vite + React)`
### ✅ What is compliant:
- Clean Vite reconstruction successfully built. 
- `RainbowKit` & `Wagmi` integration.
- Custom GovTech UI established with Tailwind.

### ❌ What is missing / Non-compliant:
1. **Leaflet.js GIS Mapping:** The prompt requires "Leaflet.js for GIS land visualization". The Surveyor dashboard currently has a CSS mockup instead of an actual Leaflet interactive canvas. 
2. **Dynamic Integrations:** We need to utilize the **21st.dev MCP UI Component Builder** skill to dynamically inject missing, premium Web3 UI elements to fulfill the "industry-level" UI requirement.

---

## Proposed Recovery Actions (The Fixes)

I request permission to execute the following sequentially:

#### Phase A: Smart Contract Optimization
- [ ] Add the missing `pytest` equivalents for Hardhat to achieve 100% coverage.
- [ ] Optimize the `LandParcel` state reads.

#### Phase B: Backend Refactoring & NIN Mocking
- [ ] Swap `psycopg2-binary` to `pg8000` in `requirements.txt` to instantly fix the broken local backend setup on Windows.
- [ ] Implement a strict `/api/auth/verify-nin` endpoint utilizing a swappable interface pattern.
- [ ] Implement Pytest coverage setup for Flask.

#### Phase C: Frontend & MCP 21st.dev UI Implementations
- [ ] Use `21st.dev` MCP schema to generate a sleek, production-grade map bounding box wrapper for `react-leaflet`.
- [ ] Rip out the fake GIS UI in `SurveyorDashboard.jsx` and replace it with a genuine Leaflet map targeting Nigerian coordinates.

---

## User Review Required

> [!CAUTION]
> **Action Required:** Do I have your permission to alter `backend/requirements.txt` to remove `psycopg2-binary` in favor of a pure-Python adapter so your local backend runs flawlessly today?
> 
> Also, do you approve of me utilizing the **21st_magic MCP tool** to automatically construct the missing interactive GIS components for the frontend? 

Once approved, I will begin executing Phase A immediately!
