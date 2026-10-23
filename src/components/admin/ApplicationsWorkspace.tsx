import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  FileSpreadsheet,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { ApplicationStatus, PositionType, StoredApplicationRecord } from '../../types/application';
import { AuditLogEntry, ReviewerNoteItem } from '../../types/admin';
import { fetchAdminApplications, fetchApplicationDetail } from '../../lib/supabase';
import { ApplicationDetailModal } from './ApplicationDetailModal';

export const ApplicationsWorkspace: React.FC = () => {
  const [applications, setApplications] = useState<StoredApplicationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<PositionType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'status'>('newest');

  // Detail Modal State
  const [selectedApp, setSelectedApp] = useState<StoredApplicationRecord | null>(null);
  const [appNotes, setAppNotes] = useState<ReviewerNoteItem[]>([]);
  const [appHistory, setAppHistory] = useState<AuditLogEntry[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminApplications({
        position: positionFilter,
        status: statusFilter,
        searchQuery,
        sortBy,
      });
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [positionFilter, statusFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadApplications();
  };

  const handleOpenDetail = async (app: StoredApplicationRecord) => {
    try {
      const detail = await fetchApplicationDetail(app.id);
      setSelectedApp(detail.application || app);
      setAppNotes(detail.notes);
      setAppHistory(detail.history);
      setIsDetailOpen(true);
    } catch (err) {
      setSelectedApp(app);
      setIsDetailOpen(true);
    }
  };

  const handleExportCSV = () => {
    if (applications.length === 0) return;

    const headers = [
      'Reference Code',
      'Display Name',
      'Platform Username',
      'Position',
      'Status',
      'Age Bracket',
      'Time Zone',
      'Languages',
      'Weekly Availability',
      'Contact Method',
      'Submitted At',
    ];

    const rows = applications.map((a) => [
      `"${a.reference_code}"`,
      `"${a.applicant_display_name.replace(/"/g, '""')}"`,
      `"${a.platform_username.replace(/"/g, '""')}"`,
      `"${a.position}"`,
      `"${a.status}"`,
      `"${a.age_range}"`,
      `"${a.time_zone}"`,
      `"${a.languages.join('; ')}"`,
      `"${a.weekly_availability}"`,
      `"${a.contact_method.replace(/"/g, '""')}"`,
      `"${a.created_at}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ASPIDA_Recruitment_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'rejected':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'interview':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'under_review':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Applications ({applications.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review and manage submitted staff applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadApplications}
            disabled={isLoading}
            className="p-2 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            title="Refresh Registry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={applications.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-slate-200 hover:text-amber-300 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Discord handle, display name, reference code, contact..."
              className="w-full pl-9 pr-20 py-2 bg-black/60 border border-white/10 focus:border-amber-400/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-[11px] font-medium rounded-lg transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Role filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Role:</span>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value as any)}
              className="px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Roles</option>
              <option value="moderator">Community Moderator</option>
              <option value="administrator">Server Administrator</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl border border-amber-500/20 bg-[#090B12] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Reference Code</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                      <span>Loading candidates...</span>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No applications found matching the selected filters.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => handleOpenDetail(app)}
                    className="hover:bg-amber-500/[0.04] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono text-amber-300 font-semibold">
                      {app.reference_code}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white group-hover:text-amber-200 transition-colors">
                        {app.applicant_display_name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {app.platform_username}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10">
                        {app.position === 'moderator' ? 'Moderator' : 'Administrator'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {app.weekly_availability}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(app);
                        }}
                        className="p-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-amber-400/50 text-slate-400 hover:text-amber-300 transition-colors"
                        title="View Application Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          notes={appNotes}
          history={appHistory}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onStatusUpdated={(newStatus) => {
            selectedApp.status = newStatus;
            setSelectedApp({ ...selectedApp });
            loadApplications();
          }}
          onNoteAdded={(newNote) => {
            setAppNotes([newNote, ...appNotes]);
          }}
        />
      )}
    </div>
  );
};
