import type { ElementType, ReactNode } from 'react';
import type { TextVariant } from '../../theme/typography';

export type Tone = 'primary' | 'secondary' | 'accent' | 'danger' | 'on-accent';

interface TextProps {
  variant?: TextVariant;
  tone?: Tone;
  as?: ElementType;
  caps?: boolean;
  className?: string;
  children: ReactNode;
  id?: string;
}

/** Applies one of the 12 Daylight text styles through CSS variables. */
export function Text({ variant = 'body', tone = 'primary', as: Tag = 'span', caps, className = '', children, id }: TextProps) {
  const style = {
    fontSize: `var(--dl-text-${variant}-size)`,
    lineHeight: `var(--dl-text-${variant}-line)`,
    fontWeight: `var(--dl-text-${variant}-weight)` as unknown as number,
    letterSpacing: `var(--dl-text-${variant}-tracking)`,
  };
  return (
    <Tag id={id} className={`dl-text dl-text--${variant} dl-tone--${tone} ${className}`} data-caps={caps ? 'true' : undefined} style={style}>
      {children}
    </Tag>
  );
}
