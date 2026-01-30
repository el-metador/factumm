import React, { useState, useEffect } from 'react';
import { User, SleepData } from '../types';
import { calculateOptimalWakeOptions, calculateSleepQuality } from '../utils/sleepCalculator';
import { storage } from '../utils/storage';
import { Reveal } from './Reveal';
import { Icon } from './icons';

interface SleepTrackerProps {
  user: User;
}

export function SleepTracker({ user }: SleepTrackerProps) {
  const [sleepData, setSleepData] = useState<SleepData | null>(null);
  const [bedTime, setBedTime] = useState('22:30');
  const [targetSleep, setTargetSleep] = useState(8);
  const [actualWakeTime, setActualWakeTime] = useState('');
  const language = user.settings.language;

  useEffect(() => {
    const saved = storage.getSleepData();
    if (saved) {
      setSleepData(saved);
      setBedTime(saved.bedTime);
      setTargetSleep(saved.targetSleep);
    }
  }, []);

  const calculateWakeTimes = () => {
    const wakeOptions = calculateOptimalWakeOptions(bedTime, targetSleep);
    const middleOption = wakeOptions[Math.floor(wakeOptions.length / 2)];
    if (!middleOption) return;
    const newSleepData: SleepData = {
      bedTime,
      wakeTime: middleOption.time,
      targetSleep,
      cycles: Math.round((targetSleep * 60) / 90)
    };
    setSleepData(newSleepData);
    storage.setSleepData(newSleepData);
  };

  const logWakeTime = () => {
    if (!actualWakeTime || !sleepData) return;

    const parseTime = (value: string) => {
      const [hours, minutes] = value.split(':').map(Number);
      return { hours, minutes };
    };

    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    const bedParts = parseTime(bedTime);
    const wakeParts = parseTime(actualWakeTime);

    const bedTimeDate = new Date(baseDate);
    bedTimeDate.setHours(bedParts.hours, bedParts.minutes, 0, 0);

    const wakeTimeDate = new Date(baseDate);
    wakeTimeDate.setHours(wakeParts.hours, wakeParts.minutes, 0, 0);

    if (wakeTimeDate <= bedTimeDate) {
      wakeTimeDate.setDate(wakeTimeDate.getDate() + 1);
    }

    const actualSleepHours = (wakeTimeDate.getTime() - bedTimeDate.getTime()) / (1000 * 60 * 60);
    
    const quality = calculateSleepQuality(actualSleepHours, targetSleep);
    
    // Here you would typically save this to a sleep log
    alert(`Sleep quality: ${quality}%`);
  };

  const text = {
    en: {
      title: 'Sleep Tracker',
      subtitle: 'Optimize your rest with sleep cycle science',
      bedTime: 'Bedtime',
      targetHours: 'Target Sleep Hours',
      calculate: 'Calculate Optimal Wake Times',
      optimalTimes: 'Optimal Wake Times',
      description: 'Based on 90-minute sleep cycles',
      logActual: 'Log Actual Wake Time',
      actualWake: 'Actual Wake Time',
      submit: 'Log Sleep',
      tip: 'Tip: Waking up at the end of a sleep cycle helps you feel more refreshed!'
    },
    rus: {
      title: 'Трекер сна',
      subtitle: 'Оптимизируйте отдых с помощью науки о циклах сна',
      bedTime: 'Время сна',
      targetHours: 'Целевые часы сна',
      calculate: 'Рассчитать оптимальное время пробуждения',
      optimalTimes: 'Оптимальное время пробуждения',
      description: 'Основано на 90-минутных циклах сна',
      logActual: 'Записать фактическое время пробуждения',
      actualWake: 'Фактическое время пробуждения',
      submit: 'Записать сон',
      tip: 'Совет: Пробуждение в конце цикла сна помогает чувствовать себя более отдохнувшим!'
    }
  };

  const t = text[language];

  const wakeOptions = sleepData ? calculateOptimalWakeOptions(bedTime, targetSleep) : [];

  return (
    <div className="space-y-6">
      <Reveal className="surface-card p-6">
        <h2 className="text-2xl font-semibold text-black mb-2">{t.title}</h2>
        <p className="text-black/60 mb-6">{t.subtitle}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black/70 mb-2">
              {t.bedTime}
            </label>
            <input
              type="time"
              value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-2">
              {t.targetHours}
            </label>
            <select
              value={targetSleep}
              onChange={(e) => setTargetSleep(Number(e.target.value))}
              className="input-field"
            >
              {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(hours => (
                <option key={hours} value={hours}>{hours} hours</option>
              ))}
            </select>
          </div>

          <button
            onClick={calculateWakeTimes}
            className="btn-primary w-full"
          >
            {t.calculate}
          </button>
        </div>
      </Reveal>

      {sleepData && wakeOptions.length > 0 && (
        <Reveal className="surface-card p-6">
          <h3 className="text-lg font-semibold text-black mb-2">{t.optimalTimes}</h3>
          <p className="text-sm text-black/60 mb-4">{t.description}</p>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {wakeOptions.map((option, index) => (
              <div key={index} className="surface-muted rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-black">{option.time}</div>
                <div className="text-xs text-black/60">
                  {option.cycles} cycles
                </div>
              </div>
            ))}
          </div>

          <div className="surface-muted rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-black/70">
              <Icon name="info" className="h-4 w-4" />
              <span>{t.tip}</span>
            </div>
          </div>
        </Reveal>
      )}

      <Reveal className="surface-card p-6">
        <h3 className="text-lg font-semibold text-black mb-4">{t.logActual}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black/70 mb-2">
              {t.actualWake}
            </label>
            <input
              type="time"
              value={actualWakeTime}
              onChange={(e) => setActualWakeTime(e.target.value)}
              className="input-field"
            />
          </div>

          <button
            onClick={logWakeTime}
            disabled={!actualWakeTime}
            className="btn-primary w-full"
          >
            {t.submit}
          </button>
        </div>
      </Reveal>
    </div>
  );
}
