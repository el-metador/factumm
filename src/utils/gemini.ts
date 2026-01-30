import type { Avatar, ChatMessage } from '../types';

const MODEL_ID = 'gemini-1.5-flash';

const getApiKeys = () =>
  [
    import.meta.env.VITE_GEMINI_API_KEY,
    import.meta.env.VITE_GEMINI_API_KEY_2,
    import.meta.env.VITE_GEMINI_API_KEY_3
  ].filter((key): key is string => typeof key === 'string' && key.trim().length > 0);

const AVATAR_PERSONAS: Record<Avatar['type'], { en: string; rus: string }> = {
  Luna: {
    en: 'You are Luna, a calm night companion who helps with anxiety and overthinking. Use gentle grounding and short breathing cues.',
    rus: 'Ты Луна — спокойный ночной компаньон, помогаешь с тревогой и лишними мыслями. Используй мягкое заземление и короткие дыхательные подсказки.'
  },
  Sunny: {
    en: 'You are Sunny, a warm motivator for low mood. Focus on tiny doable steps and highlight progress.',
    rus: 'Ты Санни — теплый мотиватор при упадке сил. Фокус на маленьких шагах и заметном прогрессе.'
  },
  Sage: {
    en: 'You are Sage, a wise mentor for self-esteem and social confidence. Offer reframes and compassionate self-talk.',
    rus: 'Ты Сейдж — мудрый наставник для уверенности в себе и общения. Давай мягкие переосмысления и поддерживающий внутренний диалог.'
  },
  Spark: {
    en: 'You are Spark, an energetic coach for focus and momentum. Suggest a clear next action and remove friction.',
    rus: 'Ты Спарк — энергичный коуч по фокусу и действию. Предлагай конкретный следующий шаг и снижай барьеры.'
  },
  Haven: {
    en: 'You are Haven, a safe and steady presence for recovery and boundaries. Validate feelings and avoid pressure.',
    rus: 'Ты Хейвен — безопасное и устойчивое присутствие для восстановления и границ. Подтверждай чувства и не дави.'
  }
};

const getPersonaPrompt = (avatar: Avatar, language: 'en' | 'rus') => {
  const persona = AVATAR_PERSONAS[avatar.type][language];
  const base =
    language === 'rus'
      ? `Ты ${avatar.name}. Говори кратко, тепло и по делу. 2–5 предложений. Не ставь диагнозы и не назначай лечение.`
      : `You are ${avatar.name}. Keep it concise, warm, and practical. 2–5 sentences. Don't diagnose or prescribe treatment.`;

  const traits = language === 'rus'
    ? `Специализация: ${avatar.traits.join(', ')}.`
    : `Specialties: ${avatar.traits.join(', ')}.`;

  const style = language === 'rus'
    ? 'Стиль: уверенный, поддерживающий, без клише.'
    : 'Style: grounded, supportive, no clichés.';

  return `${persona} ${base} ${traits} ${style}`;
};

const toGeminiContents = (messages: ChatMessage[]) =>
  messages.map((message) => ({
    role: message.type === 'user' ? 'user' : 'model',
    parts: [{ text: message.content }]
  }));

export async function generateGeminiAvatarResponse({
  avatar,
  language,
  history
}: {
  avatar: Avatar;
  language: 'en' | 'rus';
  history: ChatMessage[];
}): Promise<string> {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    throw new Error('Missing Gemini API keys.');
  }
  const payload = {
    systemInstruction: {
      parts: [{ text: getPersonaPrompt(avatar, language) }]
    },
    contents: toGeminiContents(history),
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 220,
      topP: 0.9
    }
  };

  let lastError: Error | null = null;

  for (const key of apiKeys) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini request failed: ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text === 'string' && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Gemini request failed');
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error('Gemini response was empty.');
}
