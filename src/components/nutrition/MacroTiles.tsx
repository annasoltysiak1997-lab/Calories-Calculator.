import { formatGrams } from '../../domain/format';
import { energyShares } from '../../domain/nutrition';
import type { Nutrients } from '../../domain/types';

type Macro = 'protein' | 'carbs' | 'fat';
const ORDER: { key: Macro; label: string }[] = [
  { key: 'protein', label: 'Protein' },
  { key: 'carbs', label: 'Carbs' },
  { key: 'fat', label: 'Fat' },
];

interface MacroTilesProps {
  nutrients: Nutrients;
  /** "share" shows % of kcal; "none" hides the footer. */
  footer?: 'share' | 'none';
  /** Outline one tile and replace its footer, e.g. { macro: 'fat', note: 'was 53 g' }. */
  highlight?: { macro: Macro; note: string };
  compact?: boolean;
}

/** Protein, carbs and fat together, always in that order. Values come from the domain. */
export function MacroTiles({ nutrients, footer = 'share', highlight, compact }: MacroTilesProps) {
  const shares = energyShares(nutrients);
  return (
    <div className="dl-macro-tiles">
      {ORDER.map(({ key, label }) => {
        const isHi = highlight?.macro === key;
        const foot = isHi ? highlight!.note : footer === 'share' ? `${shares[key]}% of kcal` : null;
        return (
          <div key={key} className={`dl-macro-tile dl-macro-tile--${key} ${compact ? 'dl-macro-tile--compact' : ''}`} data-highlight={isHi || undefined}>
            <span className="dl-macro-tile__label">{label}</span>
            <span className="dl-macro-tile__value">{formatGrams(nutrients[key])} g</span>
            {foot ? <span className="dl-macro-tile__foot">{foot}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
