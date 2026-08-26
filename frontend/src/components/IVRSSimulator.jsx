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
      <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 glass-panel-luxury flex flex-col justify-between space-y-6 shadow-2xl">
        
        {/* Phone Display Header */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-950 to-blue-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {t('ivrs_channel_label', selectedLanguage)}
              </span>
              <h3 className="text-xl font-black text-white font-mono">14566</h3>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-xs font-mono font-black px-3 py-1 rounded-full border ${
              callActive
                ? 'bg-emerald-950 border-emerald-700 text-emerald-400 animate-pulse shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              {callActive ? `${t('call_connected', selectedLanguage)} • 00:${callDuration < 10 ? '0' + callDuration : callDuration}` : t('offline', selectedLanguage)}
            </span>
          </div>
        </div>

        {/* Audio Spectrum Analyzer */}
        {callActive ? (
          <div className="space-y-4 bg-gradient-to-b from-slate-950 to-slate-900 border border-cyan-800/80 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold">
              <span className="flex items-center space-x-1.5">
                <Activity className="w-4 h-4 animate-spin text-cyan-400" />
                <span>{t('spectrum_sampling', selectedLanguage)}</span>
              </span>

              {/* Play Native Spoken Voice Button */}
              <button
                type="button"
                onClick={playCallerVoiceNarrative}
                className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 rounded-lg text-[11px] font-bold text-cyan-300 flex items-center space-x-1 shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Voice ({selectedLanguage.toUpperCase()})</span>
              </button>
            </div>

            {/* Pitch Meter */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>{t('f0_pitch_label', selectedLanguage)}</span>
                <span className="font-mono text-cyan-400 font-bold">{livePitch} Hz</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 shadow-md shadow-cyan-500/50"
                  style={{ width: `${(livePitch / 300) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Pause Meter */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>{t('pause_ratio_label', selectedLanguage)}</span>
                <span className="font-mono text-amber-400 font-bold">{livePause}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300 shadow-md shadow-amber-500/50"
                  style={{ width: `${livePause * 2}%` }}
                ></div>
              </div>
            </div>

            {/* Audio Transcript Preview */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-sans italic leading-relaxed">
              "{selectedScenario.complaint_text}"
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl text-center space-y-3">
            <Volume2 className="w-8 h-8 text-cyan-400/60 mx-auto" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Select a grievance scenario below and click <strong>"{t('start_ivrs_call', selectedLanguage)}"</strong> to hear native speech audio in {selectedLanguage.toUpperCase()}.
            </p>
          </div>
        )}

        {/* Scenario Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
            {t('select_caller_scenario', selectedLanguage)}
          </label>
          <select
            value={selectedScenario.id}
            onChange={(e) => setSelectedScenario(SAMPLE_PRESETS.find(p => p.id === e.target.value))}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-semibold cursor-pointer"
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
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-xl shadow-emerald-500/25 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>{t('start_ivrs_call', selectedLanguage)}</span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-xl shadow-red-500/25 transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>{t('end_ivrs_call', selectedLanguage)}</span>
            </button>
          )}
        </div>

      </div>

      {/* Right Column: Technical Overview */}
      <div className="lg:col-span-6 space-y-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 glass-panel-luxury space-y-4 shadow-xl">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            {t('ivrs_specs_title', selectedLanguage)}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed">
            {t('ivrs_specs_desc', selectedLanguage)}
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-300">Audio Codec</span>
              <span className="text-cyan-400 font-mono font-bold">G.711 Narrowband</span>
            </div>
            <div className="flex items-center justify-between text-xs p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-300">Extraction Latency</span>
              <span className="text-emerald-400 font-mono font-bold">&lt; 320 ms Real-Time</span>
            </div>
            <div className="flex items-center justify-between text-xs p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-300">Offline Backup</span>
              <span className="text-cyan-400 font-mono font-bold">SMS Alert Dispatch</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
