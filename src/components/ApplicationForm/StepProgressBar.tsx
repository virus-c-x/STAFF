import React from 'react';
import { Check } from 'lucide-react';
import { PositionType } from '../../types/application';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  position: PositionType | '';
  onStepClick?: (step: number) => void;
  maxReachedStep: number;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  position,
  onStepClick,
  maxReachedStep,
}) => {
  const steps = [
    { num: 1, label: 'Applicant Profile' },
    { num: 2, label: 'Position Track' },
    { num: 3, label: 'General Ethics' },
    {
      num: 4,
      label: position === 'administrator' ? 'Admin Scenarios' : 'Moderator Scenarios',
    },
    { num: 5, label: 'Review & Submit' },
  ];

  return (
    <div className="w-full bg-[#0C0E14]/80 backdrop-blur-md border border-amber-500/20 rounded-xl p-4 sm:p-5 mb-8 shadow-lg">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        {steps.map((st, idx) => {
          const isCompleted = currentStep > st.num;
          const isActive = currentStep === st.num;
          const isClickable = onStepClick && st.num <= maxReachedStep;

          return (
            <React.Fragment key={st.num}>
              {/* Step Node */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick(st.num)}
                disabled={!isClickable}
                className={`flex items-center gap-2.5 text-left shrink-0 transition-opacity ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                } ${isActive ? 'opacity-100' : isCompleted ? 'opacity-90' : 'opacity-40'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold font-mono transition-all ${
                    isCompleted
                      ? 'bg-amber-400 text-black font-bold shadow-sm shadow-amber-500/30'
                      : isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-400/60 shadow-sm shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-500 border border-white/5'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.num}
                </div>
                <div className="hidden sm:block">
                  <span
                    className={`block text-xs font-medium ${
                      isActive ? 'text-amber-200 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              </button>

              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 min-w-[16px] h-0.5 mx-2 transition-colors ${
                    currentStep > st.num ? 'bg-amber-500/60' : 'bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
