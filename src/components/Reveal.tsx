import React from 'react';
import { useRevealOnScroll } from '../utils/useRevealOnScroll';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
}

export function Reveal({ children, className = '' }: RevealProps) {
  const ref = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </div>
  );
}
