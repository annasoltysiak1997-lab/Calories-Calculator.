import { formatKcal, spokenKcal } from '../../domain/format';
import { Text } from '../primitives/Text';
import { OperatorGlyph } from './OperatorGlyph';

interface ResultRowProps {
  label: string;
  kcal: number;
  /** From the domain: true when the value comes from dividing a dish. */
  approximate?: boolean;
  size?: 'xl' | 'lg' | 'md';
  delta?: string;
  note?: string;
}

/** "= Whole dish  1,773 kcal". The number is the hero; ≈ marks divided values. */
export function ResultRow({ label, kcal, approximate = false, size = 'lg', delta, note }: ResultRowProps) {
  const numberVariant = `number-${size}` as const;
  return (
    <div className="dl-result">
      <div className="dl-result__label">
        <span className="dl-result__name"><OperatorGlyph op="=" /><Text variant="body-strong">{label}</Text></span>
        {delta ? <span className="dl-result__delta">{delta}</span> : null}
        {note ? <Text variant="caption" tone="secondary">{note}</Text> : null}
      </div>
      <span className="dl-visually-hidden">{spokenKcal(kcal, approximate)}</span>
      <div className="dl-result__value" aria-hidden="true">
        {approximate ? <span className="dl-result__approx" aria-hidden="true" style={{ fontSize: `calc(var(--dl-text-${numberVariant}-size) * 0.6)` }}>≈</span> : null}
        <Text variant={numberVariant}>{formatKcal(kcal)}</Text>
        <Text variant="meta" tone="secondary">kcal</Text>
      </div>
    </div>
  );
}
