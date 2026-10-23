import React, { useState } from 'react';
import { Shield, Lock, Mail, Key, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLoginProps {
  onBackToPortal: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToPortal }) => {
  const { loginWithGoogle, loginWithPassword, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'password' | 'google'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await loginWithPassword(email, password);
      if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center px-4 py-8 bg-[#060709] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-amber-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[250px] bg-amber-600/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Header bar */}
      <div className="w-full max-w-md flex items-center justify-between z-10">
        <button
          onClick={onBackToPortal}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portal</span>
        </button>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#090B12]/95 border border-amber-500/25 rounded-2xl p-7 sm:p-8 shadow-2xl relative z-10 backdrop-blur-sm">
        {/* Emblem & Title */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-amber-400/15 to-transparent border border-amber-500/30 flex items-center justify-center shadow-lg">
            <img
              src="/icon.png"
              alt="ASPIDA Emblem"
              className="w-9 h-9 object-contain drop-shadow"
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white uppercase gold-gradient-text">
              ASPIDA
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Administrator Sign In
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-black/40 border border-white/10 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('password');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'password'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('google');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'google'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Google Sign-In
          </button>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Forms */}
        {activeTab === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 focus:border-amber-400/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 focus:border-amber-400/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-black font-semibold text-xs rounded-xl shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed text-center">
              Sign in with your authorized administrator Google Account.
            </p>

            <button
              type="button"
              onClick={handleGoogleSubmit}
              disabled={isSubmitting || isLoading}
              className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-amber-400/50 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}
      </div>

      {/* Discreet Copyright */}
      <div className="text-[11px] text-slate-500 font-mono z-10">
        © {new Date().getFullYear()} ASPIDA
      </div>
    </div>
  );
};
