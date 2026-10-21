import React from 'react';
import { PositionType } from '../../types/application';
import { ROLE_DETAILS } from '../../lib/questions';
import { Shield, ShieldAlert, CheckCircle2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

interface Step2PositionSelectProps {
  position: PositionType | '';
  onSelectPosition: (pos: PositionType) => void;
  onNext: () => void;
  onBack: () => void;
  error?: string;
}

export const Step2PositionSelect: React.FC<Step2PositionSelectProps> = ({
  position,
  onSelectPosition,
  onNext,
  onBack,
  error,
}) => {
  const mod = ROLE_DETAILS.moderator;
  const admin = ROLE_DETAILS.administrator;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-white">Step 2 — Position Selection & Eligibility Confirmation</h3>
        <p className="text-xs text-slate-400 mt-1">
          Select the position you wish to apply for. Your subsequent questions will adapt based on this choice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Moderator Option */}
        <div
          onClick={() => onSelectPosition('moderator')}
          className={`cursor-pointer rounded-xl border p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between ${
            position === 'moderator'
              ? 'border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-500/10'
              : 'border-slate-800 bg-[#0E121B] hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-400 font-mono">{mod.badgeSubtitle}</span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  position === 'moderator'
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {position === 'moderator' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            <h4 className="text-xl font-bold text-white">{mod.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{mod.summary}</p>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Key Responsibilities:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {mod.responsibilities.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Eligibility Prerequisites:
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                {mod.eligibility.slice(0, 3).map((e, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 shrink-0">·</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/60">
            <span
              className={`text-xs font-semibold ${
                position === 'moderator' ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              {position === 'moderator' ? '✓ Selected Position' : 'Click to select Moderator'}
            </span>
          </div>
        </div>

        {/* Administrator Option */}
        <div
          onClick={() => onSelectPosition('administrator')}
          className={`cursor-pointer rounded-xl border p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between ${
            position === 'administrator'
              ? 'border-purple-500 bg-purple-950/20 shadow-md shadow-purple-500/10'
              : 'border-slate-800 bg-[#0E121B] hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-400 font-mono">{admin.badgeSubtitle}</span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  position === 'administrator'
                    ? 'border-purple-500 bg-purple-600 text-white'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {position === 'administrator' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            <h4 className="text-xl font-bold text-white">{admin.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{admin.summary}</p>

            <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-[11px] text-slate-400">
              <strong className="text-slate-200">Governance Notice:</strong> Administrative appointments focus on operational triage and staff alignment. They do not grant financial, server ownership, or technical root privileges.
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Key Responsibilities:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {admin.responsibilities.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Eligibility Prerequisites:
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                {admin.eligibility.slice(0, 3).map((e, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-400 shrink-0">·</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/60">
            <span
              className={`text-xs font-semibold ${
                position === 'administrator' ? 'text-purple-400' : 'text-slate-400'
              }`}
            >
              {position === 'administrator' ? '✓ Selected Position' : 'Click to select Administrator'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!position}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
        >
          <span>Continue to General Questions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
