import React from 'react';
import { User } from '../types';
import { Reveal } from './Reveal';
import { Icon } from './icons';

interface DashboardProps {
  user: User;
  onViewChange: (view: string) => void;
}

export function Dashboard({ user, onViewChange }: DashboardProps) {
  const language = user.settings.language;
  const avatar = user.avatar;
  type IconName = React.ComponentProps<typeof Icon>['name'];

  const text = {
    en: {
      goodMorning: 'Good morning',
      goodAfternoon: 'Good afternoon', 
      goodEvening: 'Good evening',
      todaysGoals: "Today's Goals",
      checkIn: 'Daily Check-in',
      checkInDesc: 'How are you feeling today?',
      sleepTracker: 'Sleep Tracker',
      sleepDesc: 'Optimize your rest cycles',
      chatWithAvatar: `Chat with ${avatar?.name}`,
      chatDesc: 'Share your thoughts and feelings',
      challenges: 'Challenges',
      challengesDesc: 'Complete tasks to level up',
      marathon: '30-day marathon',
      marathonDesc: 'Five daily questions and reflections',
      streakDays: 'day streak',
      exp: 'EXP'
    },
    rus: {
      goodMorning: 'Доброе утро',
      goodAfternoon: 'Добрый день',
      goodEvening: 'Добрый вечер', 
      todaysGoals: 'Цели на сегодня',
      checkIn: 'Ежедневная проверка',
      checkInDesc: 'Как вы себя чувствуете сегодня?',
      sleepTracker: 'Трекер сна',
      sleepDesc: 'Оптимизируйте циклы отдыха',
      chatWithAvatar: `Чат с ${avatar?.name}`,
      chatDesc: 'Поделитесь своими мыслями и чувствами',
      challenges: 'Вызовы',
      challengesDesc: 'Выполняйте задания для повышения уровня',
      marathon: '30-дневный марафон',
      marathonDesc: 'Пять ежедневных вопросов и заметки',
      streakDays: 'дней подряд',
      exp: 'ОПЫТ'
    }
  };

  const t = text[language];
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.goodMorning : hour < 17 ? t.goodAfternoon : t.goodEvening;

  const cards: {
    id: string;
    title: string;
    description: string;
    icon: IconName;
    action: () => void;
  }[] = [
    {
      id: 'quiz',
      title: t.checkIn,
      description: t.checkInDesc,
      icon: 'quiz',
      action: () => onViewChange('quiz')
    },
    {
      id: 'chat',
      title: t.chatWithAvatar,
      description: t.chatDesc,
      icon: 'chat',
      action: () => onViewChange('chat')
    },
    {
      id: 'sleep',
      title: t.sleepTracker,
      description: t.sleepDesc,
      icon: 'sleep',
      action: () => onViewChange('sleep')
    },
    {
      id: 'marathon',
      title: t.marathon,
      description: t.marathonDesc,
      icon: 'marathon',
      action: () => onViewChange('marathon')
    },
    {
      id: 'challenges',
      title: t.challenges,
      description: t.challengesDesc,
      icon: 'target',
      action: () => onViewChange('progress')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Reveal className="surface-card p-6">
        <h2 className="text-2xl font-semibold text-black mb-2">
          {greeting}, {user.name}
        </h2>
        {avatar && (
          <p className="text-black/60">
            {language === 'rus' 
              ? `${avatar.name} готов поддержать вас сегодня`
              : `${avatar.name} is ready to support you today`}
          </p>
        )}
      </Reveal>

      {/* Stats */}
      <Reveal className="grid grid-cols-2 gap-4">
        <div className="surface-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="flame" className="h-6 w-6 text-black" />
            <span className="text-2xl font-semibold text-black">{user.streak}</span>
          </div>
          <p className="text-sm text-black/60">{t.streakDays}</p>
        </div>
        
        <div className="surface-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="star" className="h-6 w-6 text-black" />
            <span className="text-2xl font-semibold text-black">{user.experience}</span>
          </div>
          <p className="text-sm text-black/60">{t.exp}</p>
        </div>
      </Reveal>

      {/* Action Cards */}
      <Reveal className="grid grid-cols-1 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={card.action}
            className="surface-card p-6 text-left group hover:border-black transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black text-contrast flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform duration-200">
                <Icon name={card.icon} className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-black mb-1">{card.title}</h3>
                <p className="text-sm text-black/60">{card.description}</p>
              </div>
              <div className="text-black/40 group-hover:text-black transition-colors">
                →
              </div>
            </div>
          </button>
        ))}
      </Reveal>
    </div>
  );
}
