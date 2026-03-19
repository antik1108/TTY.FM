import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Sidebar from '../../src/components/Sidebar';
import MainContent from '../../src/components/MainContent';
import { Playlist, Song, ViewMode } from '../../src/types';

describe('Navigation Flow (Integration)', () => {
  const mockPlaylists: Playlist[] = [
    { id: 'synthwave', name: 'Synthwave', songCount: 5, icon: 'folder' },
    { id: 'chillhop', name: 'Chillhop', songCount: 8, icon: 'folder' },
  ];

  const mockLibrarySongs: Song[] = [
    {
      id: '1',
      hexId: '0xABCD',
      title: 'Library Song 1',
      artist: 'Artist A',
      duration: '03:45',
      durationSeconds: 225,
      size: '3.5 MB',
      genre: 'SYNTH',
    },
    {
      id: '2',
      hexId: '0xEF01',
      title: 'Library Song 2',
      artist: 'Artist B',
      duration: '04:20',
      durationSeconds: 260,
      size: '4.2 MB',
      genre: 'AMBIENT',
    },
  ];

  const mockPlaylistSongs: Song[] = [
    {
      id: '3',
      hexId: '0x1234',
      title: 'Synthwave Track',
      artist: 'Neon Artist',
      duration: '03:30',
      durationSeconds: 210,
      size: '3.2 MB',
      genre: 'SYNTH',
      playlist: 'Synthwave',
    },
  ];

  it('navigates from library to playlist and back', () => {
    const onSelectLibrary = jest.fn();
    const onSelectPlaylist = jest.fn();
    const onSelectUpload = jest.fn();
    const onCreatePlaylist = jest.fn();
    const onRefreshLibrary = jest.fn();

    let viewMode = ViewMode.LIBRARY;
    let selectedPlaylistId: string | null = null;
    let currentSongs = mockLibrarySongs;
    let mainTitle = 'Core Process Library';

    const { rerender } = render(
      <>
        <Sidebar
          playlists={mockPlaylists}
          uncategorizedCount={2}
          viewMode={viewMode}
          selectedPlaylistId={selectedPlaylistId}
          onSelectLibrary={onSelectLibrary}
          onSelectUpload={onSelectUpload}
          onSelectPlaylist={onSelectPlaylist}
          onCreatePlaylist={onCreatePlaylist}
          onRefreshLibrary={onRefreshLibrary}
          isOpen={false}
          onClose={() => {}}
        />
        <MainContent
          songs={currentSongs}
          currentSong={null}
          title={mainTitle}
          onSelect={() => {}}
          isLoading={false}
          error={null}
        />
      </>
    );

    // Verify library view
    expect(screen.getByText('Core Process Library')).toBeInTheDocument();
    expect(screen.getByText('Library Song 1')).toBeInTheDocument();
    expect(screen.getByText('Library Song 2')).toBeInTheDocument();

    // Click on Synthwave playlist
    const synthwaveButton = screen.getByText('Synthwave');
    fireEvent.click(synthwaveButton);

    expect(onSelectPlaylist).toHaveBeenCalledWith(mockPlaylists[0]);

    // Update state as if playlist was selected
    viewMode = ViewMode.PLAYLIST;
    selectedPlaylistId = 'synthwave';
    currentSongs = mockPlaylistSongs;
    mainTitle = 'Playlist: Synthwave';

    rerender(
      <>
        <Sidebar
          playlists={mockPlaylists}
          uncategorizedCount={2}
          viewMode={viewMode}
          selectedPlaylistId={selectedPlaylistId}
          onSelectLibrary={onSelectLibrary}
          onSelectUpload={onSelectUpload}
          onSelectPlaylist={onSelectPlaylist}
          onCreatePlaylist={onCreatePlaylist}
          onRefreshLibrary={onRefreshLibrary}
          isOpen={false}
          onClose={() => {}}
        />
        <MainContent
          songs={currentSongs}
          currentSong={null}
          title={mainTitle}
          onSelect={() => {}}
          isLoading={false}
          error={null}
        />
      </>
    );

    // Verify playlist view
    expect(screen.getByText('Playlist: Synthwave')).toBeInTheDocument();
    expect(screen.getByText('Synthwave Track')).toBeInTheDocument();
    expect(screen.queryByText('Library Song 1')).not.toBeInTheDocument();

    // Navigate back to library
    const libraryButton = screen.getByText('Library_Root');
    fireEvent.click(libraryButton);

    expect(onSelectLibrary).toHaveBeenCalledTimes(1);
  });

  it('creates new playlist and refreshes library', () => {
    const onCreatePlaylist = jest.fn();
    const onRefreshLibrary = jest.fn();

    // Mock window.prompt
    global.prompt = jest.fn(() => 'NewPlaylist');

    render(
      <Sidebar
        playlists={mockPlaylists}
        uncategorizedCount={2}
        viewMode={ViewMode.LIBRARY}
        selectedPlaylistId={null}
        onSelectLibrary={() => {}}
        onSelectUpload={() => {}}
        onSelectPlaylist={() => {}}
        onCreatePlaylist={onCreatePlaylist}
        onRefreshLibrary={onRefreshLibrary}
        isOpen={false}
        onClose={() => {}}
      />
    );

    // Click new playlist button
    const newButton = screen.getByText('New');
    fireEvent.click(newButton);

    expect(global.prompt).toHaveBeenCalledWith(
      'Playlist name (A-Z, 0-9, underscore):'
    );
    expect(onCreatePlaylist).toHaveBeenCalledWith('NewPlaylist');

    // Click refresh button
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(onRefreshLibrary).toHaveBeenCalledTimes(1);
  });

  it('displays loading state when fetching songs', () => {
    render(
      <MainContent
        songs={[]}
        currentSong={null}
        title="Core Process Library"
        onSelect={() => {}}
        isLoading={true}
        error={null}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays error state when fetch fails', () => {
    render(
      <MainContent
        songs={[]}
        currentSong={null}
        title="Core Process Library"
        onSelect={() => {}}
        isLoading={false}
        error="FATAL: CONNECTION_REFUSED_TO_MAINFRAME"
      />
    );

    expect(
      screen.getByText('FATAL: CONNECTION_REFUSED_TO_MAINFRAME')
    ).toBeInTheDocument();
  });
});
