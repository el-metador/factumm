import { Avatar } from '../types';

export const avatars: Avatar[] = [
  {
    id: 'luna',
    name: 'Luna',
    type: 'Luna',
    description: 'Gentle companion for night anxiety and emotional sensitivity',
    color: 'from-zinc-900 to-zinc-700',
    image: '/avatars/luna.png',
    traits: ['night anxiety', 'emotional sensitivity', 'overthinking', 'sleep issues']
  },
  {
    id: 'sunny',
    name: 'Sunny',
    type: 'Sunny',
    description: 'Warm guide through light depression and low motivation',
    color: 'from-stone-900 to-stone-700',
    image: '/avatars/sunny.png',
    traits: ['light depression', 'apathy', 'low motivation', 'seasonal sadness']
  },
  {
    id: 'sage',
    name: 'Sage',
    type: 'Sage',
    description: 'Wise mentor for self-esteem and social confidence',
    color: 'from-slate-900 to-slate-700',
    image: '/avatars/sage.png',
    traits: ['low self-esteem', 'chronic self-doubt', 'social anxiety', 'imposter syndrome']
  },
  {
    id: 'spark',
    name: 'Spark',
    type: 'Spark',
    description: 'Energetic coach for motivation and focus',
    color: 'from-neutral-900 to-neutral-700',
    image: '/avatars/spark.png',
    traits: ['apathy', 'procrastination', 'executive dysfunction', 'lack of focus']
  },
  {
    id: 'haven',
    name: 'Haven',
    type: 'Haven',
    description: 'Safe space for trauma recovery and social healing',
    color: 'from-gray-900 to-gray-700',
    image: '/avatars/haven.png',
    traits: ['social anxiety', 'attachment issues', 'trauma', 'burnout']
  }
];
