import React from 'react';
import { PositionType } from '../../types/application';
import { ROLE_DETAILS } from '../../lib/questions';
import { CheckCircle2, ArrowLeft, ArrowRight, AlertCircle, Shield, Award } from 'lucide-react';

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
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-amber-400 font-mono text-sm tracking-wider">02.</span>
          <span>Position Selection & Prerequisites</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Select the position you wish to apply for. The subsequent evaluation scenarios will adapt to your chosen track.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Moderator Option */}
        <div
          onClick={() => onSelectPosition('moderator')}
          className={`cursor-pointer rounded-2xl border p-6 transition-all duration-200 flex flex-col justify-between ${
            position === 'moderator'
              ? 'border-amber-400/80 bg-amber-500/[0.08] shadow-lg shadow-amber-500/10'
              : 'border-slate-800 bg-[#0A0C13] hover:border-slate-700 hover:bg-[#0D0F17]'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-amber-400/90 font-mono tracking-wider uppercase">
                {mod.badgeSubtitle}
              </span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  position === 'moderator'
                    ? 'border-amber-400 bg-amber-400 text-black'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {position === 'moderator' && <span className="w-2 h-2 rounded-full bg-black" />}
              </div>
            </div>

            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>{mod.title}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{mod.summary}</p>

            <div className="space-y-2 pt-3 border-t border-white/5">
              <div className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wide">
                Key Responsibilities:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {mod.responsibilities.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Eligibility Prerequisites:
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                {mod.eligibility.slice(0, 3).map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 shrink-0">·</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <span
              className={`text-xs font-semibold ${
                position === 'moderator' ? 'text-amber-300' : 'text-slate-500'
              }`}
            >
              {position === 'moderator' ? '✓ Selected Track' : 'Click to select Moderator'}
            </span>
          </div>
        </div>

        {/* Administrator Option */}
        <div
          onClick={() => onSelectPosition('administrator')}
          className={`cursor-pointer rounded-2xl border p-6 transition-all duration-200 flex flex-col justify-between ${
            position === 'administrator'
              ? 'border-amber-400/80 bg-amber-500/[0.08] shadow-lg shadow-amber-500/10'
              : 'border-slate-800 bg-[#0A0C13] hover:border-slate-700 hover:bg-[#0D0F17]'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-amber-400/90 font-mono tracking-wider uppercase">
                {admin.badgeSubtitle}
              </span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  position === 'administrator'
                    ? 'border-amber-400 bg-amber-400 text-black'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {position === 'administrator' && <span className="w-2 h-2 rounded-full bg-black" />}
              </div>
            </div>

            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{admin.title}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{admin.summary}</p>

            <div className="p-3 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl text-[11px] text-slate-300">
              <strong className="text-amber-300 block mb-0.5">Governance Scope:</strong>
              Administrative appointments focus on operational triage and staff alignment. They do not grant financial, server ownership, or technical root privileges.
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wide">
                Key Responsibilities:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {admin.responsibilities.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Eligibility Prerequisites:
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                {admin.eligibility.slice(0, 3).map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 shrink-0">·</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <span
              className={`text-xs font-semibold ${
                position === 'administrator' ? 'text-amber-300' : 'text-slate-500'
              }`}
            >
              {position === 'administrator' ? '✓ Selected Track' : 'Click to select Administrator'}
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
      <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/5 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="Btn gap-2 shrink-0 w-full sm:w-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!position}
          className="Btn gap-2 shrink-0 shadow-md shadow-amber-500/20 w-full sm:w-auto"
        >
          <span>Continue to General Questions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
