# TTY.FM Frontend

Vite + React client for the TTY.FM cyber-terminal UI.

## Run locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   `npm install`
2. Start the dev server:
   `npm run dev`

The frontend proxies API requests to the backend at `http://localhost:3001`.

---

## Testing

Frontend unit tests use **Jest** + **React Testing Library**.

### Run tests

```bash
cd frontend
npm install              # First time: install test dependencies
npm test                 # Run all tests (unit + integration)
npm run test:unit        # Run only unit tests
npm run test:integration # Run only integration tests
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
```

### Write your first test

See [components/Header.test.tsx](components/Header.test.tsx) for a unit test example.

See [__tests__/integration/](\_\_tests\_\_/integration/) for integration test examples.

Test file patterns:
- `*.test.tsx` or `*.test.ts` - Unit tests (test individual components)
- `*.integration.test.tsx` - Integration tests (test multiple components working together)

**Unit Test Example:**

```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

**Integration Test Example:**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

it('navigates from library to playlist', () => {
  render(
    <>
      <Sidebar onSelectPlaylist={onSelect} />
      <MainContent songs={songs} />
    </>
  );
  
  fireEvent.click(screen.getByText('Synthwave'));
  expect(screen.getByText('Playlist: Synthwave')).toBeInTheDocument();
});
```

### Configuration

- Jest config: [jest.config.cjs](jest.config.cjs)
- Test setup: [setupTests.ts](setupTests.ts)
- Test TypeScript config: [tsconfig.test.json](tsconfig.test.json)

### Documentation

- [docs/TESTING.md](docs/TESTING.md) - Complete unit testing guide
- [docs/INTEGRATION_TESTING.md](docs/INTEGRATION_TESTING.md) - Integration testing guide
- [docs/E2E_TESTING.md](docs/E2E_TESTING.md) - End-to-end testing with Playwright
- [docs/JEST_SETUP.md](docs/JEST_SETUP.md) - Setup summary and quick reference

---

## E2E Testing

End-to-end tests use **Playwright** to test the app in real browsers.

### Run E2E tests

```bash
cd frontend
npm install                  # Install dependencies
npx playwright install       # Install browsers (first time only)

npm run test:e2e            # Run E2E tests
npm run test:e2e:ui         # Interactive UI mode (recommended for development)
npm run test:e2e:headed     # See browser while tests run
npm run test:e2e:debug      # Debug mode with step-through
```

**Note:** E2E tests require the dev server to be running. The config auto-starts it, but for full functionality you should also start the backend.

### E2E Test Examples

E2E tests are located in [e2e/](e2e/) directory:
- `app.spec.ts` - Basic app smoke tests
- `navigation.spec.ts` - Navigation flow tests
- `player.spec.ts` - Player functionality tests

See [docs/E2E_TESTING.md](docs/E2E_TESTING.md) for complete guide.

### Configuration

- Playwright config: [playwright.config.ts](playwright.config.ts)
- Tests browsers: Chromium, Firefox, WebKit

---

## Frontend CI: what you should know first

This section is the project-specific context you need before writing a frontend CI workflow.

### 1) What the frontend is, and is not

- Frontend stack: **Vite 6 + React 19 + TypeScript**.
- Package manager in repo: **npm** (lockfile exists: `frontend/package-lock.json`).
- Current frontend scripts:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
  - `npm test` — runs Jest unit tests
  - `npm run test:watch` — watch mode
  - `npm run test:coverage` — coverage report

**CI implication:** your baseline CI should now include a test gate (`npm test`) alongside the build.

### 2) Node/runtime expectations

- Local docs and startup script require **Node.js 18+**.
- CI should pin a stable LTS runtime (for consistency/reproducibility).

**Practical recommendation:** use Node 20 in CI unless you have a reason to stay lower.

### 3) API coupling and what CI can validate

- Frontend API calls use relative paths (`/api`) in service files.
- Vite dev server proxies `/api` to `http://localhost:3001` (in `vite.config.ts`).
- The production build (`vite build`) does **not** require backend to be running.

**CI implication:**
- A frontend-only CI can reliably validate:
  - dependency install correctness
  - production bundling success
- It cannot validate runtime API behavior unless you add an integration job that starts backend too.

### 4) Workflow triggers and scope

For faster CI and fewer irrelevant runs, trigger frontend CI on:

- changes under `frontend/**`
- changes in `.github/workflows/frontend-ci.yml`

Also include `workflow_dispatch` for manual runs.

### 5) Minimal quality gate you should enforce now

At the current project maturity, enforce this baseline:

1. Checkout repo
2. Setup Node (LTS)
3. Use npm cache
4. `npm ci` inside `frontend`
5. `npm test` inside `frontend` — unit tests
6. `npm run build` inside `frontend` — production build

This gives you deterministic installs (lockfile-respecting) + unit test validation + guaranteed production buildability.

### 6) Artifacts and deployment readiness

- Frontend build output is `frontend/dist/`.
- You may upload `dist/` as a CI artifact if you want later deploy/release jobs.

Artifact upload is optional for validation-only CI, but useful if another workflow consumes the built assets.

### 7) Common pitfalls in this repo

- Don’t use `npm install` in CI when `package-lock.json` exists; prefer `npm ci`.
- Don’t require backend startup in the base frontend CI job (unless intentionally doing integration checks).
- Keep CI path filters tight, otherwise backend-only changes will trigger frontend CI unnecessarily.

### 8) Suggested evolution after baseline CI is live

Once baseline build CI is stable, improve signal gradually:

1. Add `lint` script and gate with `npm run lint`
2. Add unit/component tests and gate with `npm test`
3. Add optional integration job that boots backend + frontend for API/UI checks

---

## Local command parity with CI

Use this to reproduce CI behavior locally:

```bash
cd frontend
npm ci
npm test
npm run build
```

If this passes locally, CI should pass too (assuming same Node major version).
