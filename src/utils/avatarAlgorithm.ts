import { avatarSelectionQuiz } from '../data/quiz';
import { avatars } from '../data/avatars';
import { Avatar } from '../types';

export function calculateAvatarMatch(responses: Record<string, string>): Avatar {
  const scores = {
    Luna: 0,
    Sunny: 0,
    Sage: 0,
    Spark: 0,
    Haven: 0
  };

  // Calculate scores based on quiz responses
  avatarSelectionQuiz.forEach(question => {
    const response = responses[question.id];
    if (response) {
      const selectedOption = question.options.find(opt => opt.value === response);
      if (selectedOption) {
        Object.entries(selectedOption.weights).forEach(([avatarType, weight]) => {
          scores[avatarType as keyof typeof scores] += weight;
        });
      }
    }
  });

  // Find the avatar with the highest score
  const topAvatar = Object.entries(scores).reduce((a, b) => 
    scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
  )[0];

  return avatars.find(avatar => avatar.type === topAvatar) || avatars[0];
}

export function generateAvatarResponse(avatarType: string, userMessage: string, language: 'en' | 'rus'): string {
  const responses: Record<string, { en: string[]; rus: string[] }> = {
    Luna: {
      en: [
        "I understand that feeling. Night thoughts can be overwhelming, but you're not alone in this.",
        "Those racing thoughts are valid, but let's find some peace together.",
        "Your sensitivity is actually a strength, even when it doesn't feel like it.",
        "I'm here to listen, without judgment. What's weighing on your heart tonight?"
      ],
      rus: [
        "Я понимаю это чувство. Ночные мысли могут быть подавляющими, но ты не одинок в этом.",
        "Эти беспокойные мысли реальны, но давай вместе найдем покой.",
        "Твоя чувствительность на самом деле сила, даже когда так не кажется.",
        "Я здесь, чтобы слушать, без осуждения. Что тяготит твое сердце сегодня?"
      ]
    },
    Sunny: {
      en: [
        "I see you, and your feelings are valid. Sometimes we need to start with tiny steps.",
        "It's okay to feel unmotivated. Let's find one small thing that might spark some light.",
        "You don't have to be 'on' all the time. Rest is part of healing too.",
        "Even on gray days, you're doing better than you think. What's one thing you're grateful for today?"
      ],
      rus: [
        "Я вижу тебя, и твои чувства важны. Иногда нужно начинать с маленьких шагов.",
        "Это нормально чувствовать себя без мотивации. Давай найдем что-то маленькое, что может зажечь свет.",
        "Тебе не нужно быть 'в форме' все время. Отдых тоже часть исцеления.",
        "Даже в серые дни ты справляешься лучше, чем думаешь. За что ты благодарен сегодня?"
      ]
    },
    Sage: {
      en: [
        "You're more capable than you believe. Self-doubt is just a voice, not the truth.",
        "Comparing yourself to others is like comparing your behind-the-scenes to their highlight reel.",
        "Your worth isn't determined by others' approval. You are enough, exactly as you are.",
        "What would you say to a friend feeling this way? Try showing yourself that same compassion."
      ],
      rus: [
        "Ты более способен, чем думаешь. Сомнения в себе - это просто голос, а не правда.",
        "Сравнивать себя с другими - как сравнивать свою закулисную жизнь с их лучшими моментами.",
        "Твоя ценность не определяется одобрением других. Ты достаточен, именно такой, какой ты есть.",
        "Что бы ты сказал другу, чувствующему то же самое? Попробуй проявить к себе такое же сочувствие."
      ]
    },
    Spark: {
      en: [
        "Let's break this down into bite-sized pieces. What's one tiny action you could take right now?",
        "Procrastination is often perfectionism in disguise. Good enough is better than perfect.",
        "Your brain works differently, and that's not a flaw. Let's find systems that work for you.",
        "Energy comes from action, not the other way around. What's the smallest step forward?"
      ],
      rus: [
        "Давай разобьем это на маленькие кусочки. Какое одно крошечное действие ты мог бы сделать прямо сейчас?",
        "Прокрастинация часто перфекционизм в маскировке. Достаточно хорошо лучше, чем идеально.",
        "Твой мозг работает по-другому, и это не недостаток. Давай найдем системы, которые работают для тебя.",
        "Энергия приходит от действий, а не наоборот. Какой самый маленький шаг вперед?"
      ]
    },
    Haven: {
      en: [
        "This is a safe space. You can share as much or as little as you're comfortable with.",
        "Your boundaries matter, and it's okay to protect your energy.",
        "Healing isn't linear. Some days will be harder, and that's part of the journey.",
        "You've survived difficult things before. That resilience is still within you."
      ],
      rus: [
        "Это безопасное место. Ты можешь делиться столько, сколько тебе комфортно.",
        "Твои границы важны, и это нормально защищать свою энергию.",
        "Исцеление не линейно. Некоторые дни будут тяжелее, и это часть пути.",
        "Ты уже переживал трудные времена. Эта стойкость все еще внутри тебя."
      ]
    }
  };

  const avatarResponses = responses[avatarType] || responses.Haven;
  const randomIndex = Math.floor(Math.random() * avatarResponses[language].length);
  return avatarResponses[language][randomIndex];
}