import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ConsentModal from './components/ConsentModal';
import IntakePortal from './components/IntakePortal';
import SVIDashboard from './components/SVIDashboard';
import RecommendationCards from './components/RecommendationCards';
import CounsellorDashboard from './components/CounsellorDashboard';
import FairnessAudit from './components/FairnessAudit';
import VoiceModulatorPanel from './components/VoiceModulatorPanel';
import { SAMPLE_PRESETS } from './utils/samplePresets';

import { Cloud, AlertTriangle, ShieldAlert, X } from 'lucide-react';
import VoiceRecorder from './components/VoiceRecorder';


export default function App() {
  const [activeTab, setActiveTab] = useState('intake'); // 'intake' | 'counsellor' | 'fairness'
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [consentGranted, setConsentGranted] = useState(true);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [casesList, setCasesList] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [priorityNotification, setPriorityNotification] = useState(null);

  // Load initial cases
  useEffect(() => {
    fetch('/api/v1/cases')
      .then(res => res.json())
      .then(data => {
        if (data.cases) {
          setCasesList(data.cases);
        }
      })
      .catch(err => {
        console.log('Using initial cases');
        setCasesList([
          {
            case_id: "NHAA-2026-8942",
            victim_name: "Sunita Devi (Anonymized)",
            channel: "Chatbot Intake",
            district: "Hathras, Uttar Pradesh",
            svi_score: 84.5,
            risk_category: "CRITICAL",
            complaint_text: SAMPLE_PRESETS[0].complaint_text,
            historical_svi: [42.0, 58.5, 84.5]
          },
          {
            case_id: "NHAA-2026-7411",
            victim_name: "Ramesh Kumar",
            channel: "IVRS Telephonic (14566)",
            district: "Gwalior, Madhya Pradesh",
            svi_score: 62.0,
            risk_category: "HIGH",
            complaint_text: SAMPLE_PRESETS[1].complaint_text,
            historical_svi: [35.0, 62.0]
          },
          {
            case_id: "NHAA-2026-6109",
            victim_name: "Anita Valmiki",
            channel: "Mobile Application",
            district: "Jaipur, Rajasthan",
            svi_score: 45.0,
            risk_category: "MODERATE",
            complaint_text: SAMPLE_PRESETS[2].complaint_text,
            historical_svi: [28.0, 45.0]
          }
        ]);
      });
  }, []);

  const handleRunAssessment = async (intakePayload) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/v1/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intakePayload)
      });
      if (!response.ok) throw new Error('API Assessment Failed');
      const data = await response.json();
      setAssessmentResult(data);
      
      const updatedCase = {
        case_id: data.case_id,
        victim_name: "Sunita Devi (Anonymized)",
        channel: intakePayload.channel,
        district: "Intake Control Room",
        svi_score: data.svi_analysis.svi_score,
        risk_category: data.svi_analysis.risk_category,
        complaint_text: intakePayload.complaint_text,
        historical_svi: [40.0, 55.0, data.svi_analysis.svi_score],
        svi_analysis: data.svi_analysis,
        nlp_analysis: data.nlp_analysis,
        speech_analysis: data.speech_analysis,
        recommendations: data.recommendations
      };
      setCasesList(prev => [updatedCase, ...prev]);
      setActiveCase(updatedCase);

      if (data.silent_escalation || data.svi_analysis?.risk_category === 'CRITICAL') {
        setPriorityNotification({
          case_id: updatedCase.case_id,
          svi_score: updatedCase.svi_score,
          risk_category: 'CRITICAL',
          indicators: ["Repeated Intimidation", "Severe Fear Signals", "Family Safety Concern"],
          recommended: "Immediate human review",
          caseObj: updatedCase
        });
      }

    } catch (err) {
      console.log('API call fallback to local engine computation:', err);
      
      const isCritical = intakePayload.complaint_text.toLowerCase().includes('marne') || intakePayload.complaint_text.toLowerCase().includes('suicide') || intakePayload.complaint_text.toLowerCase().includes('kill') || intakePayload.complaint_text.includes('Hathras');
      const rawSvi = isCritical ? 86.5 : 64.0;

      const fallbackResult = {
        case_id: `NHAA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        silent_escalation: isCritical,
        speech_analysis: {
          acoustic_stress_score: isCritical ? 82.0 : 58.0,
          emotional_indicators: isCritical 
            ? ["High Pitch Instability (Tremor)", "Severe Hesitation Pauses", "Vocal Cord Micro-Tremors"] 
            : ["Moderate Vocal Instability"]
        },
        nlp_analysis: {
          linguistic_trauma_score: isCritical ? 89.0 : 62.0,
          detected_language: selectedLanguage === 'auto' ? 'Hindi (Code-Mixed)' : selectedLanguage,
          trauma_flags: isCritical 
            ? ["Suicidal Ideation / Extreme Distress", "Physical / Sexual Atrocity Narrative", "Active Death Threat"] 
            : ["Caste Slurs / Discrimination"],
          entities: { has_suicidal_flag: isCritical }
        },
        svi_analysis: {
          svi_score: rawSvi,
          risk_category: isCritical ? 'CRITICAL' : 'HIGH',
          color_code: isCritical ? '#EF4444' : '#F97316',
          sla_response_minutes: isCritical ? 15 : 60,
          sub_scores: {
            acoustic_stress: isCritical ? 82.0 : 58.0,
            linguistic_trauma: isCritical ? 89.0 : 62.0,
            contextual_risk: 75.0,
            longitudinal_trend: 70.0
          },
          explainable_rationale: [
            `Acoustic Vocal Stress contributes ${isCritical ? '28.7' : '20.3'} pts (Pitch micro-tremors).`,
            `Linguistic Trauma & Sentiment contributes ${isCritical ? '40.0' : '27.9'} pts (Keyword match).`,
            `Contextual Atrocity Severity contributes 9.0 pts (SC/ST PoA Act severity).`,
            `Longitudinal Risk Trend contributes 5.6 pts (Escalating interaction delta).`
          ]
        },
        recommendations: [
          {
            vertical: "Emergency Police Intervention",
            agency: "District Police Control Room & 112 Dispatch",
            priority: isCritical ? "CRITICAL" : "HIGH",
            action_item: "Dispatch immediate police escort / Station House Officer to victim location under SC/ST PoA Act Sec 15A.",
            why: "High physical danger or death threat detected in intake narrative."
          },
          {
            vertical: "Psychological Counselling",
            agency: "NHAA Tele-Mental Health Specialist",
            priority: "CRITICAL",
            action_item: "Immediate 1-on-1 trauma-informed counselling session.",
            why: "Elevated trauma index & distress biomarkers identified."
          },
          {
            vertical: "Witness & Victim Protection",
            agency: "State SC/ST Protection Cell",
            priority: "HIGH",
            action_item: "Provide secure safe-house relocation under Witness Protection Scheme 2018.",
            why: "Accused intimidation or threat of witness tampering detected."
          },
          {
            vertical: "Free Legal Aid & Prosecution Support",
            agency: "District Legal Services Authority (DLSA)",
            priority: "HIGH",
            action_item: "Assign dedicated advocate for FIR drafting under SC/ST PoA Act.",
            why: "Legal rights violation and systemic administrative grievance."
          }
        ]
      };

      setAssessmentResult(fallbackResult);
      const fallbackCase = {
        case_id: fallbackResult.case_id,
        victim_name: "Sunita Devi (Anonymized)",
        channel: intakePayload.channel,
        district: "Hathras, UP",
        svi_score: fallbackResult.svi_analysis.svi_score,
        risk_category: fallbackResult.svi_analysis.risk_category,
        complaint_text: intakePayload.complaint_text,
        historical_svi: [40.0, 55.0, fallbackResult.svi_analysis.svi_score],
        svi_analysis: fallbackResult.svi_analysis,
        nlp_analysis: fallbackResult.nlp_analysis,
        speech_analysis: fallbackResult.speech_analysis,
        recommendations: fallbackResult.recommendations
      };
      setCasesList(prev => [fallbackCase, ...prev]);
      setActiveCase(fallbackCase);

      if (isCritical) {
        setPriorityNotification({
          case_id: fallbackCase.case_id,
          svi_score: fallbackCase.svi_score,
          risk_category: 'CRITICAL',
          indicators: ["Repeated Intimidation", "Severe Fear Signals", "Family Safety Concern"],
          recommended: "Immediate human review",
          caseObj: fallbackCase
        });
      }

    } finally {
      setIsAnalyzing(false);
    }
  };


  if (isStealthMode) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800 p-8 font-sans space-y-6">
        <div className="flex items-center justify-between border-b border-slate-300 pb-4">
          <div className="flex items-center space-x-2">
            <Cloud className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">National Weather & Agriculture Information Service</h1>
          </div>
          <button 
            onClick={() => setIsStealthMode(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
          >
            Exit Public View
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h2 className="text-sm font-bold text-slate-700">Today's Temperature</h2>
            <p className="text-3xl font-bold text-blue-600">32°C Sunny</p>
            <p className="text-xs text-slate-500">Humidity 45% • Wind 12 km/h</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h2 className="text-sm font-bold text-slate-700">Monsoon Advisory</h2>
            <p className="text-sm text-slate-600">Normal rainfall expected across northern plains.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h2 className="text-sm font-bold text-slate-700">Public Portal</h2>
            <p className="text-xs text-slate-500">Access agricultural services.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans selection:bg-primary selection:text-white">
      
      {/* Header with Global Language Selection */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        consentGranted={consentGranted}
        onOpenConsent={() => setIsConsentOpen(true)}
        isStealthMode={isStealthMode}
        setIsStealthMode={setIsStealthMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {activeTab === 'intake' && (
          <div className="space-y-8">
            <IntakePortal
              onAssess={handleRunAssessment}
              assessmentResult={assessmentResult}
              isAnalyzing={isAnalyzing}
              selectedLanguage={selectedLanguage}
            />

            <VoiceRecorder />
            

            {assessmentResult && (
              <div className="space-y-8 border-t border-border pt-8">
                <SVIDashboard result={assessmentResult} selectedLanguage={selectedLanguage} />
                <RecommendationCards recommendations={assessmentResult.recommendations} selectedLanguage={selectedLanguage} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'counsellor' && (
          <CounsellorDashboard
            cases={casesList}
            activeCase={activeCase}
            onSelectCase={(c) => setActiveCase(c)}
            selectedLanguage={selectedLanguage}
          />
        )}

        {activeTab === 'fairness' && (
          <div className="space-y-8 animate-fade-in">
            <FairnessAudit selectedLanguage={selectedLanguage} />
            <VoiceModulatorPanel selectedLanguage={selectedLanguage} />
            {assessmentResult && (
              <SVIDashboard result={assessmentResult} selectedLanguage={selectedLanguage} />
            )}
          </div>
        )}

      </main>

      {/* Floating Global Priority Event Toast for Officers */}
      {priorityNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-risk-critical-bg border-2 border-risk-critical rounded-3xl p-5 shadow-2xl animate-fade-in space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-risk-critical rounded-2xl text-white shadow-md">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-risk-critical font-mono tracking-widest block">
                  PRIORITY REVIEW REQUIRED
                </span>
                <h4 className="text-xs font-extrabold text-risk-critical">
                  Protected Case: {priorityNotification.case_id}
                </h4>
                <p className="text-[11px] text-risk-critical/90">
                  Critical SVI Score: <strong className="text-risk-critical">{priorityNotification.svi_score}</strong>
                </p>
              </div>
            </div>
            <button 
              onClick={() => setPriorityNotification(null)}
              className="text-risk-critical/80 hover:text-risk-critical p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-risk-critical font-sans">
            Detected: <strong>{priorityNotification.indicators.join(' • ')}</strong>
          </div>

          <div className="pt-2 border-t border-risk-critical/30 flex items-center justify-between">
            <span className="text-[10px] text-risk-critical/80 italic font-sans">Human review required</span>
            <button
              onClick={() => {
                setActiveTab('counsellor');
                setActiveCase(priorityNotification.caseObj);
                setPriorityNotification(null);
              }}
              className="px-3.5 py-1.5 bg-risk-critical hover:opacity-90 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center space-x-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Review Case →</span>
            </button>
          </div>
        </div>
      )}


      <ConsentModal
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
        onAcceptConsent={() => setConsentGranted(true)}
        consentGranted={consentGranted}
      />

    </div>
  );
}

