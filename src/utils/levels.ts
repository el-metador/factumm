export const levels = [
  { level: 1, title: { en: 'Fog Wanderer', rus: 'Странник в тумане' }, requiredExp: 0 },
  { level: 2, title: { en: 'Light Seeker', rus: 'Искатель света' }, requiredExp: 100 },
  { level: 3, title: { en: 'Shard Collector', rus: 'Собиратель осколков' }, requiredExp: 300 },
  { level: 4, title: { en: 'Balance Keeper', rus: 'Хранитель баланса' }, requiredExp: 600 },
  { level: 5, title: { en: 'Soul Gardener', rus: 'Садовник души' }, requiredExp: 1000 },
  { level: 6, title: { en: 'Inner Flame Guardian', rus: 'Страж внутреннего пламени' }, requiredExp: 1500 },
];

export function calculateLevel(experience: number): { level: number; title: { en: string; rus: string }; progress: number } {
  let currentLevel = levels[0];
  let nextLevel = levels[1];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (experience >= levels[i].requiredExp) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || levels[i];
      break;
    }
  }
  
  const progress = nextLevel === currentLevel ? 100 : 
    ((experience - currentLevel.requiredExp) / (nextLevel.requiredExp - currentLevel.requiredExp)) * 100;
  
  return {
    level: currentLevel.level,
    title: currentLevel.title,
    progress: Math.min(progress, 100)
  };
}