import type { ElementType, ReactNode } from 'react';

interface CardProps {
  tone?: 'default' | 'subtle' | 'accent';
  radius?: 'xl' | 'lg';
  flush?: boolean;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** White surface on the warm canvas (e1). "accent" is reserved for My portion. */
export function Card({ tone = 'default', radius = 'xl', flush, as: Tag = 'section', className = '', children }: CardProps) {
  const cls = ['dl-card', tone !== 'default' && `dl-card--${tone}`, radius === 'lg' && 'dl-card--lg-radius', flush && 'dl-card--flush', className]
    .filter(Boolean).join(' ');
  return <Tag className={cls}>{children}</Tag>;
}
