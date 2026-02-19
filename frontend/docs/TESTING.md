# Frontend Testing Guide

## Quick Start

```bash
cd frontend
npm install          # Install dependencies (first time)
npm test             # Run tests once
npm run test:watch   # Watch mode for development
npm run test:coverage # Generate coverage report
```

## What's Installed

- **Jest 29** — Test framework
- **React Testing Library 16** — Component testing utilities
- **@testing-library/jest-dom** — Custom matchers (toBeInTheDocument, etc.)
- **ts-jest** — TypeScript support for Jest

## Project Structure

```
frontend/
├── jest.config.cjs           # Jest configuration
├── setupTests.ts             # Global test setup (imports jest-dom)
├── tsconfig.test.json        # TypeScript config for tests
└── components/
    ├── Header.tsx
    └── Header.test.tsx       # Example test file
```

## Writing Tests

### Basic Component Test

```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Async Behavior

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import DataComponent from './DataComponent';

describe('DataComponent', () => {
  it('loads and displays data', async () => {
    render(<DataComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Loaded!')).toBeInTheDocument();
    });
  });
});
```

## Common Matchers

```tsx
// Basic matchers
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent('text');
expect(element).toHaveClass('className');

// Form matchers
expect(input).toHaveValue('value');
expect(checkbox).toBeChecked();

// Mock matchers
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(1);
```

## Querying Elements

```tsx
// By text
screen.getByText('Hello');
screen.queryByText('Maybe'); // Returns null if not found

// By role (preferred for accessibility)
screen.getByRole('button');
screen.getByRole('textbox', { name: /username/i });

// By test ID (use sparingly)
screen.getByTestId('custom-element');

// Multiple elements
screen.getAllByRole('listitem');
```

## Mocking API Calls

```tsx
// Mock the service
jest.mock('@/services/LibraryService', () => ({
  LibraryService: {
    getSongs: jest.fn(() => Promise.resolve([
      { id: '1', title: 'Song 1', artist: 'Artist 1' }
    ]))
  }
}));

// In your test
import { LibraryService } from '@/services/LibraryService';

it('fetches and displays songs', async () => {
  render(<SongList />);
  
  await waitFor(() => {
    expect(screen.getByText('Song 1')).toBeInTheDocument();
  });
  
  expect(LibraryService.getSongs).toHaveBeenCalled();
});
```

## Coverage

Generate a coverage report:

```bash
npm run test:coverage
```

Coverage report will be in `coverage/` directory. Open `coverage/lcov-report/index.html` in a browser to see detailed results.

## Debugging Tests

### Run a single test file

```bash
npm test Header.test.tsx
```

### Run tests matching a pattern

```bash
npm test -- --testNamePattern="renders correctly"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Current File",
  "program": "${workspaceFolder}/frontend/node_modules/.bin/jest",
  "args": [
    "${fileBasename}",
    "--config",
    "${workspaceFolder}/frontend/jest.config.cjs",
    "--runInBand"
  ],
  "cwd": "${workspaceFolder}/frontend",
  "console": "integratedTerminal"
}
```

## CI Integration

Tests run automatically in CI on every push/PR. See `.github/workflows/frontend-ci.yml`.

To match CI behavior locally:

```bash
cd frontend
npm ci        # Clean install from lockfile
npm test      # Run tests
npm run build # Verify build still works
```

## Best Practices

1. **Test user behavior, not implementation**
   - Use `getByRole` over `getByTestId`
   - Test what users see/do, not internal state

2. **Keep tests focused**
   - One assertion per test when possible
   - Clear test names describing behavior

3. **Mock external dependencies**
   - API calls, localStorage, window methods
   - Keep unit tests isolated

4. **Don't test library code**
   - Trust React, Vite, and third-party libs
   - Focus on your application logic

5. **Run tests often**
   - Use watch mode during development
   - Fix failing tests immediately

## Troubleshooting

### "Cannot find module" errors

Make sure your `jest.config.cjs` `moduleNameMapper` includes your path aliases:

```js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1'
}
```

### CSS/asset import errors

These are already mocked via `identity-obj-proxy` in the config.

### ESM/TypeScript errors

Check that `ts-jest` is configured with ESM support in `jest.config.cjs`.

## Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
