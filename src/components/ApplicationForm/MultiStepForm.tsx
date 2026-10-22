import React, { useState, useEffect } from 'react';
import {
  ApplicationFormData,
  DeclarationsConsent,
  GeneralAnswers,
  ModeratorAnswers,
  AdministratorAnswers,
  PositionType,
} from '../../types/application';
import {
  saveFormDraft,
  loadFormDraft,
  clearFormDraft,
  INITIAL_FORM_DATA,
} from '../../lib/storage';
import { submitApplication, SubmissionResult } from '../../lib/supabase';
import { StepProgressBar } from './StepProgressBar';
import { Step1ApplicantInfo } from './Step1ApplicantInfo';
import { Step2PositionSelect } from './Step2PositionSelect';
import { Step3GeneralQuestions } from './Step3GeneralQuestions';
import { Step4ModeratorQuestions } from './Step4ModeratorQuestions';
import { Step5AdminQuestions } from './Step5AdminQuestions';
import { Step6ReviewSubmit } from './Step6ReviewSubmit';
import { SubmissionSuccess } from './SubmissionSuccess';
import {
  GENERAL_QUESTIONS,
  MODERATOR_QUESTIONS,
  ADMINISTRATOR_QUESTIONS,
} from '../../lib/questions';
import { RotateCcw, ArrowLeft } from 'lucide-react';

interface MultiStepFormProps {
  initialPosition?: PositionType;
  onOpenPrivacy: () => void;
  onOpenRules: () => void;
  onOpenStatusCheck: (code: string) => void;
  onBackToHome: () => void;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  initialPosition,
  onOpenPrivacy,
  onOpenRules,
  onOpenStatusCheck,
  onBackToHome,
}) => {
  const [formData, setFormData] = useState<ApplicationFormData>(() => {
    const draft = loadFormDraft();
    if (initialPosition && !draft.position) {
      return { ...draft, position: initialPosition };
    }
    return draft;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [autosaveNotice, setAutosaveNotice] = useState(false);

  // Autosave whenever formData changes
  useEffect(() => {
    saveFormDraft(formData);
    setAutosaveNotice(true);
    const timer = setTimeout(() => setAutosaveNotice(false), 1500);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleStepChange = (targetStep: number) => {
    setErrors({});
    setCurrentStep(targetStep);
    if (targetStep > maxReachedStep) {
      setMaxReachedStep(targetStep);
    }
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { applicantInfo } = formData;

    if (!applicantInfo.displayName.trim()) {
      newErrors.displayName = 'Display Name is required.';
    } else if (applicantInfo.displayName.trim().length < 2) {
      newErrors.displayName = 'Display Name must be at least 2 characters.';
    }

    if (!applicantInfo.platformUsername.trim()) {
      newErrors.platformUsername = 'Platform Username is required.';
    } else if (applicantInfo.platformUsername.trim().length < 2) {
      newErrors.platformUsername = 'Platform Username must be at least 2 characters.';
    }

    if (!applicantInfo.ageRange) {
      newErrors.ageRange = 'Please select your age bracket.';
    }

    if (!applicantInfo.timeZone.trim()) {
      newErrors.timeZone = 'Please select your primary time zone.';
    }

    if (!applicantInfo.contactMethod.trim()) {
      newErrors.contactMethod = 'A primary contact method is required.';
    }

    if (!applicantInfo.weeklyAvailability) {
      newErrors.weeklyAvailability = 'Please select your weekly availability.';
    }

    if (!applicantInfo.languages || applicantInfo.languages.length === 0) {
      newErrors.languages = 'Please select at least one language.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    if (!formData.position) {
      setErrors({ position: 'Please select either Moderator or Administrator to continue.' });
      return false;
    }
    setErrors({});
    return true;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { generalAnswers } = formData;

    GENERAL_QUESTIONS.forEach((q) => {
      const fieldKey = q.field as keyof GeneralAnswers;
      const text = (generalAnswers[fieldKey] || '').trim();
      if (!text) {
        newErrors[fieldKey] = 'This question is required.';
      } else if (text.length < q.minChars) {
        newErrors[fieldKey] = `Answer must be at least ${q.minChars} characters (currently ${text.length}).`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 4 Validation (Role specific)
  const validateStep4 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { position, moderatorAnswers, administratorAnswers } = formData;

    if (position === 'moderator') {
      MODERATOR_QUESTIONS.forEach((q) => {
        const fieldKey = q.field as keyof ModeratorAnswers;
        const text = (moderatorAnswers[fieldKey] || '').trim();
        if (!text) {
          newErrors[fieldKey] = 'This scenario response is required.';
        } else if (text.length < q.minChars) {
          newErrors[fieldKey] = `Response must be at least ${q.minChars} characters (currently ${text.length}).`;
        }
      });
    } else {
      ADMINISTRATOR_QUESTIONS.forEach((q) => {
        const fieldKey = q.field as keyof AdministratorAnswers;
        const text = (administratorAnswers[fieldKey] || '').trim();
        if (!text) {
          newErrors[fieldKey] = 'This leadership response is required.';
        } else if (text.length < q.minChars) {
          newErrors[fieldKey] = `Response must be at least ${q.minChars} characters (currently ${text.length}).`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      handleStepChange(2);
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      handleStepChange(3);
    }
  };

  const handleNextFromStep3 = () => {
    if (validateStep3()) {
      handleStepChange(4);
    }
  };

  const handleNextFromStep4 = () => {
    if (validateStep4()) {
      handleStepChange(5);
    }
  };

  const handleSubmit = async () => {
    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      const result = await submitApplication(formData);
      if (result.success) {
        clearFormDraft();
        setSubmissionResult(result);
      } else {
        setSubmissionError(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      setSubmissionError((err as Error).message || 'An unexpected transmission error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to discard your answers and start fresh?')) {
      clearFormDraft();
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);
      setMaxReachedStep(1);
      setErrors({});
      setSubmissionResult(null);
      setSubmissionError(null);
    }
  };

  // If successfully submitted, render Success View
  if (submissionResult && submissionResult.success) {
    return (
      <div className="py-12 max-w-4xl mx-auto px-6">
        <SubmissionSuccess
          referenceCode={submissionResult.referenceCode}
          formData={formData}
          isLiveSupabase={submissionResult.isLiveSupabase}
          onOpenStatusCheck={(code) => onOpenStatusCheck(code)}
          onReset={() => {
            clearFormDraft();
            setFormData(INITIAL_FORM_DATA);
            setSubmissionResult(null);
            onBackToHome();
          }}
        />
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto px-6">
      {/* Top Bar with Back to Overview & Autosave Badge */}
      <div className="flex items-center justify-between mb-6 text-xs">
        <button
          onClick={onBackToHome}
          className="text-slate-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portal</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                autosaveNotice ? 'bg-amber-400' : 'bg-slate-600'
              }`}
            />
            <span className="text-[11px] font-mono text-slate-400">
              {autosaveNotice ? 'Autosaved' : 'Draft preserved'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleResetForm}
            className="text-slate-500 hover:text-rose-400 text-[11px] flex items-center gap-1 transition-colors"
            title="Clear all fields and start over"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Draft</span>
          </button>
        </div>
      </div>

      {/* Step Progress Bar */}
      <StepProgressBar
        currentStep={currentStep}
        totalSteps={5}
        position={formData.position}
        onStepClick={(step) => handleStepChange(step)}
        maxReachedStep={maxReachedStep}
      />

      {/* Step Content */}
      <div className="bg-[#0B0D14]/90 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 sm:p-9 shadow-2xl">
        {currentStep === 1 && (
          <Step1ApplicantInfo
            data={formData.applicantInfo}
            onChange={(updated) =>
              setFormData((prev) => ({
                ...prev,
                applicantInfo: { ...prev.applicantInfo, ...updated },
              }))
            }
            onNext={handleNextFromStep1}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <Step2PositionSelect
            position={formData.position}
            onSelectPosition={(pos) =>
              setFormData((prev) => ({
                ...prev,
                position: pos,
              }))
            }
            onNext={handleNextFromStep2}
            onBack={() => handleStepChange(1)}
            error={errors.position}
          />
        )}

        {currentStep === 3 && (
          <Step3GeneralQuestions
            answers={formData.generalAnswers}
            onChange={(field, value) =>
              setFormData((prev) => ({
                ...prev,
                generalAnswers: { ...prev.generalAnswers, [field]: value },
              }))
            }
            onNext={handleNextFromStep3}
            onBack={() => handleStepChange(2)}
            errors={errors}
          />
        )}

        {currentStep === 4 && (
          formData.position === 'moderator' ? (
            <Step4ModeratorQuestions
              answers={formData.moderatorAnswers}
              onChange={(field, value) =>
                setFormData((prev) => ({
                  ...prev,
                  moderatorAnswers: { ...prev.moderatorAnswers, [field]: value },
                }))
              }
              onNext={handleNextFromStep4}
              onBack={() => handleStepChange(3)}
              errors={errors}
            />
          ) : (
            <Step5AdminQuestions
              answers={formData.administratorAnswers}
              onChange={(field, value) =>
                setFormData((prev) => ({
                  ...prev,
                  administratorAnswers: { ...prev.administratorAnswers, [field]: value },
                }))
              }
              onNext={handleNextFromStep4}
              onBack={() => handleStepChange(3)}
              errors={errors}
            />
          )
        )}

        {currentStep === 5 && (
          <Step6ReviewSubmit
            formData={formData}
            onDeclarationsChange={(decl) =>
              setFormData((prev) => ({
                ...prev,
                declarations: {
                  ...prev.declarations,
                  ...decl,
                  consentTimestamp: new Date().toISOString(),
                },
              }))
            }
            onJumpToStep={(step) => handleStepChange(step)}
            onSubmit={handleSubmit}
            onBack={() => handleStepChange(4)}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
            onOpenPrivacy={onOpenPrivacy}
            onOpenRules={onOpenRules}
          />
        )}
      </div>
    </div>
  );
};
