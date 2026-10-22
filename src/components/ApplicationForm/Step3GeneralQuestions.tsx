import React from 'react';
import { GeneralAnswers } from '../../types/application';
import { GENERAL_QUESTIONS } from '../../lib/questions';
import { ArrowLeft, ArrowRight, AlertCircle, HelpCircle } from 'lucide-react';

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
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-amber-400 font-mono text-sm tracking-wider">03.</span>
          <span>General Staff Questions (10 Scenarios)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          These 10 questions evaluate core readiness, ethical judgment, composure, and alignment with our community standards. Answer thoroughly in your own words.
        </p>
      </div>

      <div className="space-y-6">
        {GENERAL_QUESTIONS.map((q) => {
          const fieldKey = q.field as keyof GeneralAnswers;
          const val = answers[fieldKey] || '';
          const charCount = val.trim().length;
          const isMinMet = charCount >= q.minChars;
          const hasError = !!errors[fieldKey];

          return (
            <div
              key={q.id}
              className="bg-[#090B11] border border-slate-800/80 rounded-xl p-5 space-y-3 focus-within:border-amber-400/70 transition-colors shadow-sm"
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
                      isMinMet ? 'text-amber-400 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {charCount} / min {q.minChars}
                  </span>
                </div>
              </div>

              {/* Evaluation Focus Badge */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-amber-500/[0.04] px-2.5 py-1 rounded-md border border-amber-500/15">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-amber-300/90 font-medium">Evaluation Focus:</strong> {q.evaluationFocus}
                </span>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={val}
                  onChange={(e) => onChange(fieldKey, e.target.value)}
                  maxLength={q.maxChars}
                  placeholder="Provide your detailed answer here..."
                  className={`w-full bg-[#06070B] border rounded-lg p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                    hasError
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
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
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
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
          className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
        >
          <span>Continue to Role Scenarios</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
