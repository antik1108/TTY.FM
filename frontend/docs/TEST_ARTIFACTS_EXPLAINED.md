# Test Artifacts Explained - What Files Do Tests Create?

This document explains **every file** that tests create, what each file means, and how to use them.

---

## 📂 File Structure When Tests Run

```
TTY.FM/frontend/
├── src/
│   ├── components/
│   │   └── Header.test.tsx          [TEST FILE - defines tests]
│   └── ...
├── e2e/
│   ├── app.spec.ts                  [TEST FILE - defines E2E tests]
│   ├── navigation.spec.ts           [TEST FILE - defines E2E tests]
│   └── player.spec.ts               [TEST FILE - defines E2E tests]
├── tests/
│   ├── integration/                 [TEST FILES - define integration tests]
│   │   ├── ApiIntegration.integration.test.tsx
│   │   ├── NavigationFlow.integration.test.tsx
│   │   └── PlayerInteraction.integration.test.tsx
│   └── ...
│
├── coverage/                        ⬅️ CREATED BY: npm run test:coverage
│   ├── clover.xml
│   ├── coverage-final.json
│   ├── lcov.info
│   └── lcov-report/
│       ├── index.html               📊 OPEN THIS
│       ├── base.css
│       ├── prettify.js
│       └── frontend/
│           ├── index.html
│           ├── components/
│           │   └── Header.tsx.html  [Shows coverage for each file]
│           └── services/
│               └── LibraryService.ts.html
│
├── playwright-report/               ⬅️ CREATED BY: npm run test:e2e
│   ├── index.html                   📊 OPEN THIS
│   ├── trace.zip                    [Video/trace data]
│   └── [many other files]
│
└── test-results/                    ⬅️ CREATED BY: npm run test:e2e
    ├── .last-run.json               [Metadata about last run]
    ├── navigation-...-chromium/     [Only if test failed]
    │   ├── error-context.md         [📝 Why it failed]
    │   ├── screenshot.png           [📸 Page screenshot]
    │   └── trace/
    ├── navigation-...-firefox/      [Only if test failed]
    │   └── error-context.md
    └── navigation-...-webkit/       [Only if test failed]
        └── error-context.md
```

---

## 🏃 Step-by-Step: What Happens When You Run Tests

### Scenario 1: You run `npm run test:coverage`

```
You type: npm run test:coverage

    ↓

Jest runs all unit + integration tests

    ↓

For each .test.tsx file:
    - Render components in memory (no browser)
    - Run test code (clicks, checks, assertions)
    - Record which lines of code were executed

    ↓

Tests complete (all passed ✅ or some failed ❌)

    ↓

Jest writes 4 files to coverage/:
    1. clover.xml           ← Format for Clover/Jenkins tools
    2. coverage-final.json  ← Raw data as JSON
    3. lcov.info            ← Standard coverage format
    4. lcov-report/         ← HTML visual report
    
    ↓

Report ready to view:
    open frontend/coverage/lcov-report/index.html
```

---

### Scenario 2: You run `npm run test:e2e`

```
You type: npm run test:e2e

    ↓

Playwright checks: Is dev server running?
    No? → Starts: npm run dev (in background)
    Yes? → Continues

    ↓

For each .spec.ts file and each browser (Chrome, Firefox, Safari):
    - Launch actual browser window
    - Navigate to http://localhost:3000
    - Run test code (clicks, waits, assertions)
    - Capture screenshots (on failure only)
    - Capture video trace (on failure only)
    - Close browser

    ↓

All tests complete

    ↓

Creates 2 directories:

    1. playwright-report/
        ├── index.html           ← Open for visual test report
        ├── Other files...
        └── test-results data

    2. test-results/
        ├── .last-run.json       ← Metadata
        └── Only failed tests create subfolders:
            ├── testname-browser/
            │   ├── error-context.md
            │   ├── screenshot.png
            │   └── trace/

    ↓

Report ready:
    open frontend/playwright-report/index.html
```

---

## 📊 Coverage Files Explained

### File 1: `lcov-report/index.html` 🎯 MOST USEFUL
**When:** Created by `npm run test:coverage`  
**Size:** ~50 KB (plus CSS/JS)  
**How to use:** Open in browser

**What it shows:**
```
┌─ TTY.FM Coverage Report ────────────────────┐
│ Coverage Summary:                           │
│ • Statements: 72% (450/625)                 │
│ • Branches: 68% (170/250)                   │
│ • Functions: 75% (60/80)                    │
│ • Lines: 74% (430/580)                      │
│                                             │
│ Files:                                      │
│ • src/components/Header.tsx        85%  ✅  │
│ • src/components/Sidebar.tsx       60%  ⚠️   │
│ • src/services/LibraryService.ts   90%  ✅  │
│ • ...                                       │
│                                             │
│ Click a file to see line-by-line coverage   │
└─────────────────────────────────────────────┘
```

**Color meanings:**
- 🟢 Green = Line was tested
- 🔴 Red = Line was NOT tested
- 🟡 Yellow = Branch not tested (if/else)

**Why it matters:** Shows which parts of code aren't covered by tests - those are risky!

---

### File 2: `coverage-final.json`
**When:** Created by `npm run test:coverage`  
**Size:** ~100-500 KB  
**How to use:** Don't open directly (machine-readable)  
**Purpose:** Raw data used by CI/CD tools to track coverage over time

**Example content:**
```json
{
  "src/components/Header.tsx": {
    "path": "src/components/Header.tsx",
    "statementMap": {
      "1": {"start": {"line": 1}, "end": {"line": 3}},
      ...
    },
    "fnMap": {...},
    "branchMap": {...},
    "s": {"1": 5, "2": 0, ...},  // Count of times each statement executed
    "f": {"1": 3, ...},          // Count of times each function called
    "b": {"1": [2, 0], ...}      // Branch coverage
  },
  ...
}
```

---

### File 3: `lcov.info`
**When:** Created by `npm run test:coverage`  
**Size:** ~100-300 KB  
**How to use:** Don't open directly (standard format)  
**Purpose:** Used by coverage services (Codecov, Coveralls, etc.)

**Format:** LCOV (Line Coverage) - standard in industry
```
TN:TTY.FM
SF:src/components/Header.tsx
FN:5,Header
FNDA:5,Header
DA:5,1      # Line 5 was hit 1 time
DA:6,1
DA:7,0      # Line 7 was never hit (0 times)
...
end_of_record
```

---

## 🎬 Playwright Test Artifacts Explained

### File 1: `playwright-report/index.html` 🎯 MOST USEFUL
**When:** Created by `npm run test:e2e`  
**Size:** ~200-500 KB (plus data files)  
**How to use:** Open in browser

**What it shows:**
```
┌─ Playwright Test Report ─────────────────────┐
│ Test Suites: 3                              │
│ Tests: 16 (13 passed ✅, 3 failed ❌)       │
│ Duration: 2m 34s                            │
│                                             │
│ Suites:                                     │
│ ✅ e2e/app.spec.ts        (5/5 passed)      │
│ ✅ e2e/navigation.spec.ts (5/5 passed)      │
│ ❌ e2e/player.spec.ts     (3/6 passed)      │
│                                             │
│ Failed Tests:                               │
│ ❌ Test: should display footer              │
│    Browser: chromium                        │
│    Error: Timeout waiting for footer        │
│    [View] [Screenshot] [Trace]              │
│                                             │
│ ❌ Test: should toggle mobile menu          │
│    Browser: firefox                         │
│    Error: Element not clickable              │
│    [View] [Screenshot] [Trace]              │
│                                             │
└─────────────────────────────────────────────┘
```

**Interactive features:**
- Click test name → See detailed error
- Click "Screenshot" → See page state at failure
- Click "Trace" → Play back step-by-step video of test
- Toggle browser filter (show Chrome/Firefox/Safari only)

---

### File 2: `test-results/.last-run.json`
**When:** Created by `npm run test:e2e`  
**Size:** ~2-5 KB  
**How to use:** Don't open directly (machine-readable)  
**Purpose:** Metadata about test run

**Example content:**
```json
{
  "status": "failed",
  "stats": {
    "expected": 16,
    "passed": 13,
    "failed": 3,
    "flaky": 0,
    "skipped": 0,
    "duration": 154000
  },
  "runId": "run-2026-03-19",
  "startTime": "2026-03-19T10:30:00.000Z"
}
```

---

### Files 3-5: `test-results/[testname]-[browser]/`
**When:** Created by `npm run test:e2e` (only for failed tests)  
**Size:** ~50-500 KB per failure  
**How to use:** View in text editor or HTML viewer  
**Purpose:** Debug why a test failed

**Folder structure:**
```
test-results/
└── navigation-Navigation-Flow-should-navigate-to-upload-panel-chromium/
    ├── error-context.md         ← 📝 Start here
    ├── screenshot.png           ← 📸 What page looked like
    └── trace/                   ← 🎬 Video of test
        └── trace.zip
```

---

### Sub-file: `error-context.md`
**Most important file for debugging!**

**Example content:**
```markdown
# Test Failed: should navigate to upload panel

## Error Message
Timeout waiting for "Upload" button (5000ms)

## Browser
Chromium

## Screenshot
[Screenshot attached]

## DOM State
```html
<div id="root">
  <header>TTY.FM</header>
  <div class="sidebar">
    <button>Ref Refresh</button>
    <!-- Upload button missing! -->
  </div>
</div>
```

## Network Requests
- GET / 200 OK
- GET /api/library 404 Not Found ← Backend not running!
- GET /api/stats (pending...)

## Console Errors
- Failed to fetch '/api/library': Network error

## Steps Performed
1. ✅ goto('/')
2. ✅ waitForSelector('text=TTY.FM')
3. ✅ clicked Upload button
4. ❌ waitForSelector('text=Upload') - TIMEOUT
```

---

### Sub-file: `screenshot.png`
**Visual record of page state at failure**

Shows:
- What the page looked like when test failed
- Which elements were visible
- Which elements were missing
- Layout/styling issues

---

### Sub-file: `trace/trace.zip`
**Video recording of the test**

Open in Playwright Inspector:
```bash
npx playwright show-trace test-results/[testname]/trace/trace.zip
```

Allows you to:
- Play back test step-by-step
- Pause and inspect DOM at each step
- See network requests
- See console logs
- Rewind and forward

---

## 📈 Chart: What Creates What

```
┌─────────────────┬────────────────────────┬────────────────────┐
│  Command        │  Files Created         │  What You Do       │
├─────────────────┼────────────────────────┼────────────────────┤
│ npm run test    │ None (output to       │ Look at console    │
│                 │ terminal only)        │ for pass/fail      │
├─────────────────┼────────────────────────┼────────────────────┤
│ npm run test    │ coverage/             │ open coverage/     │
│ :coverage       │ ├── lcov-report/      │ lcov-report/       │
│                 │ ├── coverage-final    │ index.html         │
│                 │ └── lcov.info         │ in browser         │
├─────────────────┼────────────────────────┼────────────────────┤
│ npm run        │ playwright-report/    │ open playwright-   │
│ test:e2e       │ test-results/         │ report/index.html  │
│                 │ (only if failures)    │ in browser         │
└─────────────────┴────────────────────────┴────────────────────┘
```

---

## 🧹 Cleanup: Remove Old Test Reports

```bash
# Remove coverage files (takes ~5 MB)
rm -rf frontend/coverage

# Remove playwright reports (takes ~10-20 MB)
rm -rf frontend/playwright-report
rm -rf frontend/test-results

# Both
rm -rf frontend/coverage frontend/playwright-report frontend/test-results

# Then re-run tests to generate fresh reports
npm run test:coverage
npm run test:e2e
```

---

## 📊 Example: Reading a Real Report

### Scenario: E2E Test Fails

**Step 1:** Run tests
```bash
npm run test:e2e

# Output shows:
# FAIL: e2e/player.spec.ts
#   ✗ should display footer player controls
```

**Step 2:** Open report
```bash
open frontend/playwright-report/index.html
```

**Step 3:** Look at failed test
- See error: "Timeout waiting for footer"
- See screenshot: Page loaded but footer not visible

**Step 4:** Find error details
```bash
open frontend/test-results/player-should-display-footer-player-controls-chromium/error-context.md
```

**Step 5:** Analyze error
```
Network Requests:
- GET /api/stats 404 Not Found
- GET /api/library 404 Not Found

Console Errors:
- Failed to fetch '/api/stats': Network error

Conclusion: Backend server not running on port 3001!
```

**Step 6:** Fix and re-test
```bash
# Terminal 1
cd backend
npm start

# Terminal 2
cd frontend
npm run test:e2e

# Now prints:
# PASS: e2e/player.spec.ts (all tests pass)
```

---

## ✅ Summary

| File | Created By | Purpose | How to Use |
|------|-----------|---------|-----------|
| `coverage/lcov-report/index.html` | `npm run test:coverage` | See % of code tested | Open in browser |
| `coverage-final.json` | `npm run test:coverage` | Raw coverage data | For CI/CD tools |
| `lcov.info` | `npm run test:coverage` | Standard coverage format | For coverage services |
| `playwright-report/index.html` | `npm run test:e2e` | See E2E test results | Open in browser |
| `.last-run.json` | `npm run test:e2e` | Test metadata | For CI/CD tools |
| `test-results/*/error-context.md` | `npm run test:e2e` | Failed test details | Read to debug |
| `test-results/*/screenshot.png` | `npm run test:e2e` | Page snapshot | View to debug |
| `test-results/*/trace.zip` | `npm run test:e2e` | Full test video | Use playwright inspector |

---

## 🎓 Quiz

1. **Q:** I see a red line in `lcov-report/index.html`. What does it mean?  
   **A:** That line of code is NOT covered by any test - might be risky!

2. **Q:** E2E test failed. Where do I find why?  
   **A:** `test-results/[testname]-[browser]/error-context.md`

3. **Q:** Can I delete the `coverage/` folder?  
   **A:** Yes, it's auto-generated. Just run `npm run test:coverage` to recreate it.

4. **Q:** How do I see a video of a failed E2E test?  
   **A:** Run `npx playwright show-trace test-results/[testname]/trace/trace.zip`

5. **Q:** What's the difference between `lcov.info` and `coverage-final.json`?  
   **A:** Different formats. `lcov.info` is standard, `coverage-final.json` is Jest's format.

---

Good debugging! 🔍
