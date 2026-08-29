import React from 'react';

/**
 * AASRA Companion Component
 * A trauma-informed, hybrid abstract AI support companion.
 * Rendered as an elegant luminous orb with organic breathing motion,
 * concentric listening waves, gentle thinking light, and serene reassuring glow.
 * 
 * Props:
 * - state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'safety_support' | 'reassuring' | 'calm'
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

  const isSafetySupport = state === 'safety_support' || state === 'reassuring' || state === 'calm';

  return (
    <div className="flex flex-col items-center justify-center space-y-3 select-none">
      <div className={`relative flex items-center justify-center ${currentSize.container}`}>
        
        {/* Concentric Ambient Waves when Listening / Speaking / Thinking */}
        {(state === 'listening' || state === 'speaking' || state === 'thinking') && (
          <>
            <div className="absolute inset-0 rounded-full bg-teal-500/15 animate-ping duration-1000 motion-reduce:animate-none"></div>
            <div className="absolute -inset-2 rounded-full border border-teal-400/20 animate-pulse motion-reduce:animate-none"></div>
            <div className="absolute -inset-4 rounded-full border border-cyan-400/10"></div>
          </>
        )}

        {/* Calm Serene Waves during Safety Support */}
        {isSafetySupport && (
          <>
            <div className="absolute -inset-2 rounded-full bg-teal-400/10 animate-pulse duration-1000 motion-reduce:animate-none"></div>
            <div className="absolute -inset-4 rounded-full border border-emerald-400/20"></div>
          </>
        )}

        {/* Outer Glow Halo */}
        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${
          state === 'speaking'
            ? 'bg-primary/20 opacity-80'
            : state === 'listening'
            ? 'bg-gradient-to-r from-teal-400/35 to-cyan-500/35 opacity-80'
            : state === 'thinking'
            ? 'bg-gradient-to-r from-indigo-500/35 via-cyan-400/35 to-teal-400/35 opacity-80'
            : isSafetySupport
            ? 'bg-gradient-to-r from-teal-400/30 via-emerald-400/30 to-amber-300/25 opacity-85'
            : 'bg-gradient-to-r from-teal-500/25 via-cyan-500/25 to-blue-500/25 opacity-70'
        }`}></div>

        {/* Main Luminous Orb Container */}
        <div className={`relative ${currentSize.orb} rounded-full transition-all duration-700 flex items-center justify-center overflow-hidden shadow-2xl border ${
          state === 'listening' ? 'scale-105 border-teal-300/60' :
          state === 'thinking' ? 'border-indigo-300/60 animate-pulse' :
          isSafetySupport ? 'border-emerald-300/60 bg-teal-950/80' :
          'border-teal-300/30 animate-breathing-orb motion-reduce:animate-none'
        }`}>
          
          {/* Internal Gradient Surface */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-teal-950"></div>
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${
            isSafetySupport 
              ? 'from-teal-400/30 via-emerald-500/20 to-transparent' 
              : 'from-teal-400/20 via-cyan-600/15 to-transparent'
          }`}></div>

          {/* Abstract Facial Geometry (Subtle Presence) */}
          <svg className="w-full h-full p-2.5 opacity-85" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="aasraGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#527D7D" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#9183A0" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FFFDFC" stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="aasraWarmGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Subtle Inner Rings */}
            <circle cx="50" cy="50" r="38" stroke={isSafetySupport ? "url(#aasraWarmGlow)" : "url(#aasraGlow)"} strokeWidth="0.75" strokeDasharray="3 3" className="opacity-40" />
            <circle cx="50" cy="50" r="28" stroke={isSafetySupport ? "url(#aasraWarmGlow)" : "url(#aasraGlow)"} strokeWidth="1" className="opacity-60" />

            {/* Faint Abstract Eye Lines */}
            <path d="M 34 44 C 38 41, 44 41, 48 44" stroke={isSafetySupport ? "url(#aasraWarmGlow)" : "url(#aasraGlow)"} strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
            <path d="M 52 44 C 56 41, 62 41, 66 44" stroke={isSafetySupport ? "url(#aasraWarmGlow)" : "url(#aasraGlow)"} strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />

            {/* Dynamic Waveform Response / Presence Indicator */}
            {state === 'speaking' ? (
              <g className="animate-pulse motion-reduce:animate-none">
                <path d="M 30 58 Q 40 50, 50 58 T 70 58" stroke="url(#aasraGlow)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 36 64 Q 45 60, 50 64 T 64 64" stroke="url(#aasraGlow)" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
              </g>
            ) : state === 'listening' ? (
              <g className="animate-pulse motion-reduce:animate-none">
                <circle cx="50" cy="58" r="4" fill="url(#aasraGlow)" opacity="0.8" />
                <circle cx="50" cy="58" r="9" stroke="url(#aasraGlow)" strokeWidth="1" fill="none" opacity="0.5" />
              </g>
            ) : state === 'thinking' ? (
              <g className="animate-spin duration-3000 origin-center motion-reduce:animate-none">
                <circle cx="50" cy="58" r="5" stroke="url(#aasraGlow)" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.8" />
              </g>
            ) : isSafetySupport ? (
              /* Warm Reassuring Soft Arc */
              <g>
                <path d="M 36 58 Q 50 66, 64 58" stroke="url(#aasraWarmGlow)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9" />
                <circle cx="50" cy="50" r="10" fill="url(#aasraWarmGlow)" className="blur-[2px] opacity-60" />
              </g>
            ) : (
              /* Soft Serene Smile Curve */
              <path d="M 38 58 Q 50 64, 62 58" stroke="url(#aasraGlow)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.75" />
            )}

            {/* Core Presence Light */}
            <circle cx="50" cy="50" r="8" fill={isSafetySupport ? "url(#aasraWarmGlow)" : "url(#aasraGlow)"} className="blur-[1px] opacity-70" />
          </svg>
        </div>

        {/* State Badge Dot */}
        <div className="absolute -bottom-1 right-1 flex items-center space-x-1 bg-surface border border-primary/30 px-2 py-0.5 rounded-full shadow-lg">
          <span className={`w-1.5 h-1.5 rounded-full ${
            state === 'speaking' ? 'bg-emerald-400 animate-ping motion-reduce:animate-none' :
            state === 'listening' ? 'bg-cyan-400 animate-pulse motion-reduce:animate-none' :
            state === 'thinking' ? 'bg-indigo-400 animate-pulse motion-reduce:animate-none' :
            isSafetySupport ? 'bg-emerald-300 animate-pulse motion-reduce:animate-none' :
            'bg-teal-400'
          }`}></span>
          <span className="text-[9px] font-medium text-slate-300 uppercase tracking-wider">
            {state === 'speaking' ? 'AASRA Speaking' : 
             state === 'listening' ? 'AASRA Listening' : 
             state === 'thinking' ? 'AASRA Thinking' : 
             isSafetySupport ? 'AASRA Safety Support' : 
             'AASRA Active'}
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

