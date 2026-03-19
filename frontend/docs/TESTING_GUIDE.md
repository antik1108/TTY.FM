# TTY.FM Testing Complete Guide

This document explains **everything about testing** in this project: what tests exist, how they work, what files they create, and how to run them. Perfect for beginners and experienced developers.

---

## 🎯 Quick Summary

**Total Tests: 32**
- **2 Unit Tests** - Testing individual UI components
- **14 Integration Tests** - Testing components + services + API calls  
- **16 E2E Tests** - Testing real user flows in actual browsers

---

## 📚 What Are These 3 Types of Tests?

### 1️⃣ Unit Tests (2 tests)
**What they test:** Individual React components in isolation  
**File location:** `frontend/src/components/Header.test.tsx`  
**Tools used:** Jest + React Testing Library  
**Speed:** ⚡ Fastest (milliseconds)  
**What they verify:**
- Header component renders correctly
- Header displays stats values (latency, status, uptime, etc.)
- Menu button click triggers callback function

**Example:** Does the Header component show "TTY.FM" text and "OPTIMIZED" status?

---

### 2️⃣ Integration Tests (14 tests)
**What they test:** Multiple components working together + mocked API calls  
**File locations:**
- `frontend/tests/integration/ApiIntegration.integration.test.tsx` (6 tests)
- `frontend/tests/integration/NavigationFlow.integration.test.tsx` (4 tests)
- `frontend/tests/integration/PlayerInteraction.integration.test.tsx` (3 tests)  
**Tools used:** Jest + React Testing Library + Mock Services  
**Speed:** ⚡⚡ Medium (seconds)  
**What they verify:**
- Components communicate correctly
- Navigation state changes work
- API service methods work properly
- Data flows through components

**Example:** Can users navigate from Library to a Playlist and back?

---

### 3️⃣ E2E Tests (16 tests)
**What they test:** Complete user journeys in **real browsers** (Chrome, Firefox, Safari)  
**File locations:**
- `frontend/e2e/app.spec.ts` (5 tests)
- `frontend/e2e/navigation.spec.ts` (5 tests)
- `frontend/e2e/player.spec.ts` (6 tests)  
**Tools used:** Playwright  
**Speed:** ⚡⚡⚡ Slower (30-60 seconds for all)  
**What they verify:**
- Can users actually click buttons and see results?
- Does the app work in Chrome, Firefox, and Safari?
- Does the app work on mobile (375px width) and desktop (1920px)?
- Do UI elements appear without errors?

**Example:** Can a real user open the app, click "Library_Root", and see library songs?

---

## 🏃 How to Run Tests

### All Tests at Once
```bash
cd frontend
npm run test
```
Runs both unit + integration tests (Jest only, no browser automation)

### By Category

**Unit Tests Only:**
```bash
npm run test:unit
```

**Integration Tests Only:**
```bash
npm run test:integration
```

**E2E Tests (watches real browsers):**
```bash
npm run test:e2e
```

**E2E with Visual UI (best for debugging):**
```bash
npm run test:e2e:ui
```
Opens interactive browser where you can see each step and pause

**E2E in Headed Mode (see browser window):**
```bash
npm run test:e2e:headed
```

**E2E Debug Mode:**
```bash
npm run test:e2e:debug
```

**Test Single E2E File:**
```bash
npx playwright test e2e/player.spec.ts
```

**Test One Browser Only:**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Watch Mode (re-run on file change)
```bash
npm run test:watch
```

### Coverage Report (see how much code is tested)
```bash
npm run test:coverage
```

---

## 📊 Test Descriptions in Detail

### Unit Tests (Location: `src/components/Header.test.tsx`)

```
✓ Test 1: renders stats values
  ├─ Checks Header shows "TTY.FM"
  ├─ Checks Header shows latency (e.g., "12ms")
  ├─ Checks Header shows status (e.g., "OPTIMIZED")
  ├─ Checks Header shows uptime (e.g., "00:10:00")
  ├─ Checks Header shows node load (e.g., "54%")
  └─ Checks Header shows node name (e.g., "NODE: LOCAL_NODE")

✓ Test 2: calls onMenuClick when menu button is clicked
  ├─ Renders Header with onMenuClick callback
  ├─ Clicks the menu button
  └─ Verifies callback was called exactly 1 time
```

---

### Integration Tests - API Calls (`tests/integration/ApiIntegration.integration.test.tsx`)

```
✓ Test 1: fetches and displays system stats in header
  ├─ Mocks SystemService.getStats()
  ├─ Renders Header with mocked stats
  └─ Verifies Header shows "OPTIMIZED" and "45%" load

✓ Test 2: fetches library songs from API
  ├─ Mocks LibraryService.getSongs()
  ├─ Calls the service
  └─ Verifies it returns 1 song with correct title

✓ Test 3: handles API error gracefully
  ├─ Mocks LibraryService to throw error
  └─ Verifies error is handled properly

✓ Test 4: fetches playlists and displays count
  ├─ Mocks getPlaylists() returning 2 playlists
  └─ Verifies playlist count is correct

✓ Test 5: creates new playlist via API
  ├─ Mocks createPlaylist()
  └─ Verifies new playlist is created

✓ Test 6: generates correct stream URL
  ├─ Tests URL generation logic
  └─ Verifies URL is "/api/stream/song123"

✓ Test 7: refreshes library successfully
  ├─ Mocks refreshLibrary()
  └─ Verifies it was called
```

---

### Integration Tests - Navigation (`tests/integration/NavigationFlow.integration.test.tsx`)

```
✓ Test 1: navigates from library to playlist and back
  ├─ Renders Sidebar with playlists
  ├─ Clicks on Synthwave playlist
  ├─ Verifies onSelectPlaylist callback called
  ├─ Updates component state
  ├─ Clicks Library_Root to go back
  └─ Verifies onSelectLibrary callback called

✓ Test 2: creates new playlist and refreshes library
  ├─ Mocks window.prompt() to return "NewPlaylist"
  ├─ Clicks "New" button
  ├─ Verifies prompt was shown
  ├─ Verifies createPlaylist was called
  ├─ Clicks "Refresh" button
  └─ Verifies refreshLibrary was called

✓ Test 3: displays loading state when fetching songs
  ├─ Renders MainContent with isLoading=true
  └─ Verifies "loading" text is visible

✓ Test 4: displays error state when fetch fails
  ├─ Renders MainContent with error message
  └─ Verifies error message is visible
```

---

### Integration Tests - Player Interaction (`tests/integration/PlayerInteraction.integration.test.tsx`)

```
✓ Test 1: selects a song from list and controls playback
  ├─ Renders song list
  ├─ Clicks "Cyberpunk Dreams" song
  ├─ Verifies onSelect callback called
  ├─ Renders Footer with selected song
  ├─ Verifies song displays in footer
  ├─ Clicks play/pause button
  └─ Verifies onTogglePlay callback called

✓ Test 2: changes volume and verifies visual feedback
  ├─ Renders Footer with player
  ├─ Finds volume slider
  ├─ Changes volume to 50%
  └─ Verifies setVolume called with 50

✓ Test 3: seeks to different position in track
  ├─ Renders Footer with player
  ├─ Finds progress bar
  └─ Simulates user clicking on progress bar
```

---

### E2E Tests - App (Location: `e2e/app.spec.ts`)

```
✓ Test 1: should load the homepage
  ├─ Loads app in browser
  ├─ Waits for page to load
  ├─ Checks "TTY.FM" text visible
  ├─ Checks "Latency" visible
  ├─ Checks "Buffer_State" visible
  └─ Checks "Core Process Library" visible

✓ Test 2: should display system stats in header
  ├─ Loads app
  ├─ Waits for "OPTIMIZED" text
  └─ Checks node load percentage displays

✓ Test 3: should show sidebar navigation
  ├─ Loads app
  ├─ Checks sidebar shows "FileSystem Tree"
  ├─ Checks sidebar shows "Library_Root"
  ├─ Checks sidebar shows "UNCATEGORIZED"
  └─ Checks sidebar shows "Playlists"

✓ Test 4: should have working refresh button
  ├─ Loads app
  ├─ Finds and clicks Refresh button
  └─ Verifies app didn't crash

✓ Test 5: should toggle mobile menu
  ├─ Sets viewport to mobile size (375x667)
  ├─ Loads app
  ├─ Checks menu button visible
  ├─ Clicks menu button
  └─ Checks sidebar became visible
```

---

### E2E Tests - Navigation (Location: `e2e/navigation.spec.ts`)

```
✓ Test 1: should navigate to uncategorized songs
  ├─ Loads app
  ├─ Clicks "UNCATEGORIZED" in sidebar
  └─ Verifies navigation worked

✓ Test 2: should navigate to library view
  ├─ Loads app
  ├─ Clicks "Library_Root"
  └─ Checks "Core Process Library" displays

✓ Test 3: should navigate to upload panel
  ├─ Loads app
  ├─ Clicks "Upload" button
  └─ Checks upload interface appears

✓ Test 4: should show playlist creation dialog
  ├─ Loads app
  ├─ Clicks "New" button (create playlist)
  └─ Verifies action didn't crash

✓ Test 5: should maintain navigation state on page interactions
  ├─ Loads app
  ├─ Clicks Library_Root
  ├─ Clicks Refresh button
  └─ Verifies still in library view
```

---

### E2E Tests - Player (Location: `e2e/player.spec.ts`)

```
✓ Test 1: should display footer player controls
  ├─ Loads app
  └─ Verifies footer exists

✓ Test 2: should have audio element on page
  ├─ Loads app
  └─ Checks HTML audio element present

✓ Test 3: should show player controls when song is available
  ├─ Loads app
  ├─ Checks footer player visible
  └─ Looks for volume/play controls (may be hidden)

✓ Test 4: should display system logs section on desktop
  ├─ Sets viewport to desktop (1920x1080)
  ├─ Loads app
  └─ Checks system logs section exists (may be hidden)

✓ Test 5: should have visualizer panel
  ├─ Sets viewport to desktop
  ├─ Loads app
  └─ Checks right panel (visualizer/system info) exists

✓ Test 6: should render without errors on interaction
  ├─ Loads app
  ├─ Clicks Library_Root
  ├─ Clicks Refresh
  ├─ Checks app still works
  └─ Checks no critical console errors occurred
```

---

## 📁 What Files Do Tests Create?

### When You Run Pytest (Unit + Integration Tests)

```
frontend/
└── coverage/                    ← Created by "npm run test:coverage"
    ├── clover.xml               [Clover format report - for CI/CD tools]
    ├── coverage-final.json      [Raw coverage data - for tools]
    ├── lcov.info                [LCOV format - for coverage tools]
    └── lcov-report/
        └── index.html           [📊 OPEN THIS IN BROWSER - visual report]
            └── (many files...)  [CSS, JS for the report]
```

**What these files mean:**
- `coverage-final.json`: Raw data about which lines of code were tested
- `lcov.info`: Standard format for coverage (used by many tools)
- `lcov-report/index.html`: Visual report showing % of code tested

---

### When You Run E2E Tests (Playwright)

```
frontend/
├── playwright-report/
│   ├── index.html               [📊 OPEN THIS IN BROWSER - test report]
│   ├── trace.zip                [Video/trace of failed test]
│   └── (many files...)          [HTML, CSS, JS for report]
│
└── test-results/
    ├── .last-run.json           [Info about last test run]
    ├── navigation-...chromium/   [Failed test artifacts]
    │   ├── error-context.md      [What went wrong]
    │   └── screenshot.png        [Screenshot of failure]
    ├── navigation-...firefox/    [Failed test artifacts]
    │   └── error-context.md
    └── navigation-...webkit/     [Failed test artifacts]
        └── error-context.md
```

**What these files mean:**
- `playwright-report/index.html`: Visual report with test results, screenshots, videos
- `test-results/.last-run.json`: Machine-readable test metadata
- `test-results/*/error-context.md`: Human-readable failure explanation
- Screenshots only for failed tests (saves space)

---

## 🔍 How to View Test Reports

### Coverage Report (Unit + Integration Tests)
After running `npm run test:coverage`:
```bash
# Open in browser on Mac
open frontend/coverage/lcov-report/index.html

# On Linux
xdg-open frontend/coverage/lcov-report/index.html

# On Windows
start frontend/coverage/lcov-report/index.html
```

**What you'll see:**
- Overall coverage percentage (% of code tested)
- Files listed with coverage for each file
- Click file name to see which lines are covered (green) vs not covered (red)

---

### E2E Test Report (Playwright)
After running `npm run test:e2e`:
```bash
# Open in browser on Mac
open frontend/playwright-report/index.html

# On Linux
xdg-open frontend/playwright-report/index.html

# On Windows
start frontend/playwright-report/index.html
```

**What you'll see:**
- List of all tests (passed ✅ or failed ❌)
- Time each test took
- Screenshots of failed tests
- Video trace of failed tests (if enabled)
- Error messages

---

## ⚙️ How Tests Work (Under the Hood)

### Unit & Integration Tests Flow
```
npm run test
    ↓
Jest starts
    ↓
Reads .test.tsx files in src/
    ↓
For each test:
    ├─ Create mock environment (no real backend)
    ├─ Render React components
    ├─ Simulate user clicks/inputs
    ├─ Check expectations (did X happen?)
    └─ Cleanup
    ↓
Generate coverage report
    ↓
Exit (success if all passed)
```

### E2E Tests Flow
```
npm run test:e2e
    ↓
Playwright starts
    ↓
Starts real dev server (npm run dev) if not running
    ↓
For each test:
    ├─ Launch real browser (Chrome/Firefox/Safari)
    ├─ Navigate to http://localhost:3000
    ├─ Perform actions (click, type, wait)
    ├─ Take screenshot/video
    ├─ Check expectations
    └─ Close browser browser
    ↓
Generate HTML report
    ↓
Exit (success if all passed)
```

---

## 🐛 Troubleshooting

### Tests Fail: "Cannot find module X"
**Cause:** Missing npm packages  
**Solution:**
```bash
npm install
npm run test
```

### Unit/Integration Tests Fail
**Cause:** Jest setup issue
**Solution:**
```bash
npm run test:unit
# Look at error message, usually indicates missing dependency
```

### E2E Tests Fail: "Connection refused"
**Cause:** Backend server (port 3001) not running
**Solution:**
```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Run E2E tests
cd frontend
npm run test:e2e
```

### E2E Tests Fail: "Timeout waiting for http://localhost:3000"
**Cause:** Dev server not running
**Solution:**
```bash
npm run test:e2e
# Playwright auto-starts dev server, if it fails:
npm run dev  # Terminal 1
npm run test:e2e  # Terminal 2
```

### Playwright Browsers Not Installed
**Solution:**
```bash
npx playwright install
npm run test:e2e
```

### Tests Pass Locally But Fail in CI
**Cause:** Environment differences  
**Solution:** Check `/playwright.config.ts` - CI runs with `workers: 1` and `retries: 2`

---

## ✅ Test Results Interpretation

### Good ✅
```
PASS src/components/Header.test.tsx
PASS tests/integration/ApiIntegration.integration.test.tsx
PASS e2e/app.spec.ts
...
====== 32 passed in 45s ======
```
Meaning: All 32 tests ran without errors. App is stable!

### Warning ⚠️
```
PASS (with warnings)
  Tests: 31 passed, 1 skipped
```
Meaning: 1 test was skipped (usually intentional). Check if that's OK.

### Failure ❌
```
FAIL tests/integration/NavigationFlow.integration.test.tsx
  ○ navigates from library to playlist and back
    Error: Expected "Synthwave" to be visible

FAIL e2e/player.spec.ts
  ○ should display footer player controls
    Error: Timeout waiting for "footer" element

====== 30 passed, 2 failed ======
```
Meaning: 2 tests have issues. Check error messages and fix code.

---

## 📈 Adding New Tests

### Add Unit Test
Create file: `src/components/YourComponent.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('renders text', () => {
    render(<YourComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Add Integration Test
Create file: `tests/integration/YourFeature.integration.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import YourService from '../../src/services/YourService';

jest.mock('../../src/services/YourService');

describe('Your Feature Integration', () => {
  it('interacts with service', async () => {
    (YourService.getData as jest.Mock).mockResolvedValue({ data: 'test' });
    const result = await YourService.getData();
    expect(result.data).toBe('test');
  });
});
```

### Add E2E Test
Create file: `e2e/yourFeature.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Your Feature', () => {
  test('user can do X', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("X")');
    await expect(page.getByText('Result')).toBeVisible();
  });
});
```

Then run: `npm run test` or `npm run test:e2e`

---

## 🎓 Quiz: Do You Understand?

1. **Q:** What's the difference between Unit and Integration tests?  
   **A:** Unit tests test one component alone. Integration tests test multiple components + services together.

2. **Q:** Why are E2E tests slower?  
   **A:** They launch real browsers and test real user interactions, which takes time.

3. **Q:** What does the coverage report show?  
   **A:** Percentage of code that's been run by tests. Higher % = more code tested.

4. **Q:** If E2E tests fail with "connection refused", what's wrong?  
   **A:** The backend server (port 3001) isn't running. Start it with `cd backend && npm start`.

5. **Q:** Where do test reports go?  
   **A:** `coverage/lcov-report/` for unit/integration, `playwright-report/` for E2E.

---

## 📞 Need Help?

- Check error messages carefully - they usually say exactly what's wrong
- Run tests with `--headed` or `--ui` flags to see what's happening
- Check the coverage/playwright reports for details
- Read the test source code - it shows exactly what's being tested

Good luck testing! 🚀
