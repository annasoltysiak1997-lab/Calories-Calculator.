import type { ReactNode } from 'react';
import { iconProps, Check, Minus, Plus, X } from './Icon';

interface ToggleChipProps {
  selected?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  children: ReactNode;
}

/** Quick filter or multi-select option (diet). Selected shows a check, not colour alone. */
export function ToggleChip({ selected = false, onToggle, disabled, children }: ToggleChipProps) {
  return (
    <button type="button" className="dl-chip" aria-pressed={selected} disabled={disabled} onClick={onToggle}>
      {selected ? <Check {...iconProps(16)} /> : null}
      {children}
    </button>
  );
}

interface RemovableChipProps {
  kind?: 'filter' | 'include' | 'exclude';
  onRemove?: () => void;
  children: string;
}

/** Active filter. Include = +, Exclude = − with strike-through (neutral, never red). */
export function RemovableChip({ kind = 'filter', onRemove, children }: RemovableChipProps) {
  const prefix = kind === 'include' ? <Plus {...iconProps(16)} /> : kind === 'exclude' ? <Minus {...iconProps(16)} /> : null;
  const spoken = kind === 'include' ? `Include ${children}` : kind === 'exclude' ? `Exclude ${children}` : children;
  return (
    <button type="button" className={`dl-chip dl-chip--removable ${kind === 'exclude' ? 'dl-chip--exclude' : ''}`} aria-label={`Remove filter: ${spoken}`} onClick={onRemove}>
      {prefix}
      <span className="dl-chip__label">{children}</span>
      <span className="dl-chip__remove" aria-hidden="true"><X size={12} strokeWidth={2.6} /></span>
    </button>
  );
}

/** Non-interactive label, e.g. diet tags on recipe cards. */
export function Tag({ children }: { children: ReactNode }) {
  return <span className="dl-tag">{children}</span>;
}

export function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return <div className="dl-chip-group" role="group" aria-label={label}>{children}</div>;
}
