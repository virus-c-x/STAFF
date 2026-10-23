import React, { useState } from 'react';
import { Shield, ArrowLeft, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import moderatorBadgeImg from '../assets/images/moderator_role_emblem_1792624473648.jpg';

interface StaffHeroBannerProps {
  onBackToPortal: () => void;
  onOpenPrivacy: () => void;
  onOpenRules: () => void;
}

export const StaffHeroBanner: React.FC<StaffHeroBannerProps> = ({
  onBackToPortal,
  onOpenPrivacy,
  onOpenRules,
}) => {
  const [badgeImgLoaded, setBadgeImgLoaded] = useState(false);

  return (
    <div className="relative w-full overflow-hidden border-b border-amber-500/20 bg-[#07080D]">
      {/* Subtle ambient gold radial lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[250px] bg-amber-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-[300px] h-[200px] bg-amber-600/[0.03] rounded-full blur-[90px] pointer-events-none" />

      {/* Top utility row */}
      <div className="max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between text-xs">
        <button
          onClick={onBackToPortal}
          className="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-amber-500/30 bg-white/[0.02]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portal</span>
        </button>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <button
            onClick={onOpenPrivacy}
            className="hover:text-amber-300 transition-colors"
          >
            Privacy Notice
          </button>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <button
            onClick={onOpenRules}
            className="hover:text-amber-300 transition-colors"
          >
            Staff Rules
          </button>
        </div>
      </div>

      {/* Wide Hero Banner Container */}
      <div className="max-w-6xl mx-auto px-6 py-8 sm:py-12">
        <div className="relative rounded-2xl p-6 sm:p-10 bg-gradient-to-r from-[#0C0E15] via-[#10131E] to-[#0A0C12] border border-amber-500/25 shadow-2xl overflow-hidden">
          {/* Subtle gold grid texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/[0.07] via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8">
            {/* Left text column */}
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ASPIDA Official Staff Selection</span>
              </div>

              <div>
                <span className="block text-xs font-mono tracking-[0.25em] text-amber-400/80 uppercase mb-1">
                  ASPIDA COMMUNITY
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                  <span className="gold-gradient-text tracking-wide">STAFF RECRUITMENT</span>
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                We are appointing dedicated Community Moderators and Server Administrators to uphold safety, impartiality, and excellence across our community operations.
              </p>

              {/* Trust signals */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Confidential Review</span>
                </span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Structured Rubrics</span>
                </span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Turnaround ~48–72h</span>
                </span>
              </div>
            </div>

            {/* Right column: Circular Luxury Profile / Emblem Badge with Gold Frame & Glass Effect */}
            <div className="shrink-0 flex items-center justify-center">
              <div className="relative group">
                {/* Outer pulsing gold halo */}
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-amber-400/30 via-amber-500/15 to-transparent blur-md group-hover:blur-lg transition-all" />

                {/* Double golden ring frame */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[2px] bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 shadow-xl shadow-amber-500/10">
                  <div className="w-full h-full rounded-full p-[4px] bg-[#07090E] flex items-center justify-center overflow-hidden relative">
                    {/* Glass sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none z-10" />

                    {/* Emblem Image Asset */}
                    <img
                      src="/icon.png"
                      alt="ASPIDA Staff Emblem"
                      className={`w-full h-full object-contain p-2 rounded-full transition-opacity duration-300 ${
                        badgeImgLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setBadgeImgLoaded(true)}
                      referrerPolicy="no-referrer"
                    />

                    {!badgeImgLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#090B12]">
                        <Shield className="w-12 h-12 text-amber-400/80 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
