import React, { useState } from 'react';
import { Shield, Zap, Sparkles, CheckCircle2, Flame, Clock } from 'lucide-react';
import { AdBlockerStats } from '../types';

interface AdShieldHUDProps {
  stats: AdBlockerStats;
  onSimulateSkip: () => void;
  className?: string;
}

export const AdShieldHUD: React.FC<AdShieldHUDProps> = ({
  stats,
  onSimulateSkip,
  className = '',
}) => {
  const [showToast, setShowToast] = useState(false);

  const handleTestClick = () => {
    onSimulateSkip();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3200);
  };

  const minutesSaved = Math.max(1, Math.floor(stats.timeSavedSec / 60));

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#17140e] via-[#1a1711] to-[#121316] border border-amber-500/30 p-3 sm:p-4 shadow-xl ${className}`}>
      {/* Background ambient gold glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Shield Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/25 shield-pulse">
            <Shield className="w-5 h-5 fill-black/20" />
            <Zap className="w-3 h-3 text-black absolute top-1 right-1" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                Auto-Skip Ad Shield
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE (0.01s)
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
              <span>Bilkul Premium Wala Feel</span>
              <span className="text-neutral-600">•</span>
              <span>100% Ad-Free Video & Music Streaming</span>
            </p>
          </div>
        </div>

        {/* Right: Live Metrics & Test Button */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-3 bg-neutral-900/80 px-3 py-1.5 rounded-xl border border-neutral-800 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>{stats.adsSkipped}</span>
              <span className="text-neutral-400 font-normal">Ads Skipped</span>
            </div>
            <div className="w-[1px] h-3.5 bg-neutral-700" />
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{minutesSaved}m</span>
              <span className="text-neutral-400 font-normal">Saved</span>
            </div>
          </div>

          <button
            onClick={handleTestClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all duration-200 active:scale-95 shadow-sm hover:shadow-amber-500/20"
            title="Click to test the auto-skip ad detector"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Auto-Skip</span>
          </button>
        </div>
      </div>

      {/* Floating Skip Notification Toast */}
      {showToast && (
        <div className="absolute inset-x-3 bottom-2 sm:bottom-3 flex items-center justify-between bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-neutral-950 px-3.5 py-1.5 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 fill-neutral-950 text-amber-300" />
            <span>⚡ Sponsor/Ad detected & auto-skipped in 0.04s! (Saved 15s)</span>
          </div>
          <span className="text-[10px] bg-neutral-950/20 px-1.5 py-0.5 rounded">Gold VIP</span>
        </div>
      )}
    </div>
  );
};
