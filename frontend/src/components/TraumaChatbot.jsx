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
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 glass-panel flex flex-col justify-between space-y-6 shadow-2xl">
        
        {/* Chat Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-950 border border-teal-500/40 rounded-2xl">
              <AasraCompanion 
                state={
                  isAnalyzing ? 'thinking' : 
                  isRecording ? 'listening' : 
                  (assessmentResult?.silent_escalation || assessmentResult?.svi_analysis?.risk_category === 'CRITICAL') ? 'safety_support' : 
                  'idle'
                } 
                size="sm" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-100">{victimName}</span>
                <span className="text-[10px] text-teal-400 bg-teal-950 border border-teal-800 px-2 py-0.5 rounded font-mono">
                  <MapPin className="w-2.5 h-2.5 inline mr-1" />
                  {victimLocation}
                </span>
              </div>
              <p className="text-xs text-slate-400">AASRA Support Session • Confidential & Encrypted</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isSilentMode && (
              <button
                type="button"
                onClick={speakGreeting}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-teal-300 flex items-center space-x-1 shadow-sm"
                title="Listen to AASRA Voice Prompt"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Audio</span>
              </button>
            )}

            <div className="flex items-center space-x-1 text-xs font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 rounded-xl">
              <Shield className="w-3.5 h-3.5" />
              <span>Session Safe</span>
            </div>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
          
          {/* AASRA Initial Welcoming Message */}
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-bold shadow-md flex-shrink-0">
              AA
            </div>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl max-w-md text-xs text-slate-200 leading-relaxed space-y-1.5 shadow-sm">
              <p className="font-semibold text-teal-400">AASRA Companion:</p>
              <p>Welcome. You are in a safe, confidential space. Take all the time you need. You can share your story in your own words, or choose a topic below.</p>
            </div>
          </div>

          {/* Conversation Memory Continuity Banner */}
          {contextMemory.length > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-teal-950/60 border border-teal-800/60 rounded-xl text-xs text-teal-300">
              <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>AASRA Context Memory: You mentioned <strong>{contextMemory.join(', ')}</strong>. You don't need to repeat these details.</span>
            </div>
          )}

          {/* User Complaint Narrative */}
          {inputText && (
            <div className="flex items-start justify-end space-x-3">
              <div className="bg-teal-700/90 border border-teal-600 p-4 rounded-2xl max-w-md text-xs text-white leading-relaxed shadow-md">
                <p className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider mb-1">
                  Shared Narrative ({victimName})
                </p>
                {inputText}
              </div>
            </div>
          )}

          {/* AASRA Calm Trauma-Informed Response after Assessment */}
          {assessmentResult && (
            <div className="flex items-start space-x-3 animate-fade-in">
              <div className="w-9 h-9 rounded-2xl bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-bold shadow-md flex-shrink-0">
                AA
              </div>
              <div className="bg-slate-950 border border-teal-800/80 p-4 rounded-2xl max-w-md text-xs text-slate-200 leading-relaxed space-y-2 shadow-lg">
                <p className="font-semibold text-teal-300 flex items-center space-x-1.5">
                  <HeartHandshake className="w-4 h-4 text-teal-400" />
                  <span>AASRA Companion Response:</span>
                </p>
                <p className="text-slate-100 font-medium text-xs leading-relaxed">
                  "Thank you for telling me. Your safety matters. You don't have to go through this alone. Let's look at what support may be helpful right now."
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-teal-300 font-sans flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Support Plan Activated</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Case Confidential</span>
                </div>
              </div>
            </div>
          )}

          {/* Recording Prosody Animation */}
          {isRecording && (
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-teal-500/60 rounded-2xl shadow-xl animate-pulse">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-teal-400 animate-bounce" />
                <div>
                  <span className="text-xs font-semibold text-white block">Listening & Capturing Voice Biomarkers...</span>
                  <span className="text-[10px] text-teal-300 font-mono">F0 Pitch • Jitter • Shimmer • Pauses</span>
                </div>
              </div>

              {/* Dynamic Waveform Bars */}
              <div className="flex items-center space-x-1 h-8">
                {[60, 90, 40, 100, 70, 85, 30, 95, 50, 75, 40, 80].map((h, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 bg-teal-400 rounded-full animate-wave-bar"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  ></span>
                ))}
              </div>

              <span className="text-xs font-mono font-bold text-teal-300 bg-teal-950 px-2.5 py-1 rounded-lg">
                {recordingSeconds}s
              </span>
            </div>
          )}

        </div>

        {/* Grievance Scenarios & Demo Trigger */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">{t('scenarios_title', selectedLanguage)}</span>
            <span className="text-cyan-400 font-bold text-[11px]">{t('scenarios_click', selectedLanguage)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_PRESETS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => {
                  handleScenarioSelect(scenario);
                  // Automatically trigger assessment if user clicks scenario
                  onAssess({
                    channel: 'Trauma Chatbot Intake',
                    language_code: selectedLanguage,
                    complaint_text: scenario.complaint_text,
                    prosody_override: scenario.prosody,
                    context_factors: {
                      is_woman_or_child: true,
                      is_repeat_harassment: true,
                      police_fir_refused: true,
                      perpetrator_in_power: true,
                      victim_mood: 'Immediate Threat'
                    }
                  });
                }}
                className={`text-left p-3 rounded-2xl transition-all group shadow-sm border ${
                  scenario.is_critical_preset
                    ? 'bg-teal-950/40 hover:bg-teal-900/60 border-teal-700/80 hover:border-teal-500'
                    : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-teal-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-300">
                    {scenario.name}
                  </span>
                  <span className={`text-[9px] font-medium px-2 py-0.5 rounded border ${
                    scenario.is_critical_preset
                      ? 'bg-teal-950 text-teal-300 border-teal-700'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}>
                    {scenario.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-sans">{scenario.complaint_text}</p>
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
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-3.5 pr-28 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            />

            <div className="absolute right-3 flex items-center space-x-2">
              
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2.5 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-teal-400'
                }`}
                title="Record Speech in confidential session"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={isAnalyzing || !inputText.trim()}
                className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40 shadow-md transition-all font-medium text-xs flex items-center space-x-1"
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

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span>You can take your time • Confidential Support</span>
            {activeProsody && <span className="text-teal-400 font-medium">✓ Audio Narrative Loaded</span>}
          </div>
        </form>

      </div>

      {/* Right Column: AASRA Principles & Direct Helpline Access */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* AASRA Emotional Safety Principles Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 glass-panel space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>AASRA Support Commitments</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 font-sans">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
              <span className="text-teal-300 font-semibold block">1. You Are in Control</span>
              <p className="text-slate-400 text-[11px]">Share as much or as little as you feel comfortable. You can pause or stop at any point.</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
              <span className="text-cyan-300 font-semibold block">2. No Repetition Required</span>
              <p className="text-slate-400 text-[11px]">AASRA remembers details shared within your active session so you don't have to repeat painful experiences.</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
              <span className="text-emerald-300 font-semibold block">3. Complete Confidentiality</span>
              <p className="text-slate-400 text-[11px]">Your identity remains anonymized. Support options are tailored to your safety requirements.</p>
            </div>
          </div>
        </div>

        {/* National Helpline Direct Access */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 glass-panel space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>National Support Lines</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded">24x7 Active</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Toll-Free Helpline</span>
              <span className="text-xl font-mono font-bold text-slate-100">14566</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Emergency SOS</span>
              <span className="text-xl font-mono font-bold text-rose-400">112</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
