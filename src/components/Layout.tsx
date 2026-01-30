import React from 'react';
import { User } from '../types';
import { calculateLevel } from '../utils/levels';
import { Icon } from './icons';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Layout({ children, user, currentView, onViewChange }: LayoutProps) {
  if (!user) {
    return <div className="min-h-screen app-shell">{children}</div>;
  }

  const { level, title, progress } = calculateLevel(user.experience);
  const language = user.settings.language;

  const navigation = [
    { id: 'dashboard', icon: 'home', label: { en: 'Home', rus: 'Главная' } },
    { id: 'chat', icon: 'chat', label: { en: 'Chat', rus: 'Чат' } },
    { id: 'sleep', icon: 'sleep', label: { en: 'Sleep', rus: 'Сон' } },
    { id: 'marathon', icon: 'marathon', label: { en: 'Marathon', rus: 'Марафон' } },
    { id: 'progress', icon: 'progress', label: { en: 'Progress', rus: 'Прогресс' } },
    { id: 'settings', icon: 'settings', label: { en: 'Settings', rus: 'Настройки' } }
  ] as const;

  const handleViewChange = (view: string) => {
    onViewChange(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-safe app-shell">
      <header className="sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 pt-4">
          <div className="surface-card px-4 py-3 flex items-center justify-between animate-in">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-black text-contrast flex items-center justify-center overflow-hidden">
                {user.avatar?.image ? (
                  <img
                    src={user.avatar.image}
                    alt={user.avatar.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon name="user" className="h-5 w-5" />
                )}
              </div>
              <div>
                <h1 className="text-base font-semibold text-black">
                  {language === 'rus' ? `Привет, ${user.name}` : `Hello, ${user.name}`}
                </h1>
                <p className="text-xs text-black/60">{title[language]}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-black/70">Level {level}</div>
              <div className="mt-1 w-20 h-2 bg-black/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {children}
      </main>

      <nav className="fixed bottom-4 left-0 right-0 z-30 nav-safe">
        <div className="max-w-md mx-auto px-4">
          <div className="surface-card flex items-center justify-between gap-2 px-2 py-2 rounded-full">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={`flex-1 py-2 px-2 rounded-full flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
                  currentView === item.id
                    ? 'bg-black text-contrast shadow'
                    : 'text-black/50 hover:text-black'
                }`}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <Icon name={item.icon} className="h-5 w-5" />
                <span>{item.label[language]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
