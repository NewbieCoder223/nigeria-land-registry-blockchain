# System Audit and Security Scorecard

## Full System Trace Audit & Adversarial Validation
All layers of the Sovereign Ledger platform were audited and tested using a combination of static analysis, localized dynamic simulation, and adversarial workflow tracing.

## ✅ System Security Score
**Score:** `45 / 100` (Critical vulnerabilities present across UI, API, Blockchain, and Auth layers)

---

## 📉 Top 5 Critical Risks

### 1. 🚨 Smart Contract: Transfer State Machine Bypass (Critical)
- **Description:** The `approveTransfer` function in `LandRegistry.sol` does not verify if the physical parcel is currently under a `Disputed` or `Frozen` state before granting final approval.
- **Where:** Smart Contract (`LandRegistry.sol` -> `approveTransfer`)
- **Impact:** An attacker who has initiated a transfer before a legitimate dispute is filed can have the transfer fully complete *while* the dispute is supposed to freeze the asset, resulting in stolen property.
- **🛠 Fix:** Add a `parcelIsActive` requirement, or explicitly check status in `verifySurvey`, `validateLegal`, and `approveTransfer`.
  ```solidity
  require(parcels[parcelId].status == ParcelStatus.Active, "Parcel is locked or disputed");
  ```
- **🧪 Test Case:** Simulated via Hardhat in `Adversarial.test.js`: File dispute mid-transfer, observe Registrar completing the transfer successfully.

### 2. 🚨 Backend: Arbitrary Role Escalation (Critical)
- **Description:** The `register_user` route inside `backend/app.py` blindly trusts the `role` payload inside the user's registration JSON request, inserting it directly into the `profiles` table.
- **Where:** Backend API (`app.py` -> `@app.route('/api/auth/register')`)
- **Impact:** Any new user can sign up with `{"role": "GOVERNOR"}` or `{"role": "REGISTRAR"}` to bypass the backend RBAC checks (`@require_auth(roles=['...'])`).
- **🛠 Fix:** Strip the `role` field from incoming REST requests and force a default `LAND_OWNER` role, requiring manual/governor escalation or smart contract event sync for higher roles.
  ```python
  # Force default role instead of relying on frontend payload
  assign_role = "LAND_OWNER" 
  ```
- **🧪 Test Case:** Send a POST to `/api/auth/register` with `"role": "GOVERNOR"`. Verify subsequent actions can hit protected `REGISTRAR` endpoints.

### 3. 🚨 Data Layer: Missing RLS on Profiles Table (High)
- **Description:** The `public.profiles` table does not have Row Level Security (RLS) enabled in `supabase_schema.sql`, unlike `parcels` and `transfers`.
- **Where:** Supabase / Database Initialization (`supabase_schema.sql`)
- **Impact:** Any anon-key holder can query all PII (NIN Hashes, Emails) and directly run an `UPDATE` to change their role or `is_verified` status bypassing the backend entirely.
- **🛠 Fix:** Enable RLS on `profiles` and explicitly deny unauthenticated writes.
  ```sql
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Profiles read own" ON public.profiles FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "Profiles update own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  ```

### 4. 🚨 Blockchain: Dispute Hijacking & Lost Funds (High)
- **Description:** `fileDispute()` does not check if a parcel is *already* disputed. A second attacker can file a dispute on the same parcel, overwriting `disputeClaimants[parcelId]` and `disputeReason`.
- **Where:** Smart Contract (`LandRegistry.sol` -> `fileDispute`)
- **Impact:** The original claimant's funds are permanently locked/lost because `resolveDispute()` will refund the *last* claimant stored.
- **🛠 Fix:** Prevent filing a dispute if one already exists.
  ```solidity
  require(parcels[parcelId].status != ParcelStatus.Disputed, "Already disputed");
  ```

### 5. 🚨 Data Sync: Sequence & Race Conditions (Medium)
- **Description:** `sync.py` iterates over events *by type* per block rather than chronologically by `transactionIndex`/`logIndex`.
- **Where:** Backend DB Sync Orchestrator (`sync.py`)
- **Impact:** If `TransferCompleted` and `DisputeFiled` happen in the same block, `sync.py` applies them in hardcoded order. This leads to silent DB desyncs where Supabase records a state divergent from the Blockchain.
- **🛠 Fix:** Refactor `sync.py` to pull all logs in a block range, sort them by `(blockNumber, logIndex)`, and process them in true chronological sequence.

### 6. 🚨 Frontend: Unawaited Transaction Silent Failure (Medium)
- **Description:** In `LandRegistrationForm.jsx` (and `LandTransferForm.jsx`), `writeContract` calls are triggered but not awaited or checked with an `onError` boundary.
- **Where:** Frontend UI Component (`handleFinalSubmit` / `handleTransfer`)
- **Impact:** If a user cancels the wallet confirmation or their wallet disconnects mid-transaction, the UI freezes forever in `processStatus = 'minting'` / "Authorizing". Furthermore, IPFS deeds uploaded *prior* to wallet signing become permanently orphaned if the transaction is cancelled.
- **🛠 Fix:** Implement `onError` and `onSuccess` hooks provided by Wagmi/React Query, and move the IPFS upload step to *after* the wallet signature is successfully confirmed if possible, or build an orphaned-file sweep cron job.

### 7. 🚨 Frontend: Backend RLS Exposure (High-Medium)
- **Description:** The frontend relies on hardcoded data requests and has no protections against querying `public.profiles` or editing local browser states to bypass UI checks. Because Supabase RLS is missing for `profiles`, the frontend allows users to effectively act as admin by editing network requests.
- **Where:** Frontend -> Supabase bridge
- **Impact:** Complete override of the access interface.
- **🛠 Fix:** Apply strict read/write Supabase RLS policies and use Backend-for-Frontend (BFF) proxy requests where strict visibility is required.

---

## 🚀 Immediate Fix Priority Plan

1. **Hotfix Smart Contract (Must Redeploy)**
   - Fix `approveTransfer` to ensure `ParcelStatus.Active`.
   - Fix `fileDispute` overwrite vulnerability.
   - Link smart contract redeployment to backend config.

2. **Backend API Patch (No Downtime)**
   - Strip `"role"` from JSON payload in `app.py -> register_user` and default all to `LAND_OWNER`.

3. **Supabase Migration (No Downtime)**
   - Run `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;` to stop DB-level privilege escalation.

4. **Sync Sequencer Refactor (Low Impact)**
   - Update `sync.py` event fetching mechanism.
