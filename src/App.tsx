import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Download,
  Headphones,
  Video,
  ListMusic,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  Flame,
  Clock,
  Compass,
  TrendingUp,
  RefreshCw,
  Smartphone,
  Globe,
  Sliders,
  ShieldCheck,
  Play,
  Trash2,
  History,
  Music2,
} from 'lucide-react';
import {
  VideoTrack,
  OfflineTrack,
  PlayerMode,
  AdBlockerStats,
  CustomTheme,
  AppVersionMode,
} from './types';
import { CURATED_TRACKS } from './data/curatedVideos';
import {
  getAllOfflineTracks,
  saveTrackForOffline,
  deleteOfflineTrack,
} from './utils/indexedDb';
import {
  getWatchHistory,
  removeFromHistory,
  clearWatchHistory,
  generateAiSmartQueue,
  HistoryItem,
} from './utils/historyManager';
import { YouTubeHeader } from './components/YouTubeHeader';
import { YouTubeSidebar } from './components/YouTubeSidebar';
import { YouTubeChips } from './components/YouTubeChips';
import { YouTubeWatchView } from './components/YouTubeWatchView';
import { VideoCard } from './components/VideoCard';
import { DevToolsPanel } from './components/DevToolsPanel';
import { APKVersionModal } from './components/APKVersionModal';
import { OfflineLibraryModal } from './components/OfflineLibraryModal';
import { GeminiAIModal } from './components/GeminiAIModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  // Theme and Customization state
  const [customTheme, setCustomTheme] = useState<CustomTheme>(() => {
    return {
      logoColor: '#FFB300', // 24K Gold
      backgroundColor: '#0f0f0f', // YouTube Dark
      accentColor: '#FFB300',
      adSkipDelay: 5, // Auto-clicks skip after 5 seconds
      autoMuteAds: true,
      speedUpAds: true,
      backgroundAudioEnabled: true,
    };
  });

  // Version Mode: 'browser' (Desktop/Laptop web page) or 'apk' (Android APK version)
  const [versionMode, setVersionMode] = useState<AppVersionMode>('browser');

  // Navigation & Page state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isWatchPage, setIsWatchPage] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('home');
  const [activeChip, setActiveChip] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viralityFilter, setViralityFilter] = useState<'all' | 'viral' | 'bhakti' | 'bollywood'>('all');

  // Active track
  const [currentTrack, setCurrentTrack] = useState<VideoTrack>(CURATED_TRACKS[0]);
  const [playerMode, setPlayerMode] = useState<PlayerMode>('video');

  // Video feeds
  const [videosList, setVideosList] = useState<VideoTrack[]>(CURATED_TRACKS);
  const [relatedVideos, setRelatedVideos] = useState<VideoTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Ad Blocker live state
  const [adStats, setAdStats] = useState<AdBlockerStats>({
    adsSkipped: 247,
    timeSavedSec: 1160,
    bannersBlocked: 618,
    isShieldActive: true,
  });

  // Watch History persistent state
  const [watchHistory, setWatchHistory] = useState<HistoryItem[]>(() => {
    const list = getWatchHistory();
    if (list.length > 0) return list;
    return [{ ...CURATED_TRACKS[0], watchedAt: Date.now() }];
  });

  // Offline management
  const [offlineTracks, setOfflineTracks] = useState<OfflineTrack[]>([]);
  const [isOfflineModeActive, setIsOfflineModeActive] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [downloadingTrackId, setDownloadingTrackId] = useState<string | null>(null);

  // Modals
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalTab, setAiModalTab] = useState<'summary' | 'dj' | 'chat'>('summary');
  const [mobileTab, setMobileTab] = useState<'home' | 'offline' | 'dj'>('home');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isInstallable, install } = usePWAInstall();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Perform live YouTube search
  const performLiveSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/yt/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data: VideoTrack[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setVideosList(data);
        }
      }
    } catch (err) {
      console.warn('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Fetch real related videos whenever currentTrack changes
  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch(`/api/yt/related?videoId=${currentTrack.id}`);
        if (res.ok) {
          const data: VideoTrack[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRelatedVideos(data);
            return;
          }
        }
        setRelatedVideos(CURATED_TRACKS.filter((t) => t.id !== currentTrack.id));
      } catch (e) {
        setRelatedVideos(CURATED_TRACKS.filter((t) => t.id !== currentTrack.id));
      }
    }
    fetchRelated();
  }, [currentTrack.id]);

  // Monitor network online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerToast('📶 Internet connected! Live YouTube online.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsOfflineModeActive(true);
      triggerToast('📶❌ Switched to Offline Downloaded Mode.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial load: fetch trending live YouTube videos
  useEffect(() => {
    performLiveSearch('latest bollywood songs 2026');
  }, [performLiveSearch]);

  // Load offline tracks from IndexedDB & pre-seed
  useEffect(() => {
    async function initOfflineStore() {
      try {
        const stored = await getAllOfflineTracks();
        if (stored.length > 0) {
          setOfflineTracks(stored);
        } else {
          const seeded1 = await saveTrackForOffline(CURATED_TRACKS[0], undefined, 4.2);
          const seeded2 = await saveTrackForOffline(CURATED_TRACKS[2], undefined, 5.1);
          setOfflineTracks([seeded1, seeded2]);
        }
      } catch (err) {
        console.warn('IndexedDB initial load note:', err);
      }
    }
    initOfflineStore();
  }, []);

  // Auto-skip Ad simulation handler
  const handleAdSkipped = () => {
    setAdStats((prev) => ({
      ...prev,
      adsSkipped: prev.adsSkipped + 1,
      timeSavedSec: prev.timeSavedSec + 15,
      lastSkippedTime: new Date().toLocaleTimeString(),
    }));
    triggerToast(
      customTheme.adSkipDelay === 0
        ? '⚡ Ad Auto-Skipped instantly in 0.01s!'
        : `⚡ Ad Auto-Skipped in ${customTheme.adSkipDelay}s! (Auto-Click on Skip button)`
    );
  };

  // Download track for offline playback
  const handleDownloadTrack = async (track: VideoTrack) => {
    if (downloadingTrackId) return;
    setDownloadingTrackId(track.id);

    try {
      const offlineItem = await saveTrackForOffline(track);
      setOfflineTracks((prev) => {
        const filtered = prev.filter((t) => t.id !== track.id);
        return [offlineItem, ...filtered];
      });
      triggerToast(`✓ "${track.title}" downloaded to your local device!`);
    } catch (e) {
      console.error('Download error:', e);
      triggerToast('Download error. Please check storage permission.');
    } finally {
      setDownloadingTrackId(null);
    }
  };

  // Delete downloaded track
  const handleDeleteOfflineTrack = async (trackId: string) => {
    try {
      await deleteOfflineTrack(trackId);
      setOfflineTracks((prev) => prev.filter((t) => t.id !== trackId));
      triggerToast('Track removed from offline storage.');
    } catch (e) {
      console.warn('Delete error:', e);
    }
  };

  // Parse YouTube URL or perform real search
  const handleUrlOrSearchSubmit = (input: string) => {
    const raw = input.trim();

    // Check for youtube.com/watch?v=...
    const matchWatch = raw.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    const matchShort = raw.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    const matchRawId = raw.length === 11 && !raw.includes(' ') ? raw : null;

    const extractedId = matchWatch?.[1] || matchShort?.[1] || matchRawId;

    if (extractedId) {
      const newCustomTrack: VideoTrack = {
        id: extractedId,
        title: `YouTube Video (${extractedId})`,
        channel: 'YouTube Creator',
        thumbnail: `https://i.ytimg.com/vi/${extractedId}/hqdefault.jpg`,
        duration: '4:00',
        durationSeconds: 240,
        views: 'Live Stream',
        category: 'music',
        bitrate: '320 kbps Golden Master',
        description: 'Loaded via direct YouTube URL with Gold Ad Shield active.',
      };
      setCurrentTrack(newCustomTrack);
      setIsWatchPage(true);
      triggerToast(`Loaded YouTube video [${extractedId}] with zero ads!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSearchQuery(raw);
      setIsWatchPage(false);
      performLiveSearch(raw);
    }
  };

  // Select video to watch
  const handleSelectVideo = (track: VideoTrack, mode?: PlayerMode) => {
    setCurrentTrack(track);
    if (mode) setPlayerMode(mode);
    setIsWatchPage(true);
    // Sync with watch history state immediately
    setWatchHistory((prev) => {
      const filtered = prev.filter((it) => it.id !== track.id);
      return [{ ...track, watchedAt: Date.now() }, ...filtered].slice(0, 60);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Next / Previous (Strictly auto-queues songs/bhakti/music, filtering out live news)
  const handleNextTrack = () => {
    if (isOfflineModeActive) {
      if (offlineTracks.length === 0) return;
      const currentIndex = offlineTracks.findIndex((t) => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % offlineTracks.length;
      handleSelectVideo(offlineTracks[nextIndex]);
      return;
    }

    const smartQueue = generateAiSmartQueue(
      currentTrack,
      relatedVideos.length > 0 ? relatedVideos : videosList,
      watchHistory
    );

    if (smartQueue.length > 0) {
      handleSelectVideo(smartQueue[0]);
      triggerToast(`Autoplay: ${smartQueue[0].title.slice(0, 32)}... (Ad-Free)`);
    } else {
      const fallbackList = videosList.filter((v) => v.id !== currentTrack.id);
      if (fallbackList.length > 0) {
        handleSelectVideo(fallbackList[0]);
      }
    }
  };

  const handlePrevTrack = () => {
    if (isOfflineModeActive) {
      if (offlineTracks.length === 0) return;
      const currentIndex = offlineTracks.findIndex((t) => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + offlineTracks.length) % offlineTracks.length;
      handleSelectVideo(offlineTracks[prevIndex]);
      return;
    }

    const historyIndex = watchHistory.findIndex((h) => h.id === currentTrack.id);
    if (historyIndex >= 0 && historyIndex + 1 < watchHistory.length) {
      handleSelectVideo(watchHistory[historyIndex + 1]);
    } else {
      const list = videosList;
      const currentIndex = list.findIndex((t) => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + list.length) % list.length;
      handleSelectVideo(list[prevIndex]);
    }
  };

  // History removal handlers
  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromHistory(id);
    setWatchHistory(getWatchHistory());
    triggerToast('Removed from Watch History');
  };

  const handleClearAllHistory = () => {
    clearWatchHistory();
    setWatchHistory([]);
    triggerToast('Watch history cleared');
  };

  // Download APK Package trigger
  const handleDownloadApkFile = () => {
    // Direct binary download from server with proper application/vnd.android.package-archive headers
    const link = document.createElement('a');
    link.href = '/api/download/youtube-gold.apk';
    link.download = 'YouTube-Gold-v4.2-Android.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsApkModalOpen(true);
    triggerToast('✓ YouTube-Gold-v4.2-Android.apk (28.5 MB) download started!');
  };

  // Find if current track has an offline blob URL
  const currentOfflineBlobUrl = useMemo(() => {
    const found = offlineTracks.find((t) => t.id === currentTrack.id);
    return found?.blobUrl;
  }, [offlineTracks, currentTrack.id]);

  // AI Smart Playlist based on history and high-traffic virality (Zero live news)
  const aiSmartPlaylist = useMemo(() => {
    return generateAiSmartQueue(currentTrack, videosList, watchHistory);
  }, [currentTrack, videosList, watchHistory]);

  // Filtered browse list based on virality & user selection
  const displayedVideos = useMemo(() => {
    const baseList = isOfflineModeActive ? offlineTracks : videosList;
    if (viralityFilter === 'viral') {
      return baseList.filter((v) => {
        const num = parseFloat(v.views.replace(/[^0-9.]/g, ''));
        return (v.views.includes('M') && num >= 10) || v.views.includes('B');
      });
    }
    if (viralityFilter === 'bhakti') {
      return baseList.filter((v) => {
        const text = `${v.title} ${v.category} ${v.description}`.toLowerCase();
        return (
          text.includes('shiv') ||
          text.includes('bhole') ||
          text.includes('bhajan') ||
          text.includes('devotional') ||
          text.includes('mahadev') ||
          text.includes('alakh') ||
          text.includes('aadesh')
        );
      });
    }
    if (viralityFilter === 'bollywood') {
      return baseList.filter((v) => {
        const text = `${v.title} ${v.category}`.toLowerCase();
        return text.includes('bollywood') || text.includes('medley') || text.includes('qawwali') || text.includes('song');
      });
    }
    return baseList;
  }, [isOfflineModeActive, offlineTracks, videosList, viralityFilter]);

  return (
    <div
      className="min-h-screen text-[#f3f4f6] flex flex-col transition-colors selection:bg-amber-500/30 selection:text-amber-200"
      style={{ backgroundColor: customTheme.backgroundColor }}
    >
      {/* 1. Authentic www.youtube.com Top Header */}
      <YouTubeHeader
        onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSubmitSearch={handleUrlOrSearchSubmit}
        customTheme={customTheme}
        onOpenDevTools={() => setIsDevToolsOpen(true)}
        versionMode={versionMode}
        onToggleVersionMode={(mode) => {
          setVersionMode(mode);
          if (mode === 'apk') setIsApkModalOpen(true);
        }}
        playerMode={playerMode}
        onTogglePlayerMode={() =>
          setPlayerMode(playerMode === 'video' ? 'mp3' : 'video')
        }
        onDownloadApk={handleDownloadApkFile}
      />

      {/* 2. Main Layout Container: Sidebar + Content */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Real YouTube Navigation Sidebar (hidden on watch page on smaller screens) */}
        {!isWatchPage && (
          <YouTubeSidebar
            isExpanded={isSidebarExpanded}
            activeItem={activeSidebarItem}
            onSelectItem={(itemId, query) => {
              setActiveSidebarItem(itemId);
              if (query) {
                performLiveSearch(query);
              }
            }}
            customTheme={customTheme}
            onOpenOffline={() => setIsOfflineModalOpen(true)}
            offlineCount={offlineTracks.length}
            onDownloadApk={handleDownloadApkFile}
          />
        )}

        {/* 3. Main Stage: Either Watch Page OR YouTube Browse Feed */}
        <main className="flex-1 overflow-y-auto flex flex-col h-[calc(100vh-56px)] custom-scrollbar">
          {/* Watch Page View */}
          {isWatchPage ? (
            <div>
              {/* Back to Home banner */}
              <div className="px-4 py-2 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <button
                  onClick={() => setIsWatchPage(false)}
                  className="hover:text-white flex items-center gap-1 font-semibold text-amber-400 transition"
                >
                  ← Back to YouTube Feed
                </button>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Auto-Skip Ad Shield Active (5s delay)</span>
                </div>
              </div>

              <YouTubeWatchView
                track={currentTrack}
                relatedVideos={relatedVideos}
                onSelectRelated={(v) => handleSelectVideo(v)}
                customTheme={customTheme}
                playerMode={playerMode}
                onTogglePlayerMode={() =>
                  setPlayerMode(playerMode === 'video' ? 'mp3' : 'video')
                }
                onDownloadTrack={handleDownloadTrack}
                isDownloading={downloadingTrackId === currentTrack.id}
                onAdSkipped={handleAdSkipped}
                onOpenAiSummary={() => {
                  setAiModalTab('summary');
                  setIsAiModalOpen(true);
                }}
                isOfflineActive={isOfflineModeActive || !isOnline}
                offlineBlobUrl={currentOfflineBlobUrl}
                onNextTrack={handleNextTrack}
                onPrevTrack={handlePrevTrack}
              />
            </div>
          ) : activeSidebarItem === 'history' ? (
            /* Dedicated YouTube Gold Watch History View */
            <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.logoColor}25, transparent)`,
                      border: `1px solid ${customTheme.logoColor}40`,
                    }}
                  >
                    <History className="w-6 h-6" style={{ color: customTheme.logoColor }} />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-white flex items-center gap-2">
                      <span>Watch History</span>
                      <span
                        className="text-[10px] font-black uppercase px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${customTheme.logoColor}25`,
                          color: customTheme.logoColor,
                        }}
                      >
                        Gold VIP
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400">
                      {watchHistory.length} songs recorded • Used by AI Agent to curate continuous song queues without live news
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {watchHistory.length > 0 && (
                    <>
                      <button
                        onClick={() => {
                          if (watchHistory.length > 0) {
                            handleSelectVideo(watchHistory[0], 'mp3');
                            triggerToast('▶ Starting History Playback in MP3 Background Mode');
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white flex items-center gap-1.5 transition border border-neutral-700"
                      >
                        <Headphones className="w-3.5 h-3.5 text-amber-400" />
                        <span>Play in MP3</span>
                      </button>
                      <button
                        onClick={handleClearAllHistory}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-950/40 hover:bg-red-900/60 text-red-300 flex items-center gap-1.5 transition border border-red-800/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear History</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {watchHistory.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800">
                    <History className="w-8 h-8 text-neutral-600" />
                  </div>
                  <h3 className="font-bold text-base text-neutral-300">No watch history yet</h3>
                  <p className="text-xs text-neutral-500 max-w-sm">
                    Watch or listen to your favorite bhajans, songs, or viral tracks. They will appear here for 1-click replay.
                  </p>
                  <button
                    onClick={() => setActiveSidebarItem('home')}
                    className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 transition"
                    style={{ backgroundColor: customTheme.logoColor }}
                  >
                    Explore YouTube Gold
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {watchHistory.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      onClick={() => handleSelectVideo(item)}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-2xl bg-neutral-900/70 hover:bg-[#1f1f1f] border border-neutral-800/80 hover:border-amber-500/40 transition cursor-pointer gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[10px] font-mono text-white">
                            {item.duration}
                          </span>
                        </div>
                        <div className="min-w-0 flex flex-col gap-1">
                          <h4 className="text-sm font-semibold text-white truncate group-hover:text-amber-300 transition">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-400 truncate">{item.channel}</p>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                            <span>{item.views}</span>
                            <span>•</span>
                            <span className="text-emerald-400">Zero Ads</span>
                            <span>•</span>
                            <span>
                              {item.watchedAt ? new Date(item.watchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectVideo(item, 'mp3');
                          }}
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold flex items-center gap-1 transition"
                          title="Listen in MP3 Background Mode"
                        >
                          <Headphones className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">MP3</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectVideo(item, 'video');
                          }}
                          className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold flex items-center gap-1 transition"
                          title="Watch Video"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span className="hidden md:inline">Play</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          className="p-2 rounded-xl hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition"
                          title="Remove from History"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Browse Feed View */
            <div className="flex flex-col">
              {/* Top Category Chips (like real YouTube) */}
              <YouTubeChips
                activeChip={activeChip}
                onSelectChip={(chipId, query) => {
                  setActiveChip(chipId);
                  performLiveSearch(query);
                }}
                customTheme={customTheme}
              />

              {/* Offline Warning Banner if disconnected */}
              {(isOfflineModeActive || !isOnline) && (
                <div className="mx-4 mt-3 flex items-center justify-between gap-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-amber-400" />
                    <span>
                      Offline Mode Active: Showing {offlineTracks.length} downloaded songs directly from local storage.
                    </span>
                  </div>
                  {isOnline && (
                    <button
                      onClick={() => setIsOfflineModeActive(false)}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 text-neutral-950 font-bold"
                    >
                      Go Online
                    </button>
                  )}
                </div>
              )}

              {/* Prominent Android APK Download Bar (for Poco, Realme & All Phones) */}
              <div className="mx-4 sm:mx-6 mt-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-[#231a0e] to-neutral-900 border border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-400 text-neutral-950 flex-shrink-0 shadow-md">
                    <Smartphone className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-black text-sm text-white">
                        YouTube Gold Android APK (v4.2)
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        100% Ad-Free
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-500/40 hidden md:inline">
                        Poco & Realme Supported
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-0.5">
                      Install native APK on your phone for background MP3 playback with screen locked & zero ads.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-shrink-0">
                  <button
                    onClick={handleDownloadApkFile}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black text-neutral-950 flex items-center justify-center gap-1.5 transition shadow-xl hover:brightness-110 active:scale-95 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #FFF9C4 0%, #FFD54F 50%, #FFA000 100%)',
                      boxShadow: '0 0 16px rgba(255, 179, 0, 0.45)',
                    }}
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Download APK (Free)</span>
                  </button>
                  <button
                    onClick={() => setIsApkModalOpen(true)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
                  >
                    Guide
                  </button>
                </div>
              </div>

              {/* AI Agent Smart Playlist Curated Banner */}
              <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#1a1a1f] to-neutral-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div
                    className="p-2.5 rounded-xl flex-shrink-0"
                    style={{
                      backgroundColor: `${customTheme.logoColor}20`,
                      border: `1px solid ${customTheme.logoColor}40`,
                    }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: customTheme.logoColor }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-sm sm:text-base text-white">
                        AI Agent Smart Auto-Playlist
                      </h3>
                      <span
                        className="text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm"
                        style={{
                          backgroundColor: `${customTheme.logoColor}30`,
                          color: customTheme.logoColor,
                        }}
                      >
                        Auto-Curated • Zero Live News
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
                      Automatically generates continuous song & bhajan playlists tailored to your view history ({watchHistory.length} tracks recorded). Auto-play guarantees musical flow without live news interruptions.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch md:self-auto justify-end flex-shrink-0">
                  <button
                    onClick={() => {
                      if (aiSmartPlaylist.length > 0) {
                        handleSelectVideo(aiSmartPlaylist[0], 'mp3');
                        triggerToast('▶ Starting AI Smart Queue in MP3 Mode (Continuous Play)');
                      }
                    }}
                    className="flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-bold bg-[#222] hover:bg-[#2e2e2e] text-white flex items-center justify-center gap-1.5 transition border border-neutral-700"
                  >
                    <Headphones className="w-3.5 h-3.5 text-amber-400" />
                    <span>Queue in MP3</span>
                  </button>
                  <button
                    onClick={() => {
                      if (aiSmartPlaylist.length > 0) {
                        handleSelectVideo(aiSmartPlaylist[0], 'video');
                        triggerToast('▶ Playing AI Curated Video Queue');
                      }
                    }}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 flex items-center justify-center gap-1.5 transition shadow-lg hover:brightness-110"
                    style={{ backgroundColor: customTheme.logoColor }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play AI Queue</span>
                  </button>
                </div>
              </div>

              {/* Video Grid matching www.youtube.com */}
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display font-bold text-lg text-white">
                      {searchQuery ? `Results for "${searchQuery}"` : 'Recommended for You'}
                    </h2>
                    <span
                      className="text-[10px] font-black uppercase px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${customTheme.logoColor}25`,
                        color: customTheme.logoColor,
                        border: `1px solid ${customTheme.logoColor}50`,
                      }}
                    >
                      Ad-Free Gold
                    </span>
                  </div>

                  {/* Virality & Traffic Sorting Quick Filters */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                    <button
                      onClick={() => setViralityFilter('all')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        viralityFilter === 'all'
                          ? 'bg-white text-black'
                          : 'bg-[#272727] text-neutral-300 hover:bg-[#383838]'
                      }`}
                    >
                      All High-Traffic
                    </button>
                    <button
                      onClick={() => setViralityFilter('viral')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                        viralityFilter === 'viral'
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-[#272727] text-neutral-300 hover:bg-[#383838]'
                      }`}
                    >
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span>10M+ Viral</span>
                    </button>
                    <button
                      onClick={() => setViralityFilter('bhakti')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        viralityFilter === 'bhakti'
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-[#272727] text-neutral-300 hover:bg-[#383838]'
                      }`}
                    >
                      Mahadev Bhakti
                    </button>
                    <button
                      onClick={() => setViralityFilter('bollywood')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        viralityFilter === 'bollywood'
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-[#272727] text-neutral-300 hover:bg-[#383838]'
                      }`}
                    >
                      Bollywood & Qawwali
                    </button>

                    {isSearching && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 ml-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline">Loading...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-7">
                  {displayedVideos.map((track) => {
                    const isDownloaded = offlineTracks.some((ot) => ot.id === track.id);

                    return (
                      <VideoCard
                        key={track.id}
                        track={track}
                        isActive={currentTrack.id === track.id && isWatchPage}
                        isDownloaded={isDownloaded}
                        onSelect={(selectedTrack, mode) =>
                          handleSelectVideo(selectedTrack, mode)
                        }
                        onDownload={handleDownloadTrack}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-900 border border-amber-500/60 text-white text-xs sm:text-sm font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DevTools & Color Customizer Drawer */}
      <DevToolsPanel
        isOpen={isDevToolsOpen}
        onClose={() => setIsDevToolsOpen(false)}
        customTheme={customTheme}
        onChangeTheme={(updated) => setCustomTheme({ ...customTheme, ...updated })}
        onResetTheme={() =>
          setCustomTheme({
            logoColor: '#FFB300',
            backgroundColor: '#0f0f0f',
            accentColor: '#FFB300',
            adSkipDelay: 5,
            autoMuteAds: true,
            speedUpAds: true,
            backgroundAudioEnabled: true,
          })
        }
        versionMode={versionMode}
        onSelectVersionMode={(mode) => {
          setVersionMode(mode);
          if (mode === 'apk') setIsApkModalOpen(true);
        }}
        adStats={adStats}
        onDownloadApk={handleDownloadApkFile}
      />

      {/* APK Version Modal */}
      <APKVersionModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        customTheme={customTheme}
        onSwitchToBrowser={() => setVersionMode('browser')}
        onDownloadApkFile={handleDownloadApkFile}
        isInstallable={isInstallable}
        onInstallPwa={install}
      />

      {/* Offline Library Modal */}
      <OfflineLibraryModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        offlineTracks={offlineTracks}
        onSelectTrack={(t, mode) => handleSelectVideo(t, mode)}
        onDeleteTrack={handleDeleteOfflineTrack}
        currentTrackId={currentTrack.id}
      />

      {/* Gemini AI Modal */}
      <GeminiAIModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        track={currentTrack}
        initialTab={aiModalTab}
        onPlaySuggestedTrack={(title, artist) => {
          performLiveSearch(`${title} ${artist}`);
          setIsWatchPage(false);
        }}
      />
    </div>
  );
}
