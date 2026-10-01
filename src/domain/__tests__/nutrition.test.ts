import { describe, expect, it } from 'vitest';
import { DEMO_FOODS as F } from '../../data/foods.demo';
import { dishTotals, energyShares, forAmount, parseAmount, portionByServings, portionByWeight, roundHalfUp, unitToGrams } from '../nutrition';
import { formatGrams, formatKcal, toDisplay, workingLine } from '../format';

const SOUP = [
  { foodId: 'red-lentils-dry', grams: 300 },
  { foodId: 'carrots-raw', grams: 300 },
  { foodId: 'coconut-milk', grams: 240 },
  { foodId: 'olive-oil', grams: 15 },
];

describe('food × amount', () => {
  it('skyr 150 g = 98 kcal, 17 g protein, 6 g carbs, < 1 g fat', () => {
    expect(toDisplay(forAmount(F['skyr-natural'], 150))).toEqual({ kcal: '98', protein: '17', carbs: '6', fat: '< 1', approximate: false });
  });
  it('converts household units', () => {
    expect(unitToGrams(F['skyr-natural'], 'pot', 1)).toBe(150);
  });
});

describe('lentil soup (single source of truth)', () => {
  const dish = dishTotals(SOUP, F);
  it('rows add up to the displayed total', () => {
    const rows = dish.lines.map((l) => roundHalfUp(l.nutrients.kcal));
    expect(rows).toEqual([1050, 120, 470, 133]);
    expect(rows.reduce((a, b) => a + b, 0)).toBe(1773);
    expect(formatKcal(dish.total.kcal)).toBe('1,773');
  });
  it('whole dish macros 80 / 216 / 68 g and energy shares 18 / 48 / 34 %', () => {
    expect(toDisplay(dish.total)).toMatchObject({ protein: '80', carbs: '216', fat: '68' });
    expect(energyShares(dish.total)).toEqual({ protein: 18, carbs: 48, fat: 34 });
  });
  it('¼ of the dish ≈ 443 kcal, 20 / 54 / 17 g', () => {
    const p = portionByServings(dish.total, 4, 1);
    expect(toDisplay(p.nutrients, p.approximate)).toEqual({ kcal: '443', protein: '20', carbs: '54', fat: '17', approximate: true });
    expect(workingLine(dish.total.kcal, 4, 1)).toBe('1,773 ÷ 4 × 1 = 443.3 → 443 kcal');
  });
  it('450 g of a 1,860 g pot ≈ 429 kcal, 19 / 52 / 16 g', () => {
    const p = portionByWeight(dish.total, 1860, 450);
    expect(toDisplay(p.nutrients)).toMatchObject({ kcal: '429', protein: '19', carbs: '52', fat: '16' });
  });
  it('editable copy with 150 g coconut milk = 1,597 kcal, ≈ 399 per serving', () => {
    const copy = dishTotals(SOUP.map((l) => (l.foodId === 'coconut-milk' ? { ...l, grams: 150 } : l)), F);
    const rows = copy.lines.map((l) => roundHalfUp(l.nutrients.kcal));
    expect(rows).toEqual([1050, 120, 294, 133]);
    expect(formatKcal(copy.total.kcal)).toBe('1,597');
    expect(toDisplay(copy.total)).toMatchObject({ protein: '78', carbs: '213', fat: '50' });
    expect(toDisplay(portionByServings(copy.total, 4, 1).nutrients)).toMatchObject({ kcal: '399', protein: '19', carbs: '53', fat: '13' });
  });
});

describe('formatting', () => {
  it('rounds half up and marks tiny amounts', () => {
    expect(roundHalfUp(16.5)).toBe(17);
    expect(formatGrams(0.3)).toBe('< 1');
    expect(formatGrams(0)).toBe('0');
  });
  it('parses typed amounts', () => {
    expect(parseAmount('150')).toBe(150);
    expect(parseAmount('1,5')).toBe(1.5);
    expect(parseAmount('.5')).toBe(0.5);
    expect(Number.isNaN(parseAmount('abc'))).toBe(true);
    expect(Number.isNaN(parseAmount(''))).toBe(true);
  });
  it('rejects impossible input', () => {
    expect(() => portionByServings({ kcal: 1, protein: 0, carbs: 0, fat: 0 }, 0, 1)).toThrow();
  });
});
