import React, { useState } from 'react';
import { X, Book, Github, Database, Mail, ShieldAlert } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'github' | 'database' | 'email' | 'admin'>('github');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl max-h-[88vh] bg-[#0E121B] border border-slate-800 rounded-xl flex flex-col shadow-2xl text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="docs-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Book className="w-5 h-5" />
            </div>
            <div>
              <h2 id="docs-modal-title" className="text-lg font-semibold text-white">
                Technical Documentation & Architecture
              </h2>
              <p className="text-xs text-slate-400">Deployment guide, security specifications, and future roadmap</p>
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
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 text-xs font-medium">
          <button
            onClick={() => setTab('github')}
            className={`flex items-center gap-1.5 pb-3 px-3 border-b-2 transition-colors ${
              tab === 'github'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            GitHub Pages
          </button>
          <button
            onClick={() => setTab('database')}
            className={`flex items-center gap-1.5 pb-3 px-3 border-b-2 transition-colors ${
              tab === 'database'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Supabase & RLS
          </button>
          <button
            onClick={() => setTab('email')}
            className={`flex items-center gap-1.5 pb-3 px-3 border-b-2 transition-colors ${
              tab === 'email'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Gmail Notifications
          </button>
          <button
            onClick={() => setTab('admin')}
            className={`flex items-center gap-1.5 pb-3 px-3 border-b-2 transition-colors ${
              tab === 'admin'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin Dashboard
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {tab === 'github' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Deploying to GitHub Pages</h3>
              <p className="text-slate-400">
                The application compiles to a static distribution folder (<code className="text-indigo-300">dist/</code>) and uses relative base paths (<code className="text-indigo-300">base: &apos;./&apos;</code> in <code className="text-indigo-300">vite.config.ts</code>), making it fully compatible with custom domain or project repository subpaths.
              </p>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-400 space-y-1">
                <p className="text-slate-500"># 1. Install & build</p>
                <p className="text-emerald-400">npm install</p>
                <p className="text-emerald-400">npm run build</p>
                <p className="text-slate-500 mt-2"># 2. Output is ready in ./dist</p>
              </div>
              <p className="text-slate-400">
                Configure GitHub Actions via the included <code className="text-indigo-300">.github/workflows/deploy.yml</code> workflow. Supply <code className="text-indigo-300">VITE_SUPABASE_URL</code> and <code className="text-indigo-300">VITE_SUPABASE_ANON_KEY</code> in repository secrets.
              </p>
            </div>
          )}

          {tab === 'database' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">PostgreSQL Database & Row Level Security</h3>
              <p className="text-slate-400">
                Security is enforced at the database level so the public application can run safely from GitHub Pages without requiring server-side API servers:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li><strong className="text-slate-200">Anon Insert Guard:</strong> Public applicants can only insert rows with <code className="text-slate-300">status = &apos;pending&apos;</code>. Any attempt to populate <code className="text-slate-300">reviewer_notes</code> or change status is rejected by PostgreSQL.</li>
                <li><strong className="text-slate-200">Zero Public Read:</strong> Anonymous visitors cannot select or query the <code className="text-slate-300">applications</code> table. This prevents unauthorized scraping of submissions.</li>
                <li><strong className="text-slate-200">Safe Public Status RPC:</strong> Candidates track status using <code className="text-indigo-300">get_application_public_status(p_reference_code)</code> which only exposes status without sensitive answers.</li>
              </ul>
            </div>
          )}

          {tab === 'email' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Optional Email & Gmail Notifications</h3>
              <p className="text-slate-400">
                To prevent exposing private credentials in frontend code, emails are handled via a Supabase Edge Function located at <code className="text-indigo-300">supabase/functions/notify-application/index.ts</code>.
              </p>
              <p className="text-slate-400">
                When triggered by a database webhook on insertion, it sends a minimal notification email containing only the Reference Code, Position, Display Name, and Submission Timestamp. Written answers are never emailed.
              </p>
            </div>
          )}

          {tab === 'admin' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Future Administrative Dashboard Architecture</h3>
              <p className="text-slate-400">
                The database schema is already prepared for the future administrative phase:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li><strong className="text-slate-200">Application Pipeline:</strong> Statuses support <code className="text-slate-300">pending</code>, <code className="text-slate-300">under_review</code>, <code className="text-slate-300">interview</code>, <code className="text-slate-300">accepted</code>, and <code className="text-slate-300">rejected</code>.</li>
                <li><strong className="text-slate-200">Reviewer Notes Table:</strong> Allows staff to score answers from 1–5 and leave team feedback.</li>
                <li><strong className="text-slate-200">Audit History Trigger:</strong> Automatically logs who modified candidate statuses and when.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-slate-800 bg-[#0A0D14] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
