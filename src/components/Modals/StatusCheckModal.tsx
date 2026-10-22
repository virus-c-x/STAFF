import React, { useState } from 'react';
import { X, Search, AlertCircle, ArrowRight, ShieldCheck, Shield } from 'lucide-react';
import { checkApplicationStatus, PublicStatusResult } from '../../lib/supabase';
import { ApplicationStatus } from '../../types/application';

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

const STATUS_DESCRIPTIONS: Record<ApplicationStatus, { label: string; text: string; color: string }> = {
  pending: {
    label: 'Pending Initial Review',
    text: 'Your application has been logged into our queue and is awaiting preliminary screening by the recruitment team.',
    color: 'text-amber-300 border-amber-500/30 bg-amber-500/[0.08]',
  },
  under_review: {
    label: 'Under Staff Review',
    text: 'A senior administrator or recruitment coordinator is actively evaluating your situational responses against our rubric.',
    color: 'text-sky-300 border-sky-500/30 bg-sky-500/[0.08]',
  },
  interview: {
    label: 'Shortlisted for Interview',
    text: 'Congratulations! Your written application passed preliminary screening. A recruitment lead will reach out via your contact method to schedule a short voice/chat interview.',
    color: 'text-amber-200 border-amber-400/40 bg-amber-400/10',
  },
  accepted: {
    label: 'Application Accepted',
    text: 'Welcome to the team! Your application was approved and staff role onboarding has commenced.',
    color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/[0.08]',
  },
  rejected: {
    label: 'Application Concluded',
    text: 'Thank you for your interest and time. After careful review against current cohort requirements, we have decided not to advance your application at this time.',
    color: 'text-slate-400 border-slate-700 bg-slate-900/60',
  },
};

export const StatusCheckModal: React.FC<StatusCheckModalProps> = ({
  isOpen,
  onClose,
  initialCode = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicStatusResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await checkApplicationStatus(code);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-[#0A0C13] border border-amber-500/30 rounded-2xl flex flex-col shadow-2xl text-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-[#07080D]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/10 border border-amber-400/25 rounded-xl text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 id="status-modal-title" className="text-base font-bold text-white uppercase tracking-wider">
                Application Status Verification
              </h2>
              <p className="text-xs text-slate-400">Query your status using your Reference Code</p>
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
        <div className="p-6 space-y-5">
          <form onSubmit={handleSearch} className="space-y-3">
            <label htmlFor="refCodeInput" className="block text-xs font-semibold text-slate-300">
              Reference Code
            </label>
            <div className="flex gap-2">
              <input
                id="refCodeInput"
                type="text"
                placeholder="e.g. REF-2026-X8K9M2"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="flex-1 bg-[#06070B] border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 font-mono uppercase tracking-wider"
              />
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 shadow-md shadow-amber-500/20"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Your reference code was provided upon completing the submission form.
            </p>
          </form>

          {/* Results section */}
          {hasSearched && (
            <div className="mt-4 border-t border-white/5 pt-4">
              {loading ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  Querying database registry...
                </div>
              ) : result && result.found && result.status ? (
                <div className="space-y-4">
                  <div className={`p-5 border rounded-xl ${STATUS_DESCRIPTIONS[result.status].color}`}>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="font-bold tracking-widest text-amber-300">{result.referenceCode}</span>
                      <span className="capitalize font-semibold px-2 py-0.5 rounded bg-black/40 text-[11px]">
                        {result.position} Track
                      </span>
                    </div>
                    <div className="font-bold text-sm mb-1 text-white">
                      {STATUS_DESCRIPTIONS[result.status].label}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {STATUS_DESCRIPTIONS[result.status].text}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-[#06070B] p-3 rounded-lg border border-white/5 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Submitted:</span>
                      {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'Recorded'}
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Verification:</span>
                      <span className="text-emerald-400">Authenticated Record</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-amber-400/80 shrink-0" />
                    <span>Confidential query: Detailed candidate answers remain private.</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#06070B] border border-white/5 rounded-xl text-center space-y-1">
                  <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
                  <p className="text-xs font-semibold text-white">No Record Found</p>
                  <p className="text-xs text-slate-400">
                    No active application found matching <span className="font-mono text-amber-300">{code}</span>. Please verify your reference code.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-white/5 bg-[#07080D] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
