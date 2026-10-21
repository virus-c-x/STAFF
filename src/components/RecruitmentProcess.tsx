import React from 'react';
import { FileText, Search, Award, MessageSquare } from 'lucide-react';

export const RecruitmentProcess: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Online Application & Submission',
      desc: 'Submit your community profile, weekly availability, and written responses through this portal. A unique non-sequential reference code is issued immediately upon receipt.',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Preliminary Screening',
      desc: 'Recruitment coordinators verify community standing, age eligibility, absence of recent disciplinary sanctions, and timezone coverage requirements.',
      icon: Search,
    },
    {
      num: '03',
      title: 'Blind Scenario Rubric Evaluation',
      desc: 'Scenario and situational answers are reviewed against structured rubrics assessing de-escalation, conflict resolution, impartiality, and operational judgment.',
      icon: Award,
    },
    {
      num: '04',
      title: 'Voice Interview & Cohort Onboarding',
      desc: 'Shortlisted candidates participate in a 20-minute voice interview to discuss team dynamics, followed by guided permissions setup and shadowing senior staff.',
      icon: MessageSquare,
    },
  ];

  return (
    <section id="process" className="py-16 md:py-20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-2">
            Selection Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How our recruitment process works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Every candidate is evaluated through a fair, transparent, and multi-stage evaluation pipeline to ensure safety, consistency, and alignment with server standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="bg-[#0E121B] border border-slate-800 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold font-mono text-indigo-400">
                      {st.num}
                    </span>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
