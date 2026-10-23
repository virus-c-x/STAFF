import React from 'react';
import { X, BookOpen, CheckCircle2 } from 'lucide-react';

interface StaffRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffRulesModal: React.FC<StaffRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-modal-backdrop">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#0A0C13] border border-amber-500/30 rounded-2xl flex flex-col shadow-2xl text-slate-200 overflow-hidden animate-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-[#07080D]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/10 border border-amber-400/25 rounded-xl text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="rules-modal-title" className="text-base font-bold text-white uppercase tracking-wider">
                ASPIDA Code of Conduct & Staff Policies
              </h2>
              <p className="text-xs text-slate-400">Standard Operating Procedures · Revision 4.2</p>
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
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-amber-300">
              Core Staff Principles
            </h3>
            <div className="grid gap-3">
              <div className="p-3 bg-[#06070B] border border-white/5 rounded-xl">
                <div className="font-semibold text-white flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Impartiality & Zero-Favoritism</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Community guidelines apply uniformly to all members regardless of friendship, tenure, or server status. If a close friend violates a rule, staff must recuse themselves or report through standard channels.
                </p>
              </div>

              <div className="p-3 bg-[#06070B] border border-white/5 rounded-xl">
                <div className="font-semibold text-white flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>De-escalation First</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  The primary role of moderation is to diffuse tension and maintain constructive dialogue, not to impose punitive measures prematurely. Always prioritize clear communication.
                </p>
              </div>

              <div className="p-3 bg-[#06070B] border border-white/5 rounded-xl">
                <div className="font-semibold text-white flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Confidentiality of Staff Matters</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Internal staff channels, incident tickets, moderation deliberations, and applicant submissions are strictly confidential. Sharing internal logs outside staff channels results in immediate removal.
                </p>
              </div>

              <div className="p-3 bg-[#06070B] border border-white/5 rounded-xl">
                <div className="font-semibold text-white flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Least Privilege & Permission Governance</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Staff tools, bot commands, and administrative privileges must only be used in the direct execution of moderation duties. Abuse or joking with administrative commands is strictly prohibited.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-amber-300">
              Disciplinary Escalation Ladder
            </h3>
            <p className="text-xs text-slate-400">
              Unless handling severe infractions (e.g. unsolicited spam attacks, hate speech, or malicious links), enforcement follows:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-400 text-xs leading-relaxed">
              <li><strong className="text-slate-300">Verbal reminder / gentle redirect</strong> in public channel or DM.</li>
              <li><strong className="text-slate-300">Official logged warning</strong> with rule citation and incident context.</li>
              <li><strong className="text-slate-300">Temporary timeout / mute</strong> to cool down heated discourse.</li>
              <li><strong className="text-slate-300">Escalation to Administrator</strong> for repeated non-compliance or bans.</li>
            </ol>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-white/5 bg-[#07080D] shrink-0">
          <button
            onClick={onClose}
            className="Btn gap-2 shrink-0"
          >
            <span>Acknowledge & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
