import { useId, useState } from 'react';
import { formatGrams, formatKcal } from '../../domain/format';
import type { Food, Nutrients } from '../../domain/types';
import type { LineStatus } from '../../state/selectors';
import { OperatorGlyph } from '../nutrition/OperatorGlyph';
import { Button } from '../primitives/Button';
import { X } from '../primitives/Icon';
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

function statusLabel(status: LineStatus): string | null {
  if (status?.kind === 'added-now') return 'New';
  if (status?.kind === 'edited') return `was ${formatGrams(status.wasGrams)} g`;
  if (status?.kind === 'new') return 'Not in original';
  return null;
}

/** One ingredient: "+ Olive oil 15 g [New] 130". Tap the row to change the amount or remove it. */
export function IngredientRow({ first, food, grams, nutrients, status, onGrams, onRemove }: IngredientRowProps) {
  const [open, setOpen] = useState(false);
  const editId = useId();
  const chip = statusLabel(status);
  return (
    <li className={`dl-ingredient ${chip ? 'dl-ingredient--highlight' : ''}`}>
      <button type="button" className="dl-ingredient__row" aria-expanded={open} aria-controls={editId} onClick={() => setOpen((o) => !o)}>
        <OperatorGlyph op={first ? '' : '+'} />
        <span className="dl-ingredient__main">
          <span className="dl-ingredient__name">{food.name}</span>
          <span className="dl-ingredient__grams">{formatGrams(grams)} g</span>
          {chip ? <span className="dl-ingredient__chip">{chip}</span> : null}
        </span>
        <span className="dl-ingredient__kcal">{formatKcal(nutrients.kcal)}<span className="dl-visually-hidden"> kcal</span></span>
      </button>
      {open ? (
        <div id={editId} className="dl-ingredient__edit">
          <AmountField size="md" label={`${food.name} amount`} unit="g" value={grams} min={1}
            onChange={(g) => { if (g !== undefined) onGrams(g); }} />
          <Button variant="secondary" size="md" icon={X} onClick={onRemove}>Remove</Button>
        </div>
      ) : null}
    </li>
  );
}
