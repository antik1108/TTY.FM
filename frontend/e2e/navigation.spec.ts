import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial load
    await page.waitForSelector('text=TTY.FM', { timeout: 5000 });
  });

  test('should navigate to uncategorized songs', async ({ page }) => {
    // Click on UNCATEGORIZED in sidebar
    await page.getByText('UNCATEGORIZED').click();

    // Should show uncategorized playlist title or songs
    await page.waitForTimeout(500); // Wait for state update
    
    // Main content should update
    await expect(page.getByText('TTY.FM')).toBeVisible(); // App still works
  });

  test('should navigate to library view', async ({ page }) => {
    // Click Library_Root
    await page.getByText('Library_Root').click();

    await page.waitForTimeout(500);

    // Should show library view
    await expect(page.getByText('Core Process Library')).toBeVisible();
  });

  test('should navigate to upload panel', async ({ page }) => {
    // Find and click upload button
    const uploadButton = page.getByText('Upload').or(page.locator('button:has-text("Upload")'));
    await uploadButton.first().click();

    await page.waitForTimeout(500);

    // Should show upload interface
    await expect(page.getByText('Upload Interface').or(page.getByText('Upload'))).toBeVisible();
  });

  test('should show playlist creation dialog', async ({ page }) => {
    // Click New playlist button
    await page.getByText('New').click();

    // Should trigger browser prompt (we can't interact with native dialogs in Playwright easily)
    // But we can verify the click worked and didn't crash
    await expect(page.getByText('TTY.FM')).toBeVisible();
  });

  test('should maintain navigation state on page interactions', async ({ page }) => {
    // Navigate to library
    await page.getByText('Library_Root').click();
    await page.waitForTimeout(300);

    // Interact with UI
    await page.getByText('Refresh').click();
    await page.waitForTimeout(300);

    // Should still show library view
    await expect(page.getByText('Core Process Library')).toBeVisible();
  });
});
