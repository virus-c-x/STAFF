import React, { useState } from 'react';
import {
  X,
  Shield,
  Clock,
  User,
  Calendar,
  Globe,
  CheckCircle2,
  AlertTriangle,
  History,
  Copy,
  Check,
  ChevronRight,
  MessageSquare,
  FileText,
} from 'lucide-react';
import {
  ApplicationStatus,
  PositionType,
  StoredApplicationRecord,
} from '../../types/application';
import { AuditLogEntry, ReviewerNoteItem } from '../../types/admin';
import { ReviewerNotesSection } from './ReviewerNotesSection';
import { updateApplicationStatus } from '../../lib/supabase';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  GENERAL_QUESTIONS,
  MODERATOR_SCENARIO_QUESTIONS,
  ADMINISTRATOR_SCENARIO_QUESTIONS,
} from '../../lib/questions';

interface ApplicationDetailModalProps {
  application: StoredApplicationRecord;
  notes: ReviewerNoteItem[];
  history: AuditLogEntry[];
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (newStatus: ApplicationStatus, reason: string) => void;
  onNoteAdded: (note: ReviewerNoteItem) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  notes,
  history,
  isOpen,
  onClose,
  onStatusUpdated,
  onNoteAdded,
}) => {
  const { adminUser } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'responses' | 'notes' | 'audit'>('responses');
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>(application.status);
  const [statusReason, setStatusReason] = useState('');
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(application.reference_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;
    setIsSubmittingStatus(true);
    try {
      const res = await updateApplicationStatus(
        application.id,
        targetStatus,
        statusReason.trim() || `Status updated to ${targetStatus}`,
        adminUser.display_name,
        adminUser.id
      );
      if (res.success) {
        onStatusUpdated(targetStatus, statusReason);
        setIsChangingStatus(false);
        setStatusReason('');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsSubmittingStatus(false);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#090B12] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-amber-500/15 bg-gradient-to-r from-black/80 to-[#0e111a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg font-bold text-white tracking-wide">
                {application.applicant_display_name}
              </span>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 hover:border-amber-400/40 text-xs font-mono text-amber-300 transition-colors"
                title="Copy Reference Code"
              >
                <span>{application.reference_code}</span>
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>

              <span
                className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  application.status
                )}`}
              >
                {application.status.replace('_', ' ')}
              </span>

              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                {application.position.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>Platform: <span className="text-slate-200 font-mono">{application.platform_username}</span></span>
              <span>·</span>
              <span>Submitted: <span className="text-slate-300">{new Date(application.created_at).toLocaleString()}</span></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsChangingStatus(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              Update Status
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Change Drawer / Banner */}
        {isChangingStatus && (
          <form
            onSubmit={handleSaveStatus}
            className="p-4 bg-amber-500/10 border-b border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-amber-300 whitespace-nowrap">Transition to:</span>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as ApplicationStatus)}
                className="px-3 py-1.5 bg-black border border-amber-400/40 rounded-lg text-xs text-white focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <input
              type="text"
              required
              placeholder="Reason for status change / audit note..."
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmittingStatus}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {isSubmittingStatus ? 'Saving...' : 'Confirm Status'}
              </button>
              <button
                type="button"
                onClick={() => setIsChangingStatus(false)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-xs text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-black/40 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('responses')}
            className={`pb-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'responses'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Written Responses</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Verification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`pb-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'notes'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Reviewer Notes ({notes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Status Audit Trail ({history.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: WRITTEN RESPONSES */}
          {activeTab === 'responses' && (
            <div className="space-y-6">
              {/* Role scenarios */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {application.position === 'moderator' ? 'Community Moderator' : 'Server Administrator'} Scenario Answers
                  </h3>
                </div>

                <div className="space-y-4">
                  {(application.position === 'moderator'
                    ? MODERATOR_SCENARIO_QUESTIONS
                    : ADMINISTRATOR_SCENARIO_QUESTIONS
                  ).map((q, idx) => {
                    const ans = (application.role_answers as any)?.[q.field] || 'No answer recorded';
                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2"
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-[11px] font-mono text-amber-400 font-bold">
                            #{idx + 1}
                          </span>
                          <h4 className="text-xs font-semibold text-slate-200">{q.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">{q.description}</p>
                        <div className="p-3 rounded-lg bg-black/60 border border-white/5 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                          {ans}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* General Screening Answers */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    General Operational & Behavioral Answers
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {GENERAL_QUESTIONS.map((q, idx) => {
                    const ans = (application.general_answers as any)?.[q.field] || 'No answer recorded';
                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-[10px] font-mono text-amber-400 font-bold">
                              Q{idx + 1}
                            </span>
                            <h4 className="text-xs font-semibold text-slate-200">{q.title}</h4>
                          </div>
                          <p className="text-[10px] text-slate-500 mb-2">{q.description}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {ans}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & VERIFICATION */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400">Display Name</span>
                  <div className="text-sm font-semibold text-white">{application.applicant_display_name}</div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400">Platform Handle</span>
                  <div className="text-sm font-mono text-amber-300">{application.platform_username}</div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400">Platform User ID</span>
                  <div className="text-sm font-mono text-slate-300">{application.platform_user_id || 'Not Provided'}</div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400">Age Bracket</span>
                  <div className="text-sm text-slate-200">{application.age_range}</div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400">Time Zone / Location</span>
                  <div className="text-sm text-slate-200">{application.time_zone}</div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400">Weekly Availability</span>
                  <div className="text-sm text-slate-200">{application.weekly_availability}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Contact Channel & Languages
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400">Primary Contact Method:</span>
                    <div className="text-sm font-medium text-amber-300 font-mono mt-0.5">
                      {application.contact_method}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400">Fluent Languages:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {application.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-slate-300"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20 space-y-2">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Legal & Consent Audit Trail</span>
                </span>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Privacy Notice Version: <span className="font-mono text-slate-200">{application.privacy_notice_version}</span></div>
                  <div>Consent Timestamp: <span className="font-mono text-slate-200">{new Date(application.privacy_consent_timestamp).toUTCString()}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWER NOTES & SCORING */}
          {activeTab === 'notes' && (
            <ReviewerNotesSection
              applicationId={application.id}
              notes={notes}
              onNoteAdded={onNoteAdded}
            />
          )}

          {/* TAB 4: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>Lifecycle State Progression</span>
              </h4>

              {history.length === 0 ? (
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-500 text-center">
                  No status transitions recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">
                            {entry.old_status ? entry.old_status.toUpperCase() : 'INITIAL'}
                          </span>
                          <span className="text-amber-400">→</span>
                          <span className="text-xs font-bold text-amber-300">
                            {entry.new_status.toUpperCase()}
                          </span>
                        </div>
                        {entry.change_reason && (
                          <p className="text-xs text-slate-300 italic">{entry.change_reason}</p>
                        )}
                        <div className="text-[10px] text-slate-500">
                          Logged by: {entry.changed_by || 'System'}
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
