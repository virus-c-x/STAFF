import React, { useState } from 'react';
import { ApplicantInfo, AgeRangeOption, AvailabilityOption } from '../../types/application';
import {
  AGE_RANGE_OPTIONS,
  AVAILABILITY_OPTIONS,
  COMMON_LANGUAGES,
  COMMON_TIMEZONES,
} from '../../lib/questions';
import { AlertCircle, Plus, X, ArrowRight } from 'lucide-react';

interface Step1ApplicantInfoProps {
  data: ApplicantInfo;
  onChange: (updated: Partial<ApplicantInfo>) => void;
  onNext: () => void;
  errors: Record<string, string>;
}

export const Step1ApplicantInfo: React.FC<Step1ApplicantInfoProps> = ({
  data,
  onChange,
  onNext,
  errors,
}) => {
  const [customLanguage, setCustomLanguage] = useState('');

  const toggleLanguage = (lang: string) => {
    const current = [...data.languages];
    const index = current.indexOf(lang);
    if (index >= 0) {
      if (current.length > 1) {
        current.splice(index, 1);
        onChange({ languages: current });
      }
    } else {
      current.push(lang);
      onChange({ languages: current });
    }
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customLanguage.trim();
    if (!trimmed) return;
    if (!data.languages.includes(trimmed)) {
      onChange({
        languages: [...data.languages, trimmed],
        otherLanguage: trimmed,
      });
    }
    setCustomLanguage('');
  };

  const removeLanguage = (lang: string) => {
    if (data.languages.length <= 1) return;
    onChange({
      languages: data.languages.filter((l) => l !== lang),
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-amber-400 font-mono text-sm tracking-wider">01.</span>
          <span>Applicant Profile & Availability</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Provide your community identifiers and schedule. We do not ask for passwords or private authentication tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Display Name */}
        <div>
          <label htmlFor="displayName" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Display Name <span className="text-amber-400">*</span>
          </label>
          <input
            id="displayName"
            type="text"
            placeholder="e.g. Alex, NexusLead"
            value={data.displayName}
            onChange={(e) => onChange({ displayName: e.target.value })}
            maxLength={50}
            className={`w-full bg-[#08090E] border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
              errors.displayName
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
            }`}
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span>Known name within the community</span>
            <span className="font-mono">{data.displayName.length}/50</span>
          </div>
          {errors.displayName && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.displayName}
            </p>
          )}
        </div>

        {/* 2. Platform Username */}
        <div>
          <label htmlFor="platformUsername" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Platform Username <span className="text-amber-400">*</span>
          </label>
          <input
            id="platformUsername"
            type="text"
            placeholder="e.g. alex_mod or alex#1234"
            value={data.platformUsername}
            onChange={(e) => onChange({ platformUsername: e.target.value })}
            maxLength={50}
            className={`w-full bg-[#08090E] border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
              errors.platformUsername
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
            }`}
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span>Your handle on the server platform</span>
            <span className="font-mono">{data.platformUsername.length}/50</span>
          </div>
          {errors.platformUsername && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.platformUsername}
            </p>
          )}
        </div>

        {/* 3. Platform User ID */}
        <div>
          <label htmlFor="platformUserId" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Platform User ID <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            id="platformUserId"
            type="text"
            placeholder="e.g. 18-digit Discord User ID"
            value={data.platformUserId}
            onChange={(e) => onChange({ platformUserId: e.target.value })}
            maxLength={30}
            className="w-full bg-[#08090E] border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 font-mono text-xs"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            If Discord is used, right-click your profile in Developer Mode to copy User ID.
          </p>
        </div>

        {/* 4. Age Range */}
        <div>
          <label htmlFor="ageRange" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Age Bracket <span className="text-amber-400">*</span>
          </label>
          <select
            id="ageRange"
            value={data.ageRange}
            onChange={(e) => onChange({ ageRange: e.target.value as AgeRangeOption })}
            className={`w-full bg-[#08090E] border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
              errors.ageRange
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
            }`}
          >
            <option value="">Select your age range</option>
            {AGE_RANGE_OPTIONS.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1">
            Confirmed for appointment criteria (Moderator 16+, Administrator 18+).
          </p>
          {errors.ageRange && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.ageRange}
            </p>
          )}
        </div>

        {/* 5. Time Zone */}
        <div>
          <label htmlFor="timeZone" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Time Zone <span className="text-amber-400">*</span>
          </label>
          <select
            id="timeZone"
            value={data.timeZone}
            onChange={(e) => onChange({ timeZone: e.target.value })}
            className={`w-full bg-[#08090E] border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
              errors.timeZone
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
            }`}
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1">
            Used to plan moderation shift rosters and round-the-clock safety coverage.
          </p>
          {errors.timeZone && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.timeZone}
            </p>
          )}
        </div>

        {/* 6. Contact Method */}
        <div>
          <label htmlFor="contactMethod" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Primary Contact Method <span className="text-amber-400">*</span>
          </label>
          <input
            id="contactMethod"
            type="text"
            placeholder="e.g. Discord DM, Telegram, or Email"
            value={data.contactMethod}
            onChange={(e) => onChange({ contactMethod: e.target.value })}
            maxLength={80}
            className={`w-full bg-[#08090E] border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
              errors.contactMethod
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
            }`}
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Where recruitment coordinators can reach you regarding status and interview.
          </p>
          {errors.contactMethod && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.contactMethod}
            </p>
          )}
        </div>
      </div>

      {/* 7. Weekly Availability */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          Weekly Availability (Hours per week) <span className="text-amber-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {AVAILABILITY_OPTIONS.map((opt) => {
            const isSelected = data.weeklyAvailability === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => onChange({ weeklyAvailability: opt })}
                className={`p-3 text-xs rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-400/80 bg-amber-500/15 text-white font-medium shadow-md shadow-amber-500/10'
                    : 'border-slate-800 bg-[#08090E] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-white mb-0.5">{opt.split(' ')[0]}</div>
                <div className="text-[11px] text-slate-400">hours / week</div>
              </button>
            );
          })}
        </div>
        {errors.weeklyAvailability && (
          <p className="text-xs text-rose-400 flex items-center gap-1 mt-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.weeklyAvailability}
          </p>
        )}
      </div>

      {/* 8. Languages Spoken */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-300">
          Languages Spoken <span className="text-amber-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_LANGUAGES.map((lang) => {
            const isSelected = data.languages.includes(lang);
            return (
              <button
                type="button"
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  isSelected
                    ? 'border-amber-400/80 bg-amber-500/15 text-amber-300 font-medium'
                    : 'border-slate-800 bg-[#08090E] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>

        {/* Selected Custom Languages list */}
        {data.languages.filter((l) => !COMMON_LANGUAGES.includes(l)).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {data.languages
              .filter((l) => !COMMON_LANGUAGES.includes(l))
              .map((l) => (
                <span
                  key={l}
                  className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5"
                >
                  {l}
                  <button
                    type="button"
                    onClick={() => removeLanguage(l)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
          </div>
        )}

        {/* Custom Language Input */}
        <div className="flex gap-2 max-w-sm pt-1">
          <input
            type="text"
            placeholder="Add another language..."
            value={customLanguage}
            onChange={(e) => setCustomLanguage(e.target.value)}
            className="flex-1 bg-[#08090E] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
          />
          <button
            type="button"
            onClick={handleAddCustomLanguage}
            disabled={!customLanguage.trim()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
        {errors.languages && (
          <p className="text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.languages}
          </p>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="flex justify-end pt-6 border-t border-white/5">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
        >
          <span>Continue to Position Selection</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
