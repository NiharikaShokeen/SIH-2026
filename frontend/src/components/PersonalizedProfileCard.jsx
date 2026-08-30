import React, { useState } from 'react';
import { User, MapPin, Shield, CheckCircle, FileText, Heart, Lock, HelpCircle } from 'lucide-react';
import { t } from '../utils/translations';

export default function PersonalizedProfileCard({ onProfileChange, selectedLanguage = 'en' }) {
  const [name, setName] = useState('Sunita Devi (Anonymized)');
  const [district, setDistrict] = useState('Hathras, Uttar Pradesh');
  const [category, setCategory] = useState('SC Woman Victim');
  const [policeStation, setPoliceStation] = useState('Hathras Sadar Police Station');
  const [isPlanOpen, setIsPlanOpen] = useState(true);

  const handleUpdate = (newName, newDist, newCat, newPs) => {
    setName(newName);
    setDistrict(newDist);
    setCategory(newCat);
    setPoliceStation(newPs);

    if (onProfileChange) {
      onProfileChange({
        victim_name: newName,
        district: newDist,
        category: newCat,
        police_station: newPs
      });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 glass-panel space-y-5 shadow-2xl animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-950 border border-teal-700/60 rounded-2xl text-teal-400">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Your Support Plan</h3>
            <p className="text-xs text-slate-400">A clear, privacy-conscious breakdown of support options tailored to your district</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPlanOpen(!isPlanOpen)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-md transition-all flex items-center space-x-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isPlanOpen ? 'Hide Details' : 'View Support Plan'}</span>
        </button>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Field 1: Pseudonym */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Complainant Pseudonym:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleUpdate(e.target.value, district, category, policeStation)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Field 2: District */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">District & State:</label>
          <input
            type="text"
            value={district}
            onChange={(e) => handleUpdate(name, e.target.value, category, policeStation)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Field 3: Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Vulnerability Category:</label>
          <select
            value={category}
            onChange={(e) => handleUpdate(name, district, e.target.value, policeStation)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="SC Woman Victim">SC Woman Victim</option>
            <option value="ST Tribal Member">ST Tribal Member</option>
            <option value="Elderly SC Individual">Elderly SC Individual</option>
            <option value="SC/ST Minor Child">SC/ST Minor Child</option>
          </select>
        </div>

        {/* Field 4: Police Station */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Jurisdiction Police Station:</label>
          <input
            type="text"
            value={policeStation}
            onChange={(e) => handleUpdate(name, district, category, e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>

      </div>

      {/* Human-Centered Support Plan Explainer */}
      {isPlanOpen && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold text-slate-100">
                Personalized Support Roadmap — {name}
              </span>
            </div>
            <span className="text-[10px] text-teal-300 bg-teal-950 px-2.5 py-0.5 rounded border border-teal-800 font-mono">
              Confidential & Protected
            </span>
          </div>

          {/* 3 Human Support Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-teal-300 block">1. Someone to Talk To</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Based on what you shared, a trauma-informed counsellor may be assigned to help navigate what you are experiencing in <strong>{district}</strong>.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-cyan-300 block">2. Legal Assistance Support</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Your situation may qualify for free legal representation via the District Legal Services Authority (DLSA) in your jurisdiction.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-emerald-300 block">3. Safety Review & Protection</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Because threats were mentioned, a human welfare professional may assess your local protection requirements under SC/ST Protection rules.
              </p>
            </div>

          </div>

          {/* Privacy & Transparency Explainer */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 font-sans">
            <div className="flex items-center space-x-1.5 text-teal-400 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>What happens next & privacy safeguards:</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
              <li><strong>Who may contact you:</strong> Only verified helpline counsellors or local district welfare officers.</li>
              <li><strong>What information is shared:</strong> Your narrative is shared securely with official support staff without public exposure.</li>
              <li><strong>You stay in control:</strong> You can review or withdraw consent at any time from the top navigation bar.</li>
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
