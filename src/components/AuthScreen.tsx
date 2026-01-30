import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';
import { supabase, buildUserFromSupabase } from '../utils/supabase';
import { Reveal } from './Reveal';

interface AuthScreenProps {
  onAuth: (user: User) => void;
  language: 'en' | 'rus';
  onLanguageChange: (lang: 'en' | 'rus') => void;
}

export function AuthScreen({ onAuth, language, onLanguageChange }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (isSignUp && !formData.name)) return;

    setIsSubmitting(true);
    setAuthError(null);
    setAuthNotice(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name
            }
          }
        });

        if (error) throw error;

        if (data.session?.user) {
          const existingUser = storage.getUser();
          const user = buildUserFromSupabase(data.session.user, language, existingUser);
          onAuth(user);
        } else {
          setAuthNotice(
            language === 'rus'
              ? 'Проверьте почту для подтверждения регистрации.'
              : 'Check your email to confirm your account.'
          );
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;

        if (data.user) {
          const existingUser = storage.getUser();
          const user = buildUserFromSupabase(data.user, language, existingUser);
          onAuth(user);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async () => {
    setIsOAuthLoading(true);
    setAuthError(null);
    setAuthNotice(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      setAuthError(error.message);
      setIsOAuthLoading(false);
    }
  };

  const text = {
    en: {
      welcome: 'Welcome to Factum',
      subtitle: 'Your personal mental health companion',
      name: 'Full Name',
      email: 'Email',
      password: 'Password',
      signUp: 'Create Account',
      signIn: 'Sign In',
      continueWith: 'Continue with',
      haveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      switchToSignIn: 'Sign in here',
      switchToSignUp: 'Sign up here',
      privacy: 'Your data stays private and secure on your device',
      or: 'or',
      loading: 'Working...',
      google: 'Google'
    },
    rus: {
      welcome: 'Добро пожаловать в Factum',
      subtitle: 'Ваш персональный помощник для ментального здоровья',
      name: 'Полное имя',
      email: 'Email',
      password: 'Пароль',
      signUp: 'Создать аккаунт',
      signIn: 'Войти',
      continueWith: 'Продолжить с',
      haveAccount: 'Уже есть аккаунт?',
      noAccount: 'Нет аккаунта?',
      switchToSignIn: 'Войти здесь',
      switchToSignUp: 'Зарегистрироваться здесь',
      privacy: 'Ваши данные остаются приватными и безопасными на вашем устройстве',
      or: 'или',
      loading: 'Загрузка...',
      google: 'Google'
    }
  };

  const t = text[language];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 app-shell">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.3em] text-black/60">Factum</div>
          <div className="surface-muted inline-flex items-center rounded-full p-1">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-black text-contrast shadow'
                  : 'text-black/60 hover:text-black'
              }`}
              type="button"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('rus')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                language === 'rus'
                  ? 'bg-black text-contrast shadow'
                  : 'text-black/60 hover:text-black'
              }`}
              type="button"
            >
              RUS
            </button>
          </div>
        </div>

        <Reveal className="surface-card p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-white">
              <img
                src="/factum.png"
                alt="Factum"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-black">{t.welcome}</h1>
              <p className="text-sm text-black/60">{t.subtitle}</p>
            </div>
          </div>

          {(authError || authNotice) && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                authError
                  ? 'border-black/20 bg-black/5 text-black'
                  : 'border-black/10 bg-white text-black/70'
              }`}
            >
              {authError ?? authNotice}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleOAuthLogin}
              disabled={isOAuthLoading}
              className="btn-secondary w-full"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-xs font-semibold">
                G
              </span>
              <span className="font-medium">
                {isOAuthLoading ? t.loading : `${t.continueWith} ${t.google}`}
              </span>
            </button>
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10"></div>
            </div>
            <span className="relative bg-white px-3 text-xs text-black/50">{t.or}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  placeholder={t.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required={isSignUp}
                  disabled={isSubmitting}
                />
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder={t.email}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder={t.password}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? t.loading : isSignUp ? t.signUp : t.signIn}
            </button>
          </form>

          <div className="text-center text-sm text-black/70">
            {isSignUp ? t.haveAccount : t.noAccount}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-black underline underline-offset-4"
              type="button"
            >
              {isSignUp ? t.switchToSignIn : t.switchToSignUp}
            </button>
          </div>

          <p className="text-center text-xs text-black/50">{t.privacy}</p>
        </Reveal>
      </div>
    </div>
  );
}
