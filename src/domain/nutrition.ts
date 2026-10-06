import type { Food, IngredientLine, Nutrients, Recipe } from './types';

export const ZERO: Nutrients = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

/** Round half up (0.5 → 1), avoiding binary artefacts like 16.4999999. */
export function roundHalfUp(n: number): number {
  return Math.floor(Math.round(n * 1e6) / 1e6 + 0.5);
}

export function scale(n: Nutrients, factor: number): Nutrients {
  return { kcal: n.kcal * factor, protein: n.protein * factor, carbs: n.carbs * factor, fat: n.fat * factor };
}

export function add(a: Nutrients, b: Nutrients): Nutrients {
  return { kcal: a.kcal + b.kcal, protein: a.protein + b.protein, carbs: a.carbs + b.carbs, fat: a.fat + b.fat };
}

/** food × amount = nutrients */
export function forAmount(food: Food, grams: number): Nutrients {
  if (!(grams >= 0)) throw new RangeError('grams must be a non-negative number');
  return scale(food.per100g, grams / 100);
}

export function unitToGrams(food: Food, unit: string, quantity: number): number {
  if (unit === 'g') return quantity;
  const g = food.units?.[unit];
  if (g === undefined) throw new RangeError(`${food.name} has no unit "${unit}"`);
  return g * quantity;
}

/** The same weight in another unit, e.g. 150 g → 1 pot. Rounded to 2 decimals (1 for grams) for entry. */
export function convertAmount(food: Food, quantity: number, from: string, to: string): number {
  const grams = unitToGrams(food, from, quantity);
  const value = to === 'g' ? grams : grams / unitToGrams(food, to, 1);
  const f = to === 'g' ? 10 : 100;
  return Math.round(value * f) / f;
}

export interface DishLine extends IngredientLine {
  food: Food;
  nutrients: Nutrients;
}

export interface DishTotals {
  lines: DishLine[];
  total: Nutrients;
}

/** A dish is a sum: each ingredient × its amount, added up. */
export function dishTotals(lines: IngredientLine[], foods: Record<string, Food>): DishTotals {
  const resolved = lines.map((l) => {
    const food = foods[l.foodId];
    if (!food) throw new RangeError(`Unknown food ${l.foodId}`);
    return { ...l, food, nutrients: forAmount(food, l.grams) };
  });
  return { lines: resolved, total: resolved.reduce((sum, l) => add(sum, l.nutrients), ZERO) };
}

export interface Portion {
  nutrients: Nutrients;
  /** Fraction of the whole dish, 0–1. */
  share: number;
  /** Always true: a portion comes from dividing a dish, so it is shown with "≈". */
  approximate: true;
}

/** whole dish ÷ servings × servings eaten */
export function portionByServings(total: Nutrients, servings: number, eaten: number): Portion {
  if (!(servings > 0)) throw new RangeError('servings must be greater than 0');
  if (!(eaten >= 0)) throw new RangeError('eaten must be 0 or more');
  const share = eaten / servings;
  return { nutrients: scale(total, share), share, approximate: true };
}

/** whole dish × (my bowl ÷ cooked weight) */
export function portionByWeight(total: Nutrients, cookedGrams: number, eatenGrams: number): Portion {
  if (!(cookedGrams > 0)) throw new RangeError('cooked weight must be greater than 0');
  if (!(eatenGrams >= 0)) throw new RangeError('eaten grams must be 0 or more');
  const share = eatenGrams / cookedGrams;
  return { nutrients: scale(total, share), share, approximate: true };
}

/** Share of energy from protein, carbs and fat (4 / 4 / 9 kcal per g), in whole percent. */
export function energyShares(n: Nutrients): { protein: number; carbs: number; fat: number } {
  const p = n.protein * 4, c = n.carbs * 4, f = n.fat * 9;
  const sum = p + c + f;
  if (sum === 0) return { protein: 0, carbs: 0, fat: 0 };
  return { protein: roundHalfUp((p / sum) * 100), carbs: roundHalfUp((c / sum) * 100), fat: roundHalfUp((f / sum) * 100) };
}

/** Whole recipe and one serving, always calculated from its ingredient lines. */
export function recipeNutrition(recipe: Recipe, foods: Record<string, Food>) {
  const { total, lines } = dishTotals(recipe.lines, foods);
  return { lines, total, perServing: scale(total, 1 / recipe.servings) };
}

/** Parses user input like "150", "1,5" or "0.5". Returns NaN for anything else. */
export function parseAmount(raw: string): number {
  const t = raw.trim().replace(',', '.');
  if (!/^\d*\.?\d+$|^\d+\.$/.test(t)) return NaN;
  return parseFloat(t);
}
