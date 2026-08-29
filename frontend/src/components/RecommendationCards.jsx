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
          <h3 className="text-lg font-bold text-primary-dark">{t('recommendations_title', selectedLanguage)}</h3>
          <p className="text-xs text-text-muted">{t('recommendations_subtitle', selectedLanguage)}</p>
        </div>
        <span className="text-xs font-semibold text-primary-dark bg-primary/10 border border-primary/30 px-3 py-1 rounded-full">
          {recommendations.length} {t('support_verticals_count', selectedLanguage)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, idx) => (
          <div 
            key={idx}
            className="bg-surface border border-border rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-primary/50 transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="p-3 bg-background rounded-2xl border border-border group-hover:scale-105 transition-transform">
                {getVerticalIcon(rec.vertical)}
              </div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                rec.priority === 'CRITICAL'
                  ? 'bg-risk-critical-bg border-risk-critical/40 text-risk-critical'
                  : rec.priority === 'HIGH'
                  ? 'bg-risk-high-bg border-risk-high/40 text-risk-high'
                  : 'bg-risk-low-bg border-risk-low/40 text-risk-low'
              }`}>
                {rec.priority} PRIORITY
              </span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-text">{rec.vertical}</h4>
              <span className="text-[11px] text-primary-dark font-semibold block">{rec.agency}</span>
              <p className="text-xs text-text leading-relaxed font-sans bg-background p-3 rounded-xl border border-border">
                {rec.action_item}
              </p>
            </div>

            {/* Why Recommended Rationale */}
            <div className="pt-2 border-t border-border text-[11px] text-text-muted">
              <strong className="text-text">{t('rationale_label', selectedLanguage)} </strong> {rec.why}
            </div>

          </div>
        ))}
      </div>
    </div>
  );

}
