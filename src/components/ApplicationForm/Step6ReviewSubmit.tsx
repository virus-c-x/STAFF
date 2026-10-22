import React from 'react';
import {
  ApplicationFormData,
  DeclarationsConsent,
} from '../../types/application';
import {
  GENERAL_QUESTIONS,
  MODERATOR_QUESTIONS,
  ADMINISTRATOR_QUESTIONS,
} from '../../lib/questions';
import {
  ArrowLeft,
  AlertCircle,
  Edit2,
  FileCheck,
  Send,
  Loader2,
  ShieldCheck,
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
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-amber-400 font-mono text-sm tracking-wider">05.</span>
          <span>Final Review & Formal Declarations</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Review your profile and written scenario responses. You can click Edit on any section to return and revise before submitting.
        </p>
      </div>

      {/* Summary Card 1: Applicant Profile */}
      <div className="bg-[#090B11] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 font-semibold tracking-wider">SECTION 1</span>
            <span className="text-sm font-semibold text-white">Applicant Profile</span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(1)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
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
            <span className="text-slate-500 block mb-0.5">Platform Handle</span>
            <span className="text-slate-200 font-medium">{applicantInfo.platformUsername}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Platform User ID</span>
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

      {/* Summary Card 2: Position Track */}
      <div className="bg-[#090B11] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 font-semibold tracking-wider">SECTION 2</span>
            <span className="text-sm font-semibold text-white">Target Position Track</span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(2)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
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
          <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-md">
            Eligibility Confirmed
          </span>
        </div>
      </div>

      {/* Summary Card 3: General Questions */}
      <div className="bg-[#090B11] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 font-semibold tracking-wider">SECTION 3</span>
            <span className="text-sm font-semibold text-white">General Ethics & Judgment (10 Answers)</span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(3)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-3">
          {GENERAL_QUESTIONS.map((q) => {
            const val = generalAnswers[q.field as keyof typeof generalAnswers] || '';
            return (
              <div key={q.id} className="text-xs p-3 bg-[#06070B] rounded-lg border border-white/5 space-y-1">
                <span className="font-semibold text-white block">{q.title}</span>
                <p className="text-slate-300 whitespace-pre-line line-clamp-3 leading-relaxed">
                  {val}
                </p>
                <div className="text-[11px] text-slate-500 text-right font-mono">{val.length} chars</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Card 4: Role Questions */}
      <div className="bg-[#090B11] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 font-semibold tracking-wider">SECTION 4</span>
            <span className="text-sm font-semibold text-white capitalize">
              {position} Scenario Questions ({roleQuestions.length} Answers)
            </span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(4)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-3">
          {roleQuestions.map((q) => {
            const val = (roleAnswers as any)[q.field] || '';
            return (
              <div key={q.id} className="text-xs p-3 bg-[#06070B] rounded-lg border border-white/5 space-y-1">
                <span className="font-semibold text-white block">{q.title}</span>
                <p className="text-slate-300 whitespace-pre-line line-clamp-3 leading-relaxed">
                  {val}
                </p>
                <div className="text-[11px] text-slate-500 text-right font-mono">{val.length} chars</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: Mandatory Declarations */}
      <div className="bg-[#090B11] border border-amber-500/25 rounded-xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <FileCheck className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-semibold text-white">Mandatory Candidate Declarations</h4>
        </div>

        <p className="text-xs text-slate-400">
          Confirm the following four declarations prior to final submission:
        </p>

        <div className="space-y-3 text-xs">
          {/* Declaration 1 */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={declarations.accurateInfo}
              onChange={(e) => onDeclarationsChange({ accurateInfo: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
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
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
            />
            <span className="text-slate-300 group-hover:text-white transition-colors">
              I have read and agree to follow all{' '}
              <button
                type="button"
                onClick={onOpenRules}
                className="text-amber-400 underline hover:text-amber-300 inline"
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
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
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
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
            />
            <span className="text-slate-300 group-hover:text-white transition-colors">
              I consent to the collection and processing of my submitted information for recruitment evaluation purposes in accordance with the{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-amber-400 underline hover:text-amber-300 inline"
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
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
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
          className="px-8 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-40 disabled:pointer-events-none text-black text-xs sm:text-sm font-bold rounded-lg transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
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
