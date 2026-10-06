import { useEffect, useId, useState, type FocusEvent, type Ref } from 'react';
import { parseAmount } from '../../domain/nutrition';
import { iconProps, Pencil } from '../primitives/Icon';

interface AmountFieldProps {
  label: string;
  value: number | undefined;
  unit?: string;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  /** e.g. "= 150 g" */
  sub?: string;
  placeholder?: string;
  hideLabel?: boolean;
  autoFocus?: boolean;
  size?: 'lg' | 'md';
  /** "inline": label on the left, compact field on the right, dashed with a pencil while empty. */
  layout?: 'stack' | 'inline';
  /** Controlled text, e.g. when an on-screen keypad edits the amount; `value` is then ignored. */
  text?: string;
  onTextChange?: (text: string) => void;
  /** An on-screen keypad is used, so the device keyboard stays closed. */
  keypad?: boolean;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * Quantity entry. Accepts "150", "1,5", ".5". Updates the result on every keystroke;
 * shows an inline error (icon + text) for values outside min–max.
 */
export function AmountField({ label, value, unit, onChange, min = 0, max = 5000, sub, placeholder = '0', hideLabel, autoFocus, size = 'lg', layout = 'stack',
  text: controlledText, onTextChange, keypad, onFocus, onBlur, inputRef }: AmountFieldProps) {
  const id = useId();
  const [ownText, setOwnText] = useState(value === undefined ? '' : String(value));
  const controlled = controlledText !== undefined;
  const text = controlled ? controlledText : ownText;
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    // Sync when the value changes from outside (e.g. a quick-amount chip); keep the person's own text otherwise.
    if (controlled || value === undefined) return;
    setOwnText((t) => (parseAmount(t) === value ? t : String(value)));
  }, [value, controlled]);
  const parsed = parseAmount(text);
  const invalid = touched && text !== '' && (Number.isNaN(parsed) || parsed < min || parsed > max);
  const error = invalid ? `Enter a number from ${min} to ${max.toLocaleString('en-GB')}${unit ? ` ${unit}` : ''}.` : undefined;
  return (
    <div className={`dl-amount dl-amount--${size} dl-amount--${layout}`} data-invalid={invalid || undefined}>
      <label htmlFor={id} className={hideLabel ? 'dl-visually-hidden' : 'dl-amount__label'}>{label}</label>
      <div className="dl-amount__control" data-empty={text === '' || undefined}>
        {layout === 'inline' && text === '' ? <Pencil {...iconProps(16)} /> : null}
        <input
          id={id}
          ref={inputRef}
          className="dl-amount__input"
          inputMode={keypad ? 'none' : 'decimal'}
          autoComplete="off"
          enterKeyHint="done"
          placeholder={placeholder}
          value={text}
          autoFocus={autoFocus}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? `${id}-err` : sub ? `${id}-sub` : undefined}
          onChange={(e) => {
            const t = e.target.value;
            if (controlled) onTextChange?.(t); else setOwnText(t);
            const n = parseAmount(t);
            onChange?.(t === '' || Number.isNaN(n) || n < min || n > max ? undefined : n);
          }}
          onFocus={onFocus}
          onBlur={(e) => { setTouched(true); onBlur?.(e); }}
        />
        {unit && !(layout === 'inline' && text === '') ? <span className="dl-amount__unit">{unit}</span> : null}
      </div>
      {error ? <span id={`${id}-err`} className="dl-amount__error" role="alert">{error}</span>
        : sub ? <span id={`${id}-sub`} className="dl-amount__sub">{sub}</span> : null}
    </div>
  );
}
