export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: Avatar;
  level: number;
  experience: number;
  title: string;
  streak: number;
  completedChallenges: string[];
  settings: UserSettings;
  createdAt: Date;
}

export interface UserSettings {
  language: 'en' | 'rus';
  theme: 'light' | 'dark';
  notifications: boolean;
  dataLogging: boolean;
}

export interface Avatar {
  id: string;
  name: string;
  type: 'Luna' | 'Sunny' | 'Sage' | 'Spark' | 'Haven';
  description: string;
  color: string;
  image: string;
  traits: string[];
}

export interface MarathonEntry {
  date: string;
  day: number;
  responses: Record<string, string>;
  notes: {
    changes: string;
    significant: string;
    note: string;
  };
}

export interface MarathonState {
  startDate?: string;
  entries: MarathonEntry[];
}

export interface QuizQuestion {
  id: string;
  text: {
    en: string;
    rus: string;
  };
  options: {
    text: {
      en: string;
      rus: string;
    };
    value: string;
    weights: {
      Luna: number;
      Sunny: number;
      Sage: number;
      Spark: number;
      Haven: number;
    };
  }[];
}

export interface DailyQuiz {
  id: string;
  date: string;
  questions: QuizQuestion[];
  responses: Record<string, string>;
  moodScore: number;
}

export interface Challenge {
  id: string;
  avatarType: string;
  title: {
    en: string;
    rus: string;
  };
  description: {
    en: string;
    rus: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  experience: number;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'avatar';
  content: string;
  timestamp: Date;
  avatarType?: string;
}

export interface SleepData {
  bedTime: string;
  wakeTime: string;
  targetSleep: number; // hours
  cycles: number;
}
