import React from 'react';
import {
  Home,
  Flame,
  Music2,
  Tv,
  Gamepad2,
  Newspaper,
  Compass,
  History,
  Clock,
  ThumbsUp,
  Bookmark,
  Radio,
  Sparkles,
  Download,
  Smartphone,
} from 'lucide-react';
import { CustomTheme } from '../types';

interface YouTubeSidebarProps {
  isExpanded: boolean;
  activeItem: string;
  onSelectItem: (item: string, query?: string) => void;
  customTheme: CustomTheme;
  onOpenOffline: () => void;
  offlineCount: number;
  onDownloadApk: () => void;
}

export const YouTubeSidebar: React.FC<YouTubeSidebarProps> = ({
  isExpanded,
  activeItem,
  onSelectItem,
  customTheme,
  onOpenOffline,
  offlineCount,
  onDownloadApk,
}) => {
  const mainNav = [
    { id: 'home', label: 'Home', icon: Home, query: 'latest trending songs' },
    { id: 'shorts', label: 'Shorts', icon: Flame, query: 'youtube shorts trending viral' },
    { id: 'subscriptions', label: 'Subscriptions', icon: Tv, query: 'arijit singh new song' },
  ];

  const exploreNav = [
    { id: 'trending', label: 'Trending', icon: Compass, query: 'trending youtube videos india' },
    { id: 'music', label: 'Music', icon: Music2, query: 'top hits music playlist 2026' },
    { id: 'bhakti', label: 'Mahadev Bhakti', icon: Sparkles, query: 'lord shiva bhakti mahadev bhajans' },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2, query: 'gaming gameplay walkthrough' },
    { id: 'podcasts', label: 'Podcasts', icon: Radio, query: 'best podcasts episode hindi' },
  ];

  const subscriptions = [
    { name: 'Bhakti Madhuram (Lord Shiva)', avatar: 'https://i.ytimg.com/vi/tpRz1ISR7xk/hqdefault.jpg', query: 'bhakti madhuram lord shiv song' },
    { name: 'Arijit Singh Official', avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=50&h=50&fit=crop', query: 'arijit singh live songs' },
    { name: 'T-Series Gold', avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=50&h=50&fit=crop', query: 't series latest songs' },
    { name: 'Dhanda Nyoliwala', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=50&h=50&fit=crop', query: 'dhanda nyoliwala songs' },
    { name: 'Coke Studio', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop', query: 'coke studio live songs' },
  ];

  // Collapsed Sidebar (Just icon pills)
  if (!isExpanded) {
    return (
      <aside
        className="w-18 flex-shrink-0 flex flex-col items-center py-2 border-r border-neutral-800/80 transition-all select-none"
        style={{ backgroundColor: customTheme.backgroundColor }}
      >
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id, item.query)}
              className={`w-16 py-3 flex flex-col items-center justify-center rounded-xl my-0.5 transition ${
                isActive ? 'text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Icon
                className="w-5 h-5 mb-1"
                style={{ color: isActive ? customTheme.logoColor : undefined }}
              />
              <span className="text-[10px] font-medium tracking-tight truncate">
                {item.label}
              </span>
            </button>
          );
        })}

        <button
          onClick={onOpenOffline}
          className="w-16 py-3 flex flex-col items-center justify-center rounded-xl my-0.5 text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition"
          title="Offline Library"
        >
          <Download className="w-5 h-5 mb-1 text-amber-400" />
          <span className="text-[10px] font-medium">Offline</span>
        </button>

        <a
          href="/api/download/youtube-gold.apk"
          download="YouTube-Gold-v4.2-Android.apk"
          onClick={() => onDownloadApk()}
          className="w-16 py-3 flex flex-col items-center justify-center rounded-xl my-0.5 text-amber-300 hover:text-white hover:bg-amber-500/20 transition cursor-pointer"
          title="Download Official YouTube Gold Android APK (28.5 MB)"
        >
          <Smartphone className="w-5 h-5 mb-1 text-amber-400" />
          <span className="text-[10px] font-black text-amber-400">28MB</span>
        </a>
      </aside>
    );
  }

  // Expanded YouTube Sidebar
  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-[calc(100vh-56px)] overflow-y-auto px-3 py-2 border-r border-neutral-800/80 transition-all select-none custom-scrollbar"
      style={{ backgroundColor: customTheme.backgroundColor }}
    >
      {/* Prominent Direct Android APK Download Banner */}
      <div className="pb-3 border-b border-neutral-800">
        <a
          href="/api/download/youtube-gold.apk"
          download="YouTube-Gold-v4.2-Android.apk"
          onClick={() => onDownloadApk()}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl transition text-left cursor-pointer group shadow-sm hover:brightness-110 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 179, 0, 0.2) 0%, rgba(230, 81, 0, 0.1) 100%)',
            border: `1.5px solid ${customTheme.logoColor}70`,
          }}
          title="Download Official YouTube Gold Android APK (28.5 MB Complete Edition)"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="p-1.5 rounded-xl flex-shrink-0"
              style={{ backgroundColor: `${customTheme.logoColor}30` }}
            >
              <Smartphone className="w-4 h-4 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                <span>Download APK</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-neutral-950 font-black">
                  28.5 MB
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 truncate">Poco, Realme & Android</div>
            </div>
          </div>
          <Download className="w-4 h-4 text-amber-400 flex-shrink-0" />
        </a>
      </div>

      {/* Main navigation */}
      <div className="space-y-0.5 py-3 border-b border-neutral-800">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id, item.query)}
              className={`w-full flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-neutral-800/90 text-white font-semibold'
                  : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'
              }`}
            >
              <Icon
                className="w-5 h-5 flex-shrink-0"
                style={{ color: isActive ? customTheme.logoColor : undefined }}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Library / Offline Downloads */}
      <div className="py-3 border-b border-neutral-800 space-y-0.5">
        <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
          You
        </div>
        <button
          onClick={onOpenOffline}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition"
        >
          <div className="flex items-center gap-5">
            <Download className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>Downloads</span>
          </div>
          {offlineCount > 0 && (
            <span
              className="px-1.5 py-0.2 rounded-full text-[10px] font-bold text-neutral-950"
              style={{ backgroundColor: customTheme.logoColor }}
            >
              {offlineCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onSelectItem('history', 'trending')}
          className="w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition"
        >
          <History className="w-5 h-5 flex-shrink-0" />
          <span>History</span>
        </button>
        <button
          onClick={() => onSelectItem('watch-later', 'bollywood acoustic')}
          className="w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition"
        >
          <Clock className="w-5 h-5 flex-shrink-0" />
          <span>Watch Later</span>
        </button>
        <button
          onClick={() => onSelectItem('liked', 'top songs')}
          className="w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition"
        >
          <ThumbsUp className="w-5 h-5 flex-shrink-0" />
          <span>Liked Videos</span>
        </button>
      </div>

      {/* Subscriptions */}
      <div className="py-3 border-b border-neutral-800 space-y-1">
        <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
          Subscriptions
        </div>
        {subscriptions.map((sub, i) => (
          <button
            key={i}
            onClick={() => onSelectItem('sub', sub.query)}
            className="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition"
          >
            <img
              src={sub.avatar}
              alt={sub.name}
              className="w-6 h-6 rounded-full object-cover border border-amber-500/30"
            />
            <span className="truncate">{sub.name}</span>
          </button>
        ))}
      </div>

      {/* Explore */}
      <div className="py-3 space-y-0.5">
        <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
          Explore
        </div>
        {exploreNav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id, item.query)}
              className="w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition"
            >
              <Icon className="w-5 h-5 text-neutral-400 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
