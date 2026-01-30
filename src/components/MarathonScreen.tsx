import React, { useMemo, useEffect, useState } from 'react';
import type { MarathonEntry, MarathonState, User } from '../types';
import { marathonQuestions } from '../data/marathon';
import { storage } from '../utils/storage';
import { Reveal } from './Reveal';
import { Icon } from './icons';

interface MarathonScreenProps {
  user: User;
}

const MAX_DAYS = 30;

const getLocalDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const clampDay = (value: number) => Math.min(Math.max(value, 1), MAX_DAYS);

export function MarathonScreen({ user }: MarathonScreenProps) {
  const language = user.settings.language;
  const today = getLocalDateKey();
  const stored = storage.getMarathon();

  const [state, setState] = useState<MarathonState>(() => stored ?? { entries: [] });

  const entry = state.entries.find((item) => item.date === today);
  const [responses, setResponses] = useState<Record<string, string>>(entry?.responses ?? {});
  const [notes, setNotes] = useState(entry?.notes ?? { changes: '', significant: '', note: '' });

  useEffect(() => {
    if (!state.startDate && state.entries.length > 0) {
      const nextState = { ...state, startDate: state.entries[0].date };
      setState(nextState);
      storage.setMarathon(nextState);
    }
  }, [state.startDate, state.entries]);

  useEffect(() => {
    if (entry) {
      setResponses(entry.responses);
      setNotes(entry.notes);
    } else {
      setResponses({});
      setNotes({ changes: '', significant: '', note: '' });
    }
  }, [entry, today]);

  const dayNumber = useMemo(() => {
    if (!state.startDate) return 1;
    const diff = Math.floor(
      (parseDate(today).getTime() - parseDate(state.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return clampDay(diff + 1);
  }, [state.startDate, today]);

  const completedCount = Math.min(state.entries.length, MAX_DAYS);
  const progress = Math.round((completedCount / MAX_DAYS) * 100);
  const isComplete = completedCount >= MAX_DAYS;

  const allQuestionsAnswered = marathonQuestions.every(
    (question) => responses[question.id]?.trim().length
  );
  const hasNotes =
    notes.changes.trim().length > 0 || notes.significant.trim().length > 0 || notes.note.trim().length > 0;
  const canSubmit = allQuestionsAnswered && hasNotes;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const startDate = state.startDate ?? today;
    const newEntry: MarathonEntry = {
      date: today,
      day: dayNumber,
      responses,
      notes
    };

    const nextEntries = entry
      ? state.entries.map((item) => (item.date === today ? newEntry : item))
      : [...state.entries, newEntry];

    const nextState: MarathonState = {
      startDate,
      entries: nextEntries.sort((a, b) => a.date.localeCompare(b.date))
    };

    setState(nextState);
    storage.setMarathon(nextState);
  };

  const summary = useMemo(() => {
    if (!isComplete) return null;
    const sorted = [...state.entries].slice(0, MAX_DAYS).sort((a, b) => a.date.localeCompare(b.date));
    const changes = sorted.map((item) => item.notes.changes).filter(Boolean);
    const significant = sorted.map((item) => item.notes.significant).filter(Boolean);
    const notesList = sorted.map((item) => item.notes.note).filter(Boolean);
    return { changes, significant, notesList };
  }, [isComplete, state.entries]);

  const text = {
    en: {
      title: '30-day marathon',
      subtitle: 'Five daily questions and reflections',
      day: 'Day',
      of: 'of',
      questions: 'Daily questions',
      notesTitle: 'Notes',
      changes: 'What changed today?',
      significant: 'What meaningful thing did you do?',
      note: 'Any other note',
      save: 'Save today',
      update: 'Update today',
      completed: 'Completed today',
      required: 'Answer all questions and add at least one note.',
      summaryTitle: 'What you did in 30 days:',
      summaryChanges: 'Changes you noticed',
      summarySignificant: 'Meaningful actions',
      summaryNotes: 'Other notes'
    },
    rus: {
      title: '30-дневный марафон',
      subtitle: 'Пять ежедневных вопросов и заметки',
      day: 'День',
      of: 'из',
      questions: 'Ежедневные вопросы',
      notesTitle: 'Заметки',
      changes: 'Что изменилось сегодня?',
      significant: 'Что значимого вы сделали?',
      note: 'Любая другая заметка',
      save: 'Сохранить день',
      update: 'Обновить день',
      completed: 'Сегодня выполнено',
      required: 'Ответьте на все вопросы и добавьте хотя бы одну заметку.',
      summaryTitle: 'Что вы сделали за 30 дней:',
      summaryChanges: 'Что вы замечали по изменениям',
      summarySignificant: 'Значимые действия',
      summaryNotes: 'Другие заметки'
    }
  };

  const t = text[language];

  return (
    <div className="space-y-6">
      <Reveal className="surface-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-black">{t.title}</h2>
            <p className="text-black/60">{t.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-black/60">{t.day}</div>
            <div className="text-xl font-semibold text-black">
              {Math.min(dayNumber, MAX_DAYS)} {t.of} {MAX_DAYS}
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
          <div className="h-full bg-black transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </Reveal>

      {!isComplete && (
        <Reveal className="surface-card p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">{t.questions}</h3>
            <div className="space-y-4">
              {marathonQuestions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <label className="block text-sm font-medium text-black/70">
                    {index + 1}. {question.text[language]}
                  </label>
                  <textarea
                    value={responses[question.id] ?? ''}
                    onChange={(event) =>
                      setResponses((prev) => ({ ...prev, [question.id]: event.target.value }))
                    }
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black mb-4">{t.notesTitle}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/70">{t.changes}</label>
                <textarea
                  value={notes.changes}
                  onChange={(event) => setNotes((prev) => ({ ...prev, changes: event.target.value }))}
                  rows={2}
                  className="input-field resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/70">{t.significant}</label>
                <textarea
                  value={notes.significant}
                  onChange={(event) => setNotes((prev) => ({ ...prev, significant: event.target.value }))}
                  rows={2}
                  className="input-field resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/70">{t.note}</label>
                <textarea
                  value={notes.note}
                  onChange={(event) => setNotes((prev) => ({ ...prev, note: event.target.value }))}
                  rows={2}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {!canSubmit && (
              <div className="text-sm text-black/50 flex items-center gap-2">
                <Icon name="info" className="h-4 w-4" />
                <span>{t.required}</span>
              </div>
            )}
            <button onClick={handleSubmit} disabled={!canSubmit} className="btn-primary w-full">
              {entry ? t.update : t.save}
            </button>
            {entry && (
              <div className="text-sm text-black/60 flex items-center gap-2">
                <Icon name="check" className="h-4 w-4" />
                <span>{t.completed}</span>
              </div>
            )}
          </div>
        </Reveal>
      )}

      {summary && (
        <Reveal className="surface-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-black">{t.summaryTitle}</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-black mb-2">{t.summaryChanges}</h4>
              <ul className="space-y-2 text-sm text-black/70">
                {summary.changes.map((item, index) => (
                  <li key={`change-${index}`}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-2">{t.summarySignificant}</h4>
              <ul className="space-y-2 text-sm text-black/70">
                {summary.significant.map((item, index) => (
                  <li key={`significant-${index}`}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-2">{t.summaryNotes}</h4>
              <ul className="space-y-2 text-sm text-black/70">
                {summary.notesList.map((item, index) => (
                  <li key={`note-${index}`}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
