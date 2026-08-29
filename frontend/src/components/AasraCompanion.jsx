import React from 'react';

/**
 * AASRA Companion Component
 * A trauma-informed, hybrid abstract AI support companion.
 * Rendered as an elegant luminous orb with subtle organic breathing motion,
 * concentric listening waves, and soft audio waveform animations while speaking.
 * 
 * Props:
 * - state: 'idle' | 'breathing' | 'listening' | 'speaking' | 'calm'
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - showText: boolean
 * - subtext: string
 */
export default function AasraCompanion({ state = 'idle', size = 'md', showText = false, subtext }) {
  const sizeMap = {
    sm: { container: 'w-12 h-12', orb: 'w-10 h-10', text: 'text-xs' },
    md: { container: 'w-24 h-24', orb: 'w-20 h-20', text: 'text-sm' },
    lg: { container: 'w-36 h-36', orb: 'w-32 h-32', text: 'text-base' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex flex-col items-center justify-center space-y-3 select-none">
      <div className={`relative flex items-center justify-center ${currentSize.container}`}>
        
        {/* Concentric Ambient Waves when Listening / Speaking */}
        {(state === 'listening' || state === 'speaking') && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping duration-1000"></div>
            <div className="absolute -inset-2 rounded-full border border-primary/20 animate-pulse"></div>
            <div className="absolute -inset-4 rounded-full border border-secondary/15"></div>
          </>
        )}

        {/* Outer Glow Halo */}
        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${
          state === 'speaking'
            ? 'bg-primary/20 opacity-80'
            : state === 'listening'
            ? 'bg-primary/15 opacity-70'
            : state === 'calm'
            ? 'bg-secondary/10 opacity-50'
            : 'bg-primary/10 opacity-60'
        }`}></div>

        {/* Main Luminous Orb Container */}
        <div className={`relative ${currentSize.orb} rounded-full transition-all duration-700 flex items-center justify-center overflow-hidden shadow-2xl border border-primary/30 ${
          state === 'listening' ? 'scale-105 border-primary/50' : 'animate-breathing-orb'
        }`}>
          
          {/* Internal Gradient Surface */}
          <div className="absolute inset-0 bg-primary-dark"></div>
          <div className="absolute inset-0 bg-primary/10"></div>

          {/* Abstract Facial Geometry (Subtle Presence) */}
          <svg className="w-full h-full p-2.5 opacity-80" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="aasraGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#527D7D" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#9183A0" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FFFDFC" stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="aasraWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#527D7D" />
                <stop offset="100%" stopColor="#9183A0" />
              </linearGradient>
            </defs>

            {/* Subtle Inner Rings */}
            <circle cx="50" cy="50" r="38" stroke="url(#aasraGlow)" strokeWidth="0.75" strokeDasharray="3 3" className="opacity-40" />
            <circle cx="50" cy="50" r="28" stroke="url(#aasraGlow)" strokeWidth="1" className="opacity-60" />

            {/* Faint Abstract Eye Lines */}
            <path d="M 34 44 C 38 41, 44 41, 48 44" stroke="url(#aasraGlow)" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
            <path d="M 52 44 C 56 41, 62 41, 66 44" stroke="url(#aasraGlow)" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />

            {/* Dynamic Waveform Response / Presence Indicator */}
            {state === 'speaking' ? (
              <g className="animate-pulse">
                <path d="M 30 58 Q 40 50, 50 58 T 70 58" stroke="url(#aasraGlow)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 36 64 Q 45 60, 50 64 T 64 64" stroke="url(#aasraGlow)" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
              </g>
            ) : state === 'listening' ? (
              <g className="animate-pulse">
                <circle cx="50" cy="58" r="4" fill="url(#aasraGlow)" opacity="0.8" />
                <circle cx="50" cy="58" r="9" stroke="url(#aasraGlow)" strokeWidth="1" fill="none" opacity="0.5" />
              </g>
            ) : (
              /* Soft Serene Smile Curve */
              <path d="M 38 58 Q 50 64, 62 58" stroke="url(#aasraGlow)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.75" />
            )}

            {/* Core Presence Light */}
            <circle cx="50" cy="50" r="8" fill="url(#aasraGlow)" className="blur-[1px] opacity-70" />
          </svg>
        </div>

        {/* State Badge Dot */}
        <div className="absolute -bottom-1 right-1 flex items-center space-x-1 bg-surface border border-primary/30 px-2 py-0.5 rounded-full shadow-lg">
          <span className={`w-1.5 h-1.5 rounded-full ${
            state === 'speaking' ? 'bg-primary animate-ping' :
            state === 'listening' ? 'bg-secondary animate-pulse' :
            'bg-primary'
          }`}></span>
          <span className="text-[9px] font-medium text-text-muted uppercase tracking-wider">
            {state === 'speaking' ? 'AASRA Speaking' : state === 'listening' ? 'AASRA Listening' : 'AASRA Active'}
          </span>
        </div>

      </div>

      {showText && (
        <div className="text-center space-y-1">
          <h4 className="text-sm font-semibold text-text tracking-wide flex items-center justify-center space-x-1.5">
            <span>AASRA Support Companion</span>
          </h4>
          {subtext && <p className={`text-text-muted max-w-sm ${currentSize.text}`}>{subtext}</p>}
        </div>
      )}
    </div>
  );
}
