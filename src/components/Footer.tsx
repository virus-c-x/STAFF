import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenRules: () => void;
  onOpenStatusCheck: () => void;
  onBackToPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenRules,
  onOpenStatusCheck,
  onBackToPortal,
}) => {
  return (
    <footer className="w-full bg-[#050609] border-t border-amber-500/15 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase">
              <span className="w-2 h-2 rounded-sm bg-amber-400" />
              <span className="gold-gradient-text">AEGIS RECRUITMENT</span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm">
              Community safety, impartial arbitration, and structured leadership operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button
              onClick={onBackToPortal}
              className="hover:text-amber-300 transition-colors text-left"
            >
              Portal Home
            </button>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-amber-300 transition-colors text-left"
            >
              Privacy Notice
            </button>
            <button
              onClick={onOpenRules}
              className="hover:text-amber-300 transition-colors text-left"
            >
              Staff Rules & Code
            </button>
            <button
              onClick={onOpenStatusCheck}
              className="hover:text-amber-300 transition-colors text-left"
            >
              Check Status
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} AEGIS Operations. Secure Staff Recruitment Portal.
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span>Encrypted Submissions</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Zero Public Reads</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
