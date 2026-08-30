import React from 'react';
import { ShieldCheck, Lock, Eye, AlertTriangle, Check, X } from 'lucide-react';

export default function ConsentModal({ isOpen, onClose, onAcceptConsent, consentGranted }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/70 backdrop-blur-md animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glowing Top Decorator */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary-dark to-secondary"></div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-primary-dark">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">Informed Consent & Privacy Charter</h2>
              <p className="text-xs text-text-muted">National Helpline Against Atrocities (14566) • MoSJE</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-background"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consent Statements */}
        <div className="space-y-3 text-sm text-text bg-background p-4 rounded-xl border border-border">
          <div className="flex items-start space-x-3">
            <Lock className="w-4 h-4 text-primary-dark mt-1 flex-shrink-0" />
            <p>
              <strong className="text-text">Encrypted & Confidential Intake:</strong> Your voice biomarkers and text narrative are encrypted using AES-256 standards. Audio streams are discarded post-feature extraction unless explicit ongoing consent is retained.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Eye className="w-4 h-4 text-primary-dark mt-1 flex-shrink-0" />
            <p>
              <strong className="text-text">AI Stress Assessment Purpose:</strong> The AI engine computes a Stress Vulnerability Index (SVI) purely to prioritize counsellor dispatch, legal aid, medical care, and witness protection.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-4 h-4 text-primary-dark mt-1 flex-shrink-0" />
            <p>
              <strong className="text-text">Right to Opt-Out Anytime:</strong> You may pause audio recording, request human-only intake without AI analysis, or request total deletion of session logs at any stage.
            </p>
          </div>
        </div>

        {/* Scope Checkboxes */}
        <div className="space-y-2 text-xs text-text">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" defaultChecked disabled className="rounded border-border text-primary focus:ring-primary" />
            <span>Consent to process speech prosody (pitch & micro-tremor stress indicators)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" defaultChecked disabled className="rounded border-border text-primary focus:ring-primary" />
            <span>Consent to share automated recommendations with authorized DLSA / Police Counsellors</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-text hover:bg-background"
          >
            Review Later
          </button>
          <button
            onClick={() => {
              onAcceptConsent();
              onClose();
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Accept & Record Consent</span>
          </button>
        </div>

      </div>
    </div>
  );
}
