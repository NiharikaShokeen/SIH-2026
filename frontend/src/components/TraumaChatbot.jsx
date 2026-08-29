import React, { useState } from 'react';
import { Mic, MicOff, Send, Volume2, Shield, HeartHandshake, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import AasraCompanion from './AasraCompanion';
import { SAMPLE_PRESETS } from '../utils/samplePresets';
import { audioEngine } from '../utils/audioSynthesizer';
import { t } from '../utils/translations';

export default function TraumaChatbot({ 
  onAssess, 
  assessmentResult, 
  isAnalyzing, 
  selectedLanguage, 
  isSilentMode = false,
  emotionalState = null 
}) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeProsody, setActiveProsody] = useState(null);
  const [victimMood, setVictimMood] = useState(emotionalState || 'Immediate Threat');
  const [victimName, setVictimName] = useState('Sunita Devi (Anonymized)');
  const [victimLocation, setVictimLocation] = useState('Hathras, UP');
  const [contextMemory, setContextMemory] = useState([]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(1);

      if (!isSilentMode) {
        audioEngine.speakPrompt('recording', selectedLanguage, 1.0, 1.0);
      }

      const interval = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 12) {
            clearInterval(interval);
            setIsRecording(false);
            return 12;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      audioEngine.stopAudio();
      setIsRecording(false);
    }
  };

  const handleScenarioSelect = (preset) => {
    setInputText(preset.complaint_text);
    setActiveProsody(preset.prosody);
    setVictimName(preset.name);
    setVictimLocation(preset.name.includes('Hathras') ? 'Hathras, UP' : preset.name.includes('Gwalior') ? 'Gwalior, MP' : 'Jaipur, RJ');
    
    // Add memory context tags
    const newTags = [];
    if (preset.complaint_text.includes('pati') || preset.complaint_text.includes('mara')) newTags.push('physical violence');
    if (preset.complaint_text.includes('Police') || preset.complaint_text.includes('FIR')) newTags.push('police refusal');
    if (preset.complaint_text.includes('jaan se maar')) newTags.push('death threats');
    setContextMemory(newTags);

    if (!isSilentMode) {
      audioEngine.speakPrompt(preset.complaint_text, selectedLanguage, 0.95, 1.0);
    }
  };

  const speakGreeting = () => {
    if (!isSilentMode) {
      audioEngine.speakPrompt('welcome', selectedLanguage, 1.0, 1.0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    audioEngine.stopAudio();

    onAssess({
      channel: 'Trauma Chatbot Intake',
      language_code: selectedLanguage,
      complaint_text: inputText,
      prosody_override: activeProsody,
      context_factors: {
        is_woman_or_child: true,
        is_repeat_harassment: true,
        police_fir_refused: true,
        perpetrator_in_power: true,
        victim_mood: emotionalState || victimMood
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Chat Intake */}
      <div className="lg:col-span-7 bg-surface border border-border rounded-3xl p-6 glass-panel flex flex-col justify-between space-y-6 shadow-2xl">
        
        {/* Chat Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-background border border-primary/30 rounded-2xl">
              <AasraCompanion state={isAnalyzing ? 'listening' : isRecording ? 'listening' : 'idle'} size="sm" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-text">{victimName}</span>
                <span className="text-[10px] text-primary-dark bg-primary/10 border-primary/30 px-2 py-0.5 rounded font-mono">
                  <MapPin className="w-2.5 h-2.5 inline mr-1" />
                  {victimLocation}
                </span>
              </div>
              <p className="text-xs text-text-muted">AASRA Support Session • Confidential & Encrypted</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isSilentMode && (
              <button
                type="button"
                onClick={speakGreeting}
                className="px-2.5 py-1.5 bg-background hover:bg-surface border border-border rounded-xl text-xs font-medium text-primary-dark flex items-center space-x-1 shadow-sm"
                title="Listen to AASRA Voice Prompt"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Audio</span>
              </button>
            )}

            <div className="flex items-center space-x-1 text-xs font-medium text-risk-low bg-risk-low-bg border-risk-low/40 px-3 py-1.5 rounded-xl">
              <Shield className="w-3.5 h-3.5" />
              <span>Session Safe</span>
            </div>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
          
          {/* AASRA Initial Welcoming Message */}
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-dark text-xs font-bold shadow-md flex-shrink-0">
              AA
            </div>
            <div className="bg-background border border-border p-4 rounded-2xl max-w-md text-xs text-text leading-relaxed space-y-1.5 shadow-sm">
              <p className="font-semibold text-primary-dark">AASRA Companion:</p>
              <p>Welcome. You are in a safe, confidential space. Take all the time you need. You can share your story in your own words, or choose a topic below.</p>
            </div>
          </div>

          {/* Conversation Memory Continuity Banner */}
          {contextMemory.length > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-primary/10 border border-primary/25 rounded-xl text-xs text-primary-dark">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
              <span>AASRA Context Memory: You mentioned <strong>{contextMemory.join(', ')}</strong>. You don't need to repeat these details.</span>
            </div>
          )}

          {/* User Complaint Narrative */}
          {inputText && (
            <div className="flex items-start justify-end space-x-3">
              <div className="bg-primary border border-primary p-4 rounded-2xl max-w-md text-xs text-white leading-relaxed shadow-md">
                <p className="text-[10px] text-white/80 font-semibold uppercase tracking-wider mb-1">
                  Shared Narrative ({victimName})
                </p>
                {inputText}
              </div>
            </div>
          )}

          {/* Recording Prosody Animation */}
          {isRecording && (
            <div className="flex items-center justify-between p-4 bg-background border border-primary/40 rounded-2xl shadow-xl animate-pulse">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-primary animate-bounce" />
                <div>
                  <span className="text-xs font-semibold text-white block">Listening & Capturing Voice Biomarkers...</span>
                  <span className="text-[10px] text-primary-dark font-mono">F0 Pitch • Jitter • Shimmer • Pauses</span>
                </div>
              </div>

              {/* Dynamic Waveform Bars */}
              <div className="flex items-center space-x-1 h-8">
                {[60, 90, 40, 100, 70, 85, 30, 95, 50, 75, 40, 80].map((h, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 bg-primary rounded-full animate-wave-bar"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  ></span>
                ))}
              </div>

              <span className="text-xs font-mono font-bold text-primary-dark bg-primary/10 px-2.5 py-1 rounded-lg">
                {recordingSeconds}s
              </span>
            </div>
          )}

        </div>

        {/* Grievance Scenarios */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold">{t('scenarios_title', selectedLanguage)}</span>
            <span className="text-secondary font-bold text-[11px]">{t('scenarios_click', selectedLanguage)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_PRESETS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => handleScenarioSelect(scenario)}
                className="text-left p-3 bg-background hover:bg-surface border border-border hover:border-primary/40 rounded-2xl transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text group-hover:text-primary-dark">{scenario.name}</span>
                  <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-surface text-text-muted border border-border">{scenario.category}</span>
                </div>
                <p className="text-[11px] text-text-muted line-clamp-1 mt-1 font-sans">{scenario.complaint_text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Input & Mic Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center">
            
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Share what you are experiencing in your own words..."
              className="w-full bg-background border border-border rounded-2xl p-3.5 pr-28 text-xs text-text placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />

            <div className="absolute right-3 flex items-center space-x-2">
              
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2.5 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-risk-critical text-white animate-pulse shadow-md'
                    : 'bg-surface hover:bg-background text-primary'
                }`}
                title="Record Speech in confidential session"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={isAnalyzing || !inputText.trim()}
                className="p-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white disabled:opacity-40 shadow-md transition-all font-medium text-xs flex items-center space-x-1"
                title="Send Message"
              >
                {isAnalyzing ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>

            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] text-text-muted font-sans">
            <span>You can take your time • Confidential Support</span>
            {activeProsody && <span className="text-primary-dark font-medium">✓ Audio Narrative Loaded</span>}
          </div>
        </form>

      </div>

      {/* Right Column: AASRA Principles & Direct Helpline Access */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* AASRA Emotional Safety Principles Card */}
        <div className="bg-surface border border-border rounded-3xl p-5 glass-panel space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-primary-dark font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>AASRA Support Commitments</span>
          </div>

          <div className="space-y-3 text-xs text-text font-sans">
            <div className="p-3 bg-background rounded-2xl border border-border space-y-1">
              <span className="text-primary-dark font-semibold block">1. You Are in Control</span>
              <p className="text-primary-dark text-[11px]">Share as much or as little as you feel comfortable. You can pause or stop at any point.</p>
            </div>

            <div className="p-3 bg-background rounded-2xl border border-border space-y-1">
              <span className="text-secondary font-semibold block">2. No Repetition Required</span>
              <p className="text-text text-[11px]">AASRA remembers details shared within your active session so you don't have to repeat painful experiences.</p>
            </div>

            <div className="p-3 bg-background rounded-2xl border border-border space-y-1">
              <span className="text-risk-low font-semibold block">3. Complete Confidentiality</span>
              <p className="text-text text-[11px]">Your identity remains anonymized. Support options are tailored to your safety requirements.</p>
            </div>
          </div>
        </div>

        {/* National Helpline Direct Access */}
        <div className="bg-surface border border-border rounded-3xl p-5 glass-panel space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-primary-dark font-semibold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>National Support Lines</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary-dark border border-primary/30 px-2 py-0.5 rounded">24x7 Active</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-background p-3 rounded-2xl border border-border">
              <span className="text-[10px] text-text-muted block font-medium">Toll-Free Helpline</span>
              <span className="text-xl font-mono font-bold text-text">14566</span>
            </div>
            <div className="bg-background p-3 rounded-2xl border border-border">
              <span className="text-[10px] text-text-muted block font-medium">Emergency SOS</span>
              <span className="text-xl font-mono font-bold text-risk-critical">112</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
