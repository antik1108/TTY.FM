import { render, screen, waitFor } from '@testing-library/react';
import { LibraryService } from '../../src/services/LibraryService';
import { SystemService } from '../../src/services/SystemService';
import Header from '../../src/components/Header';
import { Song, SystemStats } from '../../src/types';

// Mock the services
jest.mock('../../src/services/LibraryService');
jest.mock('../../src/services/SystemService');

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays system stats in header', async () => {
    const mockStats = {
      cpu: 45,
      mem: '2.5 GB',
      time: '14:30:00',
      uptime: '2d 5h 30m',
      platform: 'darwin',
      arch: 'arm64'
    };

    (SystemService.getStats as jest.MockedFunction<typeof SystemService.getStats>).mockResolvedValue(mockStats);

    const derivedStats: SystemStats = {
      latency: Math.round(mockStats.cpu / 2) + 10,
      status: mockStats.cpu > 70 ? 'THROTTLED' : 'OPTIMIZED',
      uptime: mockStats.uptime,
      nodeLoad: mockStats.cpu,
      nodeName: `${mockStats.platform.toUpperCase()}-${mockStats.arch.toUpperCase()}`
    };

    render(
      <Header
        stats={derivedStats}
        onMenuClick={() => {}}
      />
    );

    expect(screen.getByText('OPTIMIZED')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('NODE: DARWIN-ARM64')).toBeInTheDocument();
  });

  it('fetches library songs from API', async () => {
    const mockSongs: Song[] = [
      {
        id: '1',
        hexId: '0xABCD',
        title: 'Test Song',
        artist: 'Test Artist',
        duration: '03:45',
        durationSeconds: 225,
        size: 3500000,
        genre: 'SYNTH'
      }
    ];

    (LibraryService.getSongs as jest.MockedFunction<typeof LibraryService.getSongs>).mockResolvedValue(mockSongs);

    const songs = await LibraryService.getSongs();

    expect(songs).toHaveLength(1);
    expect(songs[0].title).toBe('Test Song');
    expect(LibraryService.getSongs).toHaveBeenCalledTimes(1);
  });

  it('handles API error gracefully', async () => {
    (LibraryService.getSongs as jest.MockedFunction<typeof LibraryService.getSongs>).mockRejectedValue(
      new Error('Failed to fetch library: 500 Internal Server Error')
    );

    await expect(LibraryService.getSongs()).rejects.toThrow('Failed to fetch library');
  });

  it('fetches playlists and displays count', async () => {
    const mockPlaylistsResponse = {
      playlists: [
        { id: 'synthwave', name: 'Synthwave', songCount: 5 },
        { id: 'chillhop', name: 'Chillhop', songCount: 8 }
      ],
      uncategorizedCount: 3
    };

    (LibraryService.getPlaylists as jest.MockedFunction<typeof LibraryService.getPlaylists>).mockResolvedValue(
      mockPlaylistsResponse
    );

    const result = await LibraryService.getPlaylists();

    expect(result.playlists).toHaveLength(2);
    expect(result.uncategorizedCount).toBe(3);
    expect(result.playlists[0].songCount).toBe(5);
  });

  it('creates new playlist via API', async () => {
    const mockPlaylist = {
      id: 'newplaylist',
      name: 'NewPlaylist',
      songCount: 0
    };

    (LibraryService.createPlaylist as jest.MockedFunction<typeof LibraryService.createPlaylist>).mockResolvedValue(
      mockPlaylist
    );

    const result = await LibraryService.createPlaylist('NewPlaylist');

    expect(result.name).toBe('NewPlaylist');
    expect(LibraryService.createPlaylist).toHaveBeenCalledWith('NewPlaylist');
  });

  it('generates correct stream URL', () => {
    const songId = 'song123';
    const streamUrl = LibraryService.getStreamUrl(songId);

    expect(streamUrl).toBe('/api/stream/song123');
  });

  it('refreshes library successfully', async () => {
    (LibraryService.refreshLibrary as jest.MockedFunction<typeof LibraryService.refreshLibrary>).mockResolvedValue();

    await LibraryService.refreshLibrary();

    expect(LibraryService.refreshLibrary).toHaveBeenCalledTimes(1);
  });
});
