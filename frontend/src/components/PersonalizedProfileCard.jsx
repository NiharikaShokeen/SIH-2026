import React, { useState } from 'react';
import { User, MapPin, Shield, CheckCircle, FileText, Download, Heart, AlertTriangle } from 'lucide-react';
import { t } from '../utils/translations';

export default function PersonalizedProfileCard({ onProfileChange, selectedLanguage = 'en' }) {
  const [name, setName] = useState('Sunita Devi (Anonymized)');
  const [district, setDistrict] = useState('Hathras, Uttar Pradesh');
  const [category, setCategory] = useState('SC Woman Victim');
  const [policeStation, setPoliceStation] = useState('Hathras Sadar Police Station');
  const [isPlanOpen, setIsPlanOpen] = useState(false);

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 glass-panel-luxury space-y-4 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-950 to-indigo-950 border border-cyan-700/60 rounded-2xl text-cyan-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Personalized Victim Profile & Safety Plan</h3>
            <p className="text-[11px] text-slate-400">Tailors emergency support, local legal aid & shelter options to your exact district</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPlanOpen(!isPlanOpen)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isPlanOpen ? 'Hide Safety Plan' : 'Generate Safety Plan'}</span>
        </button>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Field 1: Pseudonym */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complainant Pseudonym:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleUpdate(e.target.value, district, category, policeStation)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Field 2: District */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">District & State:</label>
          <input
            type="text"
            value={district}
            onChange={(e) => handleUpdate(name, e.target.value, category, policeStation)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Field 3: Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vulnerability Category:</label>
          <select
            value={category}
            onChange={(e) => handleUpdate(name, district, e.target.value, policeStation)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="SC Woman Victim">SC Woman Victim</option>
            <option value="ST Tribal Member">ST Tribal Member</option>
            <option value="Elderly SC Individual">Elderly SC Individual</option>
            <option value="SC/ST Minor Child">SC/ST Minor Child</option>
          </select>
        </div>

        {/* Field 4: Police Station */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jurisdiction Police Station:</label>
          <input
            type="text"
            value={policeStation}
            onChange={(e) => handleUpdate(name, district, category, e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

      </div>

      {/* Expandable Safety Plan Document Preview */}
      {isPlanOpen && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-900/60 space-y-3 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Personalized Victim Safety Action Plan — {name}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Confidential Document
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-cyan-400 font-bold block">1. Immediate Protection</span>
              <p>Escort assigned via Station House Officer, <strong>{policeStation}</strong>. Direct hotline linked to 14566 & 112.</p>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold block">2. Safe House Relocation</span>
              <p>Assigned perimeter safe house in <strong>{district}</strong> under Witness Protection Scheme 2018.</p>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold block">3. Legal Aid Advocate</span>
              <p>Special Public Prosecutor assigned via District Legal Services Authority (DLSA), {district.split(',')[0]}.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
