import React from 'react';
import {
  X,
  Palette,
  Sliders,
  ShieldCheck,
  Zap,
  Smartphone,
  Globe,
  Download,
  CheckCircle2,
  VolumeX,
  FastForward,
  RotateCcw,
} from 'lucide-react';
import { CustomTheme, AppVersionMode, AdBlockerStats } from '../types';

interface DevToolsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  customTheme: CustomTheme;
  onChangeTheme: (theme: Partial<CustomTheme>) => void;
  onResetTheme: () => void;
  versionMode: AppVersionMode;
  onSelectVersionMode: (mode: AppVersionMode) => void;
  adStats: AdBlockerStats;
  onDownloadApk: () => void;
}

export const DevToolsPanel: React.FC<DevToolsPanelProps> = ({
  isOpen,
  onClose,
  customTheme,
  onChangeTheme,
  onResetTheme,
  versionMode,
  onSelectVersionMode,
  adStats,
  onDownloadApk,
}) => {
  if (!isOpen) return null;

  const logoColorPresets = [
    { label: '24K Classic Gold', hex: '#FFB300' },
    { label: 'Amber Sun', hex: '#FF9800' },
    { label: 'Warm Yellow', hex: '#FFD54F' },
    { label: 'Rose Gold', hex: '#E0A96D' },
    { label: 'Cyberpunk Neon', hex: '#00E5FF' },
    { label: 'Emerald Glow', hex: '#10B981' },
  ];

  const bgColorPresets = [
    { label: 'YouTube Dark', hex: '#0f0f0f' },
    { label: 'Deep Obsidian', hex: '#090a0f' },
    { label: 'AMOLED Black', hex: '#000000' },
    { label: 'Dark Slate', hex: '#16181e' },
    { label: 'Navy Blue', hex: '#0a0e17' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-[#14161f] border-l border-amber-500/30 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200"
        style={{ borderColor: `${customTheme.logoColor}50` }}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/80 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-950 font-bold shadow"
              style={{ backgroundColor: customTheme.logoColor }}
            >
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">
                YouTube Gold Customizer
              </h3>
              <p className="text-[11px] text-neutral-400">
                Custom Tools & Color Editing Development
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 flex-1 text-xs">
          {/* Section 1: Version Switcher (Browser Page vs APK Version) */}
          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                Active Version Mode
              </span>
              <span className="text-[10px] text-neutral-400">Browser ya APK</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectVersionMode('browser')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold transition border ${
                  versionMode === 'browser'
                    ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-md'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Browser Page</span>
              </button>

              <button
                onClick={() => onSelectVersionMode('apk')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold transition border ${
                  versionMode === 'apk'
                    ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-md'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>APK Version</span>
              </button>
            </div>

            {/* Quick APK Downloader Button */}
            <a
              href="/api/download/youtube-gold.apk"
              download="YouTube-Gold-v4.2-Android.apk"
              onClick={() => onDownloadApk()}
              className="w-full mt-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/25 to-yellow-500/25 border border-amber-500/50 text-amber-300 hover:bg-amber-500/35 font-bold flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer text-center"
            >
              <Download className="w-4 h-4 text-amber-400 stroke-[2.5]" />
              <span>Download YouTube-Gold-v4.2.apk (28.5 MB)</span>
            </a>
          </div>

          {/* Section 2: Auto-Skip Ads Engine Controls */}
          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Auto-Skip Ad Engine
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                ACTIVE
              </span>
            </div>

            {/* Auto-click skip delay setting */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium block">
                Auto-Click Skip Delay (Song/Video ke beech ads aane par):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { delay: 5, label: '5s (Default)' },
                  { delay: 3, label: '3s' },
                  { delay: 0, label: 'Instant (0s)' },
                ].map((item) => (
                  <button
                    key={item.delay}
                    onClick={() => onChangeTheme({ adSkipDelay: item.delay })}
                    className={`py-1.5 px-2 rounded-lg font-semibold transition border text-center ${
                      customTheme.adSkipDelay === item.delay
                        ? 'bg-amber-400 text-neutral-950 border-amber-400 font-bold'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                {customTheme.adSkipDelay === 0
                  ? '⚡ Instant mode: Ad shuru hote hi turant skip button par click karega.'
                  : `⚡ Ad aate hi ${customTheme.adSkipDelay} second baad auto-click skip dabayega.`}
              </p>
            </div>

            {/* Auto Mute & Speed Up toggles */}
            <div className="pt-2 border-t border-neutral-800 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 text-neutral-200">
                  <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Auto-Mute Ads</span>
                </div>
                <input
                  type="checkbox"
                  checked={customTheme.autoMuteAds}
                  onChange={(e) => onChangeTheme({ autoMuteAds: e.target.checked })}
                  className="rounded accent-amber-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 text-neutral-200">
                  <FastForward className="w-3.5 h-3.5 text-neutral-400" />
                  <span>16x Turbo Speed on Unskippable Ads</span>
                </div>
                <input
                  type="checkbox"
                  checked={customTheme.speedUpAds}
                  onChange={(e) => onChangeTheme({ speedUpAds: e.target.checked })}
                  className="rounded accent-amber-400 cursor-pointer"
                />
              </label>
            </div>

            {/* Live Stats */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Ads Skipped: <strong className="text-amber-400">{adStats.adsSkipped}</strong></span>
              <span>Time Saved: <strong className="text-emerald-400">{Math.floor(adStats.timeSavedSec / 60)}m</strong></span>
            </div>
          </div>

          {/* Section 3: Logo Color Customizer */}
          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                YouTube Logo Color (Red → Custom)
              </span>
              <div
                className="w-4 h-4 rounded-full border border-white/40"
                style={{ backgroundColor: customTheme.logoColor }}
              />
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 gap-2">
              {logoColorPresets.map((preset) => (
                <button
                  key={preset.hex}
                  onClick={() => onChangeTheme({ logoColor: preset.hex, accentColor: preset.hex })}
                  className={`flex items-center gap-2 p-2 rounded-xl transition border text-left ${
                    customTheme.logoColor === preset.hex
                      ? 'border-white/60 bg-neutral-800 font-bold text-white'
                      : 'border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span className="text-[11px] truncate">{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Hex Color Picker */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-neutral-400">Custom Hex:</span>
              <input
                type="color"
                value={customTheme.logoColor}
                onChange={(e) => onChangeTheme({ logoColor: e.target.value, accentColor: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-neutral-300 text-xs">{customTheme.logoColor}</span>
            </div>
          </div>

          {/* Section 4: Background Color Customizer */}
          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Background Color Customizer
              </span>
              <div
                className="w-4 h-4 rounded-full border border-white/40"
                style={{ backgroundColor: customTheme.backgroundColor }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {bgColorPresets.map((preset) => (
                <button
                  key={preset.hex}
                  onClick={() => onChangeTheme({ backgroundColor: preset.hex })}
                  className={`flex items-center gap-2 p-2 rounded-xl transition border text-left ${
                    customTheme.backgroundColor === preset.hex
                      ? 'border-white/60 bg-neutral-800 font-bold text-white'
                      : 'border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-600 flex-shrink-0"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span className="text-[11px] truncate">{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-neutral-400">Custom Hex:</span>
              <input
                type="color"
                value={customTheme.backgroundColor}
                onChange={(e) => onChangeTheme({ backgroundColor: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-neutral-300 text-xs">{customTheme.backgroundColor}</span>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={onResetTheme}
            className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to YouTube Gold Defaults</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between text-[11px] text-neutral-400">
          <span>YouTube Gold Customizer v4.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
