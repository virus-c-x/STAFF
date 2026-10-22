import React from 'react';
import { ArrowRight, Shield } from 'lucide-react';

interface NavbarProps {
  onApplyClick: () => void;
  onOpenStatusCheck: () => void;
  onOpenRules: () => void;
  onOpenPrivacy: () => void;
  onBackToPortal: () => void;
  currentView: 'portal' | 'staff';
}

export const Navbar: React.FC<NavbarProps> = ({
  onApplyClick,
  onOpenStatusCheck,
  onOpenRules,
  onOpenPrivacy,
  onBackToPortal,
  currentView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#060709]/85 backdrop-blur-md border-b border-amber-500/15 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={onBackToPortal}
          className="text-base sm:text-lg font-bold tracking-[0.2em] text-white hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 uppercase text-left"
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px]">
            <div className="w-full h-full bg-[#080A10] rounded-[5px] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
          <span className="gold-gradient-text font-extrabold">AEGIS</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
          <button
            type="button"
            onClick={onBackToPortal}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Portal Home
          </button>
          <button
            type="button"
            onClick={onApplyClick}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'staff' ? 'text-amber-300 font-semibold' : 'hover:text-amber-300'
            }`}
          >
            Staff Recruitment
          </button>
          <button
            type="button"
            onClick={onOpenStatusCheck}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Check Status
          </button>
          <button
            type="button"
            onClick={onOpenRules}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Staff Rules
          </button>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Privacy Notice
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView === 'portal' ? (
            <button
              onClick={onApplyClick}
              className="px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg transition-all duration-150 flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm shadow-amber-500/30"
            >
              <span>Apply for Staff</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onBackToPortal}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Back to Portal
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
