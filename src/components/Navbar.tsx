import React from 'react';
import { ArrowRight, Database } from 'lucide-react';
import { getSupabaseConfig } from '../lib/supabase';

interface NavbarProps {
  onApplyClick: () => void;
  onOpenStatusCheck: () => void;
  onOpenDocs: () => void;
  onOpenSupabaseConfig: () => void;
  hasDraft: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onApplyClick,
  onOpenStatusCheck,
  onOpenDocs,
  onOpenSupabaseConfig,
  hasDraft,
}) => {
  const config = getSupabaseConfig();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080A10]/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
          <span>Aegis Staff Portal</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
          <a
            href="#positions"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Positions
          </a>
          <a
            href="#process"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Recruitment Process
          </a>
          <button
            type="button"
            onClick={onOpenStatusCheck}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Check Status
          </button>
          <button
            type="button"
            onClick={onOpenDocs}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Architecture & Docs
          </button>
          <button
            type="button"
            onClick={onOpenSupabaseConfig}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
            title={config.isConfigured ? 'Supabase Connected' : 'Running in Sandbox Mode'}
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Database</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                config.isConfigured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onApplyClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-all duration-150 flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm shadow-indigo-600/30"
          >
            <span>{hasDraft ? 'Continue Application' : 'Apply Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
