import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Mail,
  Shield,
  KeyRound,
  UserCog,
} from 'lucide-react';
import { AdminRole, AdminUser } from '../../types/admin';
import {
  fetchAdminUsers,
  inviteAdminUser,
  removeAdminUser,
  updateAdminUserRole,
  isPrimaryOwner,
  PRIMARY_OWNER_EMAILS,
} from '../../lib/supabase';

interface AdminTeamTabProps {
  currentAdminEmail: string;
}

export const AdminTeamTab: React.FC<AdminTeamTabProps> = ({ currentAdminEmail }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('reviewer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminUsers();
      setAdmins(data);
    } catch (err) {
      console.error('Failed to load administrators:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await inviteAdminUser(
        inviteEmail,
        inviteName,
        inviteRole,
        currentAdminEmail
      );

      if (res.success && res.user) {
        setFeedback({
          type: 'success',
          message: `Administrator authorization granted to ${inviteEmail}.`,
        });
        setInviteEmail('');
        setInviteName('');
        setInviteModalOpen(false);
        loadAdmins();
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to authorize administrator.',
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (id: string, newRole: AdminRole) => {
    const res = await updateAdminUserRole(id, newRole, currentAdminEmail);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: 'Administrator clearance role updated successfully.',
      });
      loadAdmins();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to modify clearance level.' });
    }
  };

  const handleRemove = async (id: string, email: string) => {
    if (!window.confirm(`Revoke administrative clearance for ${email}?`)) return;

    const res = await removeAdminUser(id, currentAdminEmail);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: `Clearance for ${email} successfully revoked.`,
      });
      loadAdmins();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to revoke account.' });
    }
  };

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'owner':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
            Executive Owner
          </span>
        );
      case 'lead_reviewer':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
            Lead Reviewer
          </span>
        );
      case 'reviewer':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-slate-800 text-slate-300 border border-white/10 uppercase">
            Reviewer
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <UserCog className="w-5 h-5 text-amber-400" />
            <span>Administrator Team & Permissions</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage administrator accounts and role permissions for reviewing and evaluating applications.
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/15 cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Administrator</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Admin Users Table */}
      <div className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0D17] border-b border-white/5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Administrator</th>
                <th className="px-5 py-3.5">Email / Identifier</th>
                <th className="px-5 py-3.5">Clearance Role</th>
                <th className="px-5 py-3.5">Last Active</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    Loading authorized administrators...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    No administrators found in directory.
                  </td>
                </tr>
              ) : (
                admins.map((adm) => {
                  const isOwnerAccount = isPrimaryOwner(adm.email);
                  const isCurrent = adm.email.toLowerCase() === currentAdminEmail.toLowerCase();

                  return (
                    <tr key={adm.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{adm.display_name}</span>
                          {isCurrent && (
                            <span className="text-[10px] text-amber-400 font-mono font-normal">
                              (You)
                            </span>
                          )}
                        </div>
                        {adm.invited_by && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Authorized by: {adm.invited_by}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 font-mono text-slate-400">
                        {adm.email}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {getRoleBadge(adm.role)}
                          {!isOwnerAccount && (
                            <select
                              value={adm.role}
                              onChange={(e) => handleRoleChange(adm.id, e.target.value as AdminRole)}
                              className="bg-[#0A0D17] border border-white/10 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                            >
                              <option value="reviewer">Reviewer</option>
                              <option value="lead_reviewer">Lead Reviewer</option>
                              <option value="owner">Owner</option>
                            </select>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                        {adm.last_login_at
                          ? new Date(adm.last_login_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Never'}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {isOwnerAccount ? (
                          <span className="text-[10px] text-amber-400 font-mono">
                            Protected
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[10px] text-slate-500 font-mono">
                            Current Session
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemove(adm.id, adm.email)}
                            className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all cursor-pointer inline-flex items-center gap-1"
                            title="Remove administrator"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Remove</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0A0D17] border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Add Administrator</span>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-amber-400 rounded-xl text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-amber-400 rounded-xl text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-amber-400 rounded-xl text-white focus:outline-none cursor-pointer"
                >
                  <option value="reviewer">Reviewer (Read applications and submit notes)</option>
                  <option value="lead_reviewer">Lead Reviewer (Review applications and update statuses)</option>
                  <option value="owner">Owner (Full administrative permissions)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  {isSubmitting ? 'Adding...' : 'Add Administrator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
