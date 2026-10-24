import { VideoTrack } from '../types';

/**
 * Configure MediaSession API to keep continuous background playback working
 * even when the tab is minimized, switched, or phone screen is locked.
 */
export function setupMediaSession(
  track: VideoTrack,
  actions: {
    onPlay: () => void;
    onPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onSeek?: (time: number) => void;
  }
) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: `${track.channel} • YouTube Gold VIP`,
      album: 'YouTube Gold Premium (Ad-Free)',
      artwork: [
        { src: track.thumbnail, sizes: '96x96', type: 'image/jpeg' },
        { src: track.thumbnail, sizes: '128x128', type: 'image/jpeg' },
        { src: track.thumbnail, sizes: '192x192', type: 'image/jpeg' },
        { src: track.thumbnail, sizes: '512x512', type: 'image/jpeg' },
      ],
    });

    try {
      navigator.mediaSession.setActionHandler('play', actions.onPlay);
      navigator.mediaSession.setActionHandler('pause', actions.onPause);
      navigator.mediaSession.setActionHandler('previoustrack', actions.onPrev);
      navigator.mediaSession.setActionHandler('nexttrack', actions.onNext);
      if (actions.onSeek) {
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined) {
            actions.onSeek?.(details.seekTime);
          }
        });
      }
    } catch (e) {
      console.warn('MediaSession handler registration warning:', e);
    }
  }
}

export function updateMediaPlaybackState(isPlaying: boolean) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }
}
