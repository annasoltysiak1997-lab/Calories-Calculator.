import { energyShares } from '../../domain/nutrition';
import type { Nutrients } from '../../domain/types';

/** Decorative share-of-energy bar; always paired with MacroTiles or inline values. */
export function MacroBar({ nutrients }: { nutrients: Nutrients }) {
  const s = energyShares(nutrients);
  return (
    <div className="dl-macro-bar" aria-hidden="true">
      {(['protein', 'carbs', 'fat'] as const).map((k) => (
        <span key={k} className={`dl-macro-bar__seg dl-macro-bar__seg--${k}`} style={{ flexGrow: s[k], flexBasis: 0 }} />
      ))}
    </div>
  );
}
