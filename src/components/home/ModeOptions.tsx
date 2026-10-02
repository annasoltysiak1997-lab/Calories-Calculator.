import { iconProps, Plus } from '../primitives/Icon';

export interface ModeOption<T extends string> {
  value: T;
  title: string;
  sub: string;
  /** Hash link to the calculator for this option. */
  href: string;
}

interface ModeOptionsProps<T extends string> {
  label: string;
  options: ModeOption<T>[];
  /** Highlighted option; takes the cobalt treatment. */
  active: T;
}

/** Three option cards in one row. Each whole card is a link to its calculator. */
export function ModeOptions<T extends string>({ label, options, active }: ModeOptionsProps<T>) {
  return (
    <nav className="dl-mode-options" aria-label={label}>
      {options.map((o) => (
        <a key={o.value} href={o.href} className="dl-mode-card" data-active={o.value === active ? 'true' : undefined}>
          <span className="dl-mode-card__icon" aria-hidden="true"><Plus {...iconProps(20)} /></span>
          <span className="dl-mode-card__text">
            <span className="dl-mode-card__title">{o.title}</span>
            <span className="dl-mode-card__sub">{o.sub}</span>
          </span>
        </a>
      ))}
    </nav>
  );
}
