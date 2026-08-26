import React, { useState } from 'react';
import { MessageSquare, PhoneCall, Smartphone, ShieldCheck, Sliders, User } from 'lucide-react';
import TraumaChatbot from './TraumaChatbot';
import IVRSSimulator from './IVRSSimulator';
import MobileAppView from './MobileAppView';
import VoiceModulatorPanel from './VoiceModulatorPanel';
import PersonalizedProfileCard from './PersonalizedProfileCard';
import { t } from '../utils/translations';

export default function IntakePortal({ onAssess, assessmentResult, isAnalyzing, selectedLanguage }) {
  const [channel, setChannel] = useState('chatbot');
  const [showModulator, setShowModulator] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Top Channel Switcher & Personalization Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 glass-panel-luxury">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
            {t('intake_channel_label', selectedLanguage)}
          </span>
          
          <button
            onClick={() => setChannel('chatbot')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              channel === 'chatbot'
                ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('channel_chatbot', selectedLanguage)}</span>
          </button>

          <button
            onClick={() => setChannel('ivrs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              channel === 'ivrs'
                ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('channel_ivrs', selectedLanguage)}</span>
          </button>

          <button
            onClick={() => setChannel('mobile')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              channel === 'mobile'
                ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{t('channel_mobile', selectedLanguage)}</span>
          </button>
        </div>

        {/* Personalized Interactive Tools Toolbar */}
        <div className="flex items-center space-x-2">
          
          <button
            type="button"
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              showProfile
                ? 'bg-indigo-950 border-indigo-700 text-indigo-300'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Victim Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setShowModulator(!showModulator)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              showModulator
                ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Voice Audio Modulator</span>
          </button>

        </div>
      </div>

      {/* Expandable Voice Modulation Panel */}
      {showModulator && (
        <VoiceModulatorPanel selectedLanguage={selectedLanguage} />
      )}

      {/* Expandable Victim Profile Card */}
      {showProfile && (
        <PersonalizedProfileCard selectedLanguage={selectedLanguage} />
      )}

      {/* Active Intake Channel */}
      <div className="transition-all">
        {channel === 'chatbot' && (
          <TraumaChatbot
            onAssess={onAssess}
            assessmentResult={assessmentResult}
            isAnalyzing={isAnalyzing}
            selectedLanguage={selectedLanguage}
          />
        )}

        {channel === 'ivrs' && (
          <IVRSSimulator
            onAssess={onAssess}
            assessmentResult={assessmentResult}
            isAnalyzing={isAnalyzing}
            selectedLanguage={selectedLanguage}
          />
        )}

        {channel === 'mobile' && (
          <MobileAppView
            onAssess={onAssess}
            assessmentResult={assessmentResult}
            isAnalyzing={isAnalyzing}
            selectedLanguage={selectedLanguage}
          />
        )}
      </div>

    </div>
  );
}
