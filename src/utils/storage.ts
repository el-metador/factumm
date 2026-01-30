import { User, DailyQuiz, Challenge, ChatMessage, SleepData, MarathonState } from '../types';
import { avatars } from '../data/avatars';

const STORAGE_KEYS = {
  USER: 'factum_user',
  DAILY_QUIZZES: 'factum_daily_quizzes',
  CHALLENGES: 'factum_challenges',
  CHAT_MESSAGES: 'factum_chat_messages',
  SLEEP_DATA: 'factum_sleep_data',
  MARATHON: 'factum_marathon',
} as const;

const safeJsonParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const reviveUser = (user: User | null): User | null => {
  if (!user) return null;
  const createdAt = new Date(user.createdAt);
  const matchedAvatar = user.avatar
    ? avatars.find((avatar) => avatar.type === user.avatar?.type)
    : undefined;
  return {
    ...user,
    avatar: user.avatar
      ? {
          ...user.avatar,
          image: user.avatar.image ?? matchedAvatar?.image ?? ''
        }
      : undefined,
    createdAt: Number.isNaN(createdAt.getTime()) ? new Date() : createdAt
  };
};

const reviveChatMessages = (messages: ChatMessage[]): ChatMessage[] => {
  return messages.map((message) => {
    const timestamp = new Date(message.timestamp);
    return {
      ...message,
      timestamp: Number.isNaN(timestamp.getTime()) ? new Date() : timestamp
    };
  });
};

export const storage = {
  // User data
  getUser: (): User | null => {
    const data = safeJsonParse<User | null>(localStorage.getItem(STORAGE_KEYS.USER), null);
    return reviveUser(data);
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // Daily quizzes
  getDailyQuizzes: (): DailyQuiz[] => {
    return safeJsonParse<DailyQuiz[]>(localStorage.getItem(STORAGE_KEYS.DAILY_QUIZZES), []);
  },

  addDailyQuiz: (quiz: DailyQuiz): void => {
    const quizzes = storage.getDailyQuizzes();
    quizzes.push(quiz);
    localStorage.setItem(STORAGE_KEYS.DAILY_QUIZZES, JSON.stringify(quizzes));
  },

  // Challenges
  getChallenges: (): Challenge[] => {
    return safeJsonParse<Challenge[]>(localStorage.getItem(STORAGE_KEYS.CHALLENGES), []);
  },

  setChallenges: (challenges: Challenge[]): void => {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  },

  // Chat messages
  getChatMessages: (): ChatMessage[] => {
    const data = safeJsonParse<ChatMessage[]>(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES), []);
    return reviveChatMessages(data);
  },

  addChatMessage: (message: ChatMessage): void => {
    const messages = storage.getChatMessages();
    messages.push(message);
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  },

  // Sleep data
  getSleepData: (): SleepData | null => {
    return safeJsonParse<SleepData | null>(localStorage.getItem(STORAGE_KEYS.SLEEP_DATA), null);
  },

  setSleepData: (sleepData: SleepData): void => {
    localStorage.setItem(STORAGE_KEYS.SLEEP_DATA, JSON.stringify(sleepData));
  },

  // Marathon
  getMarathon: (): MarathonState | null => {
    return safeJsonParse<MarathonState | null>(localStorage.getItem(STORAGE_KEYS.MARATHON), null);
  },

  setMarathon: (state: MarathonState): void => {
    localStorage.setItem(STORAGE_KEYS.MARATHON, JSON.stringify(state));
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
