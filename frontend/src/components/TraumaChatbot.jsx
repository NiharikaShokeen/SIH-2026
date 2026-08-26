import React, { useState } from 'react';
import { Mic, MicOff, Send, AlertCircle, RefreshCw, Volume2, Shield, HeartHandshake, MapPin } from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/samplePresets';
import { audioEngine } from '../utils/audioSynthesizer';
import { t } from '../utils/translations';

export default function TraumaChatbot({ onAssess, assessmentResult, isAnalyzing, selectedLanguage }) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeProsody, setActiveProsody] = useState(null);
  const [victimMood, setVictimMood] = useState('Immediate Threat');
  const [victimName, setVictimName] = useState('Sunita Devi (Anonymized)');
  const [victimLocation, setVictimLocation] = useState('Hathras, UP');

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(1);

      // Speak native recording prompt in selected language (Hindi, Telugu, Tamil, Bengali, Marathi, etc.)
      audioEngine.speakPrompt('recording', selectedLanguage, 1.0, 1.0);

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
    
    // Play selected narrative out loud in native language pitch
    audioEngine.speakPrompt(preset.complaint_text, selectedLanguage, 0.95, 1.0);
  };

  const speakGreeting = () => {
    // Speak native welcome greeting aloud in selected language
    audioEngine.speakPrompt('welcome', selectedLanguage, 1.0, 1.0);
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
        victim_mood: victimMood
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Chat Intake */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 glass-panel-luxury flex flex-col justify-between space-y-6 shadow-2xl">
        
        {/* Chat Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-700/60 rounded-2xl text-cyan-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white">{victimName}</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950 border border-cyan-800/80 px-2 py-0.5 rounded font-mono">
                  <MapPin className="w-2.5 h-2.5 inline mr-1" />
                  {victimLocation}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t('chatbot_subtitle', selectedLanguage)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            
            {/* Audio Voice Assistant Button */}
            <button
              type="button"
              onClick={speakGreeting}
              className="px-2.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 rounded-xl text-xs font-bold text-cyan-300 flex items-center space-x-1 shadow-sm"
              title="Listen to AI Voice Assistant Greeting"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Hear Voice ({selectedLanguage.toUpperCase()})</span>
            </button>

            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 rounded-xl">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('confidential_session', selectedLanguage)}</span>
            </div>

          </div>
        </div>

        {/* Check-in Status Bar */}
        <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
            {t('status_checkin', selectedLanguage)}
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'Immediate Threat', labelKey: 'status_threat', color: 'border-red-800 text-red-300 bg-red-950/60' },
              { id: 'Social Boycott', labelKey: 'status_boycott', color: 'border-amber-800 text-amber-300 bg-amber-950/60' },
              { id: 'Police Refused', labelKey: 'status_police', color: 'border-purple-800 text-purple-300 bg-purple-950/60' },
              { id: 'Need Shelter', labelKey: 'status_shelter', color: 'border-cyan-800 text-cyan-300 bg-cyan-950/60' }
            ].map(mood => (
              <button
                key={mood.id}
                type="button"
                onClick={() => setVictimMood(mood.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  victimMood === mood.id ? `${mood.color} ring-2 ring-cyan-400/50 shadow-md` : 'border-slate-800 text-slate-400 hover:border-slate-700 bg-slate-900'
                }`}
              >
                {t(mood.labelKey, selectedLanguage)}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
          
          {/* AI Initial Greeting */}
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-cyan-500/30">
              AI
            </div>
            <div className="bg-slate-800/90 border border-slate-700/60 p-4 rounded-2xl max-w-md text-xs text-slate-200 leading-relaxed shadow-sm">
              <p className="font-bold text-cyan-400 mb-1">{t('ai_greeting_title', selectedLanguage)}</p>
              {t('ai_greeting_body', selectedLanguage)}
            </div>
          </div>

          {/* User Complaint Narrative */}
          {inputText && (
            <div className="flex items-start justify-end space-x-3">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 rounded-2xl max-w-md text-xs text-white leading-relaxed shadow-lg">
                <p className="text-[10px] text-cyan-100 font-bold uppercase tracking-wider mb-1">
                  {t('complainant_narrative', selectedLanguage)} ({victimName})
                </p>
                {inputText}
              </div>
            </div>
          )}

          {/* Recording Prosody Animation */}
          {isRecording && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-700/80 rounded-2xl shadow-xl animate-pulse">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-cyan-400 animate-bounce" />
                <div>
                  <span className="text-xs font-bold text-white block">{t('recording_biomarkers', selectedLanguage)}</span>
                  <span className="text-[10px] text-cyan-300 font-mono">{t('recording_sub', selectedLanguage)}</span>
                </div>
              </div>

              {/* Dynamic Waveform Bars */}
              <div className="flex items-center space-x-1 h-8">
                {[60, 90, 40, 100, 70, 85, 30, 95, 50, 75, 40, 80].map((h, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 bg-cyan-400 rounded-full animate-wave-bar"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  ></span>
                ))}
              </div>

              <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-900/60 px-2.5 py-1 rounded-lg">
                {recordingSeconds}s
              </span>
            </div>
          )}

        </div>

        {/* Grievance Scenarios */}
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
                onClick={() => handleScenarioSelect(scenario)}
                className="text-left p-2.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/80 rounded-2xl transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">{scenario.name}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">{scenario.category}</span>
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
              placeholder={t('input_placeholder', selectedLanguage)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-3.5 pr-28 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none shadow-inner"
            />

            <div className="absolute right-3 flex items-center space-x-2">
              
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2.5 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-400'
                }`}
                title="Record Speech Biomarkers & Listen to Voice"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={isAnalyzing || !inputText.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white disabled:opacity-40 shadow-lg shadow-cyan-500/25 transition-all"
                title="Evaluate SVI Index"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>

            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{t('enter_submit_hint', selectedLanguage)}</span>
            {activeProsody && <span className="text-cyan-400 font-semibold">✓ {t('biomarkers_loaded', selectedLanguage)}</span>}
          </div>
        </form>

      </div>

      {/* Right Column: Pipeline Cards */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Multimodal AI Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 glass-panel-luxury space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>{t('ai_pipeline_title', selectedLanguage)}</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {t('ai_pipeline_desc', selectedLanguage)}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('acoustic_biomarkers', selectedLanguage)}</span>
              <span className="text-xs font-semibold text-cyan-400 mt-1 block">F0 Pitch • Jitter • Shimmer</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('linguistic_sentiment', selectedLanguage)}</span>
              <span className="text-xs font-semibold text-indigo-400 mt-1 block">IndicBERT • Trauma Lexicon</span>
            </div>
          </div>
        </div>

        {/* Helpline Direct Access Card */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 glass-panel-luxury space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              <span>{t('hotline_access_title', selectedLanguage)}</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">24x7 Active</span>
          </div>

          <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">{t('toll_free_label', selectedLanguage)}</span>
              <span className="text-xl font-mono font-black text-white">14566</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">{t('emergency_sos_label', selectedLanguage)}</span>
              <span className="text-xl font-mono font-black text-red-400">112</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
