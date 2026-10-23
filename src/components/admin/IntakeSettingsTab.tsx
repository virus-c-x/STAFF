import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Megaphone,
  Save,
  RotateCcw,
  Clock,
  UserCheck,
} from 'lucide-react';
import { RecruitmentSettings } from '../../types/admin';
import { fetchRecruitmentSettings, updateRecruitmentSettings } from '../../lib/supabase';

interface IntakeSettingsTabProps {
  currentAdminEmail: string;
}

export const IntakeSettingsTab: React.FC<IntakeSettingsTabProps> = ({ currentAdminEmail }) => {
  const [settings, setSettings] = useState<RecruitmentSettings | null>(null);
  const [staffOpen, setStaffOpen] = useState(true);
  const [judgeOpen, setJudgeOpen] = useState(false);
  const [bannerActive, setBannerActive] = useState(true);
  const [bannerText, setBannerText] = useState('');
  const [bannerType, setBannerType] = useState<'info' | 'announcement' | 'warning'>('announcement');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchRecruitmentSettings();
      setSettings(data);
      setStaffOpen(data.staff_intake_open);
      setJudgeOpen(data.judge_intake_open);
      setBannerActive(data.banner_active);
      setBannerText(data.banner_text);
      setBannerType(data.banner_type || 'announcement');
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      const res = await updateRecruitmentSettings(
        {
          staff_intake_open: staffOpen,
          judge_intake_open: judgeOpen,
          banner_active: bannerActive,
          banner_text: bannerText,
          banner_type: bannerType,
        },
        currentAdminEmail
      );

      if (res.success && res.updated) {
        setSettings(res.updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(res.error || 'Failed to update recruitment settings.');
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span>Intake Settings & Announcements</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage application availability for staff and judge cohorts, and set public announcement banners.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Settings updated successfully.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Intake Gates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* STAFF INTAKE */}
          <div className={`p-6 rounded-2xl border transition-all ${
            staffOpen
              ? 'bg-[#090C16]/70 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
              : 'bg-black/40 border-white/10'
          }`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">STAFF Cohort</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                    staffOpen
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-white/10'
                  }`}>
                    {staffOpen ? 'Applications Open' : 'Intake Closed'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Community Moderation & Server Administration positions. Allows applicants to enter the multi-step questionnaire.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStaffOpen(!staffOpen)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  staffOpen
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
                }`}
                title={staffOpen ? 'Close Staff Intake' : 'Open Staff Intake'}
              >
                {staffOpen ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Status: {staffOpen ? 'Accepting Submissions' : 'Submissions Blocked'}</span>
              <button
                type="button"
                onClick={() => setStaffOpen(!staffOpen)}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Toggle {staffOpen ? 'Close' : 'Open'}
              </button>
            </div>
          </div>

          {/* JUDGE INTAKE */}
          <div className={`p-6 rounded-2xl border transition-all ${
            judgeOpen
              ? 'bg-[#090C16]/70 border-amber-500/30 shadow-lg shadow-amber-950/20'
              : 'bg-black/40 border-white/10'
          }`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">JUDGE Cohort</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                    judgeOpen
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-white/10'
                  }`}>
                    {judgeOpen ? 'Intake Active' : 'Locked (Coming Soon)'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dispute Arbitration, Tournament Governance, and Judicial Review Board. Keep locked until cycle launches.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setJudgeOpen(!judgeOpen)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  judgeOpen
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
                }`}
                title={judgeOpen ? 'Close Judge Intake' : 'Open Judge Intake'}
              >
                {judgeOpen ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Status: {judgeOpen ? 'Accepting Submissions' : 'Submissions Blocked'}</span>
              <button
                type="button"
                onClick={() => setJudgeOpen(!judgeOpen)}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Toggle {judgeOpen ? 'Close' : 'Open'}
              </button>
            </div>
          </div>
        </div>

        {/* Public Banner & Broadcast Settings */}
        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>Public Portal Broadcast Banner</span>
              </div>
              <p className="text-xs text-slate-400">
                Display an official directive banner across the applicant recruitment portal.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bannerActive}
                onChange={(e) => setBannerActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Broadcast Message
              </label>
              <textarea
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[#0A0D17] border border-white/10 focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-all font-mono"
                placeholder="Enter official public cycle announcement..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['announcement', 'info', 'warning'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBannerType(type)}
                  className={`p-3 rounded-xl border text-xs font-medium text-left capitalize transition-all cursor-pointer ${
                    bannerType === type
                      ? 'bg-amber-500/15 border-amber-400/40 text-amber-200'
                      : 'bg-black/20 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{type}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {type === 'announcement' ? 'Gold herald style' : type === 'info' ? 'Blue directive style' : 'Amber advisory style'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Banner Live Preview */}
          {bannerActive && bannerText && (
            <div className="pt-4 border-t border-white/5">
              <span className="text-[11px] font-mono text-slate-500 block mb-2 uppercase tracking-wider">
                Live Public Preview:
              </span>
              <div className={`p-3.5 rounded-xl text-xs flex items-center gap-3 border ${
                bannerType === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : bannerType === 'info'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  : 'bg-gradient-to-r from-amber-500/15 to-transparent border-amber-400/30 text-amber-200'
              }`}>
                <Megaphone className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="font-medium">{bannerText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Audit Meta & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Last modified:{' '}
              {settings?.updated_at
                ? new Date(settings.updated_at).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'Initial Configuration'}
              {settings?.updated_by && ` by ${settings.updated_by}`}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={loadSettings}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Changes</span>
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-lg shadow-amber-500/15 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Enforcing...' : 'Apply & Save Protocols'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
