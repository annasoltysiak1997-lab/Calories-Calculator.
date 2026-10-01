import { iconProps, Minus, Plus } from '../primitives/Icon';

interface StepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  format?: (v: number) => string;
}

/** − value + control for servings; value is announced on change. */
export function Stepper({ label, value, onChange, step = 1, min = 0, max = 99, format = (v) => String(v) }: StepperProps) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, Math.round(v * 100) / 100)));
  return (
    <div className="dl-stepper" role="group" aria-label={label}>
      <button type="button" className="dl-stepper__btn" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => set(value - step)}><Minus {...iconProps(20)} /></button>
      <output className="dl-stepper__value" aria-live="polite">{format(value)}</output>
      <button type="button" className="dl-stepper__btn" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => set(value + step)}><Plus {...iconProps(20)} /></button>
    </div>
  );
}
