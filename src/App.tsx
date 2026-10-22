import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PortalHome } from './components/PortalHome';
import { StaffHeroBanner } from './components/StaffHeroBanner';
import { MultiStepForm } from './components/ApplicationForm/MultiStepForm';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/Modals/PrivacyModal';
import { StaffRulesModal } from './components/Modals/StaffRulesModal';
import { StatusCheckModal } from './components/Modals/StatusCheckModal';
import { PositionType } from './types/application';

export default function App() {
  const [view, setView] = useState<'portal' | 'staff'>('portal');
  const [selectedPosition, setSelectedPosition] = useState<PositionType | undefined>(undefined);

  // Modals state
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isStatusCheckOpen, setIsStatusCheckOpen] = useState(false);
  const [statusCheckInitialCode, setStatusCheckInitialCode] = useState('');

  const handleOpenStaff = (pos?: PositionType) => {
    if (pos) setSelectedPosition(pos);
    setView('staff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStatusCheckWithCode = (code: string) => {
    setStatusCheckInitialCode(code);
    setIsStatusCheckOpen(true);
  };

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
        />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Top Bar for Staff Section */}
          <Navbar
            currentView={view}
            onApplyClick={() => handleOpenStaff()}
            onBackToPortal={() => {
              setView('portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenStatusCheck={() => {
              setStatusCheckInitialCode('');
              setIsStatusCheckOpen(true);
            }}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />

          {/* Wide Hero Banner with Circular Glass & Gold Badge */}
          <StaffHeroBanner
            onBackToPortal={() => {
              setView('portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
              onBackToHome={() => {
                setView('portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
            onBackToPortal={() => {
              setView('portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
