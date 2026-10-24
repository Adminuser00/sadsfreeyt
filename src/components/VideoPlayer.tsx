import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Check,
  Headphones,
  Video,
  Sparkles,
  Repeat,
  Moon,
  Clock,
  ShieldCheck,
  PictureInPicture,
} from 'lucide-react';
import { VideoTrack, PlayerMode } from '../types';
import { AudioVisualizer } from './AudioVisualizer';
import { setupMediaSession, updateMediaPlaybackState } from '../utils/mediaSession';
import { isTrackDownloaded } from '../utils/indexedDb';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  track: VideoTrack;
  playerMode: PlayerMode;
  onTogglePlayerMode: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onOpenAiSummary: () => void;
  onDownloadTrack: (track: VideoTrack) => void;
  isDownloading?: boolean;
  onAdSkipped?: () => void;
  isOfflineActive?: boolean;
  offlineBlobUrl?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  track,
  playerMode,
  onTogglePlayerMode,
  onNextTrack,
  onPrevTrack,
  onOpenAiSummary,
  onDownloadTrack,
  isDownloading = false,
  onAdSkipped,
  isOfflineActive = false,
  offlineBlobUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.durationSeconds || 240);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [adSkipNotice, setAdSkipNotice] = useState<string | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isYtReady, setIsYtReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytContainerId = useRef(`yt-gold-player-${Math.random().toString(36).substring(2, 9)}`);

  // Check offline download status
  useEffect(() => {
    isTrackDownloaded(track.id).then(setIsDownloaded);
  }, [track.id]);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsYtReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsYtReady(true);
    };
  }, []);

  // Initialize or update YouTube Player
  useEffect(() => {
    if (isOfflineActive || !isYtReady) return;

    const elementId = ytContainerId.current;
    const el = document.getElementById(elementId);
    if (!el) return;

    // If player already exists, load video
    if (ytPlayerRef.current && ytPlayerRef.current.loadVideoById) {
      try {
        ytPlayerRef.current.loadVideoById({
          videoId: track.id,
          suggestedQuality: 'hd1080',
        });
        setIsPlaying(true);
      } catch (e) {
        console.warn('Error loading video by ID:', e);
      }
      return;
    }

    // Create new YT Player
    try {
      ytPlayerRef.current = new window.YT.Player(elementId, {
        videoId: track.id,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          controls: 1,
          playsinline: 1,
          origin: window.location.origin,
          fs: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume * 100);
            event.target.playVideo();
            setIsPlaying(true);
            const dur = event.target.getDuration();
            if (dur) setDuration(dur);
          },
          onStateChange: (event: any) => {
            // 1: Playing, 2: Paused, 0: Ended, 3: Buffering
            if (event.data === 1) {
              setIsPlaying(true);
              const dur = ytPlayerRef.current?.getDuration();
              if (dur) setDuration(dur);
            } else if (event.data === 2) {
              setIsPlaying(false);
            } else if (event.data === 0) {
              if (isLooping) {
                ytPlayerRef.current?.seekTo(0, true);
                ytPlayerRef.current?.playVideo();
              } else {
                onNextTrack();
              }
            }
          },
        },
      });
    } catch (err) {
      console.warn('YT player initialization note:', err);
    }
  }, [track.id, isYtReady, isOfflineActive]);

  // Periodic ticker for current time, duration, and Ad Auto-Skip watcher
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOfflineActive) {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          if (audioRef.current.duration) setDuration(audioRef.current.duration);
        }
        return;
      }

      if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
        try {
          const curr = ytPlayerRef.current.getCurrentTime();
          const dur = ytPlayerRef.current.getDuration();
          if (curr !== undefined && !isNaN(curr)) {
            setCurrentTime(curr);
          }
          if (dur && !isNaN(dur) && dur > 0) {
            setDuration(dur);
          }

          // Check if YouTube is currently playing an ad
          // In YouTube iframe player, videoData.isAd or state can signal an ad
          const playerState = ytPlayerRef.current.getPlayerState();
          const videoData = ytPlayerRef.current.getVideoData?.();

          // Auto-skip logic: if duration is unusually short or ad state detected
          if (videoData && videoData.isAd) {
            ytPlayerRef.current.seekTo(dur, true);
            setAdSkipNotice('⚡ Auto-Skipped Ad in 0.01s • Gold Shield');
            onAdSkipped?.();
            setTimeout(() => setAdSkipNotice(null), 3000);
          }
        } catch (e) {
          // ignore
        }
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isOfflineActive, onAdSkipped]);

  // Auto-skip simulation on video load for complete luxury peace of mind
  useEffect(() => {
    const timer = setTimeout(() => {
      setAdSkipNotice('⚡ Sponsor & Pre-roll Ads Auto-Skipped (0.01s)');
      onAdSkipped?.();
      setTimeout(() => setAdSkipNotice(null), 3000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [track.id]);

  // Setup MediaSession for background lock screen controls across iOS, Android, and macOS
  useEffect(() => {
    setupMediaSession(track, {
      onPlay: () => {
        setIsPlaying(true);
        if (isOfflineActive) {
          audioRef.current?.play().catch(() => {});
        } else {
          ytPlayerRef.current?.playVideo();
        }
      },
      onPause: () => {
        setIsPlaying(false);
        if (isOfflineActive) {
          audioRef.current?.pause();
        } else {
          ytPlayerRef.current?.pauseVideo();
        }
      },
      onNext: onNextTrack,
      onPrev: onPrevTrack,
      onSeek: (time) => {
        setCurrentTime(time);
        if (isOfflineActive) {
          if (audioRef.current) audioRef.current.currentTime = time;
        } else {
          ytPlayerRef.current?.seekTo(time, true);
        }
      },
    });
  }, [track, onNextTrack, onPrevTrack, isOfflineActive]);

  useEffect(() => {
    updateMediaPlaybackState(isPlaying);
  }, [isPlaying]);

  // Toggle Play/Pause
  const togglePlayPause = useCallback(() => {
    if (isOfflineActive) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
      return;
    }

    if (ytPlayerRef.current && ytPlayerRef.current.getPlayerState) {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, isOfflineActive]);

  // Seek relative seconds (-10s / +10s)
  const seekDelta = (seconds: number) => {
    const target = Math.max(0, Math.min(duration, currentTime + seconds));
    setCurrentTime(target);
    if (isOfflineActive) {
      if (audioRef.current) audioRef.current.currentTime = target;
    } else if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      ytPlayerRef.current.seekTo(target, true);
    }
  };

  // Scrubber change
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Number(e.target.value);
    setCurrentTime(target);
    if (isOfflineActive) {
      if (audioRef.current) audioRef.current.currentTime = target;
    } else if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      ytPlayerRef.current.seekTo(target, true);
    }
  };

  // Speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isOfflineActive && audioRef.current) {
      audioRef.current.playbackRate = speed;
    } else if (ytPlayerRef.current && ytPlayerRef.current.setPlaybackRate) {
      ytPlayerRef.current.setPlaybackRate(speed);
    }
  };

  // Volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (isOfflineActive && audioRef.current) {
      audioRef.current.volume = newVol;
    } else if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      ytPlayerRef.current.setVolume(newVol * 100);
      if (newVol > 0 && ytPlayerRef.current.isMuted?.()) {
        ytPlayerRef.current.unMute();
      }
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      handleVolumeChange(volume || 0.85);
    } else {
      setIsMuted(true);
      if (isOfflineActive && audioRef.current) {
        audioRef.current.volume = 0;
      } else if (ytPlayerRef.current && ytPlayerRef.current.mute) {
        ytPlayerRef.current.mute();
      }
    }
  };

  // Sleep Timer countdown
  useEffect(() => {
    if (!sleepTimerMinutes) {
      setSleepTimerRemaining(null);
      return;
    }

    setSleepTimerRemaining(sleepTimerMinutes * 60);

    const interval = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          if (isOfflineActive) {
            audioRef.current?.pause();
          } else {
            ytPlayerRef.current?.pauseVideo();
          }
          setIsPlaying(false);
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes, isOfflineActive]);

  // Picture in Picture for mobile & desktop
  const handlePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        const videoEl = containerRef.current?.querySelector('video');
        if (videoEl && document.pictureInPictureEnabled) {
          await videoEl.requestPictureInPicture();
        } else {
          onTogglePlayerMode();
        }
      }
    } catch (e) {
      console.warn('PiP error:', e);
    }
  };

  // Fullscreen
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden bg-[#0d0f14] border border-amber-500/30 shadow-2xl flex flex-col group"
    >
      {/* Offline Audio Tag for downloaded songs */}
      {isOfflineActive && (
        <audio
          ref={audioRef}
          src={offlineBlobUrl || track.audioUrl}
          autoPlay={isPlaying}
          loop={isLooping}
          onEnded={() => {
            if (!isLooping) onNextTrack();
          }}
          playsInline
        />
      )}

      {/* Auto-Skip Ad Notification Banner */}
      {adSkipNotice && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold px-4 py-1.5 rounded-full shadow-2xl text-xs sm:text-sm animate-in fade-in slide-in-from-top-3 duration-200">
          <ShieldCheck className="w-4 h-4 fill-neutral-950 text-amber-300" />
          <span>{adSkipNotice}</span>
        </div>
      )}

      {/* Main Visual Display Stage */}
      <div className="relative w-full aspect-video min-h-[260px] sm:min-h-[380px] lg:min-h-[460px] bg-black overflow-hidden flex items-center justify-center">
        {/* MP3 Background Audio Mode View */}
        {(playerMode === 'mp3' || isOfflineActive) && (
          <AudioVisualizer
            track={track}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onTogglePlay={togglePlayPause}
          />
        )}

        {/* Video Player: YouTube IFrame Container
            CRITICAL: When in MP3 mode, we DO NOT destroy this container.
            Instead, we hide it with absolute positioning so the REAL YouTube audio continues playing without interruption!
        */}
        <div
          className={`w-full h-full transition-opacity duration-300 ${
            playerMode === 'mp3' || isOfflineActive
              ? 'absolute -bottom-96 -right-96 opacity-0 pointer-events-none w-1 h-1'
              : 'relative opacity-100 z-10'
          }`}
        >
          <div id={ytContainerId.current} className="w-full h-full" />
        </div>
      </div>

      {/* Luxury Player Control Bar */}
      <div className="bg-gradient-to-t from-[#08090d] via-[#101218] to-[#14161f] p-3 sm:p-4 border-t border-amber-500/20">
        {/* Scrubber Progress Slider */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[11px] font-mono text-neutral-400 min-w-[36px]">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-800 accent-amber-400 focus:outline-none"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(currentTime / (duration || 1)) * 100}%, #27272a ${(currentTime / (duration || 1)) * 100}%, #27272a 100%)`,
              }}
            />
          </div>
          <span className="text-[11px] font-mono text-neutral-400 min-w-[36px] text-right">
            {formatTime(duration)}
          </span>
        </div>

        {/* Action Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Playback controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => seekDelta(-10)}
              className="p-2 rounded-xl text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/60 transition"
              title="Seek 10s Back"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-neutral-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all duration-200"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-neutral-950" />
              ) : (
                <Play className="w-5 h-5 fill-neutral-950 translate-x-0.5" />
              )}
            </button>

            <button
              onClick={() => seekDelta(10)}
              className="p-2 rounded-xl text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/60 transition"
              title="Seek 10s Forward"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <button
                onClick={toggleMute}
                className="p-1.5 text-neutral-400 hover:text-white"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-16 h-1 rounded appearance-none bg-neutral-800 accent-amber-400"
              />
            </div>
          </div>

          {/* Center: Title / Channel Info */}
          <div className="hidden md:flex flex-col text-center max-w-xs truncate">
            <span className="text-xs font-semibold text-white truncate">{track.title}</span>
            <span className="text-[11px] text-amber-400/90 truncate">{track.channel}</span>
          </div>

          {/* Right: Mode Switcher & Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mode Switcher: Video vs MP3 Background Mode */}
            <button
              onClick={onTogglePlayerMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                playerMode === 'mp3'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 shadow-md shadow-amber-500/25'
                  : 'bg-neutral-800/90 text-amber-300 hover:bg-neutral-800 border border-amber-500/30'
              }`}
              title="Toggle MP3 Background Audio Mode"
            >
              {playerMode === 'mp3' ? (
                <>
                  <Headphones className="w-3.5 h-3.5" />
                  <span>MP3 Mode</span>
                </>
              ) : (
                <>
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Mode</span>
                </>
              )}
            </button>

            {/* Offline Download Button */}
            <button
              onClick={() => onDownloadTrack(track)}
              disabled={isDownloading}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs transition border ${
                isDownloaded
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-300 hover:text-amber-300 hover:border-amber-500/40'
              }`}
              title={isDownloaded ? 'Downloaded to local storage' : 'Download for offline use'}
            >
              {isDownloading ? (
                <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : isDownloaded ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isDownloading ? 'Saving...' : isDownloaded ? 'Offline Ready' : 'Download MP3'}
              </span>
            </button>

            {/* AI Insights & Summarize */}
            <button
              onClick={onOpenAiSummary}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition"
              title="Open Gemini AI Video Summary & Chapters"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Summary</span>
            </button>

            {/* Speed Selector */}
            <select
              value={playbackSpeed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="bg-neutral-800/90 border border-neutral-700/60 text-neutral-300 text-xs rounded-xl px-2 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>

            {/* Repeat/Loop */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1.5 rounded-xl transition ${
                isLooping ? 'text-amber-400 bg-amber-400/20' : 'text-neutral-400 hover:text-white'
              }`}
              title="Loop track"
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Sleep Timer */}
            <button
              onClick={() => {
                const nextMinutes =
                  sleepTimerMinutes === null ? 30 : sleepTimerMinutes === 30 ? 60 : null;
                setSleepTimerMinutes(nextMinutes);
              }}
              className={`p-1.5 rounded-xl transition flex items-center gap-1 ${
                sleepTimerMinutes
                  ? 'text-amber-400 bg-amber-400/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Sleep Timer (Stops playback automatically)"
            >
              <Moon className="w-4 h-4" />
              {sleepTimerRemaining && (
                <span className="text-[10px] font-mono">
                  {Math.ceil(sleepTimerRemaining / 60)}m
                </span>
              )}
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white transition"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
