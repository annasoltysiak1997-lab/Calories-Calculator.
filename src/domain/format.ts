import { roundHalfUp } from './nutrition';
import type { Nutrients } from './types';

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
