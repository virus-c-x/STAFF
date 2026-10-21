import React from 'react';
import { X, BookOpen, CheckCircle2 } from 'lucide-react';

interface StaffRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffRulesModal: React.FC<StaffRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#0E121B] border border-slate-800 rounded-xl flex flex-col shadow-2xl text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="rules-modal-title" className="text-lg font-semibold text-white">
                Server Rules & Staff Code of Conduct
              </h2>
              <p className="text-xs text-slate-400">Standard Operating Guidelines · Revision 4.2</p>
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
            <h3 className="text-base font-semibold text-white">Core Staff Principles</h3>
            <div className="grid gap-3">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <div className="font-medium text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Impartiality & Anti-Favoritism
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Community guidelines apply uniformly to all members regardless of friendship, tenure, or server status. If a close friend violates a rule, staff must recuse themselves or report through standard channels.
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <div className="font-medium text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  De-escalation First
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  The primary role of moderation is to diffuse tension and maintain constructive dialogue, not to impose punitive measures prematurely. Always prioritize clear communication.
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <div className="font-medium text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Confidentiality of Staff Matters
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Internal staff channels, incident tickets, moderation deliberations, and applicant submissions are strictly confidential. Sharing internal logs outside staff channels results in immediate removal.
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <div className="font-medium text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Least Privilege & Permission Governance
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Staff tools, bot commands, and administrative privileges must only be used in the direct execution of moderation duties. Abuse or joking with administrative commands is strictly prohibited.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-semibold text-white">Disciplinary Escalation Ladder</h3>
            <p className="text-xs text-slate-400">
              Unless handling severe infractions (e.g. unsolicited spam attacks, hate speech, or malicious links), enforcement follows:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-400 text-xs">
              <li><strong className="text-slate-300">Verbal reminder / gentle redirect</strong> in public channel or DM.</li>
              <li><strong className="text-slate-300">Official logged warning</strong> with rule citation and incident context.</li>
              <li><strong className="text-slate-300">Temporary timeout / mute</strong> to cool down heated discourse.</li>
              <li><strong className="text-slate-300">Escalation to Administrator</strong> for repeated non-compliance or bans.</li>
            </ol>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-slate-800 bg-[#0A0D14] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
