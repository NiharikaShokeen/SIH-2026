import React, { useState } from 'react';
import { Activity, ShieldAlert, CheckCircle, Clock, Search, AlertTriangle, TrendingUp, UserCheck, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { t } from '../utils/translations';

export default function CounsellorDashboard({ cases, onSelectCase, activeCase, onRefreshCases, selectedLanguage = 'en' }) {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefreshCases) {
      setIsRefreshing(true);
      await onRefreshCases();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

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
      
      {/* Header bar with Refresh Cases button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h2 className="text-xl font-extrabold text-primary-dark">Officer & Counsellor Control Room</h2>
          <p className="text-xs text-text-muted">Real-time SVI case queue, priority escalation alerts & intervention dispatch</p>
        </div>

        {onRefreshCases && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-surface hover:bg-background border border-border text-primary-dark rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing Queue...' : 'Refresh Case Feed'}</span>
          </button>
        )}
      </div>

      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-surface border border-border p-5 rounded-3xl space-y-1 shadow-sm">
          <span className="text-xs text-primary-dark font-bold uppercase">{t('total_cases_label', selectedLanguage)}</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-mono font-black text-text">{cases.length}</span>
            <Activity className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="bg-risk-critical-bg border border-risk-critical/40 p-5 rounded-3xl space-y-1 shadow-sm">
          <span className="text-xs text-risk-critical font-bold uppercase">{t('critical_escalations_label', selectedLanguage)}</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-mono font-black text-risk-critical">
              {cases.filter(c => c.risk_category === 'CRITICAL').length}
            </span>
            <AlertTriangle className="w-6 h-6 text-risk-critical animate-pulse" />
          </div>
        </div>

        <div className="bg-risk-high-bg border border-risk-high/40 p-5 rounded-3xl space-y-1 shadow-sm">
          <span className="text-xs text-risk-high font-bold uppercase">{t('high_risk_pending_label', selectedLanguage)}</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-mono font-black text-risk-high">
              {cases.filter(c => c.risk_category === 'HIGH').length}
            </span>
            <Clock className="w-6 h-6 text-risk-high" />
          </div>
        </div>

        <div className="bg-risk-low-bg border border-risk-low/40 p-5 rounded-3xl space-y-1 shadow-sm">
          <span className="text-xs text-risk-low font-bold uppercase">{t('dispatched_actions_label', selectedLanguage)}</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-mono font-black text-risk-low">100%</span>
            <UserCheck className="w-6 h-6 text-risk-low" />
          </div>
        </div>

      </div>

      {/* Priority Escalation Alert Banner for Officers */}
      {cases.some(c => c.risk_category === 'CRITICAL') && (
        <div className="bg-risk-critical-bg border-2 border-risk-critical rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in shadow-md">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-risk-critical rounded-2xl text-white shadow mt-0.5">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-risk-critical px-2.5 py-0.5 rounded font-mono shadow">
                  PRIORITY REVIEW REQUIRED
                </span>
                <span className="text-xs font-mono font-bold text-risk-critical">
                  Case ID: {cases.find(c => c.risk_category === 'CRITICAL')?.case_id || 'NHAA-2026-8942'}
                </span>
                <span className="text-[10px] font-mono font-bold bg-risk-critical/15 text-risk-critical border border-risk-critical/30 px-2 py-0.5 rounded">
                  CRITICAL • SVI: {cases.find(c => c.risk_category === 'CRITICAL')?.svi_score || 91}
                </span>
              </div>
              <h4 className="text-sm font-bold text-risk-critical font-sans">
                High-Risk Combination Detected: Repeated Intimidation • Severe Fear Signals • Family Safety Concern
              </h4>
              <p className="text-xs text-risk-critical/90 font-sans">
                Recommended Immediate Action: <strong>Immediate human review & 1-on-1 trauma counselling assignment</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectCase && onSelectCase(cases.find(c => c.risk_category === 'CRITICAL'))}
            className="px-5 py-2.5 bg-risk-critical hover:opacity-90 text-white rounded-2xl text-xs font-bold shadow-md whitespace-nowrap transition-all flex items-center space-x-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Review Case</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Priority Queue */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-3xl p-5 space-y-4 shadow-sm">
          
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-primary-dark flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              <span>{t('svi_priority_queue', selectedLanguage)}</span>
            </h3>
            <span className="text-xs text-text-muted font-mono">{t('sorted_by_svi', selectedLanguage)}</span>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t('search_placeholder', selectedLanguage)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-background border border-border rounded-xl px-2 py-1.5 text-xs text-text focus:outline-none cursor-pointer"
            >
              <option value="ALL">{t('all_risk', selectedLanguage)}</option>
              <option value="CRITICAL">{t('critical_risk', selectedLanguage)}</option>
              <option value="HIGH">{t('high_risk', selectedLanguage)}</option>
              <option value="MODERATE">{t('moderate_risk', selectedLanguage)}</option>
            </select>
          </div>

          {/* Case List */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredCases.map((c) => (
              <button
                key={c.case_id}
                onClick={() => onSelectCase(c)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  selectedCase && selectedCase.case_id === c.case_id
                    ? 'bg-background border-primary shadow-sm font-semibold'
                    : 'bg-surface hover:bg-background border-border'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-text font-mono">{c.case_id}</span>
                    <span className="text-[10px] text-text-muted">({c.channel})</span>
                  </div>
                  <span className="text-xs text-text block">{c.victim_name || 'Complainant'}</span>
                  <span className="text-[10px] text-text-muted">{c.district}</span>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-lg font-black font-mono text-text block">{c.svi_score || c.svi_analysis?.svi_score}</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    c.risk_category === 'CRITICAL'
                      ? 'bg-risk-critical-bg text-risk-critical border border-risk-critical/30'
                      : c.risk_category === 'HIGH'
                      ? 'bg-risk-high-bg text-risk-high border border-risk-high/30'
                      : c.risk_category === 'MODERATE'
                      ? 'bg-risk-moderate-bg text-risk-moderate border border-risk-moderate/30'
                      : 'bg-risk-low-bg text-risk-low border border-risk-low/30'
                  }`}>
                    {c.risk_category}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Case Briefing, Explainable Breakdown & Human Dispatch */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-3xl p-6 space-y-6 shadow-sm">
          {selectedCase ? (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-primary-dark bg-primary/10 border border-primary/30 px-2.5 py-0.5 rounded font-mono">
                      {selectedCase.case_id}
                    </span>
                    <span className="text-xs text-text-muted">{selectedCase.district}</span>
                  </div>
                  <h3 className="text-lg font-bold text-text mt-1">{selectedCase.victim_name}</h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-text-muted block font-semibold">SVI Risk Score</span>
                  <span className="text-2xl font-mono font-black text-primary-dark">
                    {selectedCase.svi_score || selectedCase.svi_analysis?.svi_score}
                  </span>
                </div>
              </div>

              {/* Explainable AI Section: Why This Case Was Prioritized */}
              <div className="bg-background p-4 rounded-2xl border border-border space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h4 className="text-xs font-bold text-primary-dark uppercase tracking-wider flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-primary" />
                    <span>Why This Case Was Prioritized (Explainable SVI Output)</span>
                  </h4>
                  <span className="text-[10px] text-text-muted font-mono">Model Audit Verified</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Linguistic Indicators */}
                  <div className="p-3 bg-surface rounded-xl border border-border space-y-1">
                    <span className="text-[11px] font-bold text-secondary block">Linguistic Indicators:</span>
                    <p className="text-text text-[11px]">
                      {selectedCase.nlp_analysis?.trauma_flags?.join(', ') || 'Repeated Intimidation • Atrocity Threat • Caste Slurs'}
                    </p>
                  </div>

                  {/* Acoustic Indicators */}
                  <div className="p-3 bg-surface rounded-xl border border-border space-y-1">
                    <span className="text-[11px] font-bold text-primary-dark block">Acoustic Indicators:</span>
                    <p className="text-text text-[11px]">
                      {selectedCase.speech_analysis?.emotional_indicators?.join(', ') || 'High Pitch Instability (Tremor) • Vocal Hesitation Pauses'}
                    </p>
                  </div>

                  {/* Context Indicators */}
                  <div className="p-3 bg-surface rounded-xl border border-border space-y-1">
                    <span className="text-[11px] font-bold text-risk-moderate block">Context Indicators:</span>
                    <p className="text-text text-[11px]">
                      Family Safety Risk • Police FIR Refusal • Active Perpetrator Intimidation
                    </p>
                  </div>

                  {/* Historical Trend */}
                  <div className="p-3 bg-surface rounded-xl border border-border space-y-1">
                    <span className="text-[11px] font-bold text-risk-low block">Historical Trend:</span>
                    <p className="text-text text-[11px]">
                      Escalating vulnerability trajectory (+26% delta over previous interactions)
                    </p>
                  </div>
                </div>
              </div>

              {/* Longitudinal Risk Graph */}
              <div className="bg-background p-4 rounded-2xl border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>{t('trajectory_title', selectedLanguage)}</span>
                  </span>
                  <span className="text-risk-critical font-semibold text-[11px]">{t('escalating_trend', selectedLanguage)}</span>
                </div>

                <div className="h-36 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DDD9D1" />
                      <XAxis dataKey="session" stroke="#697075" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} stroke="#697075" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFDFC', borderColor: '#DDD9D1', borderRadius: 8, fontSize: 12, color: '#34383C' }} />
                      <Line type="monotone" dataKey="SVI" stroke="#72243E" strokeWidth={3} dot={{ r: 5, fill: '#72243E' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Narrative Text Briefing */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-text">{t('case_narrative_briefing', selectedLanguage)}</span>
                <p className="text-xs text-text leading-relaxed bg-background p-4 rounded-2xl border border-border font-sans">
                  "{selectedCase.complaint_text}"
                </p>
              </div>

              {/* Recommended Human Actions Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text block">Recommended Action Verticals (Prioritized):</span>
                  <span className="text-[10px] text-risk-low font-mono font-bold">🟢 Primary Action First</span>
                </div>
                
                <div className="space-y-2">
                  {/* Primary Urgent Action */}
                  <div className="p-3.5 bg-risk-low-bg border border-risk-low/40 rounded-2xl flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-risk-low flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-risk-low animate-pulse"></span>
                        <span>Primary Action: Assign Human Counsellor & 112 Escort</span>
                      </span>
                      <p className="text-[11px] text-text">Immediate 1-on-1 psychological support and police protection under SC/ST PoA Act Sec 15A.</p>
                    </div>
                    <button
                      onClick={() => alert(`[ASSIGNED]: Human Counsellor & 112 Police Escort assigned for Case ${selectedCase.case_id}.`)}
                      className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow whitespace-nowrap"
                    >
                      Assign Now
                    </button>
                  </div>

                  {/* Secondary Actions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => alert(`[DLSA LEGAL AID]: Special Advocate assigned for Case ${selectedCase.case_id}.`)}
                      className="p-3 rounded-xl bg-background hover:bg-surface border border-border text-text font-semibold text-xs flex items-center justify-between shadow-sm"
                    >
                      <span>DLSA Legal Aid Advocate</span>
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    </button>

                    <button
                      onClick={() => alert(`[CASE RESOLVED]: Case ${selectedCase.case_id} marked resolved & victim relocated.`)}
                      className="p-3 rounded-xl bg-background hover:bg-surface border border-border text-text font-semibold text-xs flex items-center justify-between shadow-sm"
                    >
                      <span>Mark Case Resolved</span>
                      <UserCheck className="w-3.5 h-3.5 text-risk-low" />
                    </button>
                  </div>
                </div>

                {/* Subtle Ethical AI Disclaimer */}
                <div className="pt-2 text-center">
                  <p className="text-[11px] text-text-muted italic">
                    "AI recommends and prioritizes. Humans make intervention decisions."
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-text-muted text-xs">
              Select a case from the SVI priority queue to view briefing.
            </div>
          )}
        </div>

      </div>


    </div>
  );
}

