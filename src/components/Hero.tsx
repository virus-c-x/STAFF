import React, { useState } from 'react';
import { ArrowRight, Shield, Award, Clock, Sparkles } from 'lucide-react';
import { PositionType } from '../types/application';

interface HeroProps {
  onStartApplication: (position?: PositionType) => void;
  onOpenPrivacy: () => void;
  isRecruitmentOpen: boolean;
  onToggleRecruitmentOpen?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartApplication,
  onOpenPrivacy,
  isRecruitmentOpen,
  onToggleRecruitmentOpen,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section id="home" className="relative pt-8 pb-16 md:py-20 overflow-hidden border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6">
        {/* Closed announcement banner (if toggled closed) */}
        {!isRecruitmentOpen ? (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-sm flex items-center justify-between gap-4">
            <div>
              <strong className="font-semibold block text-amber-200">Recruitment Cycle Closed</strong>
              <span>
                Staff applications are currently paused while our review board evaluates submitted candidates. Please check back next cycle.
              </span>
            </div>
            {onToggleRecruitmentOpen && (
              <button
                onClick={onToggleRecruitmentOpen}
                className="text-xs px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-md transition-colors shrink-0"
              >
                Reopen Cohort (Staff Demo)
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4">
            {/* Unboxed metadata line with dot separator */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="text-indigo-400 font-semibold tracking-wide">Spring 2026 Cohort</span>
              <span aria-hidden="true">·</span>
              <span>Applications Open</span>
              <span aria-hidden="true">·</span>
              <span>Turnaround 48–72 Hours</span>
            </div>

            {onToggleRecruitmentOpen && (
              <button
                onClick={onToggleRecruitmentOpen}
                className="text-[11px] text-slate-500 hover:text-slate-400 transition-colors"
                title="Toggle open/closed banner for demo testing"
              >
                [Preview Closed Banner]
              </button>
            )}
          </div>
        )}

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
              Uphold community safety. Lead with integrity.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              We are recruiting dedicated Community Moderators and Server Administrators. Join a transparent, structured operations team dedicated to fairness, rapid incident resolution, and fostering a safe, welcoming digital community.
            </p>

            {/* Key Trust Signals (No pills, clean unboxed typographic strip) */}
            <div className="grid grid-cols-3 gap-4 pt-2 pb-2 border-y border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Positions</span>
                <span className="text-slate-200 font-semibold">Moderator & Admin</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Evaluation</span>
                <span className="text-slate-200 font-semibold">Blind Scenario Rubric</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Security</span>
                <span className="text-slate-200 font-semibold">PostgreSQL RLS Encrypted</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onStartApplication()}
                disabled={!isRecruitmentOpen}
                className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-all duration-150 flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <span>Apply for Staff</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#positions"
                className="px-5 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              >
                Review Requirements
              </a>

              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-xs text-slate-400 hover:text-indigo-400 underline decoration-slate-600 underline-offset-4 transition-colors"
              >
                Privacy Notice
              </button>
            </div>
          </div>

          {/* Right Column: Dominant 16:9 Visual Anchor */}
          <div className="lg:col-span-5">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-[#0E121B] shadow-2xl">
              {/* Fallback container with styled gradient mesh */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-indigo-950/40 via-slate-900 to-black">
                  <Shield className="w-10 h-10 text-indigo-400 mb-2 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-200">Staff Operations Command</span>
                  <span className="text-xs text-slate-400">Loading sanctuary view...</span>
                </div>
              )}

              <img
                src="/src/assets/images/hero_recruitment_portal_1792624473636.jpg"
                alt="Community operations command hub and leadership sanctuary"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#080A10]/90 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-4 right-4 text-xs flex items-center justify-between text-slate-300">
                <span className="font-medium text-white">Central Operations Center</span>
                <span className="text-[11px] text-slate-400 font-mono">Status: Recruiting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
