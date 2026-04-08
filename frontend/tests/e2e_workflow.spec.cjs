const { test, expect } = require('@playwright/test');

test.describe('Sovereign Ledger Workflow', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the local dev server
        await page.goto('http://localhost:5173');
    });

    test('should show sidebar on desktop and hide on mobile', async ({ page }) => {
        // Desktop view
        await page.setViewportSize({ width: 1280, height: 720 });
        const sidebar = page.locator('aside');
        await expect(sidebar).toBeVisible();

        // Mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        // After transition, it should be off-screen (-100%)
        // We'll check if it's hidden or has the transform
        await expect(sidebar).not.toBeInViewport();
    });

    test('should restrict access to superuser-only features', async ({ page }) => {
        // The DebugOverlay should NOT be visible if not connected as superuser
        const debugConsole = page.locator('text=Sovereign Debug Console');
        await expect(debugConsole).not.toBeVisible();
    });

    test('should allow landowner to initiate transfer', async ({ page, context }) => {
        // This would normally require a wallet mock (like wagmi-connector)
        // For simple E2E, we'll just check if the form elements exist
        await page.click('text=Transfer Land');
        const form = page.locator('form');
        await expect(form).toBeVisible();
        await expect(page.locator('text=Step 1: Initiation')).toBeVisible();
    });
});
