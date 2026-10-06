import type { IngredientLine } from '../domain/types';

/**
 * DEMO DATA — what Home shows before the person has a dish or recent foods of their own.
 * Values are calculated from the demo foods, never stored.
 */

/** The lentil soup recipe without the oil: 1,050 + 120 + 470 = 1,640 kcal. */
export const DEMO_DISH: { name: string; servings: number; lines: IngredientLine[] } = {
  name: 'Lentil soup',
  servings: 4,
  lines: [
    { foodId: 'red-lentils-dry', grams: 300 },
    { foodId: 'carrots-raw', grams: 300 },
    { foodId: 'coconut-milk', grams: 240 },
  ],
};

export const DEMO_RECENT: { foodId: string; grams: number; unit?: string }[] = [
  { foodId: 'skyr-natural', grams: 150 },
  { foodId: 'rice-cooked', grams: 200 },
  { foodId: 'apple', grams: 180, unit: 'medium' },
  { foodId: 'banana', grams: 120, unit: 'medium' },
  { foodId: 'eggs', grams: 120, unit: 'egg' },
];
