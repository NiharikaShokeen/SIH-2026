import React, { useState } from 'react';
import { Activity, ShieldAlert, CheckCircle, Clock, Search, AlertTriangle, TrendingUp, UserCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { t } from '../utils/translations';

export default function CounsellorDashboard({ cases, onSelectCase, activeCase, selectedLanguage = 'en' }) {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = cases.filter(c => {
    if (filter !== 'ALL' && c.risk_category !== filter) return false;
    if (searchTerm && !c.victim_name.toLowerCase().includes(searchTerm.toLowerCase()) && !c.case_id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const selectedCase = activeCase || (filteredCases.length > 0 ? filteredCases[0] : null);

  const trendData = selectedCase && selectedCase.historical_svi ? [
    { session: 'Interaction #1', SVI: selectedCase.historical_svi[0] || 35 },
    { session: 'Interaction #2', SVI: selectedCase.historical_svi[1] || 48 },
    { session: 'Current Intake', SVI: selectedCase.svi_score || selectedCase.historical_svi[2] || 78 }
  ] : [
    { session: 'Interaction #1', SVI: 32 },
    { session: 'Interaction #2', SVI: 54 },
    { session: 'Current Intake', SVI: 78 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl glass-panel space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">{t('total_cases_label', selectedLanguage)}</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-mono font-black text-white">{cases.length}</span>
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-red-900/60 p-5 rounded-3xl glass-panel space-y-1">
          <span className="text-xs text-red-400 font-bold uppercase">{t('critical_escalations_label', selectedLanguage)}</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-mono font-black text-red-400">
              {cases.filter(c => c.risk_category === 'CRITICAL').length}
            </span>
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-amber-900/60 p-5 rounded-3xl glass-panel space-y-1">
          <span className="text-xs text-amber-400 font-bold uppercase">{t('high_risk_pending_label', selectedLanguage)}</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-mono font-black text-amber-400">
              {cases.filter(c => c.risk_category === 'HIGH').length}
            </span>
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-emerald-900/60 p-5 rounded-3xl glass-panel space-y-1">
          <span className="text-xs text-emerald-400 font-bold uppercase">{t('dispatched_actions_label', selectedLanguage)}</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-mono font-black text-emerald-400">100%</span>
            <UserCheck className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* Main Control Room Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Priority Queue */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 glass-panel space-y-4 shadow-xl">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>{t('svi_priority_queue', selectedLanguage)}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{t('sorted_by_svi', selectedLanguage)}</span>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t('search_placeholder', selectedLanguage)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">{t('all_risk', selectedLanguage)}</option>
              <option value="CRITICAL">{t('critical_risk', selectedLanguage)}</option>
              <option value="HIGH">{t('high_risk', selectedLanguage)}</option>
              <option value="MODERATE">{t('moderate_risk', selectedLanguage)}</option>
            </select>
          </div>

          {/* Case List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredCases.map((c) => (
              <button
                key={c.case_id}
                onClick={() => onSelectCase(c)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  selectedCase && selectedCase.case_id === c.case_id
                    ? 'bg-slate-800 border-cyan-500/80 shadow-md'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white font-mono">{c.case_id}</span>
                    <span className="text-[10px] text-slate-400">({c.channel})</span>
                  </div>
                  <span className="text-xs text-slate-300 block">{c.victim_name || 'Complainant'}</span>
                  <span className="text-[10px] text-slate-500">{c.district}</span>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-lg font-black font-mono text-white block">{c.svi_score || c.svi_analysis?.svi_score}</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    c.risk_category === 'CRITICAL'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : c.risk_category === 'HIGH'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {c.risk_category}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Case Briefing & Longitudinal Trend */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 glass-panel space-y-6 shadow-xl">
          {selectedCase ? (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-2.5 py-0.5 rounded font-mono">
                      {selectedCase.case_id}
                    </span>
                    <span className="text-xs text-slate-400">{selectedCase.district}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedCase.victim_name}</h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold">SVI Score</span>
                  <span className="text-2xl font-mono font-black text-cyan-400">
                    {selectedCase.svi_score || selectedCase.svi_analysis?.svi_score}
                  </span>
                </div>
              </div>

              {/* Longitudinal Risk Graph */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>{t('trajectory_title', selectedLanguage)}</span>
                  </span>
                  <span className="text-red-400 font-semibold text-[11px]">{t('escalating_trend', selectedLanguage)}</span>
                </div>

                <div className="h-40 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="session" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey="SVI" stroke="#ef4444" strokeWidth={3} dot={{ r: 5, fill: '#ef4444' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Narrative Text Briefing */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">{t('case_narrative_briefing', selectedLanguage)}</span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800 font-sans">
                  "{selectedCase.complaint_text}"
                </p>
              </div>

              {/* Dispatch Action Toolbar */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-300 block">Officer Dispatch & Support Actions:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => alert(`[112 EMERGENCY DISPATCH]: Police escort assigned for Case ${selectedCase.case_id} under SC/ST PoA Act Sec 15A.`)}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Dispatch Escort (112)</span>
                  </button>

                  <button
                    onClick={() => alert(`[DLSA LEGAL AID]: Special Advocate assigned for Case ${selectedCase.case_id}.`)}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Assign DLSA Legal Aid</span>
                  </button>

                  <button
                    onClick={() => alert(`[CASE RESOLVED]: Case ${selectedCase.case_id} marked resolved & victim safely relocated.`)}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a case from the SVI priority queue to view briefing.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
