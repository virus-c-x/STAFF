import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Calendar } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#0E121B] border border-slate-800 rounded-xl flex flex-col shadow-2xl text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-lg font-semibold text-white">
                Recruitment Privacy Notice
              </h2>
              <p className="text-xs text-slate-400">Version 1.0 · Last Updated October 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              1. Purpose of Data Collection
            </h3>
            <p className="text-slate-400">
              The information submitted through this recruitment portal is gathered strictly to evaluate candidate suitability for community moderation and administrative appointments within our server community. We do not sell, rent, or monetize your applicant information under any circumstances.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-indigo-400" />
              2. Confidentiality & Access Restrictions
            </h3>
            <p className="text-slate-400">
              Your application answers are protected under PostgreSQL Row Level Security (RLS) policies. Only authorized recruitment leads and senior community administrators with authenticated staff credentials have access to review your written submissions. Anonymous public users cannot query or inspect your application.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-medium text-white">
              3. Information We Collect
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Community Display Name & Platform Username (e.g. Discord handle)</li>
              <li>General age bracket (for compliance with community volunteer requirements)</li>
              <li>Time zone and weekly available contribution hours</li>
              <li>Languages spoken for multilingual moderation coverage</li>
              <li>Written situational and behavioral scenario responses</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              Note: We do not ask for, nor should you provide, passwords, authentication tokens, government identification, financial details, or home addresses.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              4. Data Retention & Deletion
            </h3>
            <p className="text-slate-400">
              Applications are retained for a maximum of 90 days following recruitment cycle closure to facilitate onboarding and review inquiries, after which candidate records are securely archived or purged from active databases upon request.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-medium text-white">
              5. Applicant Rights
            </h3>
            <p className="text-slate-400">
              You retain the right to request review, correction, or withdrawal of your application prior to final evaluation by contacting the administration team with your unique Application Reference Code.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-slate-800 bg-[#0A0D14] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
