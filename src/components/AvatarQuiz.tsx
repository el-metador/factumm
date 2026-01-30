import React, { useState } from 'react';
import { avatarSelectionQuiz } from '../data/quiz';
import { calculateAvatarMatch } from '../utils/avatarAlgorithm';
import { User, Avatar } from '../types';
import { Reveal } from './Reveal';

interface AvatarQuizProps {
  user: User;
  onComplete: (user: User, avatar: Avatar) => void;
}

export function AvatarQuiz({ user, onComplete }: AvatarQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const language = user.settings.language;
  const question = avatarSelectionQuiz[currentQuestion];

  const handleAnswer = (value: string) => {
    const newResponses = { ...responses, [question.id]: value };
    setResponses(newResponses);

    if (currentQuestion < avatarSelectionQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, calculate avatar
      setIsLoading(true);
      setTimeout(() => {
        const selectedAvatar = calculateAvatarMatch(newResponses);
        const updatedUser = { ...user, avatar: selectedAvatar };
        onComplete(updatedUser, selectedAvatar);
      }, 1500);
    }
  };

  const text = {
    en: {
      title: 'Personality Assessment',
      subtitle: 'Let\'s find your perfect companion',
      question: 'Question',
      of: 'of',
      analyzing: 'Analyzing your responses...',
      finding: 'Finding your perfect companion'
    },
    rus: {
      title: 'Оценка личности',
      subtitle: 'Давайте найдем вашего идеального компаньона',
      question: 'Вопрос',
      of: 'из',
      analyzing: 'Анализируем ваши ответы...',
      finding: 'Ищем вашего идеального компаньона'
    }
  };

  const t = text[language];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 app-shell">
        <Reveal className="surface-card p-8 w-full max-w-md text-center">
          <div className="animate-spin w-16 h-16 border-4 border-black/10 border-t-black rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-black mb-2">{t.analyzing}</h2>
          <p className="text-black/60">{t.finding}</p>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 app-shell">
      <Reveal className="surface-card p-8 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-2">{t.title}</h1>
          <p className="text-black/60 mb-4">{t.subtitle}</p>
          
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-black/50">
              {t.question} {currentQuestion + 1} {t.of} {avatarSelectionQuiz.length}
            </span>
            <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / avatarSelectionQuiz.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-black mb-6">
            {question.text[language]}
          </h2>
          
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 text-left border border-black/10 rounded-xl hover:border-black hover:bg-black/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
              >
                <span className="text-black">{option.text[language]}</span>
              </button>
            ))}
          </div>
        </div>

        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="btn-ghost"
          >
            ← {language === 'rus' ? 'Назад' : 'Back'}
          </button>
        )}
      </Reveal>
    </div>
  );
}
