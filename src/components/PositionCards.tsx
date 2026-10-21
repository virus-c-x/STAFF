import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { ROLE_DETAILS } from '../lib/questions';
import { PositionType } from '../types/application';

interface PositionCardsProps {
  onSelectPosition: (position: PositionType) => void;
  isRecruitmentOpen: boolean;
}

export const PositionCards: React.FC<PositionCardsProps> = ({
  onSelectPosition,
  isRecruitmentOpen,
}) => {
  const [modImgLoaded, setModImgLoaded] = useState(false);
  const [adminImgLoaded, setAdminImgLoaded] = useState(false);

  const mod = ROLE_DETAILS.moderator;
  const admin = ROLE_DETAILS.administrator;

  return (
    <section id="positions" className="py-16 md:py-20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-2">
            Available Positions
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Select your leadership track
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Carefully review the responsibilities and eligibility criteria for each position. Choose the track where your experience and availability best align with community needs.
          </p>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Moderator Card */}
          <div className="bg-[#0E121B] border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-200">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-indigo-400 font-mono mb-1">{mod.badgeSubtitle}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{mod.title}</h3>
                </div>
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shrink-0">
                  <img
                    src={mod.imageSrc}
                    alt="Community Moderator Emblem"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      modImgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setModImgLoaded(true)}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {mod.summary}
              </p>

              {/* Responsibilities */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
                  Key Responsibilities
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {mod.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eligibility */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
                  Eligibility Requirements
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {mod.eligibility.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 shrink-0">·</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action */}
            <div className="pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={() => onSelectPosition('moderator')}
                disabled={!isRecruitmentOpen}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Apply as Community Moderator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Administrator Card */}
          <div className="bg-[#0E121B] border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-purple-500/50 transition-all duration-200">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-purple-400 font-mono mb-1">{admin.badgeSubtitle}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{admin.title}</h3>
                </div>
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shrink-0">
                  <img
                    src={admin.imageSrc}
                    alt="Server Administrator Emblem"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      adminImgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setAdminImgLoaded(true)}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {admin.summary}
              </p>

              {/* Crucial Scope Disclaimer */}
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Governance Scope:</strong> Administrators oversee operational escalations and staff coordination. This role does not grant automatic financial, server ownership, or technical root privileges.
                </span>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
                  Key Responsibilities
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {admin.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eligibility */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
                  Eligibility Requirements
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {admin.eligibility.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-400 shrink-0">·</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action */}
            <div className="pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={() => onSelectPosition('administrator')}
                disabled={!isRecruitmentOpen}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Apply as Server Administrator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
