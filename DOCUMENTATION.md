# Factum Documentation

## 1. Overview

Factum is a client-side application (React + Vite) that helps users with daily self-reflection. Core scenarios:
- personalized avatar companion matching;
- daily check-ins and progress growth;
- companion chat (Gemini + local fallback);
- sleep tracking and a 30-day reflection marathon.

The app **is not a medical service** and does not diagnose or prescribe treatment; this is explicitly enforced in the AI prompt.

## 2. Architecture and app state

### 2.1 App states (`src/App.tsx`)

The app acts as a finite state machine with four states:
- `auth` — sign in / sign up;
- `quiz` — initial avatar matching quiz;
- `reveal` — avatar introduction screen;
- `main` — main UI and navigation.

`currentView` controls tabs inside `main`:
`dashboard | chat | sleep | quiz | progress | marathon | settings`.

### 2.2 Key components

- `Layout` — top bar, level indicator, bottom navigation.
- `Dashboard` — greeting, streak, experience, quick actions.
- `ChatScreen` — chat with the avatar.
- `DailyQuiz` — daily check-in.
- `SleepTracker` — sleep recommendations.
- `ProgressScreen` — levels/achievements/trends.
- `MarathonScreen` — 30-day journal.
- `Settings` — language/theme/privacy/data reset.

## 3. Authentication

- Implemented with **Supabase Auth** (`src/utils/supabase.ts`).
- Sign in: email+password (`signInWithPassword`) or Google OAuth.
- A local `User` model is created via `buildUserFromSupabase` after sign-in.
- Hydration flow:
  - read user from `localStorage` first;
  - check active Supabase session (if present);
  - rebuild user when auth state changes.

## 4. Avatar matching

- Quiz data lives in `src/data/quiz.ts` (`avatarSelectionQuiz`).
- Each answer has weights per avatar type.
- `calculateAvatarMatch` sums weights and selects the top score.
- The chosen avatar is stored in `user.avatar` and used across screens.

Avatars are defined in `src/data/avatars.ts`:
`Luna`, `Sunny`, `Sage`, `Spark`, `Haven` — each with description, traits, and image.

## 5. Companion chat

- `ChatScreen` stores history in `localStorage`.
- On first launch, it inserts a welcome message from the avatar.
- **Gemini** is used for response generation (`src/utils/gemini.ts`).
  - Model: `gemini-1.5-flash`.
  - The prompt includes persona, tone, and avatar specialties.
  - Context includes the last **8 messages**.
- If Gemini is unavailable or keys are missing, the app uses local fallback responses via `generateAvatarResponse`.

## 6. Daily check-in

- `DailyQuiz` uses a local date key (`YYYY-MM-DD`).
- Only **one** quiz is allowed per day.
- On completion:
  - calculates `moodScore` (0–100);
  - grants **+25 experience**;
  - increments `streak` by 1.

## 7. Progress and levels

- `calculateLevel` (`src/utils/levels.ts`) determines level and progress to next level.
- `ProgressScreen` calculates average `moodScore` over the last 7 days.
- Achievements depend on:
  - at least one daily check-in;
  - streak >= 7;
  - at least one user message in chat.

## 8. Sleep tracker

- `calculateOptimalWakeOptions` computes 3 wake times around target sleep.
- Based on **90-minute sleep cycles**.
- Logging actual wake time is **not persisted** yet; it only shows a quality score (alert).

## 9. 30-day marathon

- Stored in `localStorage` as `MarathonState`.
- Each day includes:
  - 5 required questions;
  - at least 1 note.
- After 30 entries, an automatic summary is generated (changes, meaningful actions, notes).

## 10. Settings

- Language: `en` or `rus`.
- Theme: `light` or `dark` via `data-theme` on `<html>`.
- Notifications/data logging are local toggles only.
- Data wipe triggers `storage.clearAll()`.

## 11. Local storage keys

- `factum_user`
- `factum_daily_quizzes`
- `factum_challenges`
- `factum_chat_messages`
- `factum_sleep_data`
- `factum_marathon`

Dates are revived in `storage.ts` via helper functions for users and chat messages.

## 12. Themes and design system

- Theme tokens live in `src/index.css`.
- Light and dark themes are supported.
- `Reveal` animations are handled via `IntersectionObserver` (`useRevealOnScroll`).
- `prefers-reduced-motion` is respected.

## 13. Environment variables

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_GEMINI_API_KEY=...
VITE_GEMINI_API_KEY_2=...
VITE_GEMINI_API_KEY_3=...
```

## 14. Database schema (optional)

`sql_scheme.sql` contains a full PostgreSQL/Supabase schema, including:
- `users`, `avatars` — profiles and avatars;
- `daily_quizzes`, `daily_quiz_responses` — check-ins;
- `marathon_entries`, `marathon_responses` — marathon entries;
- `chat_messages` — conversation history;
- `sleep_logs` — sleep logs;
- `challenges`, `user_challenges` — tasks and progress.

The current frontend **does not write** to these tables, aside from Supabase auth.

---

To integrate backend storage, extend `storage.ts`, add API calls in `utils`, and update types in `src/types`.
