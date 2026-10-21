import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PositionCards } from './components/PositionCards';
import { RecruitmentProcess } from './components/RecruitmentProcess';
import { Footer } from './components/Footer';
import { MultiStepForm } from './components/ApplicationForm/MultiStepForm';
import { PrivacyModal } from './components/Modals/PrivacyModal';
import { StaffRulesModal } from './components/Modals/StaffRulesModal';
import { StatusCheckModal } from './components/Modals/StatusCheckModal';
import { SupabaseConfigModal } from './components/Modals/SupabaseConfigModal';
import { DocsModal } from './components/Modals/DocsModal';
import { PositionType } from './types/application';
import { loadFormDraft } from './lib/storage';

export default function App() {
  const [view, setView] = useState<'home' | 'apply'>('home');
  const [selectedPosition, setSelectedPosition] = useState<PositionType | undefined>(undefined);
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(true);

  // Modals state
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isStatusCheckOpen, setIsStatusCheckOpen] = useState(false);
  const [statusCheckInitialCode, setStatusCheckInitialCode] = useState('');
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Draft check
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const draft = loadFormDraft();
    const hasData =
      Boolean(draft.position) ||
      Boolean(draft.applicantInfo.displayName) ||
      Boolean(draft.generalAnswers.q1_why_join);
    setHasDraft(hasData);
  }, [view]);

  const handleStartApplication = (position?: PositionType) => {
    if (position) {
      setSelectedPosition(position);
    }
    setView('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStatusCheckWithCode = (code: string) => {
    setStatusCheckInitialCode(code);
    setIsStatusCheckOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080A10] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar Navigation */}
      <Navbar
        onApplyClick={() => handleStartApplication()}
        onOpenStatusCheck={() => {
          setStatusCheckInitialCode('');
          setIsStatusCheckOpen(true);
        }}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
        hasDraft={hasDraft}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {view === 'home' ? (
          <div>
            <Hero
              onStartApplication={(pos) => handleStartApplication(pos)}
              onOpenPrivacy={() => setIsPrivacyOpen(true)}
              isRecruitmentOpen={isRecruitmentOpen}
              onToggleRecruitmentOpen={() => setIsRecruitmentOpen((prev) => !prev)}
            />

            <PositionCards
              onSelectPosition={(pos) => handleStartApplication(pos)}
              isRecruitmentOpen={isRecruitmentOpen}
            />

            <RecruitmentProcess />
          </div>
        ) : (
          <MultiStepForm
            initialPosition={selectedPosition}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenStatusCheck={handleOpenStatusCheckWithCode}
            onBackToHome={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenStatusCheck={() => {
          setStatusCheckInitialCode('');
          setIsStatusCheckOpen(true);
        }}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
      />

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

      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
        onConfigChanged={() => {
          // Re-trigger re-render if connection mode toggles
        }}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
