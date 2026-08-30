import React, { useState } from 'react';
import { Smartphone, Send, ShieldAlert, Heart, RefreshCw, CheckCircle } from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/samplePresets';

export default function MobileAppView({ onAssess, isAnalyzing, selectedLanguage }) {
  const [mobileText, setMobileText] = useState(SAMPLE_PRESETS[2].complaint_text);

  const handleSubmit = () => {
    onAssess({
      channel: 'Mobile Application',
      language_code: selectedLanguage,
      complaint_text: mobileText,
      context_factors: {
        is_woman_or_child: true,
        is_repeat_harassment: false,
        police_fir_refused: false,
        perpetrator_in_power: true
      }
    });
  };

  return (
    <div className="flex justify-center py-4">
      {/* Smartphone Outer Frame */}
      <div className="w-[360px] h-[680px] bg-background border-[6px] border-border rounded-[48px] shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden glass-panel">

        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-surface rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-background rounded-full"></div>
        </div>

        {/* Mobile Header */}
        <div className="pt-6 pb-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold text-text tracking-wide">NHAA 14566 App</span>
          </div>
          <span className="text-[10px] text-text-muted font-mono">v2.4 Live</span>
        </div>

        {/* Mobile Screen Content */}
        <div className="space-y-4 my-auto overflow-y-auto max-h-[500px] pr-1">

          <div className="bg-surface p-3 rounded-2xl border border-border space-y-1">
            <span className="text-[10px] text-primary font-bold uppercase">Quick Trauma Assessment</span>
            <p className="text-xs text-text-muted">
              Submit your complaint narrative or speak directly to evaluate immediate safety risk level.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-text-muted">Grievance Narrative:</label>
            <textarea
              rows={5}
              value={mobileText}
              onChange={(e) => setMobileText(e.target.value)}
              className="w-full bg-surface border border-border rounded-2xl p-3 text-xs text-text focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Quick Preset Selector */}
          <div className="space-y-1">
            <span className="text-[10px] text-text-muted">Or load preset case:</span>
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {SAMPLE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setMobileText(p.complaint_text)}
                  className="px-2.5 py-1 bg-surface hover:bg-border/40 border border-border text-[10px] text-text-muted rounded-lg whitespace-nowrap"
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Mobile Action Button */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-primary/25"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Complaint & Evaluate SVI</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}