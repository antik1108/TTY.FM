# Integration Testing - Complete Setup ✅

## What Was Added

### 1. Integration Test Files

Created three comprehensive integration test suites:

#### `__tests__/integration/PlayerInteraction.integration.test.tsx`
Tests player controls and song selection workflow:
- Selecting a song from list and starting playback
- Volume control interaction
- Seeking to different positions in track
- Verifies Footer and MainContent work together

#### `__tests__/integration/NavigationFlow.integration.test.tsx`
Tests navigation between different views:
- Navigating from library to playlist and back
- Creating new playlists
- Refreshing library
- Loading and error states
- Verifies Sidebar and MainContent coordination

#### `__tests__/integration/ApiIntegration.integration.test.tsx`
Tests API service layer integration:
- Fetching and displaying system stats
- Fetching library songs from API
- Handling API errors gracefully
- Fetching and displaying playlists
- Creating new playlists via API
- Stream URL generation
- Library refresh functionality

### 2. Mock Data

Created `__tests__/mocks/mockData.ts` with reusable test data:
- `mockSongs` - Sample song data
- `mockPlaylists` - Sample playlist data
- `mockPlaylistSongs` - Songs with playlist association
- `mockSystemStats` - System statistics
- `mockPlaylistsResponse` - Complete API response structure

### 3. npm Scripts

Added specialized test commands:

```bash
npm run test:unit         # Run only unit tests (*.test.tsx)
npm run test:integration  # Run only integration tests (*.integration.test.tsx)
```

Existing commands still work:
```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### 4. Documentation

Created `docs/INTEGRATION_TESTING.md` covering:
- What integration testing is and when to use it
- Differences between unit and integration tests
- How to run integration tests
- Complete examples and patterns
- Best practices
- Common testing scenarios
- Debugging techniques
- Testing checklist

Updated existing docs:
- `README.md` - Added integration testing section
- `docs/JEST_SETUP.md` - Added integration test info

## Test Structure

```
frontend/
├── __tests__/
│   ├── integration/
│   │   ├── PlayerInteraction.integration.test.tsx    # Player controls
│   │   ├── NavigationFlow.integration.test.tsx       # Navigation
│   │   └── ApiIntegration.integration.test.tsx       # API calls
│   └── mocks/
│       └── mockData.ts                               # Reusable mock data
├── components/
│   ├── Header.tsx
│   ├── Header.test.tsx                               # Unit test
│   ├── Footer.tsx
│   └── ...
└── docs/
    ├── TESTING.md                                    # Unit testing guide
    ├── INTEGRATION_TESTING.md                        # Integration guide
    └── JEST_SETUP.md                                 # Setup summary
```

## How to Run

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run only integration tests
npm run test:integration

# Run only unit tests
npm run test:unit

# Watch mode for development
npm run test:watch

# With coverage
npm run test:coverage
```

## What Integration Tests Cover

### Player Interaction Tests
✅ Select song from list → verify playback starts  
✅ Control playback (play/pause)  
✅ Adjust volume with slider  
✅ Seek to different positions in track  
✅ Verify song info displays in footer  

### Navigation Flow Tests
✅ Navigate from library to playlist  
✅ Navigate back to library  
✅ Select uncategorized songs  
✅ Create new playlist via sidebar  
✅ Refresh library  
✅ Display loading state  
✅ Display error state  

### API Integration Tests
✅ Fetch system stats from API  
✅ Display stats in header  
✅ Fetch library songs  
✅ Handle API errors  
✅ Fetch playlists  
✅ Create playlist via API  
✅ Generate stream URLs  
✅ Refresh library via API  

## Example Integration Test

```tsx
it('selects a song and controls playback', () => {
  const onSelect = jest.fn();
  const onTogglePlay = jest.fn();
  
  let currentSong = null;
  let isPlaying = false;

  const { rerender } = render(
    <MainContent
      songs={mockSongs}
      currentSong={currentSong}
      onSelect={onSelect}
    />
  );

  // Select first song
  fireEvent.click(screen.getByText('Cyberpunk Dreams'));
  expect(onSelect).toHaveBeenCalled();

  // Update state
  currentSong = mockSongs[0];
  isPlaying = true;

  // Rerender with Footer
  rerender(
    <>
      <MainContent songs={mockSongs} currentSong={currentSong} onSelect={onSelect} />
      <Footer currentSong={currentSong} isPlaying={isPlaying} onTogglePlay={onTogglePlay} />
    </>
  );

  // Verify song in footer
  expect(screen.getByText('Cyberpunk Dreams')).toBeInTheDocument();
  
  // Control playback
  fireEvent.click(screen.getByRole('button', { name: /pause/i }));
  expect(onTogglePlay).toHaveBeenCalled();
});
```

## Key Differences: Unit vs Integration Tests

| Aspect | Unit Test | Integration Test |
|--------|-----------|------------------|
| **File naming** | `Component.test.tsx` | `Feature.integration.test.tsx` |
| **Location** | Next to component | `__tests__/integration/` |
| **Scope** | Single component | Multiple components |
| **Dependencies** | All mocked | Some real, some mocked |
| **Speed** | Fast | Slower |
| **Run command** | `npm run test:unit` | `npm run test:integration` |

## Best Practices

### 1. Test User Workflows
Integration tests should test complete user journeys, not individual component logic.

✅ Good: "User selects playlist, then plays a song"  
❌ Bad: "Button renders with correct className"  

### 2. Use Realistic Mock Data
Import from `__tests__/mocks/mockData.ts` for consistency:

```tsx
import { mockSongs, mockPlaylists } from '../mocks/mockData';
```

### 3. Mock External Dependencies
Always mock API calls:

```tsx
jest.mock('../../services/LibraryService');
```

### 4. Test Error States
Don't just test happy paths:

```tsx
it('displays error when API fails', () => {
  (LibraryService.getSongs as jest.Mock).mockRejectedValue(
    new Error('Failed to fetch')
  );
  // Test error handling...
});
```

### 5. Clean Up Between Tests
```tsx
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Next Steps

### More Integration Tests to Add

1. **Upload Workflow**
   - Select upload panel
   - Upload file
   - Verify file added to library

2. **Playlist Management**
   - Create playlist
   - Rename playlist
   - Add songs to playlist
   - Delete playlist

3. **Full User Journey**
   - Open app → select playlist → play song → control volume → seek → pause

4. **Mobile Navigation**
   - Sidebar open/close behavior
   - Mobile view switching

5. **System Monitoring**
   - Stats update over time
   - Log messages display correctly

## Debugging Tips

### Print Current DOM
```tsx
import { screen } from '@testing-library/react';
screen.debug(); // Print entire DOM
```

### Wait for Async Operations
```tsx
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Find Elements
```tsx
// Try different queries:
screen.getByRole('button', { name: /play/i });
screen.getByText('Song Title');
screen.getByLabelText('Volume');
```

## CI Integration

Integration tests run automatically in CI alongside unit tests:

```yaml
# .github/workflows/frontend-ci.yml
- name: Run unit tests
  run: npm test
```

All tests (unit + integration) must pass for CI to succeed.

## Resources

- [docs/INTEGRATION_TESTING.md](../docs/INTEGRATION_TESTING.md) - Complete guide
- [docs/TESTING.md](../docs/TESTING.md) - Unit testing guide
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

---

**Setup completed:** 2026-02-19  
**Status:** ✅ Ready to use  
**Total integration tests:** 3 test suites, ~10 tests
