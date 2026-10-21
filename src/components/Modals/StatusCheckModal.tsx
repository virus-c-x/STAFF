import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
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
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
  },
  under_review: {
    label: 'Under Staff Review',
    text: 'A senior administrator or recruitment coordinator is actively reviewing your scenario responses against our rubric.',
    color: 'text-sky-400 border-sky-500/20 bg-sky-500/10',
  },
  interview: {
    label: 'Shortlisted for Interview',
    text: 'Congratulations! Your written application passed preliminary screening. A recruitment lead will reach out via your contact method to schedule a short voice/chat interview.',
    color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
  },
  accepted: {
    label: 'Application Accepted',
    text: 'Welcome to the team! Your application was approved and staff role provisioning has commenced.',
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
  },
  rejected: {
    label: 'Application Concluded',
    text: 'Thank you for your application and interest. After thorough review against our current cohort requirements, we have decided not to advance your application at this time.',
    color: 'text-slate-400 border-slate-700 bg-slate-800/40',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-[#0E121B] border border-slate-800 rounded-xl flex flex-col shadow-2xl text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 id="status-modal-title" className="text-lg font-semibold text-white">
                Check Application Status
              </h2>
              <p className="text-xs text-slate-400">Track candidate status with your reference code</p>
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
            <label htmlFor="refCodeInput" className="block text-xs font-medium text-slate-300">
              Application Reference Code
            </label>
            <div className="flex gap-2">
              <input
                id="refCodeInput"
                type="text"
                placeholder="e.g. REF-2026-X8K9M2"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono uppercase tracking-wider"
              />
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Look Up</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Reference codes were issued upon successful submission of your application.
            </p>
          </form>

          {/* Results section */}
          {hasSearched && (
            <div className="mt-4 border-t border-slate-800 pt-4">
              {loading ? (
                <div className="py-6 text-center text-slate-400 text-sm">
                  Querying database records...
                </div>
              ) : result && result.found && result.status ? (
                <div className="space-y-4">
                  <div className={`p-4 border rounded-xl ${STATUS_DESCRIPTIONS[result.status].color}`}>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="font-semibold tracking-wider">{result.referenceCode}</span>
                      <span className="capitalize font-medium px-2 py-0.5 rounded bg-black/30">
                        {result.position} Position
                      </span>
                    </div>
                    <div className="font-semibold text-sm mb-1 text-white">
                      {STATUS_DESCRIPTIONS[result.status].label}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {STATUS_DESCRIPTIONS[result.status].text}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800 font-mono">
                    <div>
                      <span className="text-slate-500 block">Submitted:</span>
                      {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'Recorded'}
                    </div>
                    <div>
                      <span className="text-slate-500 block">Database Source:</span>
                      {result.isLiveSupabase ? 'Supabase Live' : 'Local Sandbox'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Protected query: Detailed answers remain private.</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg text-center space-y-1">
                  <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
                  <p className="text-sm font-medium text-white">No Application Found</p>
                  <p className="text-xs text-slate-400">
                    We could not find an application with code <span className="font-mono text-slate-300">{code}</span>. Please verify the code and try again.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-slate-800 bg-[#0A0D14] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
