import React from 'react';

interface DivineAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  borderGoldColor?: string;
}

export const DivineAvatar: React.FC<DivineAvatarProps> = ({
  className = '',
  size = 'md',
  borderGoldColor = '#FFB300',
}) => {
  const sizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center p-[1.5px] shadow-md transition-transform hover:scale-105 cursor-pointer relative group ${sizes[size]} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${borderGoldColor} 0%, #FFA000 50%, #E65100 100%)`,
        boxShadow: `0 0 10px ${borderGoldColor}50`,
      }}
      title="Bhole Nath & Mata Parvati - YouTube Gold VIP"
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0c10] flex items-center justify-center relative">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Divine Aura Gradient */}
            <radialGradient id="divineAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFB300" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0a0c10" stopOpacity="0" />
            </radialGradient>

            {/* Mahadev Skin Tone (Neelkanth divine blue) */}
            <linearGradient id="shivaSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#90CAF9" />
              <stop offset="50%" stopColor="#64B5F6" />
              <stop offset="100%" stopColor="#1E88E5" />
            </linearGradient>

            {/* Mata Parvati Divine Radiant Golden Aura */}
            <linearGradient id="parvatiSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="60%" stopColor="#FFCA28" />
              <stop offset="100%" stopColor="#FFB300" />
            </linearGradient>

            {/* Sacred Saffron & Crimson Clothes */}
            <linearGradient id="shivaSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9800" />
              <stop offset="100%" stopColor="#E65100" />
            </linearGradient>

            <linearGradient id="parvatiRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5252" />
              <stop offset="100%" stopColor="#D50000" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <rect width="100" height="100" fill="#0c0e14" />
          <circle cx="50" cy="50" r="46" fill="url(#divineAura)" />

          {/* Golden Halo behind Bhole Nath & Mata Parvati */}
          <circle cx="50" cy="46" r="38" fill="none" stroke="#FFD54F" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" />

          {/* === LORD SHIVA (BHOLE NATH) - Left Side === */}
          {/* Shiva Jata (Hair Bun) */}
          <ellipse cx="40" cy="28" rx="14" ry="11" fill="#1A1C23" />
          {/* Crescent Moon (Chandra) on Jata */}
          <path
            d="M32 23 A 5 5 0 0 0 35 30 A 4.2 4.2 0 0 1 32 23 Z"
            fill="#FFFFFF"
            style={{ filter: 'drop-shadow(0 0 3px #FFFFFF)' }}
          />
          {/* Ganga Stream symbol */}
          <path d="M40 18 Q 42 12, 44 8" stroke="#81D4FA" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Shiva Face Profile/Front */}
          <path
            d="M30 35 Q 28 55, 41 58 Q 48 55, 48 38 Z"
            fill="url(#shivaSkin)"
          />
          {/* Sacred Tripundra Vibhuti on Forehead */}
          <line x1="33" y1="36" x2="43" y2="36" stroke="#FFFFFF" strokeWidth="1" />
          <line x1="33" y1="38" x2="43" y2="38" stroke="#FFFFFF" strokeWidth="1" />
          <line x1="33" y1="40" x2="43" y2="40" stroke="#FFFFFF" strokeWidth="1" />
          {/* Third Eye (Trinetra) */}
          <ellipse cx="38" cy="38" rx="1" ry="2" fill="#FF1744" />

          {/* Shiva Calm Eyes & Smile */}
          <path d="M33 46 Q 36 48, 39 46" stroke="#102030" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M35 52 Q 38 54, 41 52" stroke="#102030" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Neelkanth (Throat Blue) & Rudraksha Mala */}
          <path d="M36 57 Q 41 62, 45 58" stroke="#0D47A1" strokeWidth="2" fill="none" />
          <path d="M32 58 Q 40 68, 48 59" stroke="#8D6E63" strokeWidth="1.6" strokeDasharray="2 1.5" fill="none" />

          {/* Vasuki Naag (Serpent) on Shiva's Neck */}
          <path d="M31 56 Q 38 60, 47 54" stroke="#43A047" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Shiva Torso / Saffron Cloth */}
          <path d="M22 66 C 26 58, 40 62, 48 68 L 48 98 L 18 98 Z" fill="url(#shivaSaffron)" />

          {/* Golden Trishul beside Shiva */}
          <line x1="18" y1="18" x2="18" y2="95" stroke="#FFD54F" strokeWidth="1.5" />
          <path d="M14 26 L18 20 L22 26" stroke="#FFD54F" strokeWidth="1.5" fill="none" />
          <line x1="18" y1="16" x2="18" y2="24" stroke="#FFD54F" strokeWidth="1.8" />
          {/* Tiny Damru on Trishul */}
          <polygon points="15,30 21,30 15,36 21,36" fill="#FFA000" />

          {/* === MATA PARVATI (DEVI GAURI) - Right Side === */}
          {/* Mata Parvati Golden Mukut (Crown) */}
          <polygon points="56,22 62,13 68,20 74,13 80,22" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.8" />
          <circle cx="68" cy="18" r="1.5" fill="#FF1744" />

          {/* Mata Parvati Dark Lustrous Hair */}
          <ellipse cx="68" cy="34" rx="14" ry="14" fill="#141416" />

          {/* Mata Parvati Radiant Face */}
          <path
            d="M56 34 Q 54 54, 66 56 Q 78 54, 76 34 Z"
            fill="url(#parvatiSkin)"
          />

          {/* Mata Parvati Red Bindi & Sindoor */}
          <circle cx="66" cy="33" r="1.5" fill="#D50000" />
          <line x1="66" y1="26" x2="66" y2="30" stroke="#FF1744" strokeWidth="1.2" />

          {/* Gentle Lotus Eyes & Graceful Smile */}
          <path d="M60 41 Q 63 43, 67 41" stroke="#3E2723" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M62 47 Q 66 50, 70 47" stroke="#C2185B" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Golden Nose Ring (Nath) */}
          <circle cx="61" cy="44" r="1.8" fill="none" stroke="#FFD54F" strokeWidth="0.8" />

          {/* Golden Necklace & Red Chunari */}
          <path d="M57 55 Q 66 62, 75 55" stroke="#FFD54F" strokeWidth="2" fill="none" />
          <path d="M48 68 C 55 58, 75 58, 86 68 L 86 98 L 48 98 Z" fill="url(#parvatiRed)" />

          {/* Divine Blessing Lotus in hand */}
          <ellipse cx="50" cy="78" rx="6" ry="4" fill="#F48FB1" opacity="0.9" />

          {/* Outer Ring Border */}
          <circle cx="50" cy="50" r="48" fill="none" stroke="#FFD54F" strokeWidth="2" opacity="0.9" />
        </svg>
      </div>
    </div>
  );
};
