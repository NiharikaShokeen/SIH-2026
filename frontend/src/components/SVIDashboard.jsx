import React from 'react';
import { AlertTriangle, Layers, ChevronRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { t } from '../utils/translations';

export default function SVIDashboard({ result, selectedLanguage = 'en' }) {
  if (!result) return null;

  const { svi_analysis, nlp_analysis, silent_escalation, case_id } = result;
  const { svi_score, risk_category, color_code, sub_scores, explainable_rationale, sla_response_minutes } = svi_analysis;

  const radarData = [
    { subject: t('sub_acoustic', selectedLanguage), A: sub_scores.acoustic_stress || 40, fullMark: 100 },
    { subject: t('sub_linguistic', selectedLanguage), A: sub_scores.linguistic_trauma, fullMark: 100 },
    { subject: t('sub_context', selectedLanguage), A: sub_scores.contextual_risk, fullMark: 100 },
    { subject: t('sub_trend', selectedLanguage), A: sub_scores.longitudinal_trend, fullMark: 100 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Silent Escalation Alert Banner */}
      {silent_escalation && (
        <div className="bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border-2 border-red-600 rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4 glow-red-lg animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-500/50">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-widest shadow">
                  CRITICAL ESCALATION TRIGGERED
                </span>
                <span className="text-xs text-red-300 font-mono font-bold">Case ID: {case_id}</span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1">
                Suicidal Ideation / Extreme Atrocity Threat Identified in Narrative Stream
              </h3>
              <p className="text-xs text-red-200 mt-0.5">
                Priority alert dispatched to District Control Room & Tele-Mental Health Specialist.
              </p>
            </div>
          </div>
          <div className="text-right bg-red-950/80 px-4 py-2 rounded-2xl border border-red-800">
            <span className="text-[10px] text-red-300 block font-bold uppercase">SLA Target Window</span>
            <span className="text-xl font-mono font-black text-white">&lt; {sla_response_minutes} Mins</span>
          </div>
        </div>
      )}

      {/* Main SVI Score & Radar Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Circular Meter & Risk Badge */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 glass-panel-luxury flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              {t('svi_title', selectedLanguage)}
            </span>
            <span className="text-xs text-cyan-400 font-mono font-bold">
              {t('svi_formula_tag', selectedLanguage)}
            </span>
          </div>

          {/* Meter Ring Display */}
          <div className="flex flex-col items-center justify-center py-4 relative">
            
            <div className="w-48 h-48 rounded-full border-[10px] border-slate-950 flex items-center justify-center relative shadow-2xl">
              <div 
                className="absolute inset-0 rounded-full border-[10px] transition-all duration-1000"
                style={{
                  borderColor: color_code,
                  boxShadow: `0 0 30px ${color_code}`
                }}
              ></div>

              <div className="text-center space-y-0.5">
                <span className="text-5xl font-black text-white font-mono tracking-tight">{svi_score}</span>
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">out of 100</span>
              </div>
            </div>

            {/* Risk Badge */}
            <div 
              className="mt-5 px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl transition-all border border-white/20"
              style={{ backgroundColor: color_code }}
            >
              {risk_category} {t('risk_category_suffix', selectedLanguage)}
            </div>

          </div>

          {/* Sub-scores grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('sub_acoustic', selectedLanguage)}</span>
              <span className="text-lg font-black font-mono text-cyan-400 mt-0.5 block">
                {sub_scores.acoustic_stress !== null ? `${sub_scores.acoustic_stress}/100` : 'Text-Only'}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('sub_linguistic', selectedLanguage)}</span>
              <span className="text-lg font-black font-mono text-indigo-400 mt-0.5 block">
                {sub_scores.linguistic_trauma}/100
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('sub_context', selectedLanguage)}</span>
              <span className="text-lg font-black font-mono text-amber-400 mt-0.5 block">
                {sub_scores.contextual_risk}/100
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('sub_trend', selectedLanguage)}</span>
              <span className="text-lg font-black font-mono text-emerald-400 mt-0.5 block">
                {sub_scores.longitudinal_trend}/100
              </span>
            </div>
          </div>

        </div>

        {/* Right Card: Radar Chart & Explainability */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 glass-panel-luxury flex flex-col justify-between space-y-6 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-extrabold text-white">{t('explainability_title', selectedLanguage)}</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{t('audit_compliant', selectedLanguage)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Radar Chart */}
            <div className="md:col-span-6 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="SVI Vector" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Audit Rationale List */}
            <div className="md:col-span-6 space-y-2 text-xs">
              <span className="font-bold text-slate-300 block mb-2">{t('formula_breakdown', selectedLanguage)}</span>
              {explainable_rationale.map((point, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{point}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Highlighted Phrases */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>{t('trauma_keywords_title', selectedLanguage)}</span>
              <span className="text-cyan-400">{nlp_analysis.trauma_flags.length} {t('flags_suffix', selectedLanguage)}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {nlp_analysis.trauma_flags.map((flag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-xl text-xs font-bold bg-red-950/80 border border-red-800 text-red-300 flex items-center space-x-1 shadow-sm">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span>{flag}</span>
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
