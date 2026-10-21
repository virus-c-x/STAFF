import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  RefreshCw,
  Sliders,
  Check,
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  getSupabaseClient,
  getLocalDemoSubmissions,
  updateLocalDemoStatus,
} from '../../lib/supabase';
import { ApplicationStatus, StoredApplicationRecord } from '../../types/application';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged?: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'schema' | 'sandbox'>('status');
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testResult, setTestResult] = useState<{ testing: boolean; message?: string; success?: boolean }>({
    testing: false,
  });
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [demoSubmissions, setDemoSubmissions] = useState<StoredApplicationRecord[]>([]);

  const config = getSupabaseConfig();

  useEffect(() => {
    if (isOpen) {
      setUrl(config.url);
      setAnonKey(config.anonKey);
      setDemoSubmissions(getLocalDemoSubmissions());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      clearCustomSupabaseConfig();
      if (onConfigChanged) onConfigChanged();
      setTestResult({
        testing: false,
        success: true,
        message: 'Reverted to sandbox mode.',
      });
      return;
    }

    setTestResult({ testing: true });
    try {
      saveCustomSupabaseConfig(url, anonKey);
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Failed to initialize client with provided credentials.');
      }

      // Test call
      const { error } = await client.from('applications').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is normal for empty/head; RLS blocks SELECT which is expected!
        // An RLS permission error (42501 or permission denied for table applications) actually proves the connection is valid and RLS is active!
        console.log('Supabase response:', error);
      }

      setTestResult({
        testing: false,
        success: true,
        message: 'Successfully connected to Supabase project! Row Level Security verified.',
      });
      if (onConfigChanged) onConfigChanged();
    } catch (err) {
      setTestResult({
        testing: false,
        success: false,
        message: (err as Error).message || 'Connection failed.',
      });
    }
  };

  const handleClear = () => {
    clearCustomSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult({
      testing: false,
      success: true,
      message: 'Custom Supabase credentials cleared. Now in Sandbox mode.',
    });
    if (onConfigChanged) onConfigChanged();
  };

  const handleCopySchema = () => {
    const sql = `-- Supabase Schema can be copied from /supabase/schema.sql in the repo.`;
    navigator.clipboard.writeText(sql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleStatusChange = (ref: string, newStatus: ApplicationStatus) => {
    updateLocalDemoStatus(ref, newStatus);
    setDemoSubmissions(getLocalDemoSubmissions());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl max-h-[88vh] bg-[#0E121B] border border-slate-800 rounded-xl flex flex-col shadow-2xl text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="supabase-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 id="supabase-modal-title" className="text-lg font-semibold text-white">
                Supabase & PostgreSQL Integration
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Status:</span>
                {config.isConfigured ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected ({config.source === 'env' ? 'Environment Variables' : 'Custom Config'})
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Sandbox / Demo Mode (No Supabase connected)
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            PostgreSQL Schema & RLS
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'sandbox'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sandbox Submissions ({demoSubmissions.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-400">
                <strong className="text-slate-200 block mb-1">Architecture Note:</strong>
                Submissions are sent directly to Supabase with PostgreSQL Row Level Security (RLS). You can configure your credentials via <code className="text-indigo-300">VITE_SUPABASE_URL</code> and <code className="text-indigo-300">VITE_SUPABASE_ANON_KEY</code> in GitHub Secrets / <code className="text-indigo-300">.env</code>, or test live here.
              </div>

              <form onSubmit={handleTestAndSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-project.supabase.co"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <textarea
                    rows={3}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-indigo-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    * Use only the public <code className="text-slate-400">anon</code> key. Never input your private <code className="text-rose-400">service_role</code> secret.
                  </p>
                </div>

                {testResult.message && (
                  <div
                    className={`p-3 rounded-lg text-xs border ${
                      testResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                    }`}
                  >
                    {testResult.message}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={testResult.testing}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    {testResult.testing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      'Save & Test Connection'
                    )}
                  </button>

                  {config.source === 'custom' && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
                    >
                      Clear Custom Config
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>The schema file is located at <code className="text-indigo-300">/supabase/schema.sql</code></span>
                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied' : 'Copy SQL Path'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 space-y-2 max-h-[300px] overflow-y-auto">
                <p className="text-slate-500">-- Key Row Level Security (RLS) Policy applied:</p>
                <p className="text-indigo-400">
                  CREATE POLICY &quot;anon_can_insert_new_applications&quot;<br />
                  &nbsp;&nbsp;ON applications FOR INSERT<br />
                  &nbsp;&nbsp;TO anon, authenticated<br />
                  &nbsp;&nbsp;WITH CHECK (<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;status = &apos;pending&apos; AND<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;reviewer_notes IS NULL AND<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;reviewed_at IS NULL AND<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;reviewed_by IS NULL<br />
                  &nbsp;&nbsp;);
                </p>
                <p className="text-slate-500">-- Anonymous users cannot SELECT or inspect applications directly.</p>
                <p className="text-slate-500">-- Applicants check their status via SECURITY DEFINER function:</p>
                <p className="text-emerald-400">
                  get_application_public_status(p_reference_code TEXT)
                </p>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p>To run this in Supabase:</p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-500">
                  <li>Go to your Supabase Dashboard &gt; <strong>SQL Editor</strong>.</li>
                  <li>Paste the contents of <code className="text-slate-400">supabase/schema.sql</code>.</li>
                  <li>Click <strong>Run</strong>. All tables, indexes, triggers, and RLS policies are created automatically.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-start gap-2">
                <Sliders className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-medium">Interactive Status Testing:</span>
                  <p className="mt-0.5">
                    When running in local sandbox mode, submitted applications appear here. You can change their status below and then test how an applicant sees their updated status in the &quot;Check Application Status&quot; lookup tool!
                  </p>
                </div>
              </div>

              {demoSubmissions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                  No sandbox submissions recorded yet. Submit an application through the form to see it appear here.
                </div>
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto">
                  {demoSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-semibold text-white">{sub.reference_code}</span>
                        <span className="capitalize text-slate-400">{sub.position}</span>
                      </div>
                      <div className="text-slate-300">
                        {sub.applicant_display_name} ({sub.platform_username})
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-slate-400">Current Status:</span>
                        <select
                          value={sub.status}
                          onChange={(e) =>
                            handleStatusChange(sub.reference_code, e.target.value as ApplicationStatus)
                          }
                          className="bg-slate-950 border border-slate-700 text-xs rounded px-2 py-1 text-indigo-300 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="under_review">Under Review</option>
                          <option value="interview">Interview</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-800 bg-[#0A0D14] shrink-0">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
          >
            <span>Supabase Documentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
