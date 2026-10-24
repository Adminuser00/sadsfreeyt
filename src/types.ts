export interface VideoTrack {
  id: string; // YouTube videoId or unique identifier
  title: string;
  channel: string;
  channelAvatar?: string;
  thumbnail: string;
  duration: string;
  durationSeconds: number;
  views: string;
  category?: string;
  audioUrl?: string; // High-bitrate audio stream for native MP3 & offline caching
  description?: string;
  publishedAt?: string;
  lyrics?: string[];
  bitrate?: string;
}

export interface OfflineTrack extends VideoTrack {
  downloadedAt: number;
  fileSizeMb: number;
  blobUrl?: string;
}

export type PlayerMode = 'video' | 'mp3';

export type AppVersionMode = 'browser' | 'apk';

export interface CustomTheme {
  logoColor: string; // e.g. '#FFB300'
  backgroundColor: string; // e.g. '#0f0f0f'
  accentColor: string; // e.g. '#FFC107'
  adSkipDelay: number; // 0, 3, or 5 seconds
  autoMuteAds: boolean;
  speedUpAds: boolean;
  backgroundAudioEnabled: boolean;
}

export interface AdBlockerStats {
  adsSkipped: number;
  timeSavedSec: number;
  bannersBlocked: number;
  isShieldActive: boolean;
  lastSkippedTime?: string;
}

export interface AiSummaryData {
  summary: string;
  chapters: { time: string; title: string }[];
  vibeTags: string[];
  goldFact: string;
}
