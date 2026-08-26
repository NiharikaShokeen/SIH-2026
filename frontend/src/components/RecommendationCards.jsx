import React from 'react';
import { ShieldCheck, PhoneCall, Scale, Stethoscope, Heart, Landmark } from 'lucide-react';
import { t } from '../utils/translations';

export default function RecommendationCards({ recommendations, selectedLanguage = 'en' }) {
  if (!recommendations || recommendations.length === 0) return null;

  const getVerticalIcon = (vertical) => {
    switch (vertical) {
      case 'Emergency Police Intervention':
        return <ShieldCheck className="w-6 h-6 text-red-400" />;
      case 'Psychological Counselling':
        return <Heart className="w-6 h-6 text-pink-400" />;
      case 'Witness & Victim Protection':
        return <PhoneCall className="w-6 h-6 text-amber-400" />;
      case 'Free Legal Aid & Prosecution Support':
        return <Scale className="w-6 h-6 text-cyan-400" />;
      case 'Medical Care & MLC Documentation':
        return <Stethoscope className="w-6 h-6 text-emerald-400" />;
      case 'Relief & Rehabilitation Fund':
        return <Landmark className="w-6 h-6 text-purple-400" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{t('recommendations_title', selectedLanguage)}</h3>
          <p className="text-xs text-slate-400">{t('recommendations_subtitle', selectedLanguage)}</p>
        </div>
        <span className="text-xs font-semibold text-cyan-400 bg-cyan-950 border border-cyan-800 px-3 py-1 rounded-full">
          {recommendations.length} {t('support_verticals_count', selectedLanguage)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, idx) => (
          <div 
            key={idx}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 glass-panel flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-700 transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:scale-105 transition-transform">
                {getVerticalIcon(rec.vertical)}
              </div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                rec.priority === 'CRITICAL'
                  ? 'bg-red-950 border-red-800 text-red-400'
                  : rec.priority === 'HIGH'
                  ? 'bg-amber-950 border-amber-800 text-amber-400'
                  : 'bg-emerald-950 border-emerald-800 text-emerald-400'
              }`}>
                {rec.priority} PRIORITY
              </span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">{rec.vertical}</h4>
              <span className="text-[11px] text-cyan-400 font-semibold block">{rec.agency}</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {rec.action_item}
              </p>
            </div>

            {/* Why Recommended Rationale */}
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              <strong className="text-slate-300">{t('rationale_label', selectedLanguage)} </strong> {rec.why}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
