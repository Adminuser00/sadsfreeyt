import React from 'react';

interface GoldenLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Hex color for custom logo
}

export const GoldenLogo: React.FC<GoldenLogoProps> = ({
  className = '',
  size = 'md',
  color = '#FFB300',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 cursor-pointer select-none group ${className}`}>
      {/* Realistic 3D Metallic Golden Trident (Trishul) with Engraved Silver ॐ (Aum) */}
      <div
        className={`relative flex items-center justify-center rounded-2xl p-1 transition-all duration-300 group-hover:scale-105 shadow-xl flex-shrink-0 ${iconSizes[size]}`}
        style={{
          background: 'radial-gradient(circle at 35% 30%, #2a2215 0%, #121316 70%, #08090a 100%)',
          border: `1.5px solid ${color}`,
          boxShadow: `0 0 16px ${color}40, inset 0 1px 2px rgba(255,255,255,0.25)`,
        }}
        title="YouTube Gold - Sacred Trishul & Silver Aum"
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full filter drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 3D Gold Facet - Light Highlight */}
            <linearGradient id="goldLightFacet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="20%" stopColor="#FFF9C4" />
              <stop offset="60%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#FFB300" />
            </linearGradient>

            {/* 3D Gold Facet - Deep Shadow */}
            <linearGradient id="goldShadowFacet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA000" />
              <stop offset="50%" stopColor="#E65100" />
              <stop offset="100%" stopColor="#8D3B00" />
            </linearGradient>

            {/* Solid Polished 24K Gold Gradient */}
            <linearGradient id="goldPolished24K" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="25%" stopColor="#FFD54F" />
              <stop offset="50%" stopColor="#FFA000" />
              <stop offset="85%" stopColor="#E65100" />
              <stop offset="100%" stopColor="#FFD54F" />
            </linearGradient>

            {/* Ultra-Realistic Pure Chrome Silver Gradient for Aum (ॐ) */}
            <linearGradient id="silverChromeAum" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#ECEFF1" />
              <stop offset="55%" stopColor="#CFD8DC" />
              <stop offset="80%" stopColor="#90A4AE" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Deep Onyx & Gold Medallion Backing */}
            <radialGradient id="silverMedallionGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#252b36" />
              <stop offset="70%" stopColor="#0e1117" />
              <stop offset="100%" stopColor="#08090c" />
            </radialGradient>

            {/* Specular Glow */}
            <filter id="metallicShine" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#FFB300" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Golden Trishul (Trident) Group */}
          <g filter="url(#metallicShine)">
            {/* === CENTER SPEARHEAD (Beveled Razor Blade) === */}
            {/* Left Beveled Facet (Light) */}
            <path
              d="M60 4 L53 28 L60 38 Z"
              fill="url(#goldLightFacet)"
            />
            {/* Right Beveled Facet (Shadow) */}
            <path
              d="M60 4 L67 28 L60 38 Z"
              fill="url(#goldShadowFacet)"
            />
            {/* Center Razor Ridge Line */}
            <line x1="60" y1="4" x2="60" y2="38" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.9" />

            {/* === LEFT CURVED PRONG (Sharp Curved Blade) === */}
            {/* Outer Curve - High Specular Gold */}
            <path
              d="M36 17 C33 26 35 38 52 44 C49 41 42 37 42 28 C42 22 45 18 45 18 L36 17 Z"
              fill="url(#goldLightFacet)"
            />
            {/* Inner Curve - Deep Gold Shading */}
            <path
              d="M36 17 C39 24 43 32 54 44 C51 45 44 42 38 35 C35 29 36 17 36 17 Z"
              fill="url(#goldShadowFacet)"
            />
            {/* Left Spearlet Tip */}
            <polygon points="36,17 38,10 42,17 39,18" fill="url(#goldLightFacet)" />

            {/* === RIGHT CURVED PRONG (Sharp Curved Blade) === */}
            {/* Outer Curve */}
            <path
              d="M84 17 C87 26 85 38 68 44 C71 41 78 37 78 28 C78 22 75 18 75 18 L84 17 Z"
              fill="url(#goldLightFacet)"
            />
            {/* Inner Curve */}
            <path
              d="M84 17 C81 24 77 32 66 44 C69 45 76 42 82 35 C85 29 84 17 84 17 Z"
              fill="url(#goldShadowFacet)"
            />
            {/* Right Spearlet Tip */}
            <polygon points="84,17 82,10 78,17 81,18" fill="url(#goldLightFacet)" />

            {/* === TRIDENT BASE: SACRED DAMRU & LOTUS COLLAR === */}
            {/* Damru Upper Cup */}
            <path d="M50 44 L70 44 L64 50 L56 50 Z" fill="url(#goldLightFacet)" />
            {/* Damru Lower Cup */}
            <path d="M56 50 L64 50 L70 56 L50 56 Z" fill="url(#goldShadowFacet)" />
            {/* Center Damru Ring Knot */}
            <ellipse cx="60" cy="50" rx="4.5" ry="2" fill="#FFF9C4" stroke="#FFA000" strokeWidth="0.8" />
            {/* Damru Hanging Beads (Rudraksha Cords) */}
            <path d="M58 50 Q 52 53, 49 57" stroke="#FFD54F" strokeWidth="1" fill="none" />
            <circle cx="48" cy="58" r="1.8" fill="#8D3B00" stroke="#FFD54F" strokeWidth="0.5" />
            <path d="M62 50 Q 68 53, 71 57" stroke="#FFD54F" strokeWidth="1" fill="none" />
            <circle cx="72" cy="58" r="1.8" fill="#8D3B00" stroke="#FFD54F" strokeWidth="0.5" />

            {/* === VERTICAL GOLDEN SHAFT (Pillar Rod) === */}
            <rect x="57" y="56" width="6" height="56" rx="3" fill="url(#goldPolished24K)" />
            {/* Light Gleam on Shaft */}
            <line x1="58.5" y1="56" x2="58.5" y2="112" stroke="#FFF9C4" strokeWidth="1" opacity="0.8" />
            {/* Bottom Spearlet Crown Base */}
            <polygon points="60,118 53,110 67,110" fill="url(#goldPolished24K)" />
          </g>

          {/* === SILVER AUMN (ॐ) MEDALLION IN THE TRIDENT SHAFT === */}
          {/* Outer Silver Ring Bezel */}
          <circle
            cx="60"
            cy="78"
            r="16.5"
            fill="url(#silverMedallionGlow)"
            stroke="url(#silverChromeAum)"
            strokeWidth="1.8"
          />
          {/* Inner Golden Rim */}
          <circle
            cx="60"
            cy="78"
            r="14"
            fill="none"
            stroke="url(#goldPolished24K)"
            strokeWidth="0.8"
            opacity="0.9"
          />

          {/* Real Sanskrit Devanagari Silver Aum (ॐ) - Authentic Handcrafted Curves */}
          <g id="silver-sacred-om" style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.95))' }}>
            {/* Sacred ॐ Path Vector for crisp, high-res rendering */}
            <path
              d="M 52 70 
                 C 54 67, 58 67, 60 69 
                 C 61 71, 60 74, 57 76 
                 C 61 77, 63 80, 62 84 
                 C 60 88, 54 88, 51 85
                 M 58 75
                 C 63 75, 68 76, 70 79
                 C 72 82, 71 86, 68 87
                 M 64 68
                 C 67 68, 70 70, 71 73
                 M 68 64
                 C 69 64, 71 65, 71 65"
              stroke="url(#silverChromeAum)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Candrabindu (Crescent) */}
            <path
              d="M 64 65 Q 68 68, 72 65"
              stroke="url(#silverChromeAum)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
            {/* Bindu (Sacred Dot) */}
            <circle cx="68" cy="62" r="1.3" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Unified Brand Wordmark: "YouTube Gold" seamlessly combined (No separated boxes) */}
      <div className="flex items-center font-display tracking-tight font-black">
        <span className={`text-white tracking-tight ${textSizes[size]}`}>
          YouTube
        </span>
        <span
          className={`ml-1 tracking-tight bg-gradient-to-r from-[#FFF59D] via-[#FFD54F] to-[#FF8F00] bg-clip-text text-transparent drop-shadow-[0_1px_8px_rgba(255,179,0,0.5)] ${textSizes[size]}`}
          style={{
            fontStyle: 'italic',
            fontWeight: 900,
          }}
        >
          Gold
        </span>
        <span className="text-[10px] text-amber-400/80 font-bold ml-1 self-start -mt-0.5 tracking-normal">
          IN
        </span>
      </div>
    </div>
  );
};
