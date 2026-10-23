import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Shield,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { AdminKPIs, RecruitmentSettings } from '../../types/admin';
import { StoredApplicationRecord } from '../../types/application';
import {
  fetchAdminKPIs,
  fetchAdminApplications,
  fetchRecruitmentSettings,
} from '../../lib/supabase';

interface OverviewTabProps {
  onNavigateToApplications: () => void;
  onNavigateToIntake: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onNavigateToApplications,
  onNavigateToIntake,
}) => {
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [settings, setSettings] = useState<RecruitmentSettings | null>(null);
  const [recentApps, setRecentApps] = useState<StoredApplicationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [kpiData, settingsData, apps] = await Promise.all([
          fetchAdminKPIs(),
          fetchRecruitmentSettings(),
          fetchAdminApplications({ sortBy: 'newest' }),
        ]);
        setKpis(kpiData);
        setSettings(settingsData);
        setRecentApps(apps.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard overview:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0E121E] via-[#090B12] to-[#0A0D17] border border-amber-500/25 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-amber-400/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Recruitment Overview
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Monitor incoming applications, evaluate candidates, and manage cohort intake.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToIntake}
              className="px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Intake Settings</span>
            </button>
            <button
              onClick={onNavigateToApplications}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-semibold rounded-xl shadow-lg shadow-amber-500/15 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>View Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Applications</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {kpis ? kpis.totalApplications : '—'}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
            <span>Moderator: {kpis?.moderatorCount ?? 0}</span>
            <span>·</span>
            <span>Admin: {kpis?.administratorCount ?? 0}</span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
            {kpis ? kpis.pendingCount : '—'}
          </div>
          <div className="text-[11px] text-amber-400/70 font-mono">
            Awaiting screening triage
          </div>
        </div>

        {/* In Evaluation / Interview */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">In Assessment</span>
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-300 font-mono">
            {kpis ? kpis.underReviewCount + kpis.interviewCount : '—'}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Review: {kpis?.underReviewCount ?? 0} · Voice: {kpis?.interviewCount ?? 0}
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Acceptance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
            {kpis ? `${kpis.acceptanceRate}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Accepted: {kpis?.acceptedCount ?? 0} · Declined: {kpis?.rejectedCount ?? 0}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Intake Status and Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intake Status Overview */}
        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Cohort Intake</span>
            </h3>
            <button
              onClick={onNavigateToIntake}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              Configure
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Staff Intake */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">STAFF Recruitment</span>
                <p className="text-[11px] text-slate-400">Moderation & Administration</p>
              </div>
              <span
                className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border ${
                  settings?.staff_intake_open
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                {settings?.staff_intake_open ? 'Open' : 'Closed'}
              </span>
            </div>

            {/* Judge Intake */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">JUDGE Recruitment</span>
                <p className="text-[11px] text-slate-400">Judicial Review & Tournament</p>
              </div>
              <span
                className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border ${
                  settings?.judge_intake_open
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                }`}
              >
                {settings?.judge_intake_open ? 'Open' : 'Locked'}
              </span>
            </div>

            {/* Public Announcement Banner */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300">Announcement Banner</span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                    settings?.banner_active
                      ? 'bg-amber-400/10 text-amber-300'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {settings?.banner_active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                "{settings?.banner_text || 'No broadcast banner active'}"
              </p>
            </div>
          </div>
        </div>

        {/* Recent Applications Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-black/40 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Recent Applications</span>
            </h3>
            <button
              onClick={onNavigateToApplications}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              View All ({kpis?.totalApplications ?? 0})
            </button>
          </div>

          <div className="space-y-3">
            {recentApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No recent submissions found.
              </div>
            ) : (
              recentApps.map((app) => (
                <div
                  key={app.id}
                  onClick={onNavigateToApplications}
                  className="p-3.5 rounded-xl bg-black/50 border border-white/5 hover:border-amber-400/30 transition-all flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        {app.applicant_display_name}
                      </span>
                      <span className="text-[11px] font-mono text-amber-300">
                        {app.reference_code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {app.platform_username} · {app.position.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
