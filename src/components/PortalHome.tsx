import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, Shield, Megaphone, AlertCircle } from 'lucide-react';
import { RecruitmentSettings } from '../types/admin';
import { fetchRecruitmentSettings } from '../lib/supabase';

interface PortalHomeProps {
  onSelectStaff: () => void;
  onOpenStatusCheck: () => void;
  onOpenPrivacy: () => void;
  onOpenRules: () => void;
  onOpenAdmin?: () => void;
}

export const PortalHome: React.FC<PortalHomeProps> = ({
  onSelectStaff,
  onOpenStatusCheck,
  onOpenPrivacy,
  onOpenRules,
  onOpenAdmin,
}) => {
  const [settings, setSettings] = useState<RecruitmentSettings | null>(null);

  useEffect(() => {
    fetchRecruitmentSettings().then(setSettings).catch(console.error);
  }, []);

  const staffIntakeOpen = settings ? settings.staff_intake_open : true;
  const judgeIntakeOpen = settings ? settings.judge_intake_open : false;

  return (
    <div className="relative min-h-screen flex flex-col justify-between px-6 py-8 sm:py-12 overflow-hidden bg-[#060709]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[500px] h-[300px] bg-amber-600/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Row */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src="/icon.png"
            alt="ASPIDA Icon"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-md select-none shrink-0"
          />
          <span className="text-base sm:text-lg font-bold tracking-[0.25em] text-white uppercase gold-gradient-text">
            ASPIDA
          </span>
        </div>

        <button
          onClick={onOpenStatusCheck}
          className="text-xs text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-amber-500/30 bg-white/[0.02] cursor-pointer"
        >
          <span>Check Status</span>
        </button>
      </header>

      {/* Broadcast Banner if active */}
      {settings?.banner_active && settings.banner_text && (
        <div className="relative z-10 max-w-3xl w-full mx-auto mt-6">
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-3 border shadow-lg ${
              settings.banner_type === 'warning'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : settings.banner_type === 'info'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                : 'bg-gradient-to-r from-amber-500/15 via-[#0A0D17] to-amber-500/10 border-amber-400/30 text-amber-200'
            }`}
          >
            <Megaphone className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="font-medium">{settings.banner_text}</span>
          </div>
        </div>
      )}

      {/* Main Center Stage: Wide Banner, Title & The 2 Cards */}
      <main className="relative z-10 max-w-4xl w-full mx-auto my-auto py-6 sm:py-10 flex flex-col items-center text-center">
        {/* Wide Hero Banner */}
        <div className="w-full max-w-3xl lg:max-w-4xl mb-8 sm:mb-10 rounded-2xl overflow-hidden border border-amber-500/25 shadow-2xl relative bg-[#090B12]">
          <img
            src="/banner.png"
            alt="ASPIDA Official Banner"
            className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent opacity-40 pointer-events-none" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            <span className="gold-gradient-text tracking-[0.15em]">ASPIDA</span>
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
          {/* Option 1: STAFF */}
          {staffIntakeOpen ? (
            <button
              type="button"
              onClick={onSelectStaff}
              className="group relative text-left p-8 rounded-2xl border border-amber-500/35 hover:border-amber-400/70 transition-all duration-300 gold-border-glow flex flex-col justify-between min-h-[230px] focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer overflow-hidden shadow-xl"
              style={{
                backgroundImage: `url('/staffbanner.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Dark readable gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C13]/90 via-[#0B0D16]/85 to-[#07080D]/95 group-hover:from-[#0A0C13]/80 group-hover:via-[#0B0D16]/75 group-hover:to-[#07080D]/90 transition-all" />
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/15 rounded-full blur-2xl group-hover:bg-amber-400/25 transition-all pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase px-2 py-0.5 rounded bg-black/60 border border-amber-400/30 backdrop-blur-sm">
                    Applications Open
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-400 transform group-hover:translate-x-1 transition-transform" />
                </div>

                <h2 className="text-2xl font-bold tracking-wider text-white group-hover:text-amber-200 transition-colors uppercase drop-shadow">
                  STAFF
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed mt-2.5 drop-shadow-sm">
                  Apply for community moderation and server administration positions.
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 group-hover:text-amber-300 transition-colors font-medium">
                <span>Begin Application</span>
                <span className="text-[11px] font-mono text-amber-400/90">→</span>
              </div>
            </button>
          ) : (
            <div
              className="relative text-left p-8 rounded-2xl border border-white/10 opacity-75 cursor-not-allowed flex flex-col justify-between min-h-[230px] select-none overflow-hidden shadow-xl"
              style={{
                backgroundImage: `url('/staffbanner.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-[#07090E]/90 backdrop-blur-[0.5px]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase px-2 py-0.5 rounded bg-black/60 border border-white/15 backdrop-blur-sm flex items-center gap-1.5">
                    <Lock className="w-2.5 h-2.5 text-amber-400/80" />
                    <span>Intake Closed</span>
                  </span>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>

                <h2 className="text-2xl font-bold tracking-wider text-slate-200 uppercase drop-shadow">
                  STAFF
                </h2>

                <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                  Staff intake is currently paused by administration for this cohort.
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                  Submissions Paused
                </span>
                <span className="text-[11px] text-slate-500">Cohort Gated</span>
              </div>
            </div>
          )}

          {/* Option 2: JUDGE */}
          {judgeIntakeOpen ? (
            <button
              type="button"
              onClick={onSelectStaff}
              className="group relative text-left p-8 rounded-2xl border border-amber-500/35 hover:border-amber-400/70 transition-all duration-300 gold-border-glow flex flex-col justify-between min-h-[230px] focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer overflow-hidden shadow-xl"
              style={{
                backgroundImage: `url('/judgebanner.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C13]/90 via-[#0B0D16]/85 to-[#07080D]/95 group-hover:from-[#0A0C13]/80 group-hover:via-[#0B0D16]/75 group-hover:to-[#07080D]/90 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase px-2 py-0.5 rounded bg-black/60 border border-amber-400/30 backdrop-blur-sm">
                    Applications Open
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-400 transform group-hover:translate-x-1 transition-transform" />
                </div>

                <h2 className="text-2xl font-bold tracking-wider text-white group-hover:text-amber-200 transition-colors uppercase drop-shadow">
                  JUDGE
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed mt-2.5 drop-shadow-sm">
                  Dispute arbitration, tournament governance, and judicial review board.
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 group-hover:text-amber-300 transition-colors font-medium">
                <span>Begin Application</span>
                <span className="text-[11px] font-mono text-amber-400/90">→</span>
              </div>
            </button>
          ) : (
            <div
              className="relative text-left p-8 rounded-2xl border border-white/10 opacity-75 cursor-not-allowed flex flex-col justify-between min-h-[230px] select-none overflow-hidden shadow-xl"
              style={{
                backgroundImage: `url('/judgebanner.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-disabled="true"
            >
              <div className="absolute inset-0 bg-[#07090E]/85 backdrop-blur-[0.5px]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase px-2 py-0.5 rounded bg-black/60 border border-white/15 backdrop-blur-sm flex items-center gap-1.5">
                    <Lock className="w-2.5 h-2.5 text-amber-400/80" />
                    <span>Locked</span>
                  </span>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>

                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-bold tracking-wider text-slate-200 uppercase drop-shadow">
                    JUDGE
                  </h2>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                  Dispute arbitration, tournament governance, and judicial review board.
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  COMING SOON
                </span>
                <span className="text-[11px] text-slate-400">Cohort Pending</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} ASPIDA Operations</span>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={onOpenPrivacy}
            className="hover:text-amber-300 transition-colors text-left cursor-pointer"
          >
            Privacy Notice
          </button>
          <button
            onClick={onOpenRules}
            className="hover:text-amber-300 transition-colors text-left cursor-pointer"
          >
            Staff Rules
          </button>
          <button
            onClick={onOpenStatusCheck}
            className="hover:text-amber-300 transition-colors text-left cursor-pointer"
          >
            Track Status
          </button>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-slate-600 hover:text-amber-400/90 transition-colors text-left cursor-pointer flex items-center gap-1 font-mono text-[11px]"
              title="Restricted Administrative Access"
            >
              <Shield className="w-3 h-3 text-slate-600 group-hover:text-amber-400" />
              <span>Admin Access</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
