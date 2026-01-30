import React, { useState } from 'react';
import type { User, DailyQuiz } from '../types';
import { dailyQuizQuestions } from '../data/quiz';
import { storage } from '../utils/storage';
import { Reveal } from './Reveal';
import { Icon } from './icons';

interface DailyQuizProps {
  user: User;
  onComplete: (user: User) => void;
}

export function DailyQuiz({ user, onComplete }: DailyQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const language = user.settings.language;

  const getLocalDateKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getLocalDateKey();
  const existingQuiz = storage.getDailyQuizzes().find(q => q.date === today);

  if (existingQuiz) {
    return (
      <Reveal className="surface-card p-6">
        <div className="text-center">
          <span className="mb-4 block text-black/70">
            <Icon name="check" className="h-10 w-10 mx-auto" />
          </span>
          <h2 className="text-xl font-semibold text-black mb-2">
            {language === 'rus' ? 'Отличная работа!' : 'Great job!'}
          </h2>
          <p className="text-black/60">
            {language === 'rus' 
              ? 'Вы уже прошли сегодняшний опрос!' 
              : "You've already completed today's check-in!"}
          </p>
        </div>
      </Reveal>
    );
  }

  const question = dailyQuizQuestions[currentQuestion];

  const handleAnswer = (value: string) => {
    const newResponses = { ...responses, [question.id]: value };
    setResponses(newResponses);

    if (currentQuestion < dailyQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      const moodScore = calculateMoodScore(newResponses);
      const quiz: DailyQuiz = {
        id: Date.now().toString(),
        date: today,
        questions: dailyQuizQuestions,
        responses: newResponses,
        moodScore
      };

      storage.addDailyQuiz(quiz);
      
      // Update user experience
      const updatedUser = {
        ...user,
        experience: user.experience + 25,
        streak: user.streak + 1
      };
      
      storage.setUser(updatedUser);
      onComplete(updatedUser);
    }
  };

  const calculateMoodScore = (responses: Record<string, string>): number => {
    let score = 0;
    Object.values(responses).forEach(response => {
      switch (response) {
        case 'great':
        case 'excellent':
          score += 5;
          break;
        case 'good':
          score += 4;
          break;
        case 'okay':
          score += 3;
          break;
        case 'struggling':
        case 'restless':
          score += 2;
          break;
        case 'difficult':
        case 'poor':
          score += 1;
          break;
      }
    });
    return Math.round((score / (Object.keys(responses).length * 5)) * 100);
  };

  const text = {
    en: {
      title: 'Daily Check-in',
      subtitle: 'How are you feeling today?',
      question: 'Question',
      of: 'of'
    },
    rus: {
      title: 'Ежедневная проверка',
      subtitle: 'Как вы себя чувствуете сегодня?',
      question: 'Вопрос',
      of: 'из'
    }
  };

  const t = text[language];

  return (
    <Reveal className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black mb-2">{t.title}</h2>
        <p className="text-black/60 mb-4">{t.subtitle}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-black/50">
            {t.question} {currentQuestion + 1} {t.of} {dailyQuizQuestions.length}
          </span>
          <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / dailyQuizQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">
          {question.text[language]}
        </h3>
        
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
  );
}
