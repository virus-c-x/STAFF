import React from 'react';
import { GeneralAnswers } from '../../types/application';
import { GENERAL_QUESTIONS } from '../../lib/questions';
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface Step3GeneralQuestionsProps {
  answers: GeneralAnswers;
  onChange: (field: keyof GeneralAnswers, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
}

export const Step3GeneralQuestions: React.FC<Step3GeneralQuestionsProps> = ({
  answers,
  onChange,
  onNext,
  onBack,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-white">Step 3 — General Staff Questions</h3>
        <p className="text-xs text-slate-400 mt-1">
          These 10 questions evaluate core readiness, ethical judgment, composure, and alignment with our community principles. Please answer thoroughly in your own words.
        </p>
      </div>

      <div className="space-y-6">
        {GENERAL_QUESTIONS.map((q, idx) => {
          const fieldKey = q.field as keyof GeneralAnswers;
          const val = answers[fieldKey] || '';
          const charCount = val.trim().length;
          const isMinMet = charCount >= q.minChars;
          const hasError = !!errors[fieldKey];

          return (
            <div
              key={q.id}
              className="bg-[#0E121B] border border-slate-800 rounded-xl p-5 space-y-3 focus-within:border-indigo-500/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white leading-snug">
                    {q.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{q.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-mono font-medium ${
                      isMinMet ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {charCount} / min {q.minChars}
                  </span>
                </div>
              </div>

              {/* Evaluation Focus Badge (Unboxed clean text) */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800/80">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>
                  <strong className="text-slate-300">Focus:</strong> {q.evaluationFocus}
                </span>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={val}
                  onChange={(e) => onChange(fieldKey, e.target.value)}
                  maxLength={q.maxChars}
                  placeholder="Provide your detailed answer here..."
                  className={`w-full bg-slate-950 border rounded-lg p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                    hasError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>

              {hasError && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors[fieldKey]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Position</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
        >
          <span>Continue to Role Scenarios</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
