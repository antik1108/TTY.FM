import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Footer from '../../src/components/Footer';
import MainContent from '../../src/components/MainContent';
import { Song } from '../../src/types';

describe('Player Interaction (Integration)', () => {
  const mockSongs: Song[] = [
    {
      id: '1',
      hexId: '0xABCD',
      title: 'Cyberpunk Dreams',
      artist: 'Neon Rider',
      duration: '03:45',
      durationSeconds: 225,
      size: '3.5 MB',
      genre: 'SYNTH',
    },
    {
      id: '2',
      hexId: '0xEF01',
      title: 'Digital Rain',
      artist: 'Matrix Sound',
      duration: '04:20',
      durationSeconds: 260,
      size: '4.2 MB',
      genre: 'AMBIENT',
    },
  ];

  it('selects a song from list and controls playback', () => {
    const onSelect = jest.fn();
    const onTogglePlay = jest.fn();
    const onSeek = jest.fn();
    const setVolume = jest.fn();

    let currentSong: Song | null = null;
    let isPlaying = false;

    // Render the song list
    const { rerender } = render(
      <MainContent
        songs={mockSongs}
        currentSong={currentSong}
        title="Core Process Library"
        onSelect={onSelect}
        isLoading={false}
        error={null}
      />
    );

    // Select first song
    const firstSong = screen.getByText('Cyberpunk Dreams');
    fireEvent.click(firstSong);

    expect(onSelect).toHaveBeenCalledWith(mockSongs[0]);

    // Update state as if song was selected
    currentSong = mockSongs[0];
    isPlaying = true;

    // Render Footer with selected song
    rerender(
      <>
        <MainContent
          songs={mockSongs}
          currentSong={currentSong}
          title="Core Process Library"
          onSelect={onSelect}
          isLoading={false}
          error={null}
        />
        <Footer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          progress={45}
          timeLabel="01:41 / 03:45"
          onSeek={onSeek}
          volume={80}
          setVolume={setVolume}
          onSongClick={() => {}}
        />
      </>
    );

    // Verify song is displayed in footer
    expect(screen.getByText('Cyberpunk Dreams')).toBeInTheDocument();
    expect(screen.getByText('01:41 / 03:45')).toBeInTheDocument();

    // Toggle playback
    const playButton = screen.getByRole('button', { name: /pause/i });
    fireEvent.click(playButton);

    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });

  it('changes volume and verifies visual feedback', () => {
    const setVolume = jest.fn();

    render(
      <Footer
        currentSong={mockSongs[0]}
        isPlaying={true}
        onTogglePlay={() => {}}
        progress={50}
        timeLabel="01:41 / 03:45"
        onSeek={() => {}}
        volume={80}
        setVolume={setVolume}
        onSongClick={() => {}}
      />
    );

    // Find volume slider (hidden input)
    const volumeSlider = screen.getByRole('slider');
    fireEvent.change(volumeSlider, { target: { value: '50' } });

    expect(setVolume).toHaveBeenCalledWith(50);
  });

  it('seeks to different position in track', () => {
    const onSeek = jest.fn();

    render(
      <Footer
        currentSong={mockSongs[0]}
        isPlaying={true}
        onTogglePlay={() => {}}
        progress={25}
        timeLabel="00:56 / 03:45"
        onSeek={onSeek}
        volume={80}
        setVolume={() => {}}
        onSongClick={() => {}}
      />
    );

    // Find progress bar (clickable div with group class)
    const progressBar = document.querySelector('.cursor-pointer.group');
    expect(progressBar).toBeInTheDocument();

    if (progressBar) {
      // Mock getBoundingClientRect
      progressBar.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 100,
        top: 0,
        right: 100,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      // Click at 75% position
      fireEvent.click(progressBar, { clientX: 75 });

      expect(onSeek).toHaveBeenCalledWith(75);
    }
  });
});
