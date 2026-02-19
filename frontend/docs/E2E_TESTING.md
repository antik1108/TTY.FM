# E2E Testing with Playwright

## What is E2E Testing?

End-to-End (E2E) testing validates the complete application flow in a **real browser**, simulating actual user interactions. Unlike unit or integration tests that run in Node.js (jsdom), E2E tests:

- Run in **real browsers** (Chrome, Firefox, Safari)
- Test the **entire application stack** (frontend + backend)
- Simulate **real user behavior** (clicks, typing, navigation)
- Verify **visual rendering** and user experience
- Test **across different devices** and screen sizes

## Why Playwright?

Playwright is a modern E2E testing framework with:

- ✅ Multi-browser support (Chromium, Firefox, WebKit)
- ✅ Fast and reliable test execution
- ✅ Auto-waiting for elements
- ✅ Network interception and mocking
- ✅ Screenshot and video recording
- ✅ Mobile device emulation
- ✅ Excellent TypeScript support
- ✅ Interactive test debugging with UI mode

## Project Structure

```
frontend/
├── e2e/
│   ├── app.spec.ts           # Basic app smoke tests
│   ├── navigation.spec.ts    # Navigation flow tests
│   └── player.spec.ts        # Player functionality tests
├── playwright.config.ts      # Playwright configuration
├── playwright-report/        # HTML test reports (gitignored)
└── test-results/            # Test artifacts (gitignored)
```

## Running E2E Tests

### Requirements

Before running E2E tests, ensure:

1. **Frontend dev server is running** (or enable auto-start in config)
2. **Backend server is running** (for full functionality)

### Commands

```bash
cd frontend

# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive debugging)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run with debugger
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/player.spec.ts

# Run specific test by name
npx playwright test -g "should load the homepage"

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Quick Start

```bash
# 1. Start backend (in one terminal)
cd ../backend
npm start

# 2. Run E2E tests (in another terminal)
cd frontend
npm run test:e2e
```

## Test Examples

### Basic Page Load Test

```typescript
import { test, expect } from '@playwright/test';

test('should load the homepage', async ({ page }) => {
  await page.goto('/');
  
  // Check for main branding
  await expect(page.getByText('TTY.FM')).toBeVisible();
  
  // Check for header
  await expect(page.getByText('Latency')).toBeVisible();
});
```

### Navigation Test

```typescript
test('should navigate to library', async ({ page }) => {
  await page.goto('/');
  
  // Click navigation item
  await page.getByText('Library_Root').click();
  
  // Verify navigation worked
  await expect(page.getByText('Core Process Library')).toBeVisible();
});
```

### User Interaction Test

```typescript
test('should toggle mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Click menu button
  const menuButton = page.locator('button:has(span:text("menu"))').first();
  await menuButton.click();
  
  // Verify sidebar opened
  await expect(page.getByText('FileSystem Tree')).toBeVisible();
});
```

### Form Interaction Test

```typescript
test('should create new playlist', async ({ page }) => {
  await page.goto('/');
  
  // Intercept dialog
  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('prompt');
    await dialog.accept('TestPlaylist');
  });
  
  // Click new playlist
  await page.getByText('New').click();
  
  // Verify playlist created (would need API mock or real backend)
});
```

### Mobile Responsive Test

```typescript
test('should work on mobile viewport', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Mobile-specific UI should be visible
  const menuButton = page.locator('button:has(span:text("menu"))');
  await expect(menuButton).toBeVisible();
});
```

## Playwright Configuration

### Current Config Highlights

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:3000',
  
  // Auto-start dev server
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  
  // Test on multiple browsers
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
  ],
});
```

## Locators (Finding Elements)

Playwright provides several ways to find elements:

### Recommended: Role-based (accessible)

```typescript
await page.getByRole('button', { name: /play/i });
await page.getByRole('textbox', { name: /search/i });
await page.getByRole('link', { name: /home/i });
```

### By Text

```typescript
await page.getByText('TTY.FM');
await page.getByText(/loading/i);
```

### By Label

```typescript
await page.getByLabel('Volume');
await page.getByLabel(/password/i);
```

### By Test ID (when other methods don't work)

```typescript
// Add data-testid="player" to element
await page.getByTestId('player');
```

### CSS Selectors (last resort)

```typescript
await page.locator('.neon-purple');
await page.locator('footer button');
```

## Assertions

### Visibility

```typescript
await expect(page.getByText('TTY.FM')).toBeVisible();
await expect(page.getByText('Hidden')).toBeHidden();
```

### Text Content

```typescript
await expect(page.getByRole('heading')).toHaveText('Welcome');
await expect(page.locator('.status')).toContainText('OPTIMIZED');
```

### Count

```typescript
await expect(page.getByRole('listitem')).toHaveCount(5);
```

### Attributes

```typescript
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByRole('button')).toBeDisabled();
await expect(page.locator('input')).toHaveValue('test');
await expect(page.locator('a')).toHaveAttribute('href', '/home');
```

### URL

```typescript
await expect(page).toHaveURL('/library');
await expect(page).toHaveTitle(/TTY.FM/);
```

## Advanced Features

### Take Screenshots

```typescript
test('visual test', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'homepage.png' });
});
```

### Network Interception

```typescript
test('mock API response', async ({ page }) => {
  // Intercept API call
  await page.route('/api/library', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ songs: mockSongs }),
    });
  });
  
  await page.goto('/');
  // App will use mocked data
});
```

### Wait for Network

```typescript
test('wait for API', async ({ page }) => {
  await page.goto('/');
  
  // Wait for specific API call
  await page.waitForResponse('/api/library');
  
  // Now check results
  await expect(page.getByText('Song Title')).toBeVisible();
});
```

### Multiple Tabs

```typescript
test('open in new tab', async ({ context }) => {
  const page = await context.newPage();
  await page.goto('/');
  
  const newPage = await context.newPage();
  await newPage.goto('/upload');
  
  // Work with multiple tabs
});
```

### File Upload

```typescript
test('upload file', async ({ page }) => {
  await page.goto('/upload');
  
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('path/to/song.mp3');
  
  await page.getByRole('button', { name: /upload/i }).click();
});
```

## Debugging

### UI Mode (Best for Development)

```bash
npm run test:e2e:ui
```

Opens interactive UI where you can:
- See tests running in real-time
- Time-travel through test steps
- Inspect DOM at each step
- Edit tests and rerun instantly

### Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

Opens browser window so you can watch tests execute.

### Debug Mode (Step Through)

```bash
npm run test:e2e:debug
```

Pauses before each step, opens Playwright Inspector.

### Add Debug Breakpoints

```typescript
test('debug this', async ({ page }) => {
  await page.goto('/');
  
  await page.pause(); // Stops here and opens inspector
  
  await page.getByText('Click Me').click();
});
```

### Console Logs

```typescript
test('check console', async ({ page }) => {
  page.on('console', (msg) => console.log('Browser log:', msg.text()));
  
  await page.goto('/');
});
```

### Screenshots on Failure

Already configured! Failed tests automatically capture:
- Screenshot
- Video (if enabled)
- Trace file

View with: `npx playwright show-report`

## CI Integration

E2E tests can run in CI, but consider:

### Option 1: Run on Every PR (Slow but Safe)

```yaml
# .github/workflows/frontend-ci.yml
- name: Install Playwright
  run: npm run test:e2e
```

### Option 2: Separate E2E Workflow (Recommended)

Create `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests
on:
  push:
    branches: [antik-laptop]
  workflow_dispatch:

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
      
      - name: Install Playwright Browsers
        run: cd frontend && npx playwright install --with-deps
      
      - name: Start Backend
        run: cd backend && npm start &
      
      - name: Run E2E Tests
        run: cd frontend && npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

### Option 3: Manual/Scheduled Only

Run E2E tests manually before releases or on a schedule (nightly).

## Best Practices

### 1. Start with Smoke Tests

Test critical paths first:
- ✅ App loads
- ✅ Navigation works
- ✅ Basic interactions don't crash

### 2. Use Auto-Waiting

Playwright automatically waits for elements. Don't add manual sleeps:

```typescript
// ❌ Bad
await page.waitForTimeout(2000);
await page.click('button');

// ✅ Good
await page.getByRole('button').click(); // Auto-waits until clickable
```

### 3. Isolate Tests

Each test should be independent:

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Start fresh each time
});
```

### 4. Use Descriptive Test Names

```typescript
// ✅ Good
test('should display error message when API fails', async ({ page }) => {

// ❌ Bad
test('test1', async ({ page }) => {
```

### 5. Test Real User Flows

Don't test implementation:

```typescript
// ✅ Good: Test user behavior
test('user can play a song', async ({ page }) => {
  await page.getByText('Song Title').click();
  await page.getByRole('button', { name: /play/i }).click();
  await expect(page.getByText('Now Playing')).toBeVisible();
});

// ❌ Bad: Test internal state
test('isPlaying is true', async ({ page }) => {
  // Don't access component state in E2E tests
});
```

## Common Patterns

### Wait for API Response

```typescript
const responsePromise = page.waitForResponse('/api/library');
await page.getByText('Refresh').click();
const response = await responsePromise;
expect(response.status()).toBe(200);
```

### Test Multiple Viewports

```typescript
const viewports = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1920, height: 1080, name: 'desktop' },
];

for (const viewport of viewports) {
  test(`should work on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    // Test responsiveness
  });
}
```

### Reusable Page Objects

```typescript
// e2e/pages/HomePage.ts
export class HomePage {
  constructor(private page: Page) {}
  
  async navigateToLibrary() {
    await this.page.getByText('Library_Root').click();
  }
  
  async openSidebar() {
    await this.page.locator('button:has(span:text("menu"))').click();
  }
}

// Use in test
test('test with page object', async ({ page }) => {
  const homePage = new HomePage(page);
  await page.goto('/');
  await homePage.navigateToLibrary();
});
```

## Troubleshooting

### Tests are Flaky

- Use `expect().toBeVisible()` instead of checking existence
- Avoid hardcoded waits (`waitForTimeout`)
- Increase timeout if needed: `test.setTimeout(60000)`

### Can't Find Element

```typescript
// Debug: See what's on the page
await page.pause();

// Or screenshot
await page.screenshot({ path: 'debug.png', fullPage: true });
```

### Tests Pass Locally but Fail in CI

- Check viewport size (CI might use different size)
- Check timing (CI is slower)
- Enable video recording in CI for debugging

### Backend Not Available

E2E tests need backend. Options:
1. Mock API responses with `page.route()`
2. Start backend in test setup
3. Use a test backend/database

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Locators Guide](https://playwright.dev/docs/locators)

## Next Steps

1. ✅ Install Playwright: `npm install`
2. ✅ Install browsers: `npx playwright install`
3. ✅ Run tests: `npm run test:e2e:ui`
4. Write more E2E tests for:
   - Song playback
   - File upload
   - Playlist management
   - Mobile interactions
   - Error scenarios

---

**Playwright Setup Complete!** 🎭  
Run `npm run test:e2e:ui` to start testing in interactive mode.
