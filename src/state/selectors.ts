import { add, dishTotals, forAmount, ZERO } from '../domain/nutrition';
import type { Food, Nutrients } from '../domain/types';
import type { Dish } from './store';

export type LineStatus = { kind: 'added-now' } | { kind: 'edited'; wasGrams: number; wasKcal: number } | { kind: 'new' } | null;

/** Everything the Dish screen needs, calculated in one place from the dish and the food table. */
export function dishView(dish: Dish, foods: Record<string, Food>) {
  const lines = dish.lines.filter((l) => foods[l.foodId]).map((l) => {
    const nutrients = forAmount(foods[l.foodId], l.grams);
    const orig = dish.source?.lines.find((o) => o.foodId === l.foodId);
    let status: LineStatus = null;
    if (dish.lastChange?.lineId === l.id && dish.lastChange.kind === 'added') status = { kind: 'added-now' };
    else if (orig && orig.grams !== l.grams) status = { kind: 'edited', wasGrams: orig.grams, wasKcal: forAmount(foods[l.foodId], orig.grams).kcal };
    else if (dish.source && !orig) status = { kind: 'new' };
    return { ...l, food: foods[l.foodId], nutrients, status };
  });
  const total: Nutrients = lines.reduce((t, l) => add(t, l.nutrients), ZERO);
  const removed = dish.source ? dish.source.lines.filter((o) => !dish.lines.some((l) => l.foodId === o.foodId)).map((o) => foods[o.foodId]?.name ?? o.foodId) : [];
  const changes = lines.filter((l) => l.status?.kind === 'edited' || l.status?.kind === 'new').length + removed.length;
  const original = dish.source ? dishTotals(dish.source.lines, foods).total : null;
  return { lines, total, removed, changes, original };
}
