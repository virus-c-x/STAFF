import React, { useState } from 'react';
import { Star, MessageSquare, ShieldCheck, Send, User } from 'lucide-react';
import { ReviewerNoteItem } from '../../types/admin';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { addReviewerNote } from '../../lib/supabase';

interface ReviewerNotesSectionProps {
  applicationId: string;
  notes: ReviewerNoteItem[];
  onNoteAdded: (note: ReviewerNoteItem) => void;
}

export const ReviewerNotesSection: React.FC<ReviewerNotesSectionProps> = ({
  applicationId,
  notes,
  onNoteAdded,
}) => {
  const { adminUser } = useAdminAuth();
  const [content, setContent] = useState('');
  const [overallRating, setOverallRating] = useState<number>(4);
  const [scoreDeEscalation, setScoreDeEscalation] = useState<number>(4);
  const [scoreIntegrity, setScoreIntegrity] = useState<number>(5);
  const [scoreComposure, setScoreComposure] = useState<number>(4);
  const [scoreLeadership, setScoreLeadership] = useState<number>(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !adminUser) return;

    setIsSubmitting(true);
    try {
      const res = await addReviewerNote({
        application_id: applicationId,
        author_id: adminUser.id,
        author_name: adminUser.display_name,
        author_role: adminUser.role,
        note_content: content.trim(),
        rating_score: overallRating,
        score_de_escalation: scoreDeEscalation,
        score_integrity: scoreIntegrity,
        score_composure: scoreComposure,
        score_leadership: scoreLeadership,
      });

      if (res.success && res.note) {
        onNoteAdded(res.note);
        setContent('');
      }
    } catch (err) {
      console.error('Error adding reviewer note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Notes Feed */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>Confidential Reviewer Thread ({notes.length})</span>
        </h4>

        {notes.length === 0 ? (
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-500 text-center">
            No internal evaluation notes recorded yet for this dossier.
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-black/40 border border-amber-500/15 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                      {note.author_name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white">
                        {note.author_name}
                      </span>
                      <span className="text-[10px] text-amber-400/80 font-mono ml-2 uppercase">
                        [{note.author_role || 'Staff'}]
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {note.rating_score && (
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < note.rating_score!
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {note.note_content}
                </p>

                {/* Competency Score Indicators */}
                {(note.score_de_escalation || note.score_integrity) && (
                  <div className="pt-2 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    <div className="bg-white/[0.02] p-1.5 rounded border border-white/5 flex justify-between">
                      <span className="text-slate-400">De-escalation:</span>
                      <span className="font-mono text-amber-300">{note.score_de_escalation}/5</span>
                    </div>
                    <div className="bg-white/[0.02] p-1.5 rounded border border-white/5 flex justify-between">
                      <span className="text-slate-400">Integrity:</span>
                      <span className="font-mono text-amber-300">{note.score_integrity}/5</span>
                    </div>
                    <div className="bg-white/[0.02] p-1.5 rounded border border-white/5 flex justify-between">
                      <span className="text-slate-400">Composure:</span>
                      <span className="font-mono text-amber-300">{note.score_composure}/5</span>
                    </div>
                    <div className="bg-white/[0.02] p-1.5 rounded border border-white/5 flex justify-between">
                      <span className="text-slate-400">Leadership:</span>
                      <span className="font-mono text-amber-300">{note.score_leadership}/5</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-black/50 border border-amber-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Add Internal Evaluation & Score</span>
          </span>

          <button
            type="button"
            onClick={() => setShowScoreCard(!showScoreCard)}
            className="text-[11px] text-slate-400 hover:text-amber-300 underline"
          >
            {showScoreCard ? 'Hide Competency Sliders' : 'Show Competency Sliders'}
          </button>
        </div>

        {/* Competency Ratings Grid */}
        {showScoreCard && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-black/40 border border-white/5">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">De-escalation & Resolution:</span>
                <span className="text-amber-400 font-mono font-bold">{scoreDeEscalation} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={scoreDeEscalation}
                onChange={(e) => setScoreDeEscalation(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Integrity & Confidentiality:</span>
                <span className="text-amber-400 font-mono font-bold">{scoreIntegrity} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={scoreIntegrity}
                onChange={(e) => setScoreIntegrity(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Composure Under Provocation:</span>
                <span className="text-amber-400 font-mono font-bold">{scoreComposure} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={scoreComposure}
                onChange={(e) => setScoreComposure(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Leadership & Teamwork:</span>
                <span className="text-amber-400 font-mono font-bold">{scoreLeadership} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={scoreLeadership}
                onChange={(e) => setScoreLeadership(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        <div>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Record confidential feedback, interview observations, or background verification notes (never shared with candidate)..."
            className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 mr-2">Overall Recommendation:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setOverallRating(star)}
                className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
              >
                <Star
                  className={`w-4 h-4 ${
                    star <= overallRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Note</span>
          </button>
        </div>
      </form>
    </div>
  );
};
