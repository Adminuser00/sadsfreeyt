import React from 'react';
import {
  X,
  HardDrive,
  Trash2,
  Play,
  Headphones,
  CheckCircle2,
  WifiOff,
  Music,
} from 'lucide-react';
import { OfflineTrack, VideoTrack } from '../types';

interface OfflineLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  offlineTracks: OfflineTrack[];
  onSelectTrack: (track: VideoTrack, mode?: 'video' | 'mp3') => void;
  onDeleteTrack: (trackId: string) => void;
  currentTrackId?: string;
}

export const OfflineLibraryModal: React.FC<OfflineLibraryModalProps> = ({
  isOpen,
  onClose,
  offlineTracks,
  onSelectTrack,
  onDeleteTrack,
  currentTrackId,
}) => {
  if (!isOpen) return null;

  const totalStorageMb = offlineTracks.reduce((acc, t) => acc + (t.fileSizeMb || 4.2), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#12141a] border border-amber-500/30 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-gradient-to-r from-[#171922] to-[#12141a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Offline Downloaded Library</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {offlineTracks.length} Songs Saved
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Internet na hone par bhi locally phone/laptop se continuous suno.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storage Bar Indicator */}
        <div className="bg-[#151720] px-4 sm:px-5 py-3 border-b border-neutral-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <WifiOff className="w-4 h-4 text-amber-400" />
            <span>Local Device Storage:</span>
            <span className="font-semibold text-amber-300">
              {Math.round(totalStorageMb * 10) / 10} MB
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">IndexedDB Persistent Cache</span>
        </div>

        {/* Tracks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {offlineTracks.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-3">
                <Music className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-neutral-300">Koi offline song nahi hai abhi</h4>
              <p className="text-xs text-neutral-500 max-w-sm mt-1">
                Kisi bhi song ke neeche "Download MP3" button dabayein taaki bina internet ke bhi sun sakein.
              </p>
            </div>
          ) : (
            offlineTracks.map((track) => {
              const isCurrent = currentTrackId === track.id;

              return (
                <div
                  key={track.id}
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800">
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          onSelectTrack(track, 'mp3');
                          onClose();
                        }}
                        className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow"
                      >
                        <Play className="w-3.5 h-3.5 fill-neutral-950 translate-x-0.5" />
                      </button>
                    </div>

                    <div className="min-w-0">
                      <h5 className="text-xs sm:text-sm font-semibold truncate text-white">
                        {track.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span className="truncate">{track.channel}</span>
                        <span>•</span>
                        <span className="text-amber-400/90 font-mono">{track.fileSizeMb || 4.5} MB</span>
                        <span>•</span>
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Offline Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => {
                        onSelectTrack(track, 'mp3');
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-neutral-950 text-xs font-semibold flex items-center gap-1 transition"
                      title="Play in MP3 mode"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Play MP3</span>
                    </button>

                    <button
                      onClick={() => onDeleteTrack(track.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Delete from offline storage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>YouTube Gold Offline Engine • Zero Buffer</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 text-neutral-200 font-medium hover:bg-neutral-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
