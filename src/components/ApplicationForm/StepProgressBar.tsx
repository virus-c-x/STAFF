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
    { num: 1, label: 'Applicant Info' },
    { num: 2, label: 'Position Selection' },
    { num: 3, label: 'General Questions' },
    {
      num: 4,
      label: position === 'administrator' ? 'Admin Scenarios' : 'Moderator Scenarios',
    },
    { num: 5, label: 'Review & Declarations' },
  ];

  return (
    <div className="w-full bg-[#0E121B] border border-slate-800 rounded-xl p-4 sm:p-5 mb-8">
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
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold font-mono transition-colors ${
                    isCompleted
                      ? 'bg-indigo-600 text-white'
                      : isActive
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : st.num}
                </div>
                <div className="hidden sm:block">
                  <span
                    className={`block text-xs font-medium ${
                      isActive ? 'text-white' : 'text-slate-400'
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
                    currentStep > st.num ? 'bg-indigo-600/70' : 'bg-slate-800'
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
