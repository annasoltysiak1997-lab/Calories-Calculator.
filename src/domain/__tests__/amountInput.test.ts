import { describe, expect, it } from 'vitest';
import { DEMO_FOODS as F } from '../../data/foods.demo';
import { applyAmountKey, withFraction, type AmountKey } from '../amountInput';
import { shortFoodName } from '../format';
import { convertAmount, forAmount } from '../nutrition';

const type = (keys: AmountKey[], max = 5000, decimals = 1, start = '') =>
  keys.reduce((t, k) => applyAmountKey(t, k, { max, decimals }), start);

describe('keypad amount entry', () => {
  it('types 150', () => expect(type(['1', '5', '0'])).toBe('150'));
  it('deletes the last character', () => expect(type(['1', '5', '0', 'back'])).toBe('15'));
  it('starts a decimal with 0.', () => expect(type(['.', '5'])).toBe('0.5'));
  it('allows one decimal point and limits decimals', () => {
    expect(type(['1', '.', '2', '5', '.'])).toBe('1.2');
    expect(type(['1', '.', '2', '5'], 50, 2)).toBe('1.25');
  });
  it('replaces a leading zero', () => expect(type(['0', '7'])).toBe('7'));
  it('ignores keys that would go over the maximum', () => expect(type(['5', '0', '0', '0', '0'])).toBe('5000'));
  it('starts over after a quick amount', () => {
    expect(applyAmountKey('100', '2', { max: 5000, decimals: 1, replace: true })).toBe('2');
    expect(applyAmountKey('100', 'back', { max: 5000, decimals: 1, replace: true })).toBe('');
  });
});

describe('unit switch keeps the weight', () => {
  it('150 g ⇄ 1 pot ⇄ 10 tbsp of skyr', () => {
    expect(convertAmount(F['skyr-natural'], 150, 'g', 'pot')).toBe(1);
    expect(convertAmount(F['skyr-natural'], 1, 'pot', 'tbsp')).toBe(10);
    expect(convertAmount(F['skyr-natural'], 10, 'tbsp', 'g')).toBe(150);
  });
  it('150 g of skyr = 98 kcal (C2 filled state)', () => {
    expect(Math.round(forAmount(F['skyr-natural'], 150).kcal)).toBe(98);
  });
});

describe('short food name', () => {
  it('uses the part before the comma, lower case', () => {
    expect(shortFoodName('Skyr, natural')).toBe('skyr');
    expect(shortFoodName('Apple')).toBe('apple');
  });
});

describe('½ and ¼ keys', () => {
  it('set the fraction of the whole number', () => {
    expect(withFraction('4', 0.5, 24)).toBe('4.5');
    expect(withFraction('4.5', 0.25, 24)).toBe('4.25');
    expect(withFraction('', 0.5, 24)).toBe('0.5');
  });
  it('ignore a fraction that would pass the maximum', () => expect(withFraction('4', 0.5, 4)).toBe('4'));
});
