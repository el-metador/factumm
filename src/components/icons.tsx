import React from 'react';

type IconName =
  | 'home'
  | 'chat'
  | 'sleep'
  | 'progress'
  | 'settings'
  | 'quiz'
  | 'marathon'
  | 'target'
  | 'flame'
  | 'star'
  | 'badge'
  | 'check'
  | 'info'
  | 'user';

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  switch (name) {
    case 'home':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 10v9h14v-9" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <path d="M6 18l-2.5 3V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6z" />
          <path d="M8 9h8" />
          <path d="M8 12.5h6" />
        </svg>
      );
    case 'sleep':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <path d="M21 14.5a8.5 8.5 0 1 1-8-11 7 7 0 0 0 8 11z" />
        </svg>
      );
    case 'progress':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <path d="M4 19V5" />
          <path d="M9 19v-6" />
          <path d="M14 19v-9" />
          <path d="M19 19V8" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.6-.9l-.4-2.6h-4l-.4 2.6a7 7 0 0 0-1.6.9l-2.4-1-2 3.4 2 1.6a7 7 0 0 0-.1 1c0 .34.03.68.1 1l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.6.9l.4 2.6h4l.4-2.6a7 7 0 0 0 1.6-.9l2.4 1 2-3.4-2-1.6c.07-.32.1-.66.1-1z" />
        </svg>
      );
    case 'quiz':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <path d="M6 4h9a3 3 0 0 1 3 3v12H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" />
          <path d="M8 9h6" />
          <path d="M8 13h4" />
        </svg>
      );
    case 'marathon':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M7 3v4" />
          <path d="M17 3v4" />
          <path d="M7.5 12h4.5" />
          <path d="M7.5 15.5h7" />
        </svg>
      );
    case 'target':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="7.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );
    case 'flame':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <path d="M12 3s4 3 4 7a4 4 0 1 1-8 0c0-2.5 2-4.5 4-7z" />
          <path d="M9.5 14.5c0 1.4 1.1 2.5 2.5 2.5" />
        </svg>
      );
    case 'star':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <path d="M12 3.5l2.5 5 5.5.8-4 3.9.9 5.6-4.9-2.6-4.9 2.6.9-5.6-4-3.9 5.5-.8z" />
        </svg>
      );
    case 'badge':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <circle cx="12" cy="9" r="5" />
          <path d="M8.5 14.5l-1 6 4.5-2.5 4.5 2.5-1-6" />
        </svg>
      );
    case 'check':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
      );
    case 'info':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10.5v5" />
          <path d="M12 7.5h.01" />
        </svg>
      );
    case 'user':
      return (
        <svg {...baseProps} className={className} aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0" />
        </svg>
      );
    default:
      return null;
  }
}
