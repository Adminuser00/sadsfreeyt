import React from 'react';
import { CustomTheme } from '../types';

interface YouTubeChipsProps {
  activeChip: string;
  onSelectChip: (chipId: string, query: string) => void;
  customTheme: CustomTheme;
}

export const YouTubeChips: React.FC<YouTubeChipsProps> = ({
  activeChip,
  onSelectChip,
  customTheme,
}) => {
  const chips = [
    { id: 'all', label: 'All', query: 'ek man bhram mein lord shiva song bhakti madhuram' },
    { id: 'shiva', label: 'Lord Shiva Bhakti', query: 'lord shiva songs bhram aur karm alakh niranjan' },
    { id: 'nusrat', label: 'Nusrat Fateh Ali Khan', query: 'nusrat fateh ali khan nonstop soulful qawwali' },
    { id: 'jukebox', label: 'Jukebox', query: 'bollywood superhit songs nonstop jukebox' },
    { id: 'nyoliwala', label: 'Dhanda Nyoliwala', query: 'dhanda nyoliwala no favours songs' },
    { id: 'music', label: 'Music', query: 'top trending music songs viral' },
    { id: 'arijit', label: 'Arijit Singh', query: 'arijit singh superhit songs' },
    { id: 'lofi', label: 'Lo-Fi Chill', query: 'lofi hip hop radio chill beats' },
    { id: 'podcasts', label: 'Podcasts', query: 'the ranveer show beerbiceps podcast' },
  ];

  return (
    <div
      className="sticky top-14 z-30 w-full px-4 py-2.5 flex items-center gap-2.5 overflow-x-auto scrollbar-none border-b border-neutral-800/60 select-none"
      style={{ backgroundColor: customTheme.backgroundColor }}
    >
      {chips.map((c) => {
        const isActive = activeChip === c.id;

        return (
          <button
            key={c.id}
            onClick={() => onSelectChip(c.id, c.query)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              isActive
                ? 'text-neutral-950 font-bold shadow-sm'
                : 'bg-[#272727]/90 text-neutral-200 hover:bg-[#333333]'
            }`}
            style={{
              backgroundColor: isActive ? customTheme.logoColor : undefined,
            }}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
};
