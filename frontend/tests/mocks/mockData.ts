// Mock data for integration tests
import { Song, Playlist, SystemStats, PlaylistsResponse } from '@/types';

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
  },
  {
    id: '2',
    hexId: '0xEF01',
    title: 'Digital Rain',
    artist: 'Matrix Sound',
    duration: '04:20',
    durationSeconds: 260,
    size: '4.2 MB',
    genre: 'AMBIENT'
  },
  {
    id: '3',
    hexId: '0x1234',
    title: 'Neon Nights',
    artist: 'Synth Wave',
    duration: '03:30',
    durationSeconds: 210,
    size: '3.2 MB',
    genre: 'SYNTH'
  }
];

export const mockPlaylists: Playlist[] = [
  {
    id: 'synthwave',
    name: 'Synthwave',
    songCount: 5,
    icon: 'folder'
  },
  {
    id: 'chillhop',
    name: 'Chillhop',
    songCount: 8,
    icon: 'folder'
  },
  {
    id: 'ambient',
    name: 'Ambient',
    songCount: 3,
    icon: 'folder'
  }
];

export const mockPlaylistSongs: Song[] = [
  {
    id: '10',
    hexId: '0x5678',
    title: 'Synthwave Track 1',
    artist: 'Retro Artist',
    duration: '03:30',
    durationSeconds: 210,
    size: '3.2 MB',
    genre: 'SYNTH',
    playlist: 'Synthwave'
  },
  {
    id: '11',
    hexId: '0x9ABC',
    title: 'Synthwave Track 2',
    artist: 'Neon Producer',
    duration: '04:15',
    durationSeconds: 255,
    size: '3.8 MB',
    genre: 'SYNTH',
    playlist: 'Synthwave'
  }
];

export const mockPlaylistsResponse: PlaylistsResponse = {
  playlists: mockPlaylists,
  uncategorizedCount: 3
};

export const mockSystemStats: SystemStats = {
  latency: 12,
  status: 'OPTIMIZED',
  uptime: '2d 5h 30m',
  nodeLoad: 45,
  nodeName: 'DARWIN-ARM64'
};

export const mockRawSystemStats = {
  cpu: 45,
  mem: '2.5 GB',
  time: '14:30:00',
  uptime: '2d 5h 30m',
  platform: 'darwin',
  arch: 'arm64'
};
