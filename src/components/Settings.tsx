import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';
import { Reveal } from './Reveal';

interface SettingsProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
}

export function Settings({ user, onUserUpdate, onLogout }: SettingsProps) {
  const [settings, setSettings] = useState(user.settings);
  const language = user.settings.language;

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    const updatedUser = { ...user, settings: newSettings };
    storage.setUser(updatedUser);
    onUserUpdate(updatedUser);
  };

  const handleClearData = () => {
    const confirm = window.confirm(
      language === 'rus' 
        ? 'Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.'
        : 'Are you sure you want to clear all data? This action cannot be undone.'
    );
    
    if (confirm) {
      storage.clearAll();
      onLogout();
    }
  };

  const text = {
    en: {
      title: 'Settings',
      personalInfo: 'Personal Information',
      name: 'Name',
      email: 'Email',
      avatar: 'Current Avatar',
      preferences: 'Preferences',
      language: 'Language',
      theme: 'Theme',
      notifications: 'Notifications',
      privacy: 'Privacy & Data',
      dataLogging: 'Help improve Factum',
      dataDescription: 'Share anonymous usage data to help us improve the experience',
      account: 'Account',
      clearData: 'Clear All Data',
      clearDescription: 'Remove all your data from this device',
      logout: 'Logout',
      light: 'Light',
      dark: 'Dark',
      english: 'English',
      russian: 'Русский'
    },
    rus: {
      title: 'Настройки',
      personalInfo: 'Личная информация',
      name: 'Имя',
      email: 'Email',
      avatar: 'Текущий аватар',
      preferences: 'Предпочтения',
      language: 'Язык',
      theme: 'Тема',
      notifications: 'Уведомления',
      privacy: 'Приватность и данные',
      dataLogging: 'Помочь улучшить Factum',
      dataDescription: 'Делиться анонимными данными использования для улучшения опыта',
      account: 'Аккаунт',
      clearData: 'Очистить все данные',
      clearDescription: 'Удалить все ваши данные с этого устройства',
      logout: 'Выйти',
      light: 'Светлая',
      dark: 'Темная',
      english: 'English',
      russian: 'Русский'
    }
  };

  const t = text[language];

  return (
    <div className="space-y-6">
      <Reveal className="surface-card p-6">
        <h2 className="text-2xl font-semibold text-black mb-6">{t.title}</h2>

        {/* Personal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-black mb-4">{t.personalInfo}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">{t.name}</label>
              <div className="surface-muted px-4 py-3 rounded-lg text-black/70">{user.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">{t.email}</label>
              <div className="surface-muted px-4 py-3 rounded-lg text-black/70">{user.email}</div>
            </div>
            {user.avatar && (
              <div>
                <label className="block text-sm font-medium text-black/70 mb-2">{t.avatar}</label>
                <div className="flex items-center gap-3 px-4 py-3 surface-muted rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-black text-contrast flex items-center justify-center overflow-hidden">
                    {user.avatar.image ? (
                      <img
                        src={user.avatar.image}
                        alt={user.avatar.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs">{user.avatar.name.slice(0, 1)}</span>
                    )}
                  </div>
                  <span className="text-black/70">{user.avatar.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-black mb-4">{t.preferences}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">{t.language}</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="input-field"
              >
                <option value="en">{t.english}</option>
                <option value="rus">{t.russian}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">{t.theme}</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="input-field"
              >
                <option value="light">{t.light}</option>
                <option value="dark">{t.dark}</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-black/70">{t.notifications}</div>
                <div className="text-sm text-black/50">Enable push notifications</div>
              </div>
              <button
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
                className="toggle"
                data-checked={settings.notifications}
              >
                <div className="toggle-thumb" />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-black mb-4">{t.privacy}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-black/70">{t.dataLogging}</div>
                <div className="text-sm text-black/50">{t.dataDescription}</div>
              </div>
              <button
                onClick={() => handleSettingChange('dataLogging', !settings.dataLogging)}
                className="toggle"
                data-checked={settings.dataLogging}
              >
                <div className="toggle-thumb" />
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">{t.account}</h3>
          <div className="space-y-3">
            <button
              onClick={handleClearData}
              className="w-full text-left px-4 py-3 surface-muted border border-black/10 rounded-lg text-black hover:border-black transition-colors"
            >
              <div className="font-medium">{t.clearData}</div>
              <div className="text-sm text-black/60">{t.clearDescription}</div>
            </button>
            
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-3 surface-muted border border-black/10 rounded-lg text-black/70 hover:border-black transition-colors"
            >
              <div className="font-medium">{t.logout}</div>
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
