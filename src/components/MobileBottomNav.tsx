import React from 'react';
import { Home, Headphones, DownloadCloud, Sparkles, Download } from 'lucide-react';
import { PlayerMode } from '../types';

interface MobileBottomNavProps {
  currentTab: 'home' | 'offline' | 'dj';
  onSelectTab: (tab: 'home' | 'offline' | 'dj') => void;
  playerMode: PlayerMode;
  onTogglePlayerMode: () => void;
  offlineCount: number;
  isInstallable: boolean;
  onInstall: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  playerMode,
  onTogglePlayerMode,
  offlineCount,
  isInstallable,
  onInstall,
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d0e12]/95 backdrop-blur-lg border-t border-neutral-800/90 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
      {/* Home */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-1 transition ${
          currentTab === 'home' ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      {/* MP3 Background Mode */}
      <button
        onClick={onTogglePlayerMode}
        className={`flex flex-col items-center gap-1 transition relative ${
          playerMode === 'mp3' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <Headphones className="w-5 h-5" />
          {playerMode === 'mp3' && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </div>
        <span className="text-[10px]">MP3 Mode</span>
      </button>

      {/* Offline Downloads */}
      <button
        onClick={() => onSelectTab('offline')}
        className={`flex flex-col items-center gap-1 transition relative ${
          currentTab === 'offline' ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <DownloadCloud className="w-5 h-5" />
          {offlineCount > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1 rounded-full text-[9px] font-bold bg-amber-400 text-neutral-950">
              {offlineCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Offline</span>
      </button>

      {/* AI Smart DJ */}
      <button
        onClick={() => onSelectTab('dj')}
        className={`flex flex-col items-center gap-1 transition ${
          currentTab === 'dj' ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Sparkles className="w-5 h-5 text-amber-400" />
        <span className="text-[10px]">AI DJ</span>
      </button>

      {/* Install Button for Android/iOS */}
      {isInstallable && (
        <button
          onClick={onInstall}
          className="flex flex-col items-center gap-1 text-amber-400 hover:text-amber-300"
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px] font-bold">Install</span>
        </button>
      )}
    </nav>
  );
};
