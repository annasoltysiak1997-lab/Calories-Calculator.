import { roundHalfUp } from './nutrition';
import type { Food, Nutrients } from './types';

const nf = new Intl.NumberFormat('en-GB');

/** 1773.02 → "1,773" */
export function formatKcal(kcal: number): string {
  return nf.format(roundHalfUp(kcal));
}

/** Grams: whole numbers; anything above 0 and under 1 g reads "< 1". */
export function formatGrams(g: number): string {
  if (g > 0 && g < 1) return '< 1';
  return nf.format(roundHalfUp(g));
}

/** "150 g", or with a household unit "1 medium · 180 g". */
export function formatAmount(food: Food, grams: number, unit?: string): string {
  const g = `${formatGrams(grams)} g`;
  const per = unit ? food.units?.[unit] : undefined;
  if (!per) return g;
  return `${nf.format(Math.round((grams / per) * 100) / 100)} ${unit} · ${g}`;
}

/** "Skyr, natural" → "skyr", for labels like "Amount of skyr". */
export function shortFoodName(name: string): string {
  return name.split(',')[0].trim().toLowerCase();
}

/**
 * What an ingredient did to the macros, e.g. "Olive oil added fat only. Protein and carbs unchanged."
 * A macro counts as changed when its displayed grams change.
 */
export function describeMacroChange(name: string, before: Nutrients, after: Nutrients, verb: 'added' | 'changed' = 'added'): string {
  const keys = ['protein', 'carbs', 'fat'] as const;
  const changed = keys.filter((k) => formatGrams(before[k]) !== formatGrams(after[k]));
  const same = keys.filter((k) => !changed.includes(k));
  const list = (ks: readonly string[]) => (ks.length < 2 ? ks.join('') : `${ks.slice(0, -1).join(', ')} and ${ks[ks.length - 1]}`);
  if (!changed.length) return `${name} barely changes protein, carbs or fat.`;
  if (!same.length) return `${name} ${verb} protein, carbs and fat.`;
  const rest = list(same);
  return `${name} ${verb} ${list(changed)} only. ${rest[0].toUpperCase()}${rest.slice(1)} unchanged.`;
}

export interface DisplayNutrients {
  kcal: string;
  protein: string;
  carbs: string;
  fat: string;
  approximate: boolean;
}

export function toDisplay(n: Nutrients, approximate = false): DisplayNutrients {
  return { kcal: formatKcal(n.kcal), protein: formatGrams(n.protein), carbs: formatGrams(n.carbs), fat: formatGrams(n.fat), approximate };
}

/** "1,773 ÷ 4 × 1 = 443.3 → 443 kcal" */
export function workingLine(totalKcal: number, servings: number, eaten: number): string {
  const exact = (totalKcal / servings) * eaten;
  const one = Math.round(exact * 10) / 10;
  return `${formatKcal(totalKcal)} ÷ ${nf.format(servings)} × ${nf.format(eaten)} = ${nf.format(one)} → ${formatKcal(exact)} kcal`;
}

/** Spoken label for screen readers, e.g. "approximately 443 kilocalories". */
export function spokenKcal(kcal: number, approximate: boolean): string {
  return `${approximate ? 'approximately ' : ''}${formatKcal(kcal)} kilocalories`;
}
