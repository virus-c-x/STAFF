import React from 'react';
import {
  ApplicationFormData,
  DeclarationsConsent,
  PositionType,
} from '../../types/application';
import {
  GENERAL_QUESTIONS,
  MODERATOR_QUESTIONS,
  ADMINISTRATOR_QUESTIONS,
} from '../../lib/questions';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Lock,
  FileCheck,
  Send,
  Loader2,
} from 'lucide-react';

interface Step6ReviewSubmitProps {
  formData: ApplicationFormData;
  onDeclarationsChange: (decl: Partial<DeclarationsConsent>) => void;
  onJumpToStep: (stepNumber: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  submissionError: string | null;
  onOpenPrivacy: () => void;
  onOpenRules: () => void;
}

export const Step6ReviewSubmit: React.FC<Step6ReviewSubmitProps> = ({
  formData,
  onDeclarationsChange,
  onJumpToStep,
  onSubmit,
  onBack,
  isSubmitting,
  submissionError,
  onOpenPrivacy,
  onOpenRules,
}) => {
  const { applicantInfo, position, generalAnswers, moderatorAnswers, administratorAnswers, declarations } =
    formData;

  const roleQuestions =
    position === 'moderator' ? MODERATOR_QUESTIONS : ADMINISTRATOR_QUESTIONS;
  const roleAnswers =
    position === 'moderator' ? moderatorAnswers : administratorAnswers;

  const allDeclarationsChecked =
    declarations.accurateInfo &&
    declarations.agreeRulesPolicies &&
    declarations.understandNoGuarantee &&
    declarations.consentDataProcessing;

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-white">Step 6 — Final Review & Declarations</h3>
        <p className="text-xs text-slate-400 mt-1">
          Please review your submitted details and scenario answers carefully before finalizing. You can edit any section using the edit buttons.
        </p>
      </div>

      {/* Summary Card 1: Applicant Profile */}
      <div className="bg-[#0E121B] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-indigo-400 font-semibold">SECTION 1</span>
            <span className="text-sm font-semibold text-white">Applicant Profile</span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(1)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Display Name</span>
            <span className="text-slate-200 font-medium">{applicantInfo.displayName}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Platform Username</span>
            <span className="text-slate-200 font-medium">{applicantInfo.platformUsername}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Platform ID</span>
            <span className="text-slate-200 font-mono">
              {applicantInfo.platformUserId || 'Not provided'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Age Range</span>
            <span className="text-slate-200 font-medium">{applicantInfo.ageRange}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Time Zone</span>
            <span className="text-slate-200 font-medium">{applicantInfo.timeZone}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Availability</span>
            <span className="text-slate-200 font-medium">{applicantInfo.weeklyAvailability}</span>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <span className="text-slate-500 block mb-0.5">Languages</span>
            <span className="text-slate-200 font-medium">
              {applicantInfo.languages.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Card 2: Position */}
      <div className="bg-[#0E121B] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-indigo-400 font-semibold">SECTION 2</span>
            <span className="text-sm font-semibold text-white">Target Position</span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(2)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Selected Track</span>
            <span className="text-base font-bold text-white capitalize">{position} Position</span>
          </div>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md">
            Eligibility Confirmed
          </span>
        </div>
      </div>

      {/* Summary Card 3: General Questions */}
      <div className="bg-[#0E121B] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-indigo-400 font-semibold">SECTION 3</span>
            <span className="text-sm font-semibold text-white">General Questions (10 Answered)</span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(3)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-3">
          {GENERAL_QUESTIONS.map((q) => {
            const val = generalAnswers[q.field as keyof typeof generalAnswers] || '';
            return (
              <div key={q.id} className="text-xs p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1">
                <span className="font-semibold text-white block">{q.title}</span>
                <p className="text-slate-300 whitespace-pre-line line-clamp-3 leading-relaxed">
                  {val}
                </p>
                <div className="text-[11px] text-slate-500 text-right">{val.length} characters</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Card 4: Role Questions */}
      <div className="bg-[#0E121B] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-indigo-400 font-semibold">SECTION 4</span>
            <span className="text-sm font-semibold text-white capitalize">
              {position} Scenario Questions ({roleQuestions.length} Answered)
            </span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(4)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-3">
          {roleQuestions.map((q) => {
            const val = (roleAnswers as any)[q.field] || '';
            return (
              <div key={q.id} className="text-xs p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1">
                <span className="font-semibold text-white block">{q.title}</span>
                <p className="text-slate-300 whitespace-pre-line line-clamp-3 leading-relaxed">
                  {val}
                </p>
                <div className="text-[11px] text-slate-500 text-right">{val.length} characters</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: Mandatory Declarations */}
      <div className="bg-[#0E121B] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileCheck className="w-4 h-4 text-indigo-400" />
          <h4 className="text-sm font-semibold text-white">Mandatory Candidate Declarations</h4>
        </div>

        <p className="text-xs text-slate-400">
          You must review and agree to all four conditions prior to submitting your application:
        </p>

        <div className="space-y-3 text-xs">
          {/* Declaration 1 */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={declarations.accurateInfo}
              onChange={(e) => onDeclarationsChange({ accurateInfo: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-slate-300 group-hover:text-white transition-colors">
              I certify that all information provided in this application is accurate and true to the best of my knowledge. Misrepresentation is grounds for immediate disqualification.
            </span>
          </label>

          {/* Declaration 2 */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={declarations.agreeRulesPolicies}
              onChange={(e) => onDeclarationsChange({ agreeRulesPolicies: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-slate-300 group-hover:text-white transition-colors">
              I have read and agree to follow all{' '}
              <button
                type="button"
                onClick={onOpenRules}
                className="text-indigo-400 underline hover:text-indigo-300 inline"
              >
                Server Rules and Staff Code of Conduct
              </button>
              .
            </span>
          </label>

          {/* Declaration 3 */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={declarations.understandNoGuarantee}
              onChange={(e) => onDeclarationsChange({ understandNoGuarantee: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-slate-300 group-hover:text-white transition-colors">
              I understand that submitting an application does not guarantee appointment or an interview invitation.
            </span>
          </label>

          {/* Declaration 4 */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={declarations.consentDataProcessing}
              onChange={(e) => onDeclarationsChange({ consentDataProcessing: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-slate-300 group-hover:text-white transition-colors">
              I consent to the collection and processing of my submitted information for recruitment evaluation purposes in accordance with the{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-indigo-400 underline hover:text-indigo-300 inline"
              >
                Recruitment Privacy Notice
              </button>
              .
            </span>
          </label>
        </div>
      </div>

      {/* Submission Error Banner */}
      {submissionError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-rose-200">Submission Transmission Issue:</strong>
            <span>{submissionError}</span>
            <span className="block mt-1 text-slate-400">
              Your answers have been preserved. You can safely try submitting again.
            </span>
          </div>
        </div>
      )}

      {/* Final Action Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Scenarios</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !allDeclarationsChecked}
          className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 flex items-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting Application...</span>
            </>
          ) : (
            <>
              <span>Submit Staff Application</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
