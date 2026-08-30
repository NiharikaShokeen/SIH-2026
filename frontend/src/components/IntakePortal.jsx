import React, { useState } from 'react';
import { MessageSquare, PhoneCall, Smartphone, ShieldCheck, User, VolumeX, ShieldAlert, Heart } from 'lucide-react';
import AasraCompanion from './AasraCompanion';
import TraumaChatbot from './TraumaChatbot';
import IVRSSimulator from './IVRSSimulator';
import MobileAppView from './MobileAppView';
import PersonalizedProfileCard from './PersonalizedProfileCard';
import FacialMonitor from './FacialMonitor';
import { t } from '../utils/translations';

export default function IntakePortal({ onAssess, assessmentResult, assessmentError, isAnalyzing, selectedLanguage }) {
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
      <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 glass-panel-luxury space-y-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Left Text & Introduction */}
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-3 py-1 rounded-full text-primary-dark text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trauma-Informed & Confidential Support</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text tracking-tight font-sans">
              {t('aasra_hero_heading', selectedLanguage)}
            </h2>

            <p className="text-sm md:text-base text-text-muted leading-relaxed font-sans">
              {t('aasra_hero_subtext', selectedLanguage)}
            </p>

            <div className="pt-2 p-3 bg-background rounded-2xl border border-border text-xs text-primary-dark italic font-serif leading-relaxed">
              "{isAnalyzing 
                ? "Thank you for sharing that. I'm taking a moment to understand what support may be helpful."
                : t('aasra_greeting', selectedLanguage)}"
            </div>
          </div>

          {/* AASRA Visual Companion Orb */}
          <div className="flex-shrink-0">
            <AasraCompanion 
              state={isAnalyzing ? 'thinking' : assessmentResult ? 'safety_support' : 'idle'} 
              size="lg" 
              showText={true} 
              subtext={isAnalyzing ? "Understanding what support may help..." : assessmentResult ? "Support Plan Active" : "Here for you"} 
            />
          </div>

        </div>

        {/* Primary Interaction Choice Action Buttons */}
        <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          <button
            onClick={() => {
              setChannel('chatbot');
              setIsSilentMode(false);
            }}
            className={`p-3.5 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-md ${
              channel === 'chatbot' && !isSilentMode
                ? 'bg-primary border-primary text-white shadow-md'
                : 'bg-background hover:bg-surface border-border text-text'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-primary" />
            <span>{t('btn_speak_aasra', selectedLanguage)}</span>
          </button>

          <button
            onClick={() => {
              setChannel('chatbot');
              setIsSilentMode(false);
            }}
            className="p-3.5 rounded-2xl border border-border bg-background hover:bg-surface text-text text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <User className="w-4 h-4 text-primary" />
            <span>{t('btn_type_privately', selectedLanguage)}</span>
          </button>

          <button
            onClick={() => {
              setIsSilentMode(!isSilentMode);
              setChannel('chatbot');
            }}
            className={`p-3.5 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-md ${
              isSilentMode
                ? 'bg-risk-moderate-bg border-risk-moderate/40 text-risk-moderate'
                : 'bg-background hover:bg-surface border-border text-text-muted'
            }`}
            title="Mutes voice synthesis audio prompts for safety & privacy"
          >
            <VolumeX className="w-4 h-4 text-risk-moderate" />
            <span>{isSilentMode ? 'Silent Mode Active' : t('btn_silent_mode', selectedLanguage)}</span>
          </button>

          <button
            onClick={() => alert('[EMERGENCY SOS DISPATCH]: Direct helpline connection requested to 112 / 14566.')}
            className="p-3.5 rounded-2xl border border-risk-critical/40 bg-risk-critical-bg hover:bg-risk-critical-bg text-risk-critical text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <ShieldAlert className="w-4 h-4 text-risk-critical" />
            <span>{t('btn_emergency_support', selectedLanguage)}</span>
          </button>

        </div>
      </div>

      {/* Optional Emotional Check-In Card */}
      <div className="bg-surface border border-border rounded-3xl p-5 glass-panel space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-text uppercase tracking-wider">
              {t('emotional_checkin_title', selectedLanguage)}
            </h3>
          </div>
          <span className="text-[10px] text-text-muted font-mono">Optional</span>
        </div>

        <p className="text-xs text-text-muted leading-relaxed font-sans">
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
                  ? 'bg-primary/10 border-primary/40 text-primary-dark ring-1 ring-primary/20'
                  : 'bg-background hover:bg-surface border-border text-text-muted'
              }`}
            >
              {t(item.labelKey, selectedLanguage)}
            </button>
          ))}
        </div>
      </div>

      {/* Support Channel Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-2 rounded-2xl border border-border glass-panel">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3">
            {t('intake_channel_label', selectedLanguage)}
          </span>
          
          <button
            onClick={() => setChannel('chatbot')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              channel === 'chatbot'
                ? 'bg-primary text-white shadow-md'
                : 'text-text-muted hover:text-text hover:bg-background'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('channel_chatbot', selectedLanguage)}</span>
          </button>

          <button
            onClick={() => setChannel('ivrs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              channel === 'ivrs'
                ? 'bg-primary text-white shadow-md'
                : 'text-text-muted hover:text-text hover:bg-background'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('channel_ivrs', selectedLanguage)}</span>
          </button>

          <button
            onClick={() => setChannel('mobile')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              channel === 'mobile'
                ? 'bg-primary text-white shadow-md'
                : 'text-text-muted hover:text-text hover:bg-background'
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
            showProfile || assessmentResult
              ? 'bg-primary/10 border-primary/40 text-primary-dark'
              : 'bg-background hover:bg-surface border-border text-text-muted'
          }`}
        >
          <User className="w-3.5 h-3.5 text-primary" />
          <span>Your Support Plan</span>
        </button>
      </div>

      {/* Expandable Support Plan Card */}
      {(showProfile || assessmentResult) && (
        <PersonalizedProfileCard 
          assessmentResult={assessmentResult}
          selectedLanguage={selectedLanguage} 
        />
      )}

      {/* Active Support Channel */}
      <div className="transition-all">
        {channel === 'chatbot' && (
          <TraumaChatbot
            onAssess={onAssess}
            assessmentResult={assessmentResult}
            assessmentError={assessmentError}
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

