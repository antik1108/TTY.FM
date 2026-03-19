# GitHub Actions CI/CD Pipeline

This document explains the automated testing and deployment pipeline for TTY.FM.

---

## 📋 Overview

The CI pipeline runs automatically on:
- ✅ **Push** to `antik-laptop` branch
- ✅ **Pull requests** to `antik-laptop` branch

**What it tests:**
```
┌─────────────────────────────────────────────────┐
│           GitHub Actions CI Pipeline            │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Backend (Node 18.x, 20.x, 22.x)             │
│     ├─ Install dependencies                     │
│     ├─ Lint code                                │
│     ├─ Check syntax                             │
│     └─ Verify folder structure                  │
│                                                 │
│  2. Frontend (Node 18.x, 20.x, 22.x)            │
│     ├─ Install dependencies                     │
│     ├─ TypeScript type check                    │
│     ├─ Run linter (ESLint)                      │
│     ├─ Unit + Integration tests                 │
│     ├─ Generate coverage report                 │
│     ├─ Upload to Codecov                        │
│     └─ Build production bundle                  │
│                                                 │
│  3. E2E Tests (Playwright)                      │
│     ├─ Install browsers                         │
│     ├─ Run tests on Chrome/Firefox/Safari       │
│     └─ Generate HTML report                     │
│                                                 │
│  4. Status Check                                │
│     └─ Fail if any step fails                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔍 Workflow File Location

```
.github/
└── workflows/
    └── ci.yml          ← Main CI configuration
```

---

## 📊 Job Details

### Job 1: Backend Testing
**Runs on:** Linux (Ubuntu)  
**Node versions:** 18.x, 20.x, 22.x  
**Parallel runs:** 3 (one per Node version)

**Steps:**
1. ✅ Checkout code
2. ✅ Set up Node.js
3. ✅ Install dependencies (`npm ci`)
4. ✅ Run linter
5. ✅ Check syntax errors
6. ✅ Verify folder structure exists

**Checks:**
- Is `src/server.js` present?
- Are `src/config`, `src/modules`, `src/routes` directories present?
- Is JavaScript valid?

---

### Job 2: Frontend Testing
**Runs on:** Linux (Ubuntu)  
**Node versions:** 18.x, 20.x, 22.x  
**Parallel runs:** 3 (one per Node version)

**Steps:**
1. ✅ Checkout code
2. ✅ Set up Node.js
3. ✅ Install dependencies (`npm ci`)
4. ✅ TypeScript type check (`tsc --noEmit`)
5. ✅ Run ESLint
6. ✅ Run unit + integration tests
7. ✅ Generate coverage report
8. ✅ Upload to Codecov
9. ✅ Build production bundle (`npm run build`)

**Reports generated:**
- Coverage: `frontend/coverage/`
- Build: `frontend/dist/`

---

### Job 3: E2E Tests
**Runs on:** Linux (Ubuntu)  
**Browser coverage:** Chrome, Firefox, Safari  
**Timeout:** 15 minutes

**Steps:**
1. ✅ Checkout code
2. ✅ Set up Node.js 22.x
3. ✅ Install dependencies
4. ✅ Install Playwright browsers
5. ✅ Run all E2E tests
6. ✅ Generate HTML report
7. ✅ Upload artifacts

**Artifacts saved:**
- Playwright HTML report (30 days retention)
- Test results (7 days retention)

---

### Job 4: Status Check
**Depends on:** Backend, Frontend, E2E  
**Purpose:** Fail the entire workflow if any job fails

---

## 🚀 How to Use

### View Results

**Option 1: GitHub UI**
1. Go to your repository
2. Click "Actions" tab
3. See all workflow runs
4. Click a run to see details

**Option 2: Download Artifacts**
1. Click a workflow run
2. Scroll down to "Artifacts"
3. Download `playwright-report` or `test-results`

**Option 3: Local Check**
Before pushing, run locally:
```bash
# Backend
cd backend
npm install
npm run lint
node --check src/server.js

# Frontend
cd frontend
npm install
npm run test
npm run test:coverage
npm run test:e2e
npm run build
```

---

## ⚙️ Configuration Options

### Cache Dependencies
The workflow caches `node_modules` to speed up runs:
```yaml
cache: 'npm'
cache-dependency-path: backend/package-lock.json
```

### Test CI Mode
Jest runs with `--ci` flag:
```yaml
npm run test -- --ci
```

### Codecov Integration
Coverage reports upload to Codecov:
```yaml
- uses: codecov/codecov-action@v3
```

---

## 🐛 Troubleshooting

### Issue: "npm ci: command not found"
**Solution:** Already installed in Node.js. Check Node version.

### Issue: E2E tests timeout
**Solution:** Increase timeout (currently 15 minutes):
```yaml
timeout-minutes: 20  # Change this
```

### Issue: Linter fails on every push
**Solution:** Configure ESLint in `frontend/.eslintrc.json` or disable with:
```bash
npm run lint 2>/dev/null || echo "Skipping lint"
```

### Issue: Coverage upload fails
**Solution:** It's non-critical - workflow continues:
```yaml
fail_ci_if_error: false
```

---

## 📈 Success Indicators

✅ **Green checkmark** - All tests passed  
❌ **Red X** - Something failed (see logs)  
⏳ **Pending** - Still running

---

## 📊 Cost & Performance

### GitHub Actions Pricing
- **Free tier:** 2,000 minutes/month
- **Each run:** ~5-10 minutes
- **Expected runs:** ~300/month (enough for active development)

### Speed Optimization
- Cache enabled (saves ~30 seconds per run)
- Parallel jobs (3 Node versions tested simultaneously)
- E2E runs on every push to antik-laptop (optional - can be limited to save time)

---

## 🔐 Security

**Secrets (optional):**
If using Codecov or deploying:
```
Settings → Secrets → Add secret
- CODECOV_TOKEN (for coverage upload)
- DEPLOY_KEY (if auto-deploying)
```

---

## 📝 Status Badge

Add to your README.md:
```markdown
[![CI/CD Pipeline](https://github.com/[your-username]/TTY.FM/actions/workflows/ci.yml/badge.svg)](https://github.com/[your-username]/TTY.FM/actions/workflows/ci.yml)
```

This shows:
- ✅ Pipeline passing
- ❌ Pipeline failing
- Latest run status

---

## 🎯 Next Steps

1. Push workflow file to GitHub
2. Create a pull request
3. Watch "Actions" tab for workflow to run
4. Check results

---

## 📚 Related Documentation

- Frontend testing: [`frontend/docs/TESTING_GUIDE.md`](../../frontend/docs/TESTING_GUIDE.md)
- Test artifacts: [`frontend/docs/TEST_ARTIFACTS_EXPLAINED.md`](../../frontend/docs/TEST_ARTIFACTS_EXPLAINED.md)
- Setup script: [`start.sh`](../../start.sh)

---

**All configured and ready to test on every push!** 🚀
