import { test, expect } from '@playwright/test';

test.describe('TTY.FM App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Check for main branding
    await expect(page.getByText('TTY.FM')).toBeVisible();
    
    // Check for header stats
    await expect(page.getByText('Latency')).toBeVisible();
    await expect(page.getByText('Buffer_State')).toBeVisible();
    
    // Check for main sections
    await expect(page.getByText('Core Process Library')).toBeVisible();
  });

  test('should display system stats in header', async ({ page }) => {
    await page.goto('/');

    // Wait for stats to load
    await page.waitForSelector('text=OPTIMIZED', { timeout: 5000 });
    
    // Check node load is displayed
    const nodeLoadText = await page.getByText(/%$/).first();
    await expect(nodeLoadText).toBeVisible();
  });

  test('should show sidebar navigation', async ({ page }) => {
    await page.goto('/');

    // Check sidebar elements
    await expect(page.getByText('FileSystem Tree')).toBeVisible();
    await expect(page.getByText('Library_Root')).toBeVisible();
    await expect(page.getByText('UNCATEGORIZED')).toBeVisible();
    await expect(page.getByText('Playlists')).toBeVisible();
  });

  test('should have working refresh button', async ({ page }) => {
    await page.goto('/');

    // Find and click refresh button
    const refreshButton = page.getByText('Refresh');
    await refreshButton.click();
    
    // Should not crash (basic smoke test)
    await expect(page.getByText('TTY.FM')).toBeVisible();
  });

  test('should toggle mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu button should be visible
    const menuButton = page.locator('button:has(span:text("menu"))').first();
    await expect(menuButton).toBeVisible();

    // Click to open sidebar
    await menuButton.click();
    
    // Sidebar should be visible now
    await expect(page.getByText('FileSystem Tree')).toBeVisible();
  });
});
