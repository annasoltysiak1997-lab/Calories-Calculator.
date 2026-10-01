import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { iconProps, type IconComponent } from './Icon';

export type ButtonVariant = 'primary' | 'dark' | 'secondary' | 'link';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: 'lg' | 'md';
  icon?: IconComponent;
  /** Second line, e.g. "150 g · 98 kcal" */
  sub?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  /** Preview only: render a state without interaction. */
  demoState?: 'pressed' | 'focused';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'lg', icon: Icon, sub, loading, fullWidth, demoState, disabled, children, className = '', ...rest }: ButtonProps) {
  const lead = loading ? <span className="dl-spinner" aria-hidden="true" /> : Icon ? <Icon {...iconProps(20)} /> : null;
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled}
      aria-busy={loading || undefined}
      data-state={demoState}
      className={`dl-button dl-button--${variant} dl-button--${size} ${fullWidth ? 'dl-button--full' : ''} ${className}`}
      onClick={loading ? undefined : rest.onClick}
    >
      <span className="dl-button__row">{lead}{children}</span>
      {sub ? <span className="dl-button__sub">{sub}</span> : null}
    </button>
  );
}
