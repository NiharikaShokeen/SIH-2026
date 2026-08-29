import React, { useState } from 'react';
import { MessageSquare, PhoneCall, Smartphone, ShieldCheck, User, VolumeX, ShieldAlert, Heart } from 'lucide-react';
import AasraCompanion from './AasraCompanion';
import TraumaChatbot from './TraumaChatbot';
import IVRSSimulator from './IVRSSimulator';
import MobileAppView from './MobileAppView';
import PersonalizedProfileCard from './PersonalizedProfileCard';
import FacialMonitor from './FacialMonitor';
import { t } from '../utils/translations';

export default function IntakePortal({ onAssess, assessmentResult, isAnalyzing, selectedLanguage }) {
  const [channel, setChannel] = useState('chatbot');
  const [showProfile, setShowProfile] = useState(false);
  const [isSilentMode, setIsSilentMode] = useState(false);
  const [emotionalState, setEmotionalState] = useState(null);

  const handleEmotionalCheckin = (emotion) => {
    setEmotionalState(emotion);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* AASRA Hero Welcoming Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 glass-panel-luxury space-y-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Left Text & Introduction */}
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-950/80 border border-teal-800/80 px-3 py-1 rounded-full text-teal-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trauma-Informed & Confidential Support</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight font-sans">
              {t('aasra_hero_heading', selectedLanguage)}
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
              {t('aasra_hero_subtext', selectedLanguage)}
            </p>

            <div className="pt-2 p-3 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs text-teal-300 italic font-serif leading-relaxed">
              "{t('aasra_greeting', selectedLanguage)}"
            </div>
          </div>

          {/* AASRA Visual Companion Orb */}
          <div className="flex-shrink-0">
            <AasraCompanion state={isAnalyzing ? 'listening' : 'idle'} size="lg" showText={true} subtext="Here for you" />
          </div>

        </div>

        {/* Primary Interaction Choice Action Buttons */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          <button
            onClick={() => {
              setChannel('chatbot');
              setIsSilentMode(false);
            }}
            className={`p-3.5 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-md ${
              channel === 'chatbot' && !isSilentMode
                ? 'bg-teal-600 border-teal-500 text-white shadow-teal-500/20'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-teal-300" />
            <span>{t('btn_speak_aasra', selectedLanguage)}</span>
          </button>

          <button
            onClick={() => {
              setChannel('chatbot');
              setIsSilentMode(false);
            }}
            className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <User className="w-4 h-4 text-cyan-300" />
            <span>{t('btn_type_privately', selectedLanguage)}</span>
          </button>

          <button
            onClick={() => {
              setIsSilentMode(!isSilentMode);
              setChannel('chatbot');
            }}
            className={`p-3.5 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-md ${
              isSilentMode
                ? 'bg-amber-950 border-amber-800 text-amber-300'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Mutes voice synthesis audio prompts for safety & privacy"
          >
            <VolumeX className="w-4 h-4 text-amber-400" />
            <span>{isSilentMode ? 'Silent Mode Active' : t('btn_silent_mode', selectedLanguage)}</span>
          </button>

          <button
            onClick={() => alert('[EMERGENCY SOS DISPATCH]: Direct helpline connection requested to 112 / 14566.')}
            className="p-3.5 rounded-2xl border border-rose-900/80 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{t('btn_emergency_support', selectedLanguage)}</span>
          </button>

        </div>
      </div>

      {/* Optional Emotional Check-In Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 glass-panel space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {t('emotional_checkin_title', selectedLanguage)}
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Optional</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          {t('emotional_checkin_subtitle', selectedLanguage)}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { id: 'Overwhelmed', labelKey: 'feel_overwhelmed' },
            { id: 'Afraid or unsafe', labelKey: 'feel_afraid' },
            { id: 'Distressed', labelKey: 'feel_distressed' },
            { id: 'Angry', labelKey: 'feel_angry' },
            { id: 'I prefer not to say', labelKey: 'feel_skip' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleEmotionalCheckin(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                emotionalState === item.id
                  ? 'bg-teal-950 border-teal-700 text-teal-300 ring-1 ring-teal-400/40'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              {t(item.labelKey, selectedLanguage)}
            </button>
          ))}
        </div>
      </div>

      {/* Support Channel Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 glass-panel">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
            {t('intake_channel_label', selectedLanguage)}
          </span>
          
          <button
            onClick={() => setChannel('chatbot')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              channel === 'chatbot'
                ? 'bg-teal-600 text-white shadow-md'
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
                ? 'bg-teal-600 text-white shadow-md'
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
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{t('channel_mobile', selectedLanguage)}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowProfile(!showProfile)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            showProfile
              ? 'bg-teal-950 border-teal-700 text-teal-300'
              : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
        >
          <User className="w-3.5 h-3.5 text-teal-400" />
          <span>Your Support Plan</span>
        </button>
      </div>

      {/* Expandable Support Plan Card */}
      {showProfile && (
        <PersonalizedProfileCard selectedLanguage={selectedLanguage} />
      )}

      {/* Active Support Channel */}
      <div className="transition-all">
        {channel === 'chatbot' && (
          <TraumaChatbot
            onAssess={onAssess}
            assessmentResult={assessmentResult}
            isAnalyzing={isAnalyzing}
            selectedLanguage={selectedLanguage}
            isSilentMode={isSilentMode}
            emotionalState={emotionalState}
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

      <FacialMonitor
        sessionId={assessmentResult?.case_id ?? 'current-intake-session'}
        apiBase="/api/v1"
      />

    </div>
  );
}
