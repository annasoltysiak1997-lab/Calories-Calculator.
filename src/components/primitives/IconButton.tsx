import type { ButtonHTMLAttributes } from 'react';
import { iconProps, type IconComponent } from './Icon';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconComponent;
  /** Required accessible name. */
  label: string;
  variant?: 'filled' | 'subtle' | 'plain';
  badge?: number;
  demoState?: 'pressed' | 'focused';
}

export function IconButton({ icon: Icon, label, variant = 'subtle', badge, demoState, className = '', ...rest }: IconButtonProps) {
  const name = badge ? `${label}, ${badge} active` : label;
  return (
    <button type="button" aria-label={name} data-state={demoState} className={`dl-icon-button dl-icon-button--${variant} ${className}`} {...rest}>
      <Icon {...iconProps(20)} />
      {badge ? <span className="dl-icon-button__badge" aria-hidden="true">{badge}</span> : null}
    </button>
  );
}
