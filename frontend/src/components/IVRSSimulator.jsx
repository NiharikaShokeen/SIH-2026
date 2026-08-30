import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Activity, Volume2, Radio } from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/samplePresets';
import { audioEngine } from '../utils/audioSynthesizer';
import { t } from '../utils/translations';

export default function IVRSSimulator({ onAssess, isAnalyzing, selectedLanguage }) {
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState(SAMPLE_PRESETS[0]);
  const [livePitch, setLivePitch] = useState(210);
  const [livePause, setLivePause] = useState(28);

  useEffect(() => {
    let timer;
    if (callActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
        setLivePitch(Math.floor(200 + Math.random() * 50));
        setLivePause(Math.floor(20 + Math.random() * 25));
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  const handleStartCall = () => {
    setCallActive(true);
    
    // Play telephone ring sound and speak native multilingual greeting aloud!
    audioEngine.playPhoneRing();
    
    setTimeout(() => {
      audioEngine.speakPrompt('ivrs_greet', selectedLanguage, 1.0, 1.0);
    }, 1200);
  };

  const handleEndCall = () => {
    audioEngine.stopAudio();
    setCallActive(false);
    onAssess({
      channel: 'IVRS Telephonic Intake (14566)',
      language_code: selectedLanguage,
      complaint_text: selectedScenario.complaint_text,
      prosody_override: selectedScenario.prosody,
      context_factors: {
        is_woman_or_child: true,
        is_repeat_harassment: true,
        police_fir_refused: true,
        perpetrator_in_power: true
      }
    });
  };

  const playCallerVoiceNarrative = () => {
    audioEngine.speakPrompt(selectedScenario.complaint_text, selectedLanguage, 0.95, 0.95);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Phone Console */}
      <div className="lg:col-span-6 bg-surface border border-border rounded-3xl p-6 glass-panel-luxury flex flex-col justify-between space-y-6 shadow-2xl">
        
        {/* Phone Display Header */}
        <div className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-dark">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                {t('ivrs_channel_label', selectedLanguage)}
              </span>
              <h3 className="text-xl font-black text-text font-mono">14566</h3>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-xs font-mono font-black px-3 py-1 rounded-full border ${
              callActive
                ? 'bg-risk-low-bg border-risk-low/40 text-risk-low animate-pulse shadow-md shadow-risk-low/20'
                : 'bg-background border-border text-text-muted'
            }`}>
              {callActive ? `${t('call_connected', selectedLanguage)} • 00:${callDuration < 10 ? '0' + callDuration : callDuration}` : t('offline', selectedLanguage)}
            </span>
          </div>
        </div>

        {/* Audio Spectrum Analyzer */}
        {callActive ? (
          <div className="space-y-4 bg-background border border-primary/30 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-primary-dark font-bold">
              <span className="flex items-center space-x-1.5">
                <Activity className="w-4 h-4 animate-spin text-primary-dark" />
                <span>{t('spectrum_sampling', selectedLanguage)}</span>
              </span>

              {/* Play Native Spoken Voice Button */}
              <button
                type="button"
                onClick={playCallerVoiceNarrative}
                className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-[11px] font-bold text-primary-dark flex items-center space-x-1 shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Voice ({selectedLanguage.toUpperCase()})</span>
              </button>
            </div>

            {/* Pitch Meter */}
            <div>
              <div className="flex justify-between text-xs text-text-muted font-semibold mb-1">
                <span>{t('f0_pitch_label', selectedLanguage)}</span>
                <span className="font-mono text-primary-dark font-bold">{livePitch} Hz</span>
              </div>
              <div className="w-full bg-surface h-2.5 rounded-full overflow-hidden border border-border">
                <div
                  className="bg-primary h-full transition-all duration-300 shadow-md shadow-primary/40"
                  style={{ width: `${(livePitch / 300) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Pause Meter */}
            <div>
              <div className="flex justify-between text-xs text-text-muted font-semibold mb-1">
                <span>{t('pause_ratio_label', selectedLanguage)}</span>
                <span className="font-mono text-risk-moderate font-bold">{livePause}%</span>
              </div>
              <div className="w-full bg-surface h-2.5 rounded-full overflow-hidden border border-border">
                <div
                  className="bg-risk-moderate h-full transition-all duration-300 shadow-md shadow-risk-moderate/40"
                  style={{ width: `${livePause * 2}%` }}
                ></div>
              </div>
            </div>

            {/* Audio Transcript Preview */}
            <div className="p-3.5 bg-surface rounded-xl border border-border text-xs text-text font-sans italic leading-relaxed">
              "{selectedScenario.complaint_text}"
            </div>
          </div>
        ) : (
          <div className="p-6 bg-background border border-border rounded-2xl text-center space-y-3">
            <Volume2 className="w-8 h-8 text-primary/50 mx-auto" />
            <p className="text-xs text-text-muted leading-relaxed">
              Select a grievance scenario below and click <strong>"{t('start_ivrs_call', selectedLanguage)}"</strong> to hear native speech audio in {selectedLanguage.toUpperCase()}.
            </p>
          </div>
        )}

        {/* Scenario Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs text-text-muted font-bold block uppercase tracking-wider">
            {t('select_caller_scenario', selectedLanguage)}
          </label>
          <select
            value={selectedScenario.id}
            onChange={(e) => setSelectedScenario(SAMPLE_PRESETS.find(p => p.id === e.target.value))}
            className="w-full bg-background border border-border rounded-2xl p-3 text-xs text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold cursor-pointer"
            disabled={callActive}
          >
            {SAMPLE_PRESETS.map(p => (
              <option key={p.id} value={p.id}>{p.name} — {p.category}</option>
            ))}
          </select>
        </div>

        {/* Action Call Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          {!callActive ? (
            <button
              onClick={handleStartCall}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl text-xs font-extrabold text-white bg-primary hover:bg-primary-dark shadow-xl shadow-primary/25 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>{t('start_ivrs_call', selectedLanguage)}</span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl text-xs font-extrabold text-white bg-risk-critical hover:opacity-90 shadow-xl shadow-risk-critical/25 transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>{t('end_ivrs_call', selectedLanguage)}</span>
            </button>
          )}
        </div>

      </div>

      {/* Right Column: Technical Overview */}
      <div className="lg:col-span-6 space-y-4">
        <div className="bg-surface border border-border rounded-3xl p-6 glass-panel-luxury space-y-4 shadow-xl">
          <h4 className="text-xs font-bold text-primary-dark uppercase tracking-wider">
            {t('ivrs_specs_title', selectedLanguage)}
          </h4>

          <p className="text-xs text-text leading-relaxed">
            {t('ivrs_specs_desc', selectedLanguage)}
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs p-3 bg-background rounded-2xl border border-border">
              <span className="text-text-muted">Audio Codec</span>
              <span className="text-primary-dark font-mono font-bold">G.711 Narrowband</span>
            </div>
            <div className="flex items-center justify-between text-xs p-3 bg-background rounded-2xl border border-border">
              <span className="text-text-muted">Extraction Latency</span>
              <span className="text-risk-low font-mono font-bold">&lt; 320 ms Real-Time</span>
            </div>
            <div className="flex items-center justify-between text-xs p-3 bg-background rounded-2xl border border-border">
              <span className="text-text-muted">Offline Backup</span>
              <span className="text-primary-dark font-mono font-bold">SMS Alert Dispatch</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
