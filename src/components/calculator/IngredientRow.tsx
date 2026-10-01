import { formatGrams, formatKcal } from '../../domain/format';
import type { Food, Nutrients } from '../../domain/types';
import type { LineStatus } from '../../state/selectors';
import { OperatorGlyph } from '../nutrition/OperatorGlyph';
import { iconProps, X } from '../primitives/Icon';
import { AmountField } from './AmountField';

interface IngredientRowProps {
  first: boolean;
  food: Food;
  grams: number;
  nutrients: Nutrients;
  status: LineStatus;
  onGrams: (g: number) => void;
  onRemove: () => void;
}

/** One ingredient: operator, name, editable grams, kcal. Shows "Just added" or "Edited · was 240 g". */
export function IngredientRow({ first, food, grams, nutrients, status, onGrams, onRemove }: IngredientRowProps) {
  const hl = status?.kind === 'added-now' || status?.kind === 'edited' || status?.kind === 'new';
  return (
    <li className={`dl-ingredient ${hl ? 'dl-ingredient--highlight' : ''}`}>
      <OperatorGlyph op={first ? '' : '+'} />
      <div className="dl-ingredient__main">
        <span className="dl-ingredient__name">{food.name}</span>
        {status?.kind === 'added-now' ? <span className="dl-status">Just added</span> : null}
        {status?.kind === 'edited' ? <span className="dl-status">Edited · was {formatGrams(status.wasGrams)} g · {formatKcal(status.wasKcal)} kcal</span> : null}
        {status?.kind === 'new' ? <span className="dl-status">Not in the original</span> : null}
        <div className="dl-ingredient__amount">
          <AmountField size="md" label={`${food.name} amount`} hideLabel unit="g" value={grams} min={1}
            onChange={(g) => { if (g !== undefined) onGrams(g); }} />
        </div>
      </div>
      <div className="dl-ingredient__side">
        <span className="dl-ingredient__kcal"><b>{formatKcal(nutrients.kcal)}</b> kcal</span>
        <button type="button" className="dl-icon-button dl-icon-button--plain dl-ingredient__remove" aria-label={`Remove ${food.name}`} onClick={onRemove}><X {...iconProps(20)} /></button>
      </div>
    </li>
  );
}
