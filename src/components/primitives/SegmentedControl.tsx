import type { KeyboardEvent } from 'react';

interface SegmentedControlProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  size?: 'md' | 'sm';
}

/** Food/Dish/Recipes, By servings/By weight, units. Arrow keys move the selection. */
export function SegmentedControl<T extends string>({ label, options, value, onChange, size = 'md' }: SegmentedControlProps<T>) {
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = options.findIndex((o) => o.value === value);
    if (e.key === 'ArrowRight') onChange(options[(i + 1) % options.length].value);
    if (e.key === 'ArrowLeft') onChange(options[(i - 1 + options.length) % options.length].value);
  };
  return (
    <div role="radiogroup" aria-label={label} className={`dl-segmented dl-segmented--${size}`} onKeyDown={onKey}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} tabIndex={o.value === value ? 0 : -1}
          className="dl-segmented__item" onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
