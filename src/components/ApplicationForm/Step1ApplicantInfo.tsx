import React, { useState, useRef, useEffect } from 'react';
import { ApplicantInfo, AgeRangeOption } from '../../types/application';
import {
  AGE_RANGE_OPTIONS,
  AVAILABILITY_OPTIONS,
  COMMON_LANGUAGES,
} from '../../lib/questions';
import { COUNTRIES, CountryItem } from '../../lib/countries';
import {
  AlertCircle,
  Plus,
  X,
  ArrowRight,
  Search,
  ChevronDown,
  Globe,
  Check,
  Mail,
  MessageSquare,
} from 'lucide-react';

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
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const countrySearchInputRef = useRef<HTMLInputElement>(null);

  // Close country dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isCountryDropdownOpen && countrySearchInputRef.current) {
      countrySearchInputRef.current.focus();
    }
  }, [isCountryDropdownOpen]);

  const selectedCountryName = data.country || data.timeZone || '';
  const selectedCountryObj = COUNTRIES.find(
    (c) => c.name.toLowerCase() === selectedCountryName.toLowerCase()
  );

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSelectCountry = (country: CountryItem) => {
    onChange({ country: country.name, timeZone: country.name });
    setIsCountryDropdownOpen(false);
    setCountrySearch('');
  };

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

  const isGmailSelected = (data.contactMethod || '').toLowerCase() === 'gmail';

  return (
    <div className="space-y-6">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-amber-400 font-mono text-sm tracking-wider">01.</span>
          <span>Applicant Profile & Availability</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Provide your applicant identifiers, country, and schedule. We do not ask for passwords or private authentication tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Full name (renamed from Display Name) */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Full name <span className="text-amber-400">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="e.g. Alex Morgan"
            value={data.displayName}
            onChange={(e) => onChange({ displayName: e.target.value })}
            maxLength={60}
            className={`w-full bg-[#08090E] border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
              errors.displayName
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
            }`}
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span>Your formal candidate or display name</span>
            <span className="font-mono">{data.displayName.length}/60</span>
          </div>
          {errors.displayName && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.displayName}
            </p>
          )}
        </div>

        {/* 2. Discord username (renamed from Platform Username) */}
        <div>
          <label htmlFor="discordUsername" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Discord username <span className="text-amber-400">*</span>
          </label>
          <input
            id="discordUsername"
            type="text"
            placeholder="e.g. alex_moderator or alex#1234"
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
            <span>Your Discord handle / username</span>
            <span className="font-mono">{data.platformUsername.length}/50</span>
          </div>
          {errors.platformUsername && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.platformUsername}
            </p>
          )}
        </div>

        {/* 3. Discord ID (renamed from Platform User ID) */}
        <div>
          <label htmlFor="discordId" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Discord ID <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            id="discordId"
            type="text"
            placeholder="e.g. 18-digit Discord ID (712345678901234567)"
            value={data.platformUserId}
            onChange={(e) => onChange({ platformUserId: e.target.value })}
            maxLength={30}
            className="w-full bg-[#08090E] border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 font-mono text-xs"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Right-click your profile in Discord (Developer Mode enabled) to copy User ID.
          </p>
        </div>

        {/* 4. Age bracket */}
        <div>
          <label htmlFor="ageRange" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Age bracket <span className="text-amber-400">*</span>
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

        {/* 5. Country (Replaces Time zone entirely with searchable custom dark dropdown panel) */}
        <div className="relative" ref={countryDropdownRef}>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Country <span className="text-amber-400">*</span>
          </label>

          {/* Trigger button */}
          <button
            type="button"
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            className={`w-full bg-[#08090E] border rounded-lg px-3.5 py-2.5 text-sm text-left flex items-center justify-between transition-colors cursor-pointer ${
              errors.country
                ? 'border-rose-500'
                : isCountryDropdownOpen
                ? 'border-amber-400 ring-1 ring-amber-400/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
            aria-haspopup="listbox"
            aria-expanded={isCountryDropdownOpen}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {selectedCountryObj ? (
                <>
                  <span className="text-base leading-none">{selectedCountryObj.flag}</span>
                  <span className="text-white truncate font-medium">{selectedCountryObj.name}</span>
                  <span className="text-slate-500 text-xs font-mono">({selectedCountryObj.code})</span>
                </>
              ) : selectedCountryName ? (
                <>
                  <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-white truncate font-medium">{selectedCountryName}</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="text-slate-500">Select your country...</span>
                </>
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                isCountryDropdownOpen ? 'rotate-180 text-amber-400' : ''
              }`}
            />
          </button>

          <p className="text-[11px] text-slate-500 mt-1">
            Used to balance global moderation shift rosters and regional coverage.
          </p>

          {errors.country && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.country}
            </p>
          )}

          {/* In-page Searchable Dropdown Panel */}
          {isCountryDropdownOpen && (
            <div className="absolute z-50 left-0 right-0 mt-2 bg-[#0C0E17] border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-dropdown">
              {/* Search Bar */}
              <div className="p-2.5 border-b border-white/5 bg-[#090B12]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={countrySearchInputRef}
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search country by name or code..."
                    className="w-full bg-[#121522] border border-slate-700/80 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  {countrySearch && (
                    <button
                      type="button"
                      onClick={() => setCountrySearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable list */}
              <div className="max-h-56 overflow-y-auto divide-y divide-white/[0.03]">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => {
                    const isSelected =
                      selectedCountryName.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={c.code}
                        onClick={() => handleSelectCountry(c)}
                        className={`w-full px-3.5 py-2 text-xs flex items-center justify-between text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-200 font-semibold'
                            : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-base leading-none">{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({c.code})</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No country found matching "{countrySearch}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 6. Primary Contact Method * (with conditional Gmail input) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Primary Contact Method <span className="text-amber-400">*</span>
          </label>

          {/* Quick Choice Buttons: Discord or Gmail */}
          <div className="grid grid-cols-2 gap-2 mb-2.5">
            <button
              type="button"
              onClick={() => onChange({ contactMethod: 'Discord' })}
              className={`px-3 py-2 text-xs rounded-lg border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !isGmailSelected
                  ? 'border-amber-400/80 bg-amber-500/15 text-white font-semibold shadow-sm'
                  : 'border-slate-800 bg-[#08090E] text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Discord DM</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ contactMethod: 'Gmail' })}
              className={`px-3 py-2 text-xs rounded-lg border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isGmailSelected
                  ? 'border-amber-400/80 bg-amber-500/15 text-white font-semibold shadow-sm'
                  : 'border-slate-800 bg-[#08090E] text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Gmail / Email</span>
            </button>
          </div>

          {/* Conditional Email Field when Gmail is chosen */}
          {isGmailSelected ? (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label htmlFor="contactEmail" className="block text-[11px] font-semibold text-amber-300/90">
                Enter your Gmail address <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="contactEmail"
                  type="email"
                  placeholder="e.g. username@gmail.com"
                  value={data.contactEmail || ''}
                  onChange={(e) => onChange({ contactEmail: e.target.value })}
                  maxLength={100}
                  className={`w-full bg-[#08090E] border rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                    errors.contactEmail
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-amber-500/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Recruitment leads will send scheduling communications to this address.
              </p>
              {errors.contactEmail && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.contactEmail}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              We will reach out directly to your <strong className="text-slate-300">Discord username</strong> provided above.
            </p>
          )}

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
                className={`p-3 text-xs rounded-xl border text-left transition-all cursor-pointer ${
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
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
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
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
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
          className="Btn gap-2 shrink-0 shadow-md shadow-amber-500/20"
        >
          <span>Continue to Position Selection</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
