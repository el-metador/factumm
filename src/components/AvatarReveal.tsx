import React, { useState } from 'react';
import { Avatar, User } from '../types';
import { Reveal } from './Reveal';
import { Icon } from './icons';

interface AvatarRevealProps {
  user: User;
  avatar: Avatar;
  onContinue: () => void;
}

export function AvatarReveal({ user, avatar, onContinue }: AvatarRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const language = user.settings.language;

  React.useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const text = {
    en: {
      meet: 'Meet your companion',
      companion: 'Your Companion',
      traits: 'Specialized in helping with',
      continue: 'Continue to Chat',
      description: `${avatar.name} understands your unique journey and is here to provide personalized support. Together, you'll work on building healthier patterns and finding your inner strength.`
    },
    rus: {
      meet: 'Познакомьтесь с вашим компаньоном',
      companion: 'Ваш компаньон',
      traits: 'Специализируется на помощи с',
      continue: 'Перейти к чату',
      description: `${avatar.name} понимает ваш уникальный путь и здесь, чтобы обеспечить персональную поддержку. Вместе вы будете работать над построением более здоровых паттернов и поиском внутренней силы.`
    }
  };

  const t = text[language];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 app-shell">
      <Reveal className="surface-card p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-black mb-8">{t.meet}</h1>
        
        <div className={`transition-all duration-1000 ${isRevealed ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-black text-contrast flex items-center justify-center shadow-lg overflow-hidden">
            {avatar.image ? (
              <img
                src={avatar.image}
                alt={avatar.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Icon name="user" className="h-12 w-12" />
            )}
          </div>
          
          <h2 className="text-3xl font-semibold text-black mb-2">{avatar.name}</h2>
          <p className="text-lg text-black/60 mb-6">{t.companion}</p>
          
          <div className="surface-muted rounded-xl p-6 mb-6 text-left">
            <p className="text-black/70 mb-4">{t.description}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold text-black mb-2">{t.traits}:</h3>
              <div className="flex flex-wrap gap-2">
                {avatar.traits.map((trait, index) => (
                  <span 
                    key={index}
                    className="chip"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={onContinue}
            className="btn-primary w-full py-4"
          >
            {t.continue}
          </button>
        </div>
      </Reveal>
    </div>
  );
}
