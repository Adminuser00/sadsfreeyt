import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Mic,
  X,
  Sliders,
  Smartphone,
  Globe,
  Bell,
  Video as VideoIcon,
  Headphones,
  TrendingUp,
  Download,
} from 'lucide-react';
import { GoldenLogo } from './GoldenLogo';
import { DivineAvatar } from './DivineAvatar';
import { CustomTheme, AppVersionMode } from '../types';

interface YouTubeHeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSubmitSearch: (q: string) => void;
  customTheme: CustomTheme;
  onOpenDevTools: () => void;
  versionMode: AppVersionMode;
  onToggleVersionMode: (mode: AppVersionMode) => void;
  playerMode: 'video' | 'mp3';
  onTogglePlayerMode: () => void;
  onDownloadApk: () => void;
}

export const YouTubeHeader: React.FC<YouTubeHeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onSubmitSearch,
  customTheme,
  onOpenDevTools,
  versionMode,
  onToggleVersionMode,
  playerMode,
  onTogglePlayerMode,
  onDownloadApk,
}) => {
  const [localInput, setLocalInput] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalInput(searchQuery);
  }, [searchQuery]);

  // Fetch real suggestions
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
          if (Array.isArray(data)) setSuggestions(data);
        }
      } catch (e) {}
    }, 200);

    return () => clearTimeout(timer);
  }, [localInput]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localInput.trim()) {
      setShowSuggestions(false);
      onSubmitSearch(localInput.trim());
    }
  };

  const handleSelectSuggestion = (s: string) => {
    setLocalInput(s);
    setShowSuggestions(false);
    onSubmitSearch(s);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full px-4 py-2 flex items-center justify-between border-b border-neutral-800/80 transition-colors"
      style={{ backgroundColor: customTheme.backgroundColor }}
    >
      {/* Left: Hamburger & Golden Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-neutral-800/80 text-neutral-300 hover:text-white transition"
          title="Guide"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div onClick={() => onSubmitSearch('latest trending songs')}>
          <GoldenLogo color={customTheme.logoColor} size="md" />
        </div>
      </div>

      {/* Center: Real YouTube Search Bar */}
      <div ref={searchBoxRef} className="flex-1 max-w-2xl mx-4 relative hidden sm:flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex items-center w-full max-w-lg">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              placeholder="Search YouTube or paste URL..."
              value={localInput}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onChange={(e) => {
                setLocalInput(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full bg-[#121212] border border-neutral-700/80 focus:border-amber-400 text-neutral-100 placeholder-neutral-500 text-sm rounded-l-full pl-4 pr-9 py-2 focus:outline-none shadow-inner"
            />
            {localInput && (
              <button
                type="button"
                onClick={() => {
                  setLocalInput('');
                  setSuggestions([]);
                  onSearchChange('');
                }}
                className="absolute right-3 p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-r-full bg-[#222222] hover:bg-[#272727] border border-l-0 border-neutral-700/80 text-neutral-300 hover:text-white flex items-center justify-center transition"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onSubmitSearch('trending')}
            className="ml-3 p-2.5 rounded-full bg-[#181818] hover:bg-[#222222] text-neutral-300 hover:text-white transition"
            title="Search with your voice"
          >
            <Mic className="w-4 h-4" />
          </button>
        </form>

        {/* Real Autocomplete Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-12 mt-1 bg-[#1f1f1f] border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 py-1.5 animate-in fade-in duration-100">
            <div className="px-3.5 py-1 text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-400" />
              <span>YouTube Suggestions</span>
            </div>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-[#2d2d2d] flex items-center gap-3 transition"
              >
                <Search className="w-3.5 h-3.5 text-neutral-500" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Version Switcher & DevTools Button & Profiles */}
      <div className="flex items-center gap-2">
        {/* Version Switcher: Browser Page vs APK Version */}
        <div className="flex items-center bg-[#1f1f1f] rounded-full p-0.5 border border-neutral-700/60">
          <button
            onClick={() => onToggleVersionMode('browser')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
              versionMode === 'browser'
                ? 'bg-amber-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Full Browser Web Page View"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Browser</span>
          </button>

          <button
            onClick={() => onToggleVersionMode('apk')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
              versionMode === 'apk'
                ? 'bg-amber-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Android APK Mobile Version"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>APK</span>
          </button>
        </div>

        {/* Direct Download APK Button (High Visibility) */}
        <a
          href="/api/download/youtube-gold.apk"
          download="YouTube-Gold-v4.2-Android.apk"
          onClick={() => onDownloadApk()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-neutral-950 transition shadow-lg hover:brightness-110 active:scale-95 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #FFF9C4 0%, #FFD54F 40%, #FFA000 100%)',
            boxShadow: '0 0 14px rgba(255, 179, 0, 0.5)',
          }}
          title="Download YouTube Gold Android APK (28.5 MB Complete Edition)"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Download APK (28.5 MB)</span>
        </a>

        {/* MP3 Audio Background Mode Toggle */}
        <button
          onClick={onTogglePlayerMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition ${
            playerMode === 'mp3'
              ? 'bg-amber-400 text-neutral-950'
              : 'bg-[#1f1f1f] text-amber-300 hover:bg-[#272727] border border-amber-500/30'
          }`}
          title="Toggle MP3 Background Audio Mode"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">MP3 Mode</span>
        </button>

        {/* DevTools & Color Customizer Button */}
        <button
          onClick={onOpenDevTools}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-medium transition"
          title="Custom Colors & Development Tools"
        >
          <Sliders className="w-3.5 h-3.5" style={{ color: customTheme.logoColor }} />
          <span className="hidden lg:inline">Customizer</span>
        </button>

        {/* Standard YouTube icons */}
        <button
          className="p-2 rounded-full hover:bg-neutral-800/80 text-neutral-300 hover:text-white transition hidden sm:block"
          title="Create"
        >
          <VideoIcon className="w-5 h-5" />
        </button>

        <button
          className="p-2 rounded-full hover:bg-neutral-800/80 text-neutral-300 hover:text-white transition relative hidden sm:block"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: customTheme.logoColor }}
          />
        </button>

        {/* Divine Avatar: Bhagwan Bhole Nath & Mata Parvati */}
        <DivineAvatar borderGoldColor={customTheme.logoColor} size="md" />
      </div>
    </header>
  );
};
