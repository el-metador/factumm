-- Factum backend schema (PostgreSQL / Supabase friendly)

create extension if not exists "pgcrypto";

create table if not exists avatars (
  id text primary key,
  name text not null,
  type text not null,
  description text not null,
  color text not null,
  icon text not null,
  traits text[] not null default '{}'
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  avatar_id text references avatars(id),
  level integer not null default 1,
  experience integer not null default 0,
  title text not null,
  streak integer not null default 0,
  completed_challenges text[] not null default '{}',
  settings jsonb not null default jsonb_build_object(
    'language', 'en',
    'theme', 'light',
    'notifications', true,
    'dataLogging', false
  ),
  created_at timestamptz not null default now()
);

create table if not exists daily_quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  quiz_date date not null,
  mood_score integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, quiz_date)
);

create table if not exists daily_quiz_responses (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references daily_quizzes(id) on delete cascade,
  question_id text not null,
  response_value text not null
);

create table if not exists marathon_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  entry_date date not null,
  day_number integer not null,
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create table if not exists marathon_responses (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references marathon_entries(id) on delete cascade,
  question_id text not null,
  response_value text not null
);

create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  avatar_type text not null,
  title_en text not null,
  title_rus text not null,
  description_en text not null,
  description_rus text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  experience integer not null default 0,
  is_active boolean not null default true
);

create table if not exists user_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  challenge_id uuid not null references challenges(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  avatar_type text,
  role text not null check (role in ('user', 'avatar')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  bed_time time not null,
  wake_time time not null,
  target_sleep numeric(4, 2) not null,
  cycles integer not null default 0,
  log_date date not null default current_date
);

create index if not exists idx_daily_quizzes_user_date on daily_quizzes (user_id, quiz_date);
create index if not exists idx_marathon_entries_user_date on marathon_entries (user_id, entry_date);
create index if not exists idx_chat_messages_user_date on chat_messages (user_id, created_at desc);
create index if not exists idx_sleep_logs_user_date on sleep_logs (user_id, log_date desc);
