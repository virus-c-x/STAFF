import React from 'react';
import { Shield, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface PortalHomeProps {
  onSelectStaff: () => void;
  onOpenStatusCheck: () => void;
  onOpenPrivacy: () => void;
  onOpenRules: () => void;
}

export const PortalHome: React.FC<PortalHomeProps> = ({
  onSelectStaff,
  onOpenStatusCheck,
  onOpenPrivacy,
  onOpenRules,
}) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-between px-6 py-8 sm:py-12 overflow-hidden bg-[#060709]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[500px] h-[300px] bg-amber-600/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Row */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-sm shadow-amber-500/20">
            <div className="w-full h-full bg-[#090B10] rounded-[7px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <span className="text-sm font-bold tracking-[0.25em] text-white uppercase">
            Aegis
          </span>
        </div>

        <button
          onClick={onOpenStatusCheck}
          className="text-xs text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-amber-500/30 bg-white/[0.02]"
        >
          <span>Check Status</span>
        </button>
      </header>

      {/* Main Center Stage: Logo, Title & The 2 Cards */}
      <main className="relative z-10 max-w-4xl w-full mx-auto my-auto py-12 flex flex-col items-center text-center">
        {/* Emblem Insignia */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-amber-400/25 via-amber-500/10 to-transparent p-[1px] flex items-center justify-center shadow-2xl shadow-amber-500/10">
            <div className="w-full h-full bg-[#080A0F] rounded-[15px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-amber-400/10 to-transparent opacity-60" />
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400/90" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3 mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            <span className="gold-gradient-text tracking-[0.15em]">AEGIS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 tracking-[0.2em] uppercase max-w-md mx-auto">
            Recruitment & Appointment Portal
          </p>
          <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-amber-400/80 font-mono">
            <span>Spring 2026 Cohort</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Official Selection</span>
          </div>
        </div>

        {/* The Two Primary Cards: STAFF vs JUDGE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl px-2">
          {/* Option 1: STAFF (Active) */}
          <button
            type="button"
            onClick={onSelectStaff}
            className="group relative text-left p-8 rounded-2xl bg-[#0D0F16]/70 hover:bg-[#121520]/80 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 gold-border-glow flex flex-col justify-between min-h-[220px] focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer overflow-hidden"
          >
            {/* Subtle corner light */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono tracking-widest text-amber-400/90 uppercase px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                  Applications Open
                </span>
                <ArrowRight className="w-4 h-4 text-amber-400 transform group-hover:translate-x-1 transition-transform" />
              </div>

              <h2 className="text-2xl font-bold tracking-wider text-white group-hover:text-amber-200 transition-colors uppercase">
                STAFF
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                Apply for community moderation and server administration positions.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-300 transition-colors font-medium">
              <span>Begin Application</span>
              <span className="text-[11px] font-mono text-amber-400/70">→</span>
            </div>
          </button>

          {/* Option 2: JUDGE (Locked / Coming Soon) */}
          <div
            className="relative text-left p-8 rounded-2xl bg-[#0A0B10]/40 border border-white/5 opacity-65 cursor-not-allowed flex flex-col justify-between min-h-[220px] select-none overflow-hidden"
            aria-disabled="true"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Lock className="w-2.5 h-2.5 text-amber-400/70" />
                  <span>Locked</span>
                </span>
                <Lock className="w-4 h-4 text-slate-500" />
              </div>

              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold tracking-wider text-slate-300 uppercase">
                  JUDGE
                </h2>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                Dispute arbitration, tournament governance, and judicial review board.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono tracking-widest text-amber-400/80 uppercase font-semibold">
                COMING SOON
              </span>
              <span className="text-[11px] text-slate-400">Cohort Pending</span>
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} AEGIS Operations</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Security Protocol v4.2</span>
        </div>

        <div className="flex items-center gap-5">
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
            Staff Rules
          </button>
          <button
            onClick={onOpenStatusCheck}
            className="hover:text-amber-300 transition-colors text-left"
          >
            Track Status
          </button>
        </div>
      </footer>
    </div>
  );
};
