import React, { useState, useEffect } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Bookmark,
  Headphones,
  Video,
  ShieldCheck,
  Check,
  CheckCircle2,
  Sparkles,
  Maximize2,
  Minimize2,
  Flame,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { VideoTrack, CustomTheme, PlayerMode } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { DivineAvatar } from './DivineAvatar';
import { addToHistory } from '../utils/historyManager';
import { SkipBack, SkipForward } from 'lucide-react';

interface YouTubeWatchViewProps {
  track: VideoTrack;
  relatedVideos: VideoTrack[];
  onSelectRelated: (track: VideoTrack) => void;
  customTheme: CustomTheme;
  playerMode: PlayerMode;
  onTogglePlayerMode: () => void;
  onDownloadTrack: (track: VideoTrack) => void;
  isDownloading: boolean;
  onAdSkipped: () => void;
  onOpenAiSummary: () => void;
  isOfflineActive: boolean;
  offlineBlobUrl?: string;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}

export const YouTubeWatchView: React.FC<YouTubeWatchViewProps> = ({
  track,
  relatedVideos,
  onSelectRelated,
  customTheme,
  playerMode,
  onTogglePlayerMode,
  onDownloadTrack,
  isDownloading,
  onAdSkipped,
  onOpenAiSummary,
  isOfflineActive,
  offlineBlobUrl,
  onNextTrack,
  onPrevTrack,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(142800);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Auto-skip ad countdown state
  const [adState, setAdState] = useState<{
    isActive: boolean;
    remainingSec: number;
  }>({
    isActive: true, // triggers ad skip countdown on video load
    remainingSec: customTheme.adSkipDelay || 5,
  });

  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Aman Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop',
      text: 'Bhai kya mast sound quality hai! Zero ads aur background mein song chalta rehta hai!',
      time: '2 hours ago',
      likes: 42,
    },
    {
      id: '2',
      author: 'Priya Verma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
      text: 'Golden theme dekh kar bilkul premium feel aa raha hai. Red se lakh guna behtar lag raha hai.',
      time: '5 hours ago',
      likes: 89,
    },
    {
      id: '3',
      author: 'Rohit Tech',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&h=60&fit=crop',
      text: 'Auto-skip timer works like magic! Exactly 5s baad apne aap skip par click ho gaya.',
      time: '1 day ago',
      likes: 124,
    },
  ]);

  // Automatically save current track to persistent Watch History
  useEffect(() => {
    if (track && track.id) {
      addToHistory(track);
    }
  }, [track]);

  // Handle Auto-Skip Ad countdown (5s or user chosen delay -> auto clicks skip)
  useEffect(() => {
    const delay = customTheme.adSkipDelay;
    if (delay === 0) {
      // Instant skip
      setAdState({ isActive: true, remainingSec: 0 });
      const timer = setTimeout(() => {
        handleTriggerSkip();
      }, 500);
      return () => clearTimeout(timer);
    }

    setAdState({ isActive: true, remainingSec: delay });

    const interval = setInterval(() => {
      setAdState((prev) => {
        if (!prev.isActive) return prev;
        if (prev.remainingSec <= 1) {
          clearInterval(interval);
          handleTriggerSkip();
          return { isActive: false, remainingSec: 0 };
        }
        return { ...prev, remainingSec: prev.remainingSec - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [track.id, customTheme.adSkipDelay]);

  const handleTriggerSkip = () => {
    setAdState({ isActive: false, remainingSec: 0 });
    onAdSkipped();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: String(Date.now()),
      author: 'You (Gold VIP)',
      avatar: '',
      isDivine: true,
      text: commentInput.trim(),
      time: 'Just now',
      likes: 0,
    };

    setComments([newComment, ...comments]);
    setCommentInput('');
  };

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-[1680px] mx-auto px-2 sm:px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 8 Cols: Main Video Watch Player & Information */}
      <div className="lg:col-span-8 flex flex-col gap-3.5">
        {/* Real YouTube Player container with Auto-Skip banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
          <VideoPlayer
            track={track}
            playerMode={playerMode}
            onTogglePlayerMode={onTogglePlayerMode}
            onNextTrack={onNextTrack}
            onPrevTrack={onPrevTrack}
            onOpenAiSummary={onOpenAiSummary}
            onDownloadTrack={onDownloadTrack}
            isDownloading={isDownloading}
            onAdSkipped={onAdSkipped}
            isOfflineActive={isOfflineActive}
            offlineBlobUrl={offlineBlobUrl}
          />

          {/* Real Auto-Skip Ad Countdown Overlay Banner */}
          {adState.isActive && (
            <div className="absolute top-3 right-3 z-30 flex items-center gap-2.5 bg-neutral-950/90 border border-amber-500/50 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-2xl animate-in fade-in duration-150">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="text-xs text-white">
                <span className="font-semibold">Ad playing</span> •{' '}
                <span className="text-amber-400 font-bold">
                  {adState.remainingSec > 0
                    ? `Auto-clicking Skip in ${adState.remainingSec}s...`
                    : 'Auto-Skipping now!'}
                </span>
              </div>
              <button
                onClick={handleTriggerSkip}
                className="ml-1 px-3 py-1 rounded-lg text-xs font-bold text-neutral-950 shadow transition active:scale-95"
                style={{ backgroundColor: customTheme.logoColor }}
              >
                Skip Ad ⚡
              </button>
            </div>
          )}
        </div>

        {/* Video Title & Next / Previous Song Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-display font-bold text-lg sm:text-xl lg:text-2xl text-white tracking-tight leading-snug flex-1">
            {track.title}
          </h1>

          <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
            <button
              onClick={onPrevTrack}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition border border-neutral-700"
              title="Previous Song"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <button
              onClick={onNextTrack}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 text-neutral-950 transition shadow hover:opacity-90 active:scale-95"
              style={{ backgroundColor: customTheme.logoColor }}
              title="Next Song (Zero Live News)"
            >
              <span>Next</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Channel Details & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
          {/* Channel info & Golden Subscribe button */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/40">
              <img
                src={track.channelAvatar || track.thumbnail}
                alt={track.channel}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>{track.channel}</span>
                <span
                  className="w-3.5 h-3.5 rounded-full text-[9px] font-black flex items-center justify-center text-neutral-950"
                  style={{ backgroundColor: customTheme.logoColor }}
                >
                  ✓
                </span>
              </h3>
              <p className="text-xs text-neutral-400">4.82M subscribers</p>
            </div>

            {/* Golden Subscribe Button (Replaces red button) */}
            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`ml-2 px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition shadow ${
                isSubscribed
                  ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                  : 'text-neutral-950 hover:opacity-90'
              }`}
              style={{
                backgroundColor: isSubscribed ? undefined : customTheme.logoColor,
              }}
            >
              {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </div>

          {/* Action buttons: Like, Share, Download MP3, MP3 Mode */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Like/Dislike pill */}
            <div className="flex items-center bg-[#272727] rounded-full overflow-hidden border border-neutral-700/60">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-700 transition ${
                  isLiked ? 'text-amber-400' : 'text-neutral-200'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{likeCount.toLocaleString()}</span>
              </button>
              <div className="w-[1px] h-4 bg-neutral-600" />
              <button className="px-2.5 py-1.5 text-xs hover:bg-neutral-700 text-neutral-400 hover:text-white transition">
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>

            {/* Share */}
            <button
              onClick={() => alert('Link copied: ' + window.location.href)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#272727] hover:bg-[#333] text-neutral-200 text-xs font-semibold border border-neutral-700/60 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Download MP3 */}
            <button
              onClick={() => onDownloadTrack(track)}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#272727] hover:bg-[#333] text-neutral-200 text-xs font-semibold border border-neutral-700/60 transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{isDownloading ? 'Saving...' : 'Download MP3'}</span>
            </button>

            {/* MP3 Background Mode Toggle */}
            <button
              onClick={onTogglePlayerMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                playerMode === 'mp3'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                  : 'bg-[#272727] text-amber-300 hover:bg-[#333] border border-amber-500/40'
              }`}
              title="Continuous Audio playback when app is minimized"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{playerMode === 'mp3' ? 'MP3 Active' : 'MP3 Mode'}</span>
            </button>

            {/* AI Summary */}
            <button
              onClick={onOpenAiSummary}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Summary</span>
            </button>
          </div>
        </div>

        {/* Expandable Description Box */}
        <div className="bg-[#1f1f1f] hover:bg-[#252525] p-3.5 rounded-2xl border border-neutral-800 transition cursor-pointer text-xs">
          <div className="flex items-center gap-2 font-bold text-neutral-200 mb-1">
            <span>{track.views}</span>
            <span>•</span>
            <span>{track.publishedAt || 'Uploaded recently'}</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{track.bitrate || '320 kbps Master'}</span>
          </div>

          <p className={`text-neutral-300 leading-relaxed ${isDescExpanded ? '' : 'line-clamp-2'}`}>
            {track.description ||
              `Streamed in YouTube Gold VIP edition. Auto-skip ad shield active. Continuous MP3 background playback enabled.`}
          </p>

          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="mt-1 font-bold text-white hover:text-amber-400 transition"
          >
            {isDescExpanded ? 'Show less' : '...more'}
          </button>
        </div>

        {/* Real YouTube Comments Section */}
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>{comments.length} Comments</span>
            </h3>
          </div>

          {/* Add a comment input */}
          <form onSubmit={handleAddComment} className="flex gap-3 items-start">
            <DivineAvatar size="md" borderGoldColor={customTheme.logoColor} />
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Add a comment on YouTube Gold..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-700 focus:border-amber-400 text-sm text-neutral-200 py-1.5 focus:outline-none placeholder-neutral-500 transition"
              />
              {commentInput && (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCommentInput('')}
                    className="px-3 py-1 rounded-full text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded-full bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300"
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Comments list */}
          <div className="space-y-3.5 pt-2">
            {comments.map((c: any) => (
              <div key={c.id} className="flex gap-3 text-xs items-start">
                {c.isDivine || c.author.includes('Gold VIP') ? (
                  <DivineAvatar size="sm" borderGoldColor={customTheme.logoColor} className="flex-shrink-0" />
                ) : (
                  <img
                    src={c.avatar}
                    alt={c.author}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-neutral-700"
                  />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{c.author}</span>
                    <span className="text-neutral-500 text-[11px]">{c.time}</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed text-xs">{c.text}</p>
                  <div className="flex items-center gap-3 text-neutral-400 pt-0.5">
                    <button className="flex items-center gap-1 hover:text-white">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{c.likes || ''}</span>
                    </button>
                    <button className="hover:text-white">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button className="hover:text-white font-medium">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right 4 Cols: Up Next / Related YouTube Videos Column */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-300 flex items-center gap-2 pb-1 border-b border-neutral-800">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Up Next on YouTube</span>
        </h3>

        <div className="space-y-2.5">
          {relatedVideos.slice(0, 15).map((v) => (
            <div
              key={v.id}
              onClick={() => onSelectRelated(v)}
              className="flex gap-2.5 p-1.5 rounded-xl cursor-pointer hover:bg-[#1f1f1f] transition group"
            >
              <div className="relative w-40 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[10px] font-mono text-white">
                  {v.duration}
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-start gap-1 py-0.5">
                <h4 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-amber-300 transition">
                  {v.title}
                </h4>
                <p className="text-[11px] text-neutral-400 truncate">{v.channel}</p>
                <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                  <span>{v.views}</span>
                  <span>•</span>
                  <span className="text-emerald-400">Ad-Free</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
