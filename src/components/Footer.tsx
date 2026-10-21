import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenRules: () => void;
  onOpenStatusCheck: () => void;
  onOpenDocs: () => void;
  onOpenSupabaseConfig: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenRules,
  onOpenStatusCheck,
  onOpenDocs,
  onOpenSupabaseConfig,
}) => {
  return (
    <footer className="w-full bg-[#06080D] border-t border-slate-800/80 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm tracking-tight">
              <span className="w-2 h-2 rounded-sm bg-indigo-500" />
              <span>Aegis Staff Recruitment Portal</span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm">
              Community safety, incident resolution, and structured leadership operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors text-left"
            >
              Privacy Notice
            </button>
            <button
              onClick={onOpenRules}
              className="hover:text-white transition-colors text-left"
            >
              Staff Rules & Code
            </button>
            <button
              onClick={onOpenStatusCheck}
              className="hover:text-white transition-colors text-left"
            >
              Check Status
            </button>
            <button
              onClick={onOpenDocs}
              className="hover:text-white transition-colors text-left"
            >
              GitHub Pages Guide
            </button>
            <button
              onClick={onOpenSupabaseConfig}
              className="hover:text-white transition-colors text-left"
            >
              Database Settings
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Server Community Operations. Designed for GitHub Pages & Supabase.
          </div>
          <div className="flex items-center gap-4">
            <span>Encrypted PostgreSQL Submissions</span>
            <span aria-hidden="true">·</span>
            <span>Zero Unauthenticated Public Reads</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
