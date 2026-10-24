import React from 'react';
import { Play, Headphones, Download, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { VideoTrack } from '../types';

interface VideoCardProps {
  track: VideoTrack;
  isActive: boolean;
  isDownloaded?: boolean;
  onSelect: (track: VideoTrack, mode?: 'video' | 'mp3') => void;
  onDownload: (track: VideoTrack) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  track,
  isActive,
  isDownloaded = false,
  onSelect,
  onDownload,
}) => {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-[#12141a]/90 border transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 ${
        isActive
          ? 'border-amber-400/80 ring-2 ring-amber-400/20 bg-[#161822]'
          : 'border-neutral-800/80 hover:border-amber-500/40'
      }`}
    >
      {/* Thumbnail Area */}
      <div
        className="relative w-full aspect-video overflow-hidden cursor-pointer bg-neutral-900"
        onClick={() => onSelect(track, 'video')}
      >
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Dark subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white backdrop-blur-sm">
          {track.duration}
        </div>

        {/* 320k Gold MP3 badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-semibold backdrop-blur-md">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span>{track.bitrate || '320k Gold MP3'}</span>
        </div>

        {/* Ad-Free Shield Icon on hover */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>No Ads</span>
        </div>

        {/* Center Hover Quick Action Play */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-neutral-950 flex items-center justify-center shadow-xl shadow-amber-500/40 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-neutral-950 translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* Details Row */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div className="flex gap-2.5 items-start">
          {/* Channel Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-amber-500/30">
            <img
              src={track.channelAvatar || track.thumbnail}
              alt={track.channel}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Channel */}
          <div className="flex-1 min-w-0">
            <h4
              onClick={() => onSelect(track, 'video')}
              className={`text-xs sm:text-sm font-semibold line-clamp-2 cursor-pointer transition ${
                isActive ? 'text-amber-300' : 'text-neutral-100 group-hover:text-amber-200'
              }`}
              title={track.title}
            >
              {track.title}
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <span className="truncate">{track.channel}</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 text-neutral-950 text-[8px] font-bold text-center leading-[10px]">
                ✓
              </span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {track.views}
            </p>
          </div>
        </div>

        {/* Card Quick Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
          <button
            onClick={() => onSelect(track, 'mp3')}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-neutral-300 hover:text-amber-300 hover:bg-amber-400/10 transition text-[11px] font-medium"
            title="Listen in MP3 Audio Background Mode"
          >
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>MP3 Mode</span>
          </button>

          <button
            onClick={() => onDownload(track)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition text-[11px] ${
              isDownloaded
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-neutral-400 hover:text-amber-300 hover:bg-neutral-800'
            }`}
            title={isDownloaded ? 'Downloaded to local storage' : 'Download for offline use'}
          >
            {isDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Offline</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
