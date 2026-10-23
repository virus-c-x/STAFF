import React, { useState } from 'react';
import { Search, UserCheck, AlertTriangle, History, ArrowRight, Shield } from 'lucide-react';
import { CandidateHistorySummary } from '../../types/admin';
import { searchCandidateHistory, fetchApplicationDetail } from '../../lib/supabase';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { StoredApplicationRecord } from '../../types/application';

export const CandidateHistorySearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CandidateHistorySummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Detail Modal for viewing selected historic submission
  const [selectedApp, setSelectedApp] = useState<StoredApplicationRecord | null>(null);
  const [appNotes, setAppNotes] = useState<any[]>([]);
  const [appHistory, setAppHistory] = useState<any[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await searchCandidateHistory(query);
      setResults(data);
    } catch (err) {
      console.error('Candidate history search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewSubmission = async (appId: string) => {
    try {
      const detail = await fetchApplicationDetail(appId);
      if (detail.application) {
        setSelectedApp(detail.application);
        setAppNotes(detail.notes);
        setAppHistory(detail.history);
        setIsDetailOpen(true);
      }
    } catch (err) {
      console.error('Failed to open candidate history item:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">
          Applicant History Search
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Search for prior submissions and applicant records across recruitment cycles.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Discord handle, user ID, display name, or contact email..."
            className="w-full pl-10 pr-24 py-2.5 bg-black/60 border border-white/10 focus:border-amber-400/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Matching Applicant Profiles ({results.length})
          </div>

          {results.length === 0 ? (
            <div className="p-10 rounded-2xl bg-[#090B12] border border-white/5 text-center space-y-2">
              <p className="text-xs text-slate-400">No cross-cycle records found for "{query}".</p>
              <p className="text-[11px] text-slate-500">
                This applicant appears to have no prior submissions in this recruitment portal.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((candidate, idx) => {
                const isRepeat = candidate.applications.length > 1;
                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl bg-[#090B12] border transition-all ${
                      isRepeat ? 'border-amber-500/35 shadow-lg' : 'border-white/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white">
                            {candidate.applicant_display_name}
                          </span>
                          <span className="text-xs font-mono text-amber-300">
                            {candidate.platform_username}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Contact: <span className="text-slate-300 font-mono">{candidate.contact_method}</span>
                        </div>
                      </div>

                      {isRepeat && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Multiple Submissions ({candidate.applications.length})</span>
                        </div>
                      )}
                    </div>

                    {/* Applications List */}
                    <div className="pt-4 space-y-2.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Submission History
                      </span>

                      <div className="space-y-2">
                        {candidate.applications.map((app) => (
                          <div
                            key={app.id}
                            className="p-3 rounded-xl bg-black/50 border border-white/5 hover:border-amber-400/30 flex items-center justify-between gap-4 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-amber-300 font-bold">
                                {app.reference_code}
                              </span>
                              <span className="text-xs text-white uppercase font-mono">
                                {app.position}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {new Date(app.created_at).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                                {app.status.replace('_', ' ')}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleViewSubmission(app.id)}
                                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                              >
                                <span>Inspect</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          notes={appNotes}
          history={appHistory}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onStatusUpdated={() => {}}
          onNoteAdded={(newNote) => setAppNotes([newNote, ...appNotes])}
        />
      )}
    </div>
  );
};
