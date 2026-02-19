# Integration Testing Guide

## What is Integration Testing?

Integration tests verify that multiple components work together correctly. Unlike unit tests that test individual components in isolation, integration tests check:

- **Component interactions** - How components communicate and pass data
- **User workflows** - Complete user journeys across multiple components  
- **API integration** - How frontend interacts with backend services
- **State management** - How state flows between components
- **Side effects** - Real-world behavior like API calls, navigation, etc.

## Integration vs Unit Tests

| Aspect | Unit Tests | Integration Tests |
|--------|-----------|------------------|
| **Scope** | Single component | Multiple components |
| **Dependencies** | All mocked | Some real, some mocked |
| **Speed** | Very fast | Slower |
| **Purpose** | Verify component logic | Verify components work together |
| **File Pattern** | `*.test.tsx` | `*.integration.test.tsx` |

## Project Structure

```
frontend/
├── __tests__/
│   └── integration/
│       ├── PlayerInteraction.integration.test.tsx
│       ├── NavigationFlow.integration.test.tsx
│       └── ApiIntegration.integration.test.tsx
└── components/
    ├── Header.tsx
    └── Header.test.tsx  (unit test)
```

## Running Tests

```bash
# Run all tests (unit + integration)
npm test

# Run only unit tests
npm test -- --testPathIgnorePatterns=integration

# Run only integration tests
npm test -- --testPathPattern=integration

# Run specific integration test
npm test PlayerInteraction.integration

# Watch mode for integration tests
npm run test:watch -- --testPathPattern=integration
```

## Integration Test Examples

### 1. Component Interaction Testing

Test how selecting a song in MainContent affects Footer playback controls:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import MainContent from '../../components/MainContent';
import Footer from '../../components/Footer';

it('selects song and controls playback', () => {
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

  // Select a song
  fireEvent.click(screen.getByText('Song Title'));
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

  // Verify footer displays song
  expect(screen.getByText('Song Title')).toBeInTheDocument();
  
  // Control playback
  fireEvent.click(screen.getByRole('button', { name: /pause/i }));
  expect(onTogglePlay).toHaveBeenCalled();
});
```

### 2. Navigation Flow Testing

Test full navigation workflow from library → playlist → back:

```tsx
it('navigates between library and playlist', () => {
  const onSelectLibrary = jest.fn();
  const onSelectPlaylist = jest.fn();

  let viewMode = ViewMode.LIBRARY;
  let songs = librarySongs;

  const { rerender } = render(
    <>
      <Sidebar
        viewMode={viewMode}
        onSelectLibrary={onSelectLibrary}
        onSelectPlaylist={onSelectPlaylist}
      />
      <MainContent songs={songs} title="Library" />
    </>
  );

  // Click playlist in sidebar
  fireEvent.click(screen.getByText('Synthwave'));
  expect(onSelectPlaylist).toHaveBeenCalled();

  // Update state
  viewMode = ViewMode.PLAYLIST;
  songs = playlistSongs;

  rerender(
    <>
      <Sidebar viewMode={viewMode} onSelectLibrary={onSelectLibrary} onSelectPlaylist={onSelectPlaylist} />
      <MainContent songs={songs} title="Playlist: Synthwave" />
    </>
  );

  expect(screen.getByText('Playlist: Synthwave')).toBeInTheDocument();
});
```

### 3. API Integration Testing

Test service layer with mocked responses:

```tsx
import { LibraryService } from '../../services/LibraryService';

jest.mock('../../services/LibraryService');

it('fetches library from API', async () => {
  const mockSongs = [{ id: '1', title: 'Test Song' }];
  
  (LibraryService.getSongs as jest.Mock).mockResolvedValue(mockSongs);

  const songs = await LibraryService.getSongs();

  expect(songs).toHaveLength(1);
  expect(LibraryService.getSongs).toHaveBeenCalledTimes(1);
});
```

### 4. Stateful Workflow Testing

Test complete user journey with state updates:

```tsx
it('complete playback workflow', () => {
  const { rerender } = render(<App />);

  // 1. Select playlist
  fireEvent.click(screen.getByText('Synthwave'));
  
  // 2. Select song
  fireEvent.click(screen.getByText('Neon Dreams'));
  
  // 3. Verify playback started
  expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  
  // 4. Adjust volume
  const volumeSlider = screen.getByRole('slider');
  fireEvent.change(volumeSlider, { target: { value: '50' } });
  
  // 5. Verify new volume applied
  expect(volumeSlider).toHaveValue('50');
});
```

## Best Practices

### 1. Test User Journeys, Not Implementation

✅ **Good:** Test what users do
```tsx
it('plays song after selecting from playlist', () => {
  fireEvent.click(screen.getByText('Song Title'));
  expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
});
```

❌ **Bad:** Test internal state
```tsx
it('sets isPlaying to true', () => {
  expect(component.state.isPlaying).toBe(true); // Don't access internal state
});
```

### 2. Mock External Dependencies

Always mock:
- API calls (`LibraryService`, `SystemService`)
- Browser APIs (`window.prompt`, `localStorage`)
- Heavy computations
- Third-party services

```tsx
jest.mock('../../services/LibraryService', () => ({
  LibraryService: {
    getSongs: jest.fn(() => Promise.resolve([]))
  }
}));
```

### 3. Use Realistic Data

Create reusable mock data that matches real API responses:

```tsx
// __tests__/mocks/mockData.ts
export const mockSongs: Song[] = [
  {
    id: '1',
    hexId: '0xABCD',
    title: 'Cyberpunk Dreams',
    artist: 'Neon Rider',
    duration: '03:45',
    durationSeconds: 225,
    size: '3.5 MB',
    genre: 'SYNTH'
  }
];
```

### 4. Test Error States

Don't just test happy paths:

```tsx
it('displays error when API fails', async () => {
  (LibraryService.getSongs as jest.Mock).mockRejectedValue(
    new Error('Failed to fetch')
  );

  render(<MainContent />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### 5. Clean Up Between Tests

```tsx
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});
```

## Common Patterns

### Pattern 1: Component Communication

Test parent → child props flow:

```tsx
it('passes selected song to footer', () => {
  const song = mockSongs[0];
  
  render(
    <div>
      <MainContent currentSong={song} />
      <Footer currentSong={song} />
    </div>
  );

  const songTitles = screen.getAllByText(song.title);
  expect(songTitles.length).toBeGreaterThan(1); // Appears in both components
});
```

### Pattern 2: State Updates Across Components

Use `rerender` to simulate state changes:

```tsx
const { rerender } = render(<Component value={0} />);

// Trigger state change
fireEvent.click(screen.getByText('Increment'));

// Rerender with new state
rerender(<Component value={1} />);

expect(screen.getByText('1')).toBeInTheDocument();
```

### Pattern 3: Async Workflows

Use `waitFor` for async operations:

```tsx
it('loads data and displays it', async () => {
  render(<Component />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Data Loaded')).toBeInTheDocument();
  });
});
```

### Pattern 4: User Event Sequences

Test multi-step interactions:

```tsx
it('completes multi-step workflow', () => {
  render(<App />);

  // Step 1
  fireEvent.click(screen.getByText('Open Playlist'));
  
  // Step 2
  fireEvent.click(screen.getByText('Select Song'));
  
  // Step 3
  fireEvent.click(screen.getByText('Play'));
  
  // Verify final state
  expect(screen.getByText('Now Playing')).toBeInTheDocument();
});
```

## Debugging Integration Tests

### 1. Print Current DOM

```tsx
import { screen } from '@testing-library/react';

screen.debug(); // Print entire DOM
screen.debug(screen.getByRole('button')); // Print specific element
```

### 2. Find Elements

```tsx
// When test fails to find element:
screen.logTestingPlaygroundURL(); // Get interactive debugging URL
```

### 3. Wait for Elements

```tsx
// If element appears asynchronously:
const element = await screen.findByText('Async Content');

// Or use waitFor:
await waitFor(() => {
  expect(screen.getByText('Async Content')).toBeInTheDocument();
});
```

### 4. Query Debugging

```tsx
// Element not found? Try different queries:
screen.getByRole('button', { name: /play/i });
screen.getByLabelText('Volume');
screen.getByText('Song Title');
screen.getByTestId('player-controls');
```

## Testing Checklist

For each integration test, verify:

- [ ] Multiple components rendered together
- [ ] User interactions trigger expected behavior
- [ ] State changes propagate correctly
- [ ] Error states handled gracefully
- [ ] Loading states display properly
- [ ] API calls mocked appropriately
- [ ] Cleanup happens between tests

## Example: Complete Integration Test

```tsx
describe('Music Player Workflow (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (LibraryService.getSongs as jest.Mock).mockResolvedValue(mockSongs);
  });

  it('completes full playback workflow', async () => {
    const { rerender } = render(
      <>
        <Sidebar playlists={mockPlaylists} onSelectPlaylist={onSelectPlaylist} />
        <MainContent songs={[]} onSelect={onSelect} />
        <Footer currentSong={null} />
      </>
    );

    // 1. Navigate to playlist
    fireEvent.click(screen.getByText('Synthwave'));
    expect(onSelectPlaylist).toHaveBeenCalled();

    // 2. Update with playlist songs
    rerender(
      <>
        <Sidebar playlists={mockPlaylists} selectedPlaylistId="synthwave" />
        <MainContent songs={mockPlaylistSongs} onSelect={onSelect} />
        <Footer currentSong={null} />
      </>
    );

    // 3. Select a song
    fireEvent.click(screen.getByText('Neon Dreams'));
    expect(onSelect).toHaveBeenCalledWith(mockPlaylistSongs[0]);

    // 4. Update with playing song
    rerender(
      <>
        <Sidebar playlists={mockPlaylists} selectedPlaylistId="synthwave" />
        <MainContent songs={mockPlaylistSongs} currentSong={mockPlaylistSongs[0]} />
        <Footer currentSong={mockPlaylistSongs[0]} isPlaying={true} onTogglePlay={onTogglePlay} />
      </>
    );

    // 5. Verify playback state
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(screen.getByText('Neon Dreams')).toBeInTheDocument();

    // 6. Control playback
    fireEvent.click(screen.getByRole('button', { name: /pause/i }));
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });
});
```

## Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Effective Integration Testing](https://kentcdodds.com/blog/write-tests)

## Next Steps

1. ✅ Write unit tests for individual components
2. ✅ Write integration tests for component interactions
3. ⏭️ Add E2E tests with Playwright/Cypress (full browser automation)
4. ⏭️ Add visual regression tests (screenshot comparisons)
