import { createClient, type User as SupabaseUser } from '@supabase/supabase-js';
import type { User } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://iywjfmpzseluwxtfhfcr.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_wpbyjVjFFSW3fa5tXNzDdQ_Qjs55aLg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

const getDisplayName = (user: SupabaseUser): string => {
  const metadata = user.user_metadata ?? {};
  const rawName =
    metadata.full_name ||
    metadata.name ||
    metadata.preferred_username ||
    metadata.user_name ||
    metadata.username;

  if (typeof rawName === 'string' && rawName.trim()) {
    return rawName.trim();
  }

  if (user.email) {
    return user.email.split('@')[0] ?? 'Friend';
  }

  return 'Friend';
};

export const buildUserFromSupabase = (
  supabaseUser: SupabaseUser,
  fallbackLanguage: 'en' | 'rus',
  existingUser?: User | null
): User => {
  const email = supabaseUser.email ?? existingUser?.email ?? '';
  const baseUser: User = {
    id: supabaseUser.id,
    email,
    name: getDisplayName(supabaseUser),
    level: 1,
    experience: 0,
    title: fallbackLanguage === 'rus' ? 'Странник в тумане' : 'Fog Wanderer',
    streak: 0,
    completedChallenges: [],
    settings: {
      language: fallbackLanguage,
      theme: 'dark',
      notifications: true,
      dataLogging: false
    },
    createdAt: new Date()
  };

  if (existingUser && existingUser.email === email) {
    return {
      ...baseUser,
      ...existingUser,
      id: supabaseUser.id,
      email,
      name: existingUser.name || baseUser.name,
      settings: {
        ...baseUser.settings,
        ...existingUser.settings
      }
    };
  }

  return baseUser;
};
