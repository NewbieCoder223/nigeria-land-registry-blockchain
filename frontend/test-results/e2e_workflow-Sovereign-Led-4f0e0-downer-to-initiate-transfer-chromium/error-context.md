# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e_workflow.spec.cjs >> Sovereign Ledger Workflow >> should allow landowner to initiate transfer
- Location: tests\e2e_workflow.spec.cjs:28:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Transfer Land')

```

# Page snapshot

```yaml
- generic [ref=e5]:
  - banner [ref=e6]:
    - link "🇳🇬 SOVEREIGN Ledger Federal Republic of Nigeria" [ref=e8] [cursor=pointer]:
      - /url: /
      - generic [ref=e10]: 🇳🇬
      - generic [ref=e11]:
        - heading "SOVEREIGN Ledger" [level=1] [ref=e12]
        - paragraph [ref=e13]: Federal Republic of Nigeria
    - button "Connect Wallet" [ref=e16] [cursor=pointer]
  - main [ref=e17]:
    - generic [ref=e18]:
      - generic [ref=e20]:
        - generic [ref=e22]: Digital Sovereignty Protocol 1.02
        - heading "Fortify Your Territory." [level=1] [ref=e26]:
          - text: Fortify Your
          - text: Territory.
        - paragraph [ref=e27]: Nigeria's definitive cryptographic registry. Anchor your titles on unyielding permanence. No disputes. No forgery.
        - generic [ref=e28]:
          - button "Establish Connection" [ref=e29] [cursor=pointer]:
            - text: Establish Connection
            - img [ref=e30]
          - button "Explore National Desk" [ref=e32] [cursor=pointer]:
            - text: Explore National Desk
            - img [ref=e33]
      - generic [ref=e37]:
        - generic [ref=e38]:
          - img [ref=e40]
          - heading "Immutable Ledger" [level=3] [ref=e43]
          - paragraph [ref=e44]: Zero title overlap. Every parcel encoded on the blockchain with cryptographic certainty.
        - generic [ref=e46]:
          - img [ref=e48]
          - heading "GIS Precision" [level=3] [ref=e51]
          - paragraph [ref=e52]: Sub-centimetre accuracy provided by global GNSS sensor clusters for absolute boundary trust.
        - generic [ref=e54]:
          - img [ref=e56]
          - heading "Verified Identity" [level=3] [ref=e65]
          - paragraph [ref=e66]: Biometric synchronization with NIMC/NIN databases ensures legitimate title ownership.
      - generic [ref=e69]:
        - generic [ref=e70]:
          - heading "Ecosystem Authorization Matrix" [level=2] [ref=e71]
          - paragraph [ref=e72]: Multi-Role Governance Configuration
        - generic [ref=e73]:
          - generic [ref=e74]:
            - generic [ref=e75]:
              - img [ref=e77]
              - generic [ref=e81]:
                - paragraph [ref=e82]: Public Node
                - heading "Landowner" [level=3] [ref=e83]
            - list [ref=e84]:
              - listitem [ref=e85]:
                - generic [ref=e87]: Manage Asset Portfolio
              - listitem [ref=e88]:
                - generic [ref=e90]: File Dispute Claims
              - listitem [ref=e91]:
                - generic [ref=e93]: Instant Title Transfer
            - button "Establish Access" [ref=e94] [cursor=pointer]
          - generic [ref=e95]:
            - img [ref=e97]
            - generic [ref=e100]:
              - img [ref=e102]
              - generic [ref=e104]:
                - paragraph [ref=e105]: Restricted Node
                - heading "Governor / Registrar" [level=3] [ref=e106]
            - list [ref=e107]:
              - listitem [ref=e108]:
                - generic [ref=e110]: National Crisis Oversight
              - listitem [ref=e111]:
                - generic [ref=e113]: Sovereign Title Freezing
              - listitem [ref=e114]:
                - generic [ref=e116]: Legal Implementation
            - button "Administrative Auth Required" [ref=e117] [cursor=pointer]
      - generic [ref=e119]:
        - generic [ref=e120]:
          - img [ref=e121]
          - generic [ref=e123]: "Proof of Security: Active Protocol"
        - generic [ref=e124]:
          - generic [ref=e125]:
            - img [ref=e126]
            - heading "ZKP Circuits" [level=3] [ref=e128]
            - paragraph [ref=e129]: Zero-Knowledge Identity Verification
          - generic [ref=e130]:
            - img [ref=e131]
            - heading "AES-256 Storage" [level=3] [ref=e135]
            - paragraph [ref=e136]: Military-Grade Deed Encryption
          - generic [ref=e137]:
            - img [ref=e138]
            - heading "Polygon Amoy" [level=3] [ref=e143]
            - paragraph [ref=e144]: Decentralized Trust Network
  - contentinfo [ref=e145]:
    - paragraph [ref=e146]: © 2026 African University of Science & Technology (AUST)
    - generic [ref=e147]:
      - link "Legal" [ref=e148] [cursor=pointer]:
        - /url: "#"
        - text: Legal
        - img [ref=e149]
      - link "Technical" [ref=e153] [cursor=pointer]:
        - /url: "#"
        - text: Technical
        - img [ref=e154]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Sovereign Ledger Workflow', () => {
  4  |     test.beforeEach(async ({ page }) => {
  5  |         // Navigate to the local dev server
  6  |         await page.goto('http://localhost:5173');
  7  |     });
  8  | 
  9  |     test('should show sidebar on desktop and hide on mobile', async ({ page }) => {
  10 |         // Desktop view
  11 |         await page.setViewportSize({ width: 1280, height: 720 });
  12 |         const sidebar = page.locator('aside');
  13 |         await expect(sidebar).toBeVisible();
  14 | 
  15 |         // Mobile view
  16 |         await page.setViewportSize({ width: 375, height: 667 });
  17 |         // After transition, it should be off-screen (-100%)
  18 |         // We'll check if it's hidden or has the transform
  19 |         await expect(sidebar).not.toBeInViewport();
  20 |     });
  21 | 
  22 |     test('should restrict access to superuser-only features', async ({ page }) => {
  23 |         // The DebugOverlay should NOT be visible if not connected as superuser
  24 |         const debugConsole = page.locator('text=Sovereign Debug Console');
  25 |         await expect(debugConsole).not.toBeVisible();
  26 |     });
  27 | 
  28 |     test('should allow landowner to initiate transfer', async ({ page, context }) => {
  29 |         // This would normally require a wallet mock (like wagmi-connector)
  30 |         // For simple E2E, we'll just check if the form elements exist
> 31 |         await page.click('text=Transfer Land');
     |                    ^ Error: page.click: Test timeout of 30000ms exceeded.
  32 |         const form = page.locator('form');
  33 |         await expect(form).toBeVisible();
  34 |         await expect(page.locator('text=Step 1: Initiation')).toBeVisible();
  35 |     });
  36 | });
  37 | 
```