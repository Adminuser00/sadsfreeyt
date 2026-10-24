import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Headphones,
  Video,
  DownloadCloud,
  Wifi,
  WifiOff,
  Sparkles,
  Download,
  Share2,
  TrendingUp,
} from 'lucide-react';
import { GoldenLogo } from './GoldenLogo';
import { PlayerMode } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSubmitSearch: (query: string) => void;
  playerMode: PlayerMode;
  onTogglePlayerMode: () => void;
  isOnline: boolean;
  isOfflineModeActive: boolean;
  onToggleOfflineMode: () => void;
  offlineCount: number;
  onOpenOfflineLibrary: () => void;
  onOpenSmartDj: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onSubmitSearch,
  playerMode,
  onTogglePlayerMode,
  isOnline,
  isOfflineModeActive,
  onToggleOfflineMode,
  offlineCount,
  onOpenOfflineLibrary,
  onOpenSmartDj,
}) => {
  const [localInput, setLocalInput] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync external search query
  useEffect(() => {
    setLocalInput(searchQuery);
  }, [searchQuery]);

  // Fetch real YouTube search auto-complete suggestions
  useEffect(() => {
    if (!localInput.trim() || localInput.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/yt/suggestions?q=${encodeURIComponent(localInput.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSuggestions(data);
          }
        }
      } catch (e) {
        // ignore
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [localInput]);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localInput.trim()) {
      setShowSuggestions(false);
      onSubmitSearch(localInput.trim());
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setLocalInput(suggestion);
    setShowSuggestions(false);
    onSubmitSearch(suggestion);
  };

  const handleClear = () => {
    setLocalInput('');
    setSuggestions([]);
    onSearchChange('');
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[#0b0c0e]/95 backdrop-blur-md border-b border-neutral-800/80 px-3 sm:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Golden Logo */}
          <div className="flex items-center gap-3">
            <GoldenLogo size="md" />
          </div>

          {/* Center: Live YouTube Search Bar with Suggestions */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl mx-2 sm:mx-4 relative">
            <form onSubmit={handleSubmit} className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Search any YouTube video / song, artist or paste URL..."
                value={localInput}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onChange={(e) => {
                  setLocalInput(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full bg-[#14161c] border border-neutral-700/70 hover:border-amber-500/50 focus:border-amber-400 text-neutral-100 placeholder-neutral-500 text-xs sm:text-sm rounded-full pl-9 pr-16 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />

              {localInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-10 p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs shadow transition active:scale-95"
                title="Search live YouTube"
              >
                Go
              </button>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#14161f] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 py-1">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-amber-400/80 tracking-wider flex items-center gap-1 border-b border-neutral-800">
                  <TrendingUp className="w-3 h-3 text-amber-400" />
                  <span>Live YouTube Suggestions</span>
                </div>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full px-3.5 py-2 text-left text-xs text-neutral-200 hover:bg-amber-500/15 hover:text-amber-300 flex items-center gap-2.5 transition"
                  >
                    <Search className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* MP3 vs Video Mode Toggle */}
            <button
              onClick={onTogglePlayerMode}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm ${
                playerMode === 'mp3'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 shadow-amber-500/20'
                  : 'bg-neutral-800/80 text-amber-300 hover:bg-neutral-800 border border-amber-500/30'
              }`}
              title="Switch between Video and MP3 background mode"
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

            {/* AI Smart DJ Button */}
            <button
              onClick={onOpenSmartDj}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 text-xs font-medium transition"
              title="Generate customized AI playlists"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden md:inline">AI Smart DJ</span>
            </button>

            {/* Offline Library Button */}
            <button
              onClick={onOpenOfflineLibrary}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/70 text-neutral-200 text-xs font-medium transition"
              title="View downloaded songs & storage"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Offline</span>
              {offlineCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-neutral-950">
                  {offlineCount}
                </span>
              )}
            </button>

            {/* Offline Mode Active Switch */}
            <button
              onClick={onToggleOfflineMode}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium border transition ${
                isOfflineModeActive || !isOnline
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                  : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
              title={
                isOfflineModeActive
                  ? 'Offline Mode Active (Using local storage)'
                  : 'Toggle Offline Listening Mode'
              }
            >
              {isOfflineModeActive || !isOnline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px]">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-[11px]">Online</span>
                </>
              )}
            </button>

            {/* PWA Install Button */}
            {!isInstalled && isInstallable && (
              <button
                onClick={install}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/25 hover:bg-amber-400 transition"
                title="Install YouTube Gold App"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {!isInstalled && isIOS && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-amber-300 hover:bg-neutral-700 transition"
                title="Install on iPhone / iPad"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install iOS</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* iOS Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-[#14161c] border border-amber-500/30 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <GoldenLogo size="sm" />
                <span className="font-bold text-sm text-white">Install on iPhone / iPad</span>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 text-xs text-neutral-300 space-y-2.5">
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span>
                  Safari toolbar ke <strong>Share (Neeche wala arrow)</strong> button par tap karein.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span>
                  Scroll karke <strong>Add to Home Screen (होम स्क्रीन में जोड़ें)</strong> chunein.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span>
                  Top right mein <strong>Add</strong> dabayein. YouTube Gold home screen par install ho jayega!
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 transition"
            >
              Samajh Gaya (Done)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
