# Testing Quick Reference Guide

Fast lookup for the most common testing commands. 🚀

---

## ⚡ Most Common Commands

### Run ALL Tests
```bash
cd frontend
npm run test
```
✅ Runs unit + integration tests  
⏱️ ~30 seconds  
📊 Output goes to terminal only  

---

### Run ONLY Integration Tests
```bash
npm run test:integration
```
✅ Tests that use mocked APIs  
⏱️ ~20 seconds  

---

### Run ONLY Unit Tests
```bash
npm run test:unit
```
✅ Tests single components  
⏱️ ~5 seconds  

---

### Run E2E Tests in Real Browsers
```bash
npm run test:e2e
```
✅ Tests complete user journeys  
⏱️ ~1-2 minutes  
📊 Report: `playwright-report/index.html`

---

### Run E2E Tests with Visual UI (Best for Debugging!)
```bash
npm run test:e2e:ui
```
✅ Interactive browser where you can pause/inspect  
⏱️ ~1-2 minutes  
👁️ You see click-by-click replay  

---

### Run E2E Tests in Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```
✅ Watch browser windows perform the tests  
⏱️ ~1-2 minutes  

---

### Run E2E Debug Mode
```bash
npm run test:e2e:debug
```
✅ Step through test with debugger paused  
⏱️ Manual (you control pacing)  

---

### Run Tests in Watch Mode (Auto-rerun on change)
```bash
npm run test:watch
```
✅ Great while coding - reruns when you save  
⏱️ Continuous until you press `q`  

---

### Generate Coverage Report
```bash
npm run test:coverage
```
✅ Shows % of code tested  
📊 Report: `coverage/lcov-report/index.html`  
⏱️ ~30 seconds

---

## 🔧 Advanced Commands

### Run One E2E Test File
```bash
npx playwright test e2e/player.spec.ts
```

### Run One E2E Test by Name
```bash
npx playwright test -g "should display footer"
```

### Run E2E on One Browser Only
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run E2E with Verbose Output
```bash
npx playwright test --verbose
```

### Trace Failed E2E Test
```bash
npx playwright show-trace test-results/[testname]/trace/trace.zip
```

### Install Playwright Browsers (if missing)
```bash
npx playwright install
```

---

## 📊 View Test Reports

### Coverage Report (Unit + Integration)
```bash
# Mac
open frontend/coverage/lcov-report/index.html

# Linux
xdg-open frontend/coverage/lcov-report/index.html

# Windows
start frontend/coverage/lcov-report/index.html
```

### E2E Test Report
```bash
# Mac
open frontend/playwright-report/index.html

# Linux
xdg-open frontend/playwright-report/index.html

# Windows
start frontend/playwright-report/index.html
```

---

## 🎯 Typical Testing Flow

### Full Test Cycle (while developing)
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Run tests in watch mode
cd frontend
npm run test:watch

# As you edit files, tests automatically re-run
# When all pass ✅, try E2E tests:
npm run test:e2e
```

### Quick Smoke Test (before committing)
```bash
npm run test && npm run test:e2e
```
Runs all unit/integration tests first, then E2E tests

### Check Coverage Before Merge
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## ⚠️ Common Issues & Fixes

### Issue: "Cannot find module"
```bash
npm install
npm run test
```

### Issue: E2E tests timeout
```bash
# Make sure backend is running:
cd backend
npm start

# Then run tests:
cd frontend
npm run test:e2e
```

### Issue: Playwright browsers missing
```bash
npx playwright install
npm run test:e2e
```

### Issue: Port 3000 already in use
```bash
# Kill process using port 3000:
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Then run tests:
npm run test:e2e
```

### Issue: Tests pass locally but fail in CI
Check `.github/workflows/` or `playwright.config.ts` for environment-specific config

---

## 🏁 Before Pushing Code

Checklist:
```
☐ npm run test          # All unit/integration pass?
☐ npm run test:e2e      # All E2E pass?
☐ npm run test:coverage # Coverage acceptable?
☐ No console errors?    # Check browser console
☐ No new warnings?      # Check terminal output
```

---

## 📈 Test Counts

- **Unit Tests:** 2 (in `src/components/Header.test.tsx`)
- **Integration Tests:** 14 (in `tests/integration/`)
- **E2E Tests:** 16 (in `e2e/`)
- **Total:** 32 tests

---

## 🔗 Related Files

- Test config: `frontend/playwright.config.ts`, `frontend/jest.config.cjs`
- Backend: `backend/src/server.js` (runs on port 3001)
- Frontend: `frontend/src/main.tsx` (runs on port 3000)
- Coverage config: `frontend/tsconfig.json`, `frontend/package.json`

---

## 📚 Detailed Guides

- Full testing explanation: Read [`TESTING_GUIDE.md`](TESTING_GUIDE.md)
- What files tests create: Read [`TEST_ARTIFACTS_EXPLAINED.md`](TEST_ARTIFACTS_EXPLAINED.md)

---

Good testing! 🎉
