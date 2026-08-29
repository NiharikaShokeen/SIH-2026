import React, { useState } from 'react';
import { Volume2, VolumeX, Sliders, Activity, Radio, Play, Square, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioSynthesizer';
import { t } from '../utils/translations';

export default function VoiceModulatorPanel({ onProsodyChange, selectedLanguage = 'en' }) {
  const [pitchHz, setPitchHz] = useState(235);
  const [tremorLevel, setTremorLevel] = useState(38);
  const [pauseRatio, setPauseRatio] = useState(35);
  const [usePhoneFilter, setUsePhoneFilter] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);

  // Compute live estimated acoustic stress score
  const estimatedAcousticStress = Math.min(100, Math.round(
    ((pitchHz - 180) * 0.4) + (tremorLevel * 0.45) + (pauseRatio * 0.75)
  ));

  const handleSliderChange = (newPitch, newTremor, newPause, phoneFilter) => {
    setPitchHz(newPitch);
    setTremorLevel(newTremor);
    setPauseRatio(newPause);
    setUsePhoneFilter(phoneFilter);

    if (onProsodyChange) {
      onProsodyChange({
        pitch_mean: newPitch,
        pitch_std: newPitch * 0.2,
        jitter: (newTremor / 1000) + 0.015,
        shimmer: (newTremor / 500) + 0.03,
        pause_ratio: newPause / 100,
        speaking_rate: Math.max(1.2, 3.0 - (newPause / 30)),
        energy_variance: 15.0
      });
    }

    if (isPlayingAudio) {
      audioEngine.startModulatedTone(newPitch, newTremor, phoneFilter);
    }
  };

  const toggleAudioPreview = () => {
    if (isPlayingAudio) {
      audioEngine.stopAudio();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      setIsSpeakingPrompt(false);
      audioEngine.startModulatedTone(pitchHz, tremorLevel, usePhoneFilter);
    }
  };

  const playVoicePrompt = () => {
    audioEngine.stopAudio();
    setIsPlayingAudio(false);
    setIsSpeakingPrompt(true);
    
    const promptText = selectedLanguage === 'hi' 
      ? "नमस्ते, राष्ट्रीय हेल्पलाइन 14566 में आपका स्वागत है। आपकी सुरक्षा हमारी प्राथमिकता है।"
      : "Welcome to National Helpline 14566. Your safety is our top priority. Please state your grievance.";
    
    audioEngine.speakPrompt(promptText, selectedLanguage, pitchHz / 200, 1.0);
    
    setTimeout(() => {
      setIsSpeakingPrompt(false);
    }, 4000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 glass-panel space-y-5 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-950 border border-teal-800/80 rounded-2xl text-teal-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Interactive Voice Modulation & Acoustic Biomarkers</h3>
            <p className="text-[11px] text-slate-400 font-sans">Test vocal tremor modulation, pitch instability & telephonic POTS filter</p>
          </div>
        </div>

        {/* Audio Action Buttons */}
        <div className="flex items-center space-x-2">
          
          <button
            type="button"
            onClick={playVoicePrompt}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
              isSpeakingPrompt
                ? 'bg-cyan-950 text-cyan-300 border-cyan-800 animate-pulse'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
            }`}
            title="Synthesize AI Helpline Assistant Voice Prompt"
          >
            <Volume2 className="w-3.5 h-3.5 text-teal-400" />
            <span>{isSpeakingPrompt ? 'Speaking...' : 'Play Voice Prompt'}</span>
          </button>

          <button
            type="button"
            onClick={toggleAudioPreview}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
              isPlayingAudio
                ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                : 'bg-teal-600 hover:bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20'
            }`}
          >
            {isPlayingAudio ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlayingAudio ? 'Stop Tone' : 'Hear Voice Tone'}</span>
          </button>

        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Slider 1: Pitch F0 */}
        <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex justify-between text-xs font-semibold text-slate-200 font-sans">
            <span>F0 Pitch Frequency</span>
            <span className="font-mono text-teal-400 font-bold">{pitchHz} Hz</span>
          </div>
          <input
            type="range"
            min="170"
            max="290"
            value={pitchHz}
            onChange={(e) => handleSliderChange(Number(e.target.value), tremorLevel, pauseRatio, usePhoneFilter)}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>170 Hz (Normal)</span>
            <span>290 Hz (Panic)</span>
          </div>
        </div>

        {/* Slider 2: Micro-Tremor Level */}
        <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex justify-between text-xs font-semibold text-slate-200 font-sans">
            <span>Vocal Tremor & Jitter</span>
            <span className="font-mono text-amber-400 font-bold">{tremorLevel}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={tremorLevel}
            onChange={(e) => handleSliderChange(pitchHz, Number(e.target.value), pauseRatio, usePhoneFilter)}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0% (Steady)</span>
            <span>100% (High Tremor)</span>
          </div>
        </div>

        {/* Slider 3: Hesitation Pause Ratio */}
        <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex justify-between text-xs font-semibold text-slate-200 font-sans">
            <span>Hesitation Pause Ratio</span>
            <span className="font-mono text-rose-400 font-bold">{pauseRatio}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            value={pauseRatio}
            onChange={(e) => handleSliderChange(pitchHz, tremorLevel, Number(e.target.value), usePhoneFilter)}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>10% (Fluent)</span>
            <span>60% (Traumatic Pauses)</span>
          </div>
        </div>

      </div>

      {/* Bottom Meter & Filter Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        
        {/* POTS Telephonic Filter Checkbox */}
        <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <input
            type="checkbox"
            checked={usePhoneFilter}
            onChange={(e) => handleSliderChange(pitchHz, tremorLevel, pauseRatio, e.target.checked)}
            className="rounded border-slate-700 text-teal-500 focus:ring-teal-500"
          />
          <Radio className="w-3.5 h-3.5 text-teal-400" />
          <span>Apply Telephonic POTS G.711 Narrowband Filter (300Hz-3.4kHz)</span>
        </label>

        {/* Dynamic Acoustic Stress Result */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold font-sans">Estimated Acoustic Stress:</span>
          <span className={`text-base font-mono font-black px-3 py-0.5 rounded-xl border ${
            estimatedAcousticStress > 70
              ? 'bg-red-950 text-red-400 border-red-800'
              : estimatedAcousticStress > 45
              ? 'bg-amber-950 text-amber-400 border-amber-800'
              : 'bg-emerald-950 text-emerald-400 border-emerald-800'
          }`}>
            {estimatedAcousticStress} / 100
          </span>
        </div>

      </div>

    </div>
  );
}

