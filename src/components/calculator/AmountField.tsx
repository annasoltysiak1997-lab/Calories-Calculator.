import { useEffect, useId, useState } from 'react';
import { parseAmount } from '../../domain/nutrition';

interface AmountFieldProps {
  label: string;
  value: number | undefined;
  unit?: string;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  /** e.g. "= 150 g" */
  sub?: string;
  placeholder?: string;
  hideLabel?: boolean;
  autoFocus?: boolean;
  size?: 'lg' | 'md';
}

/**
 * Quantity entry. Accepts "150", "1,5", ".5". Updates the result on every keystroke;
 * shows an inline error (icon + text) for values outside min–max.
 */
export function AmountField({ label, value, unit, onChange, min = 0, max = 5000, sub, placeholder = '0', hideLabel, autoFocus, size = 'lg' }: AmountFieldProps) {
  const id = useId();
  const [text, setText] = useState(value === undefined ? '' : String(value));
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    // Sync when the value changes from outside (e.g. a quick-amount chip); keep the person's own text otherwise.
    if (value === undefined) return;
    setText((t) => (parseAmount(t) === value ? t : String(value)));
  }, [value]);
  const parsed = parseAmount(text);
  const invalid = touched && text !== '' && (Number.isNaN(parsed) || parsed < min || parsed > max);
  const error = invalid ? `Enter a number from ${min} to ${max.toLocaleString('en-GB')}${unit ? ` ${unit}` : ''}.` : undefined;
  return (
    <div className={`dl-amount dl-amount--${size}`} data-invalid={invalid || undefined}>
      <label htmlFor={id} className={hideLabel ? 'dl-visually-hidden' : 'dl-amount__label'}>{label}</label>
      <div className="dl-amount__control">
        <input
          id={id}
          className="dl-amount__input"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="done"
          placeholder={placeholder}
          value={text}
          autoFocus={autoFocus}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? `${id}-err` : sub ? `${id}-sub` : undefined}
          onChange={(e) => {
            const t = e.target.value;
            setText(t);
            const n = parseAmount(t);
            onChange(t === '' || Number.isNaN(n) || n < min || n > max ? undefined : n);
          }}
          onBlur={() => setTouched(true)}
        />
        {unit ? <span className="dl-amount__unit">{unit}</span> : null}
      </div>
      {error ? <span id={`${id}-err`} className="dl-amount__error" role="alert">{error}</span>
        : sub ? <span id={`${id}-sub`} className="dl-amount__sub">{sub}</span> : null}
    </div>
  );
}
