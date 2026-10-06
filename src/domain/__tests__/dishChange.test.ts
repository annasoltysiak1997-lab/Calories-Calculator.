import { describe, expect, it } from 'vitest';
import { DEMO_FOODS as F } from '../../data/foods.demo';
import { describeMacroChange, formatKcal } from '../format';
import { add, dishTotals, forAmount } from '../nutrition';

const SOUP_BEFORE_OIL = [
  { foodId: 'red-lentils-dry', grams: 300 },
  { foodId: 'carrots-raw', grams: 300 },
  { foodId: 'coconut-milk', grams: 240 },
];

describe('C3: lentil soup after adding 15 g olive oil', () => {
  const before = dishTotals(SOUP_BEFORE_OIL, F).total;
  const oil = forAmount(F['olive-oil'], 15);
  const after = add(before, oil);
  it('adds 133 kcal to make 1,773 kcal', () => {
    expect(formatKcal(before.kcal)).toBe('1,640');
    expect(formatKcal(oil.kcal)).toBe('133');
    expect(formatKcal(after.kcal)).toBe('1,773');
  });
  it('explains that only fat changed', () => {
    expect(describeMacroChange('Olive oil', before, after)).toBe('Olive oil added fat only. Protein and carbs unchanged.');
  });
});

describe('describeMacroChange wording', () => {
  const zero = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  it('lists every macro when all change', () => {
    expect(describeMacroChange('Lentils', zero, { kcal: 350, protein: 24, carbs: 60, fat: 2 })).toBe('Lentils added protein, carbs and fat.');
  });
  it('handles two changed macros', () => {
    expect(describeMacroChange('Skyr', { ...zero, fat: 5 }, { kcal: 98, protein: 17, carbs: 6, fat: 5.2 }, 'changed')).toBe('Skyr changed protein and carbs only. Fat unchanged.');
  });
  it('says when nothing visible changes', () => {
    expect(describeMacroChange('Salt', { ...zero, protein: 2 }, { kcal: 0, protein: 2.1, carbs: 0, fat: 0 })).toBe('Salt barely changes protein, carbs or fat.');
  });
});
