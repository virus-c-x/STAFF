import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Search,
  Shield,
  UserCog,
  FileQuestion,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { AdminUser, RecruitmentSettings } from '../../types/admin';
import { fetchRecruitmentSettings, signOutAdmin } from '../../lib/supabase';
import { OverviewTab } from './OverviewTab';
import { ApplicationsWorkspace } from './ApplicationsWorkspace';
import { CandidateHistorySearch } from './CandidateHistorySearch';
import { IntakeSettingsTab } from './IntakeSettingsTab';
import { AdminTeamTab } from './AdminTeamTab';
import { FormBuilderTab } from './FormBuilderTab';

export type AdminTab =
  | 'overview'
  | 'applications'
  | 'search'
  | 'intake'
  | 'team'
  | 'builder';

interface AdminDashboardProps {
  currentAdmin: AdminUser;
  onSignOut: () => void;
  onNavigateToPublicPortal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  onSignOut,
  onNavigateToPublicPortal,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<RecruitmentSettings | null>(null);

  useEffect(() => {
    fetchRecruitmentSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSignOutClick = async () => {
    await signOutAdmin();
    onSignOut();
  };

  const navItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'applications' as AdminTab,
      label: 'Applications',
      icon: FileSpreadsheet,
      badge: undefined,
    },
    {
      id: 'search' as AdminTab,
      label: 'Applicant History',
      icon: Search,
      badge: undefined,
    },
    {
      id: 'intake' as AdminTab,
      label: 'Intake Settings',
      icon: Shield,
      badge: settings?.staff_intake_open ? 'Open' : 'Closed',
    },
    {
      id: 'team' as AdminTab,
      label: 'Team & Roles',
      icon: UserCog,
      badge: undefined,
    },
    {
      id: 'builder' as AdminTab,
      label: 'Form Questions',
      icon: FileQuestion,
      badge: undefined,
    },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'lead_reviewer':
        return 'Lead Reviewer';
      default:
        return 'Reviewer';
    }
  };

  return (
    <div className="min-h-screen bg-[#060709] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-amber-500/20 selection:text-amber-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#080A12] border-r border-amber-500/15 shrink-0 z-30 justify-between">
        {/* Brand & Identity */}
        <div>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/icon.png"
                alt="ASPIDA Icon"
                className="w-9 h-9 object-contain drop-shadow-md select-none shrink-0"
              />
              <div>
                <div className="text-sm font-extrabold tracking-widest text-white uppercase gold-gradient-text">
                  ASPIDA
                </div>
                <div className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase">
                  Admin Portal
                </div>
              </div>
            </div>

            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        item.badge === 'Open'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.badge === 'Closed'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-white/5 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Exit Controls */}
        <div className="p-4 border-t border-white/5 space-y-3 bg-[#06080E]/70">
          <button
            onClick={onNavigateToPublicPortal}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Public Candidate Portal</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Exit</span>
          </button>

          {/* Admin User Card */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">
                {currentAdmin.display_name}
              </div>
              <div className="text-[10px] text-amber-400 font-mono tracking-wider">
                {getRoleBadge(currentAdmin.role)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                {currentAdmin.email}
              </div>
            </div>

            <button
              onClick={handleSignOutClick}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#080A12] border-b border-amber-500/15 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <img src="/icon.png" alt="ASPIDA" className="w-8 h-8 object-contain" />
          <span className="text-sm font-bold tracking-widest text-white gold-gradient-text">
            ASPIDA Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToPublicPortal}
            className="text-[11px] text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30"
          >
            Portal
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[61px] z-50 bg-[#080A12] border-b border-white/10 p-4 space-y-2 animate-scale-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="text-[10px] font-mono">{item.badge}</span>}
              </button>
            );
          })}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">{currentAdmin.email}</span>
            <button
              onClick={handleSignOutClick}
              className="text-rose-400 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operational Bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-[#07090F] border-b border-white/5 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-mono text-amber-400/90 uppercase tracking-widest">ASPIDA</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-semibold">
              {navItems.find((n) => n.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Spring 2026 Cycle</span>
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 p-4 sm:p-8">
          {activeTab === 'overview' && (
            <OverviewTab
              onNavigateToApplications={() => setActiveTab('applications')}
              onNavigateToIntake={() => setActiveTab('intake')}
            />
          )}

          {activeTab === 'applications' && <ApplicationsWorkspace />}

          {activeTab === 'search' && <CandidateHistorySearch />}

          {activeTab === 'intake' && (
            <IntakeSettingsTab currentAdminEmail={currentAdmin.email} />
          )}

          {activeTab === 'team' && (
            <AdminTeamTab currentAdminEmail={currentAdmin.email} />
          )}

          {activeTab === 'builder' && (
            <FormBuilderTab currentAdminEmail={currentAdmin.email} />
          )}
        </div>
      </main>
    </div>
  );
};
