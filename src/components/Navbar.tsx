import React from 'react';
import { ArrowRight, ArrowLeft, Shield } from 'lucide-react';

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
          className="text-base sm:text-lg font-bold tracking-[0.2em] text-white hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-3 uppercase text-left cursor-pointer"
        >
          <img
            src="/icon.png"
            alt="ASPIDA"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-md select-none shrink-0"
          />
          <span className="gold-gradient-text font-extrabold">ASPIDA</span>
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
              className="Btn gap-2 whitespace-nowrap shrink-0 shadow-sm shadow-amber-500/30"
            >
              <span>Apply for Staff</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onBackToPortal}
              className="Btn gap-2 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
