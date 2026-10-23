import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PortalHome } from './components/PortalHome';
import { StaffHeroBanner } from './components/StaffHeroBanner';
import { MultiStepForm } from './components/ApplicationForm/MultiStepForm';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/Modals/PrivacyModal';
import { StaffRulesModal } from './components/Modals/StaffRulesModal';
import { StatusCheckModal } from './components/Modals/StatusCheckModal';
import { PositionType } from './types/application';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Shield } from 'lucide-react';

function AppContent() {
  const [view, setView] = useState<'portal' | 'staff' | 'admin'>('portal');
  const [selectedPosition, setSelectedPosition] = useState<PositionType | undefined>(undefined);

  // Modals state
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isStatusCheckOpen, setIsStatusCheckOpen] = useState(false);
  const [statusCheckInitialCode, setStatusCheckInitialCode] = useState('');

  const { adminUser, isLoading: isAdminLoading, logout } = useAdminAuth();

  // Ensure the website always opens on the main home page (portal) upon initial load
  useEffect(() => {
    // Clear any lingering #/admin from prior preview sessions
    if (window.location.hash === '#/admin' || window.location.hash === '#admin') {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch {
        window.location.hash = '';
      }
    }
    setView('portal');

    // Listen for deliberate user hash changes (e.g. browser back/forward or admin links)
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash === '#admin') {
        setView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash || hash === '#' || hash === '#/') {
        setView('portal');
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenStaff = (pos?: PositionType) => {
    if (pos) setSelectedPosition(pos);
    window.location.hash = '';
    setView('staff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStatusCheckWithCode = (code: string) => {
    setStatusCheckInitialCode(code);
    setIsStatusCheckOpen(true);
  };

  const handleOpenAdmin = () => {
    window.location.hash = '#/admin';
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPortal = () => {
    try {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch {
      window.location.hash = '';
    }
    setView('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. ADMIN ROUTE VIEW
  if (view === 'admin') {
    if (isAdminLoading) {
      return (
        <div className="min-h-screen bg-[#060709] flex flex-col items-center justify-center text-slate-300 gap-4">
          <div className="relative">
            <Shield className="w-12 h-12 text-amber-400 animate-pulse" />
            <span className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-ping" />
          </div>
          <div className="text-xs font-mono tracking-widest text-amber-300/90 uppercase">
            Verifying credentials...
          </div>
        </div>
      );
    }

    if (adminUser) {
      return (
        <AdminDashboard
          currentAdmin={adminUser}
          onSignOut={logout}
          onNavigateToPublicPortal={handleBackToPortal}
        />
      );
    }

    return <AdminLogin onBackToPortal={handleBackToPortal} />;
  }

  // 2. PUBLIC PORTAL & STAFF APPLICATION FLOW
  return (
    <div className="min-h-screen flex flex-col bg-[#060709] text-slate-100 selection:bg-amber-500/20 selection:text-amber-200">
      {/* Dynamic View Router */}
      {view === 'portal' ? (
        <PortalHome
          onSelectStaff={() => handleOpenStaff()}
          onOpenStatusCheck={() => {
            setStatusCheckInitialCode('');
            setIsStatusCheckOpen(true);
          }}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenAdmin={handleOpenAdmin}
        />
      ) : (
        <div className="flex-1 flex flex-col animate-view-entry">
          {/* Top Bar for Staff Section */}
          <Navbar
            currentView={view}
            onApplyClick={() => handleOpenStaff()}
            onBackToPortal={handleBackToPortal}
            onOpenStatusCheck={() => {
              setStatusCheckInitialCode('');
              setIsStatusCheckOpen(true);
            }}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />

          {/* Wide Hero Banner with Circular Glass & Gold Badge */}
          <StaffHeroBanner
            onBackToPortal={handleBackToPortal}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
          />

          {/* Multi-step Application Form */}
          <main className="flex-1 pb-16">
            <MultiStepForm
              initialPosition={selectedPosition}
              onOpenPrivacy={() => setIsPrivacyOpen(true)}
              onOpenRules={() => setIsRulesOpen(true)}
              onOpenStatusCheck={handleOpenStatusCheckWithCode}
              onBackToHome={handleBackToPortal}
            />
          </main>

          {/* Footer */}
          <Footer
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenStatusCheck={() => {
              setStatusCheckInitialCode('');
              setIsStatusCheckOpen(true);
            }}
            onBackToPortal={handleBackToPortal}
            onOpenAdmin={handleOpenAdmin}
          />
        </div>
      )}

      {/* Overlays / Modals */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <StaffRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <StatusCheckModal
        isOpen={isStatusCheckOpen}
        onClose={() => setIsStatusCheckOpen(false)}
        initialCode={statusCheckInitialCode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AppContent />
    </AdminAuthProvider>
  );
}
