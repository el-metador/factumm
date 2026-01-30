import React from 'react';
import { User } from '../types';
import { calculateLevel } from '../utils/levels';
import { storage } from '../utils/storage';
import { Reveal } from './Reveal';
import { Icon } from './icons';

interface ProgressScreenProps {
  user: User;
}

export function ProgressScreen({ user }: ProgressScreenProps) {
  const language = user.settings.language;
  const { level, title, progress } = calculateLevel(user.experience);
  const quizzes = storage.getDailyQuizzes();

  // Calculate mood trend
  const recentQuizzes = quizzes.slice(-7); // Last 7 days
  const avgMood = recentQuizzes.length > 0 
    ? recentQuizzes.reduce((sum, quiz) => sum + quiz.moodScore, 0) / recentQuizzes.length
    : 0;

  const text = {
    en: {
      title: 'Your Progress',
      currentLevel: 'Current Level',
      experience: 'Experience Points',
      streak: 'Current Streak',
      days: 'days',
      moodTrend: 'Mood Trend (7 days)',
      excellent: 'Excellent',
      good: 'Good',
      okay: 'Okay',
      needsAttention: 'Needs Attention',
      achievements: 'Achievements',
      weeklyGoals: 'Weekly Goals',
      completeDaily: 'Complete daily check-ins',
      chatRegular: 'Chat with your avatar regularly',
      maintainSleep: 'Maintain healthy sleep schedule'
    },
    rus: {
      title: 'Ваш прогресс',
      currentLevel: 'Текущий уровень',
      experience: 'Очки опыта',
      streak: 'Текущая серия',
      days: 'дней',
      moodTrend: 'Тренд настроения (7 дней)',
      excellent: 'Отлично',
      good: 'Хорошо',
      okay: 'Нормально',
      needsAttention: 'Требует внимания',
      achievements: 'Достижения',
      weeklyGoals: 'Недельные цели',
      completeDaily: 'Выполняйте ежедневные проверки',
      chatRegular: 'Регулярно общайтесь с вашим аватаром',
      maintainSleep: 'Поддерживайте здоровый режим сна'
    }
  };

  const t = text[language];

  const getMoodStatus = (score: number) => {
    if (score >= 80) return { text: t.excellent, color: 'text-black' };
    if (score >= 60) return { text: t.good, color: 'text-black/70' };
    if (score >= 40) return { text: t.okay, color: 'text-black/60' };
    return { text: t.needsAttention, color: 'text-black/50' };
  };

  const moodStatus = getMoodStatus(avgMood);

  const achievements: {
    icon: React.ComponentProps<typeof Icon>['name'];
    title: string;
    description: string;
    unlocked: boolean;
  }[] = [
    { 
      icon: 'badge', 
      title: language === 'rus' ? 'Первый шаг' : 'First Step',
      description: language === 'rus' ? 'Завершили первый опрос' : 'Completed first quiz',
      unlocked: quizzes.length > 0
    },
    {
      icon: 'flame',
      title: language === 'rus' ? 'На пути' : 'On a Roll',
      description: language === 'rus' ? '7-дневная серия' : '7-day streak',
      unlocked: user.streak >= 7
    },
    {
      icon: 'chat',
      title: language === 'rus' ? 'Открытое сердце' : 'Open Heart',
      description: language === 'rus' ? 'Поделились с аватаром' : 'Shared with avatar',
      unlocked: storage.getChatMessages().filter(m => m.type === 'user').length > 0
    }
  ];

  return (
    <div className="space-y-6">
      <Reveal className="surface-card p-6">
        <h2 className="text-2xl font-semibold text-black mb-6">{t.title}</h2>
        
        {/* Level Progress */}
        <div className="surface-muted rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-black">{t.currentLevel}</span>
            <span className="text-2xl font-semibold text-black">Level {level}</span>
          </div>
          <p className="text-black/60 mb-3">{title[language]}</p>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-black/60 mt-2">{Math.round(progress)}% to next level</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="surface-muted p-4 text-center">
            <div className="text-2xl font-semibold text-black">{user.experience}</div>
            <div className="text-sm text-black/60">{t.experience}</div>
          </div>
          <div className="surface-muted p-4 text-center">
            <div className="text-2xl font-semibold text-black">{user.streak}</div>
            <div className="text-sm text-black/60">{t.streak} {t.days}</div>
          </div>
        </div>

        {/* Mood Trend */}
        <div className="surface-muted p-4 mb-6">
          <h3 className="font-semibold text-black mb-2">{t.moodTrend}</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-semibold text-black">{Math.round(avgMood)}%</div>
            <div className={`font-medium ${moodStatus.color}`}>{moodStatus.text}</div>
          </div>
          <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${avgMood}%` }}
            />
          </div>
        </div>
      </Reveal>

      {/* Achievements */}
      <Reveal className="surface-card p-6">
        <h3 className="text-lg font-semibold text-black mb-4">{t.achievements}</h3>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                achievement.unlocked 
                  ? 'surface-muted border border-black/10' 
                  : 'surface-muted opacity-60'
              }`}
            >
              <span className="text-2xl">
                <Icon name={achievement.icon} className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h4 className="font-medium text-black">{achievement.title}</h4>
                <p className="text-sm text-black/60">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <span className="text-black font-semibold text-sm">✓</span>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Weekly Goals */}
      <Reveal className="surface-card p-6">
        <h3 className="text-lg font-semibold text-black mb-4">{t.weeklyGoals}</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              quizzes.length >= 3 ? 'bg-black border-black' : 'border-black/30'
            }`}>
              {quizzes.length >= 3 && <span className="text-contrast text-xs">✓</span>}
            </div>
            <span className="text-black/70">{t.completeDaily}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              storage.getChatMessages().filter(m => m.type === 'user').length >= 5 ? 'bg-black border-black' : 'border-black/30'
            }`}>
              {storage.getChatMessages().filter(m => m.type === 'user').length >= 5 && (
                <span className="text-contrast text-xs">✓</span>
              )}
            </div>
            <span className="text-black/70">{t.chatRegular}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              storage.getSleepData() ? 'bg-black border-black' : 'border-black/30'
            }`}>
              {storage.getSleepData() && <span className="text-contrast text-xs">✓</span>}
            </div>
            <span className="text-black/70">{t.maintainSleep}</span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
