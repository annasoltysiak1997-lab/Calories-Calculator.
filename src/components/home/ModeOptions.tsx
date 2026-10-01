import { iconProps, Plus } from '../primitives/Icon';

export interface ModeOption<T extends string> {
  value: T;
  title: string;
  sub: string;
}

interface ModeOptionsProps<T extends string> {
  label: string;
  options: ModeOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Three option cards in one row; the selected one takes the cobalt treatment. */
export function ModeOptions<T extends string>({ label, options, value, onChange }: ModeOptionsProps<T>) {
  return (
    <div className="dl-mode-options" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className="dl-mode-card" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          <span className="dl-mode-card__icon"><Plus {...iconProps(20)} /></span>
          <span className="dl-mode-card__text">
            <span className="dl-mode-card__title">{o.title}</span>
            <span className="dl-mode-card__sub">{o.sub}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
