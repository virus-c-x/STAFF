import React, { useState, useEffect } from 'react';
import {
  FileQuestion,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle2,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { GENERAL_QUESTIONS, QuestionDefinition } from '../../lib/questions';

const STORAGE_KEY_CUSTOM_QUESTIONS = 'staff_recruitment_custom_questions';

interface FormBuilderTabProps {
  currentAdminEmail: string;
}

export const FormBuilderTab: React.FC<FormBuilderTabProps> = ({ currentAdminEmail }) => {
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'moderator' | 'administrator'>('general');
  const [questions, setQuestions] = useState<QuestionDefinition[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editMin, setEditMin] = useState(40);
  const [editMax, setEditMax] = useState(1500);

  // Add question state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMin, setNewMin] = useState(40);
  const [newMax, setNewMax] = useState(1500);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadCategoryQuestions(selectedCategory);
  }, [selectedCategory]);

  const loadCategoryQuestions = (cat: 'general' | 'moderator' | 'administrator') => {
    const raw = localStorage.getItem(`${STORAGE_KEY_CUSTOM_QUESTIONS}_${cat}`);
    if (raw) {
      try {
        setQuestions(JSON.parse(raw));
        return;
      } catch (e) {
        console.error('Failed to parse stored questions', e);
      }
    }

    // Default to questions from code
    if (cat === 'general') {
      setQuestions([...GENERAL_QUESTIONS]);
    } else {
      // Create representative role scenario questions
      setQuestions([
        {
          id: `${cat}-1`,
          field: `${cat}_q1`,
          title: `1. Core competency scenario for ${cat}`,
          description: 'Detailed candidate response to high-priority operational challenge.',
          minChars: 50,
          maxChars: 1500,
          evaluationFocus: 'Composure and adherence to rule frameworks.',
        },
        {
          id: `${cat}-2`,
          field: `${cat}_q2`,
          title: `2. Conflict resolution and protocol adherence`,
          description: 'How would you navigate ambiguity in community guidelines?',
          minChars: 50,
          maxChars: 1500,
          evaluationFocus: 'Impartial judgment.',
        },
      ]);
    }
  };

  const saveQuestions = (updated: QuestionDefinition[]) => {
    setQuestions(updated);
    localStorage.setItem(
      `${STORAGE_KEY_CUSTOM_QUESTIONS}_${selectedCategory}`,
      JSON.stringify(updated)
    );
    setFeedback('Question framework updated and synchronized.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleStartEdit = (q: QuestionDefinition) => {
    setEditingId(q.id);
    setEditTitle(q.title);
    setEditDesc(q.description);
    setEditMin(q.minChars);
    setEditMax(q.maxChars);
  };

  const handleSaveEdit = (id: string) => {
    const updated = questions.map((q) => {
      if (q.id === id) {
        return {
          ...q,
          title: editTitle.trim(),
          description: editDesc.trim(),
          minChars: editMin,
          maxChars: editMax,
        };
      }
      return q;
    });
    saveQuestions(updated);
    setEditingId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= questions.length) return;

    const copy = [...questions];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    saveQuestions(copy);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to retire this question from future candidate forms?')) return;
    const filtered = questions.filter((q) => q.id !== id);
    saveQuestions(filtered);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newQ: QuestionDefinition = {
      id: `${selectedCategory}_q_${Date.now()}`,
      field: `custom_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      minChars: newMin,
      maxChars: newMax,
      evaluationFocus: 'Administrative assessment question.',
    };

    saveQuestions([...questions, newQ]);
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-amber-400" />
            <span>Application Form Questions</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure questions, character limits, evaluation criteria, and ordering for candidate application forms.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/15 cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Question</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setSelectedCategory('general')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'general'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          General Screening Questions ({selectedCategory === 'general' ? questions.length : '10'})
        </button>
        <button
          onClick={() => setSelectedCategory('moderator')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'moderator'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Moderator Scenarios
        </button>
        <button
          onClick={() => setSelectedCategory('administrator')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'administrator'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Server Administrator Scenarios
        </button>
      </div>

      {/* Add New Question Form */}
      {isAdding && (
        <div className="p-6 rounded-2xl bg-[#0A0D17] border border-amber-500/30 shadow-2xl space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create New {selectedCategory.toUpperCase()} Question</span>
            </span>
            <button
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Question Prompt</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. How do you assess a sudden mass influx of new users?"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-amber-400 rounded-xl text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Guidance Subtitle / Evaluation Context</label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Explain what qualities the candidate should illustrate in their response..."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-amber-400 rounded-xl text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Min Characters</label>
                <input
                  type="number"
                  value={newMin}
                  onChange={(e) => setNewMin(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-amber-400 rounded-xl text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Max Characters</label>
                <input
                  type="number"
                  value={newMax}
                  onChange={(e) => setNewMax(parseInt(e.target.value) || 2000)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-amber-400 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Save Question to Form
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((q, idx) => {
          const isEditing = editingId === q.id;

          return (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-500/20 transition-all space-y-3"
            >
              {isEditing ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 font-mono">Question Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-[#0A0D17] border border-amber-400/50 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-mono">Guidance / Description</label>
                    <textarea
                      rows={2}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-[#0A0D17] border border-amber-400/50 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                      <span>Min: {editMin} chars</span>
                      <span>·</span>
                      <span>Max: {editMax} chars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(q.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-amber-400 font-bold">
                        #{idx + 1}
                      </span>
                      <h3 className="text-xs font-bold text-white">{q.title}</h3>
                    </div>
                    {q.description && (
                      <p className="text-xs text-slate-400 leading-relaxed pl-5">
                        {q.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 pl-5 text-[10px] font-mono text-slate-500">
                      <span>Requirement: {q.minChars}–{q.maxChars} chars</span>
                      <span>·</span>
                      <span>Key: {q.field}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === questions.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(q)}
                      className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-amber-300 hover:bg-amber-400/10 cursor-pointer"
                      title="Edit Question"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
