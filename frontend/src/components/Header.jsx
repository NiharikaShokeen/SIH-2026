import React from 'react';
import { ShieldAlert, Activity, FileText, Lock, Globe, Scale, EyeOff } from 'lucide-react';
import { t } from '../utils/translations';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  selectedLanguage, 
  setSelectedLanguage, 
  consentGranted, 
  onOpenConsent,
  isStealthMode,
  setIsStealthMode
}) {
  return (
    <header className="border-b border-slate-800/80 glass-panel-luxury sticky top-0 z-40 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5 gap-4">
          
          {/* Brand Logo & Government Emblem Header */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/25 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-5.5 h-5.5 text-cyan-400" />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/90 border border-cyan-800/80 px-2 py-0.5 rounded shadow-inner">
                  {t('helpline_tag', selectedLanguage)}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold hidden md:inline">
                  {t('helpline_subtitle', selectedLanguage)}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight font-sans leading-tight mt-1">
                {t('app_title', selectedLanguage)}
              </h1>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1.5 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => setActiveTab('intake')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'intake'
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t('tab_intake', selectedLanguage)}</span>
            </button>

            <button
              onClick={() => setActiveTab('counsellor')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 relative ${
                activeTab === 'counsellor'
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{t('tab_counsellor', selectedLanguage)}</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-2 right-2"></span>
            </button>

            <button
              onClick={() => setActiveTab('fairness')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'fairness'
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{t('tab_fairness', selectedLanguage)}</span>
            </button>
          </nav>

          {/* Right Controls: Stealth Mode, Language Selector, & Consent Status */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            
            {/* Stealth Quick-Hide Toggle */}
            <button
              onClick={() => setIsStealthMode(!isStealthMode)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-md ${
                isStealthMode
                  ? 'bg-slate-100 border-white text-slate-900 font-mono'
                  : 'bg-rose-950/60 border-rose-800/80 text-rose-300 hover:bg-rose-900/80'
              }`}
              title="Quick Hide Screen"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isStealthMode ? t('stealth_exit', selectedLanguage) : t('stealth_hide', selectedLanguage)}
              </span>
            </button>

            {/* Clean Language Selector */}
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-inner">
              <Globe className="w-3.5 h-3.5 text-cyan-400 mr-2 flex-shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="auto" className="bg-slate-900">Auto-Detect Indic</option>
                <option value="en" className="bg-slate-900">English</option>
                <option value="hi" className="bg-slate-900">Hindi (हिंदी)</option>
                <option value="hi-EN" className="bg-slate-900">Hinglish (Code-Mixed)</option>
                <option value="mr" className="bg-slate-900">Marathi (मराठी)</option>
                <option value="ta" className="bg-slate-900">Tamil (தமிழ்)</option>
                <option value="bn" className="bg-slate-900">Bengali (বাংলা)</option>
                <option value="te" className="bg-slate-900">Telugu (తెలుగు)</option>
              </select>
            </div>

            {/* Consent Active Badge */}
            <button
              onClick={onOpenConsent}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                consentGranted
                  ? 'bg-emerald-950/70 border-emerald-700/80 text-emerald-400 hover:bg-emerald-900/70'
                  : 'bg-amber-950/70 border-amber-700/80 text-amber-400 hover:bg-amber-900/70 animate-bounce'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {consentGranted ? t('consent_active', selectedLanguage) : t('consent_review', selectedLanguage)}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
