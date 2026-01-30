import { QuizQuestion } from '../types';

export const avatarSelectionQuiz: QuizQuestion[] = [
  {
    id: 'mood_evening',
    text: {
      en: 'How do you typically feel in the evening?',
      rus: 'Как вы обычно чувствуете себя вечером?'
    },
    options: [
      {
        text: { en: 'Anxious and overthinking', rus: 'Тревожно и много думаю' },
        value: 'anxious',
        weights: { Luna: 3, Sunny: 1, Sage: 2, Spark: 1, Haven: 2 }
      },
      {
        text: { en: 'Tired and unmotivated', rus: 'Устал и без мотивации' },
        value: 'tired',
        weights: { Luna: 1, Sunny: 3, Sage: 1, Spark: 2, Haven: 2 }
      },
      {
        text: { en: 'Restless and unfocused', rus: 'Беспокойно и рассеянно' },
        value: 'restless',
        weights: { Luna: 2, Sunny: 1, Sage: 1, Spark: 3, Haven: 1 }
      },
      {
        text: { en: 'Peaceful and content', rus: 'Спокойно и довольно' },
        value: 'peaceful',
        weights: { Luna: 1, Sunny: 2, Sage: 2, Spark: 1, Haven: 1 }
      }
    ]
  },
  {
    id: 'social_interaction',
    text: {
      en: 'How do you feel about social interactions?',
      rus: 'Как вы относитесь к социальным взаимодействиям?'
    },
    options: [
      {
        text: { en: 'Draining and overwhelming', rus: 'Истощающе и подавляюще' },
        value: 'draining',
        weights: { Luna: 2, Sunny: 1, Sage: 3, Spark: 1, Haven: 3 }
      },
      {
        text: { en: 'Enjoyable but rare', rus: 'Приятно, но редко' },
        value: 'rare',
        weights: { Luna: 1, Sunny: 3, Sage: 2, Spark: 2, Haven: 2 }
      },
      {
        text: { en: 'Energizing when focused', rus: 'Заряжающе, когда сфокусирован' },
        value: 'energizing',
        weights: { Luna: 1, Sunny: 2, Sage: 1, Spark: 3, Haven: 1 }
      },
      {
        text: { en: 'Natural and comfortable', rus: 'Естественно и комфортно' },
        value: 'natural',
        weights: { Luna: 1, Sunny: 2, Sage: 1, Spark: 2, Haven: 1 }
      }
    ]
  },
  {
    id: 'self_perception',
    text: {
      en: 'How do you typically view yourself?',
      rus: 'Как вы обычно воспринимаете себя?'
    },
    options: [
      {
        text: { en: 'Too sensitive and emotional', rus: 'Слишком чувствительный и эмоциональный' },
        value: 'sensitive',
        weights: { Luna: 3, Sunny: 1, Sage: 2, Spark: 1, Haven: 2 }
      },
      {
        text: { en: 'Lacking motivation and purpose', rus: 'Не хватает мотивации и цели' },
        value: 'unmotivated',
        weights: { Luna: 1, Sunny: 3, Sage: 2, Spark: 2, Haven: 1 }
      },
      {
        text: { en: 'Not good enough compared to others', rus: 'Недостаточно хорош по сравнению с другими' },
        value: 'inadequate',
        weights: { Luna: 1, Sunny: 2, Sage: 3, Spark: 1, Haven: 2 }
      },
      {
        text: { en: 'Struggling with focus and consistency', rus: 'Борюсь с фокусом и последовательностью' },
        value: 'unfocused',
        weights: { Luna: 2, Sunny: 2, Sage: 1, Spark: 3, Haven: 1 }
      },
      {
        text: { en: 'Overwhelmed by past experiences', rus: 'Подавлен прошлым опытом' },
        value: 'overwhelmed',
        weights: { Luna: 2, Sunny: 1, Sage: 2, Spark: 1, Haven: 3 }
      }
    ]
  },
  {
    id: 'energy_patterns',
    text: {
      en: 'When do you feel most energetic?',
      rus: 'Когда вы чувствуете себя наиболее энергичным?'
    },
    options: [
      {
        text: { en: 'Late at night when alone', rus: 'Поздно ночью, когда один' },
        value: 'night',
        weights: { Luna: 3, Sunny: 1, Sage: 1, Spark: 2, Haven: 1 }
      },
      {
        text: { en: 'Rarely feel energetic', rus: 'Редко чувствую себя энергичным' },
        value: 'rarely',
        weights: { Luna: 1, Sunny: 3, Sage: 1, Spark: 1, Haven: 2 }
      },
      {
        text: { en: 'In bursts, unpredictably', rus: 'Вспышками, непредсказуемо' },
        value: 'bursts',
        weights: { Luna: 2, Sunny: 2, Sage: 1, Spark: 3, Haven: 1 }
      },
      {
        text: { en: 'In safe, comfortable environments', rus: 'В безопасной, комфортной обстановке' },
        value: 'safe',
        weights: { Luna: 1, Sunny: 2, Sage: 2, Spark: 1, Haven: 3 }
      }
    ]
  },
  {
    id: 'coping_mechanisms',
    text: {
      en: 'How do you typically handle stress?',
      rus: 'Как вы обычно справляетесь со стрессом?'
    },
    options: [
      {
        text: { en: 'Overthink and worry at night', rus: 'Много думаю и беспокоюсь ночью' },
        value: 'overthink',
        weights: { Luna: 3, Sunny: 1, Sage: 2, Spark: 1, Haven: 1 }
      },
      {
        text: { en: 'Withdraw and sleep more', rus: 'Замыкаюсь и больше сплю' },
        value: 'withdraw',
        weights: { Luna: 1, Sunny: 3, Sage: 1, Spark: 1, Haven: 2 }
      },
      {
        text: { en: 'Doubt myself and avoid challenges', rus: 'Сомневаюсь в себе и избегаю вызовов' },
        value: 'doubt',
        weights: { Luna: 1, Sunny: 2, Sage: 3, Spark: 1, Haven: 2 }
      },
      {
        text: { en: 'Procrastinate and feel scattered', rus: 'Прокрастинирую и чувствую себя разбросанным' },
        value: 'procrastinate',
        weights: { Luna: 1, Sunny: 2, Sage: 1, Spark: 3, Haven: 1 }
      },
      {
        text: { en: 'Isolate and feel overwhelmed', rus: 'Изолируюсь и чувствую себя подавленным' },
        value: 'isolate',
        weights: { Luna: 2, Sunny: 1, Sage: 2, Spark: 1, Haven: 3 }
      }
    ]
  }
];

export const dailyQuizQuestions: QuizQuestion[] = [
  {
    id: 'daily_mood',
    text: {
      en: 'How are you feeling today?',
      rus: 'Как вы себя чувствуете сегодня?'
    },
    options: [
      {
        text: { en: 'Great! Full of energy', rus: 'Отлично! Полон энергии' },
        value: 'great',
        weights: { Luna: 1, Sunny: 1, Sage: 1, Spark: 1, Haven: 1 }
      },
      {
        text: { en: 'Good, generally positive', rus: 'Хорошо, в целом позитивно' },
        value: 'good',
        weights: { Luna: 1, Sunny: 1, Sage: 1, Spark: 1, Haven: 1 }
      },
      {
        text: { en: 'Okay, neutral', rus: 'Нормально, нейтрально' },
        value: 'okay',
        weights: { Luna: 1, Sunny: 1, Sage: 1, Spark: 1, Haven: 1 }
      },
      {
        text: { en: 'Not great, struggling', rus: 'Не очень, борюсь' },
        value: 'struggling',
        weights: { Luna: 1, Sunny: 1, Sage: 1, Spark: 1, Haven: 1 }
      },
      {
        text: { en: 'Difficult day', rus: 'Трудный день' },
        value: 'difficult',
        weights: { Luna: 1, Sunny: 1, Sage: 1, Spark: 1, Haven: 1 }
      }
    ]
  },
  {
    id: 'sleep_quality',
    text: {
      en: 'How did you sleep last night?',
      rus: 'Как вы спали прошлой ночью?'
    },
    options: [
      {
        text: { en: 'Very well, refreshed', rus: 'Очень хорошо, отдохнул' },
        value: 'excellent',
        weights: { Luna: 1, Sunny: 1, Sage: 1, Spark: 1, Haven: 1 }
      },
      {
        text: { en: 'Pretty good', rus: 'Довольно хорошо' },
        value: 'good',
        weights: { Luna: 1, Sunny: 1, Sage: 1, Spark: 1, Haven: 1 }
      },
      {
        text: { en: 'Okay, some issues', rus: 'Нормально, были проблемы' },
        value: 'okay',
        weights: { Luna: 1, Sunny: 1, Sage: 1, Spark: 1, Haven: 1 }
      },
      {
        text: { en: 'Restless, interrupted', rus: 'Беспокойно, прерывисто' },
        value: 'restless',
        weights: { Luna: 1, Sunny: 1, Sage: 1, Spark: 1, Haven: 1 }
      },
      {
        text: { en: 'Poorly, exhausted', rus: 'Плохо, измучен' },
        value: 'poor',
        weights: { Luna: 1, Sunny: 1, Sage: 1, Spark: 1, Haven: 1 }
      }
    ]
  }
];