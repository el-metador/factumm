import React, { useState, useEffect } from 'react';
import { User, Avatar } from './types';
import { storage } from './utils/storage';
import { supabase, buildUserFromSupabase } from './utils/supabase';

// Components
import { Layout } from './components/Layout';
import { AuthScreen } from './components/AuthScreen';
import { AvatarQuiz } from './components/AvatarQuiz';
import { AvatarReveal } from './components/AvatarReveal';
import { Dashboard } from './components/Dashboard';
import { ChatScreen } from './components/ChatScreen';
import { SleepTracker } from './components/SleepTracker';
import { DailyQuiz } from './components/DailyQuiz';
import { ProgressScreen } from './components/ProgressScreen';
import { Settings } from './components/Settings';
import { MarathonScreen } from './components/MarathonScreen';

type AppState = 'auth' | 'quiz' | 'reveal' | 'main';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('auth');
  const [currentView, setCurrentView] = useState('dashboard');
  const [language, setLanguage] = useState<'en' | 'rus'>('en');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const theme = user?.settings.theme ?? 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, [user?.settings.theme]);

  useEffect(() => {
    let isMounted = true;

    const hydrateUser = (resolvedUser: User | null) => {
      if (!isMounted) return;
      if (resolvedUser) {
        setUser(resolvedUser);
        setLanguage(resolvedUser.settings.language);
        setAppState(resolvedUser.avatar ? 'main' : 'quiz');
        storage.setUser(resolvedUser);
      } else {
        setUser(null);
        setAppState('auth');
      }
      setIsAuthLoading(false);
    };

    const initializeAuth = async () => {
      const savedUser = storage.getUser();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const resolvedUser = buildUserFromSupabase(
          session.user,
          savedUser?.settings.language ?? 'en',
          savedUser
        );
        hydrateUser(resolvedUser);
        return;
      }

      hydrateUser(savedUser);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const savedUser = storage.getUser();
      if (session?.user) {
        const resolvedUser = buildUserFromSupabase(
          session.user,
          savedUser?.settings.language ?? 'en',
          savedUser
        );
        hydrateUser(resolvedUser);
      } else {
        hydrateUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleAuth = (newUser: User) => {
    setUser(newUser);
    storage.setUser(newUser);
    setLanguage(newUser.settings.language);
    setAppState('quiz');
  };

  const handleQuizComplete = (updatedUser: User, avatar: Avatar) => {
    setUser(updatedUser);
    setSelectedAvatar(avatar);
    storage.setUser(updatedUser);
    setAppState('reveal');
  };

  const handleRevealContinue = () => {
    setAppState('main');
    setCurrentView('dashboard');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    setLanguage(updatedUser.settings.language);
    storage.setUser(updatedUser);
  };

  const handleLogout = () => {
    void supabase.auth.signOut();
    setUser(null);
    setAppState('auth');
    setCurrentView('dashboard');
    storage.clearAll();
  };

  const handleDailyQuizComplete = (updatedUser: User) => {
    setUser(updatedUser);
    setCurrentView('dashboard');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center app-shell">
        <div className="w-16 h-16 rounded-full border border-black/10 border-t-black animate-spin"></div>
      </div>
    );
  }

  if (appState === 'auth') {
    return (
      <AuthScreen 
        onAuth={handleAuth}
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  if (appState === 'quiz' && user) {
    return (
      <AvatarQuiz 
        user={user}
        onComplete={handleQuizComplete}
      />
    );
  }

  if (appState === 'reveal' && user && selectedAvatar) {
    return (
      <AvatarReveal 
        user={user}
        avatar={selectedAvatar}
        onContinue={handleRevealContinue}
      />
    );
  }

  if (appState === 'main' && user) {
    return (
      <Layout 
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
      >
        {currentView === 'dashboard' && (
          <Dashboard 
            user={user}
            onViewChange={setCurrentView}
          />
        )}
        {currentView === 'chat' && (
          <ChatScreen user={user} />
        )}
        {currentView === 'sleep' && (
          <SleepTracker user={user} />
        )}
        {currentView === 'quiz' && (
          <DailyQuiz 
            user={user}
            onComplete={handleDailyQuizComplete}
          />
        )}
        {currentView === 'progress' && (
          <ProgressScreen user={user} />
        )}
        {currentView === 'marathon' && (
          <MarathonScreen user={user} />
        )}
        {currentView === 'settings' && (
          <Settings 
            user={user}
            onUserUpdate={handleUserUpdate}
            onLogout={handleLogout}
          />
        )}
      </Layout>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center app-shell">
      <div className="w-10 h-10 rounded-full border border-black/10 border-t-black animate-spin"></div>
    </div>
  );
}

export default App;
