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
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          
          {/* Brand & Emblem Header */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-teal-500/40 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-teal-400" />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold tracking-widest text-teal-300 bg-teal-950 border border-teal-800 px-2 py-0.5 rounded font-mono">
                  {t('helpline_tag', selectedLanguage)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                  {t('helpline_subtitle', selectedLanguage)}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-semibold text-slate-100 tracking-tight font-sans leading-tight mt-0.5">
                {t('app_title', selectedLanguage)}
              </h1>
            </div>
          </div>

          {/* 3 Experience Modes Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('intake')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'intake'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('tab_intake', selectedLanguage)}</span>
            </button>

            <button
              onClick={() => setActiveTab('counsellor')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                activeTab === 'counsellor'
                  ? 'bg-slate-800 text-teal-300 border border-teal-500/40 shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t('tab_counsellor', selectedLanguage)}</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-2 right-2"></span>
            </button>

            <button
              onClick={() => setActiveTab('fairness')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'fairness'
                  ? 'bg-slate-800 text-teal-300 border border-teal-500/40 shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{t('tab_fairness', selectedLanguage)}</span>
            </button>
          </nav>

          {/* Right Controls: Quick Exit, Language Selector & Consent Status */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            
            {/* Quick Exit Stealth Toggle */}
            <button
              onClick={() => setIsStealthMode(!isStealthMode)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isStealthMode
                  ? 'bg-amber-950 border-amber-800 text-amber-300 font-mono'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
              title="Quick Exit / Hide Screen"
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {isStealthMode ? t('stealth_exit', selectedLanguage) : t('stealth_hide', selectedLanguage)}
              </span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-400 mr-2 flex-shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="auto" className="bg-slate-900 text-slate-100">Auto-Detect Indic</option>
                <option value="en" className="bg-slate-900 text-slate-100">English</option>
                <option value="hi" className="bg-slate-900 text-slate-100">Hindi (हिंदी)</option>
                <option value="hi-EN" className="bg-slate-900 text-slate-100">Hinglish (Code-Mixed)</option>
                <option value="mr" className="bg-slate-900 text-slate-100">Marathi (मराठी)</option>
                <option value="ta" className="bg-slate-900 text-slate-100">Tamil (தமிழ்)</option>
                <option value="bn" className="bg-slate-900 text-slate-100">Bengali (বাংলা)</option>
                <option value="te" className="bg-slate-900 text-slate-100">Telugu (తెలుగు)</option>
              </select>
            </div>

            {/* Consent Active Badge */}
            <button
              onClick={onOpenConsent}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                consentGranted
                  ? 'bg-emerald-950/80 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/80'
                  : 'bg-amber-950/80 border-amber-800/80 text-amber-300 hover:bg-amber-900/80'
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

