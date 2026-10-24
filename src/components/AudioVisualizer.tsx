import React, { useEffect, useRef } from 'react';
import { Sparkles, Radio, Music, Disc3, ShieldCheck } from 'lucide-react';
import { VideoTrack } from '../types';

interface AudioVisualizerProps {
  track: VideoTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render dynamic animated golden frequency waveform on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const barCount = 48;
      const barWidth = width / barCount - 2;

      // Draw reflective ambient center line
      ctx.strokeStyle = 'rgba(255, 179, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);

        // Calculate rhythmic frequency modulation
        const frequency = isPlaying
          ? Math.sin(i * 0.25 + phase) * 0.5 +
            Math.sin(i * 0.1 - phase * 0.6) * 0.3 +
            Math.cos(i * 0.4 + phase * 1.2) * 0.2
          : 0.08;

        const maxBarHeight = height * 0.42;
        const barH = Math.max(4, Math.abs(frequency) * maxBarHeight);

        // Golden metallic gradient for equalizer bars
        const gradient = ctx.createLinearGradient(0, centerY - barH, 0, centerY + barH);
        gradient.addColorStop(0, '#FFF59D'); // pale gold
        gradient.addColorStop(0.3, '#FFCA28'); // warm amber
        gradient.addColorStop(0.7, '#FFA000'); // deep gold
        gradient.addColorStop(1, '#FF6F00'); // gold orange

        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(255, 179, 0, 0.4)';
        ctx.shadowBlur = isPlaying ? 8 : 2;

        // Draw top bar
        ctx.fillRect(x, centerY - barH, barWidth, barH);
        // Draw inverted mirrored reflection
        ctx.fillStyle = 'rgba(255, 179, 0, 0.25)';
        ctx.shadowBlur = 0;
        ctx.fillRect(x, centerY + 1, barWidth, barH * 0.45);
      }

      if (isPlaying) {
        phase += 0.08;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full aspect-video min-h-[340px] max-h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#14161f] via-[#0d0f14] to-[#08090c] border border-amber-500/25 flex flex-col items-center justify-between p-4 sm:p-6 shadow-2xl">
      {/* Background ambient gold aura */}
      <div
        className={`absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none transition-opacity duration-700 ${
          isPlaying ? 'opacity-100' : 'opacity-30'
        }`}
      />

      {/* Top Status Indicators */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-amber-500/40 backdrop-blur-md text-xs shadow-lg">
          <span
            className={`w-2 h-2 rounded-full ${
              isPlaying ? 'bg-amber-400 animate-ping' : 'bg-neutral-600'
            }`}
          />
          <span className="text-amber-300 font-semibold tracking-wide">
            MP3 Background Audio Engine
          </span>
          <span className="hidden sm:inline text-neutral-500">•</span>
          <span className="hidden sm:inline text-neutral-400 text-[11px]">
            App minimize hone par bhi continuous playback
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Real YouTube Audio • 320kbps</span>
        </div>
      </div>

      {/* Center Display: Rotating Vinyl Record & Cover */}
      <div className="relative flex items-center justify-center my-auto group z-10">
        {/* Glow halo behind vinyl */}
        <div
          className={`absolute -inset-6 rounded-full bg-amber-500/20 blur-2xl pointer-events-none transition-all duration-700 ${
            isPlaying ? 'opacity-100 scale-110' : 'opacity-20 scale-90'
          }`}
        />

        {/* Vinyl outer disc */}
        <div
          onClick={onTogglePlay}
          className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#111317] border-4 border-amber-500/50 shadow-2xl shadow-amber-500/25 flex items-center justify-center relative cursor-pointer hover:border-amber-400 transition-all ${
            isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at center, #1b1e25 22%, #0e1014 45%, #181b22 72%, #0a0b0d 100%)`,
          }}
          title="Click to Play/Pause"
        >
          {/* Subtle vinyl grooves rings */}
          <div className="absolute inset-3 rounded-full border border-neutral-700/50 pointer-events-none" />
          <div className="absolute inset-8 rounded-full border border-neutral-700/40 pointer-events-none" />
          <div className="absolute inset-14 rounded-full border border-neutral-700/30 pointer-events-none" />

          {/* Album artwork center sticker */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-400/90 shadow-xl relative">
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-full h-full object-cover"
            />
            {/* Center spindle hole with golden bevel */}
            <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-[#0a0c0f] border-2 border-amber-400 shadow-inner" />
          </div>
        </div>
      </div>

      {/* Track Metadata */}
      <div className="text-center max-w-lg z-10 px-4 my-1">
        <h3 className="font-display text-sm sm:text-base font-bold text-white line-clamp-1 drop-shadow">
          {track.title}
        </h3>
        <p className="text-xs text-neutral-400 mt-0.5 flex items-center justify-center gap-1.5">
          <span className="text-amber-400 font-semibold">{track.channel}</span>
          <span className="text-neutral-600">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Ad-Free Gold Stream
          </span>
        </p>
      </div>

      {/* Real Canvas Equalizer Waveform */}
      <div className="w-full max-w-2xl h-14 sm:h-16 z-10 relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={64}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
