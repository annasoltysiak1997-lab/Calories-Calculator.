import { describe, expect, it } from 'vitest';
import { DEMO_FOODS as F } from '../../data/foods.demo';
import { DEMO_RECIPES as R } from '../../data/recipes.demo';
import { activeFilterCount, applyFilters, closestMatch, kcalPerServing, NO_FILTERS, removalEffects, type RecipeFilters } from '../filters';

const names = (f: RecipeFilters) => applyFilters(R, f, F).map((r) => r.name);

describe('recipe filters', () => {
  it('every recipe only uses known foods', () => {
    R.forEach((r) => r.lines.forEach((l) => expect(Boolean(F[l.foodId])).toBe(true)));
  });
  it('lentil soup per serving comes from its ingredients (≈ 443)', () => {
    expect(Math.round(kcalPerServing(R[0], F))).toBe(443);
  });
  it('search matches names and ingredients: 5 recipes for "lentil"', () => {
    expect(names({ ...NO_FILTERS, query: 'lentil' })).toHaveLength(5);
  });
  it('Vegan + Gluten-free → soup and dal, badge 2', () => {
    const f: RecipeFilters = { ...NO_FILTERS, query: 'lentil', diets: ['vegan', 'gluten-free'] };
    expect(names(f)).toEqual(['Lentil soup with smoked paprika', 'Red lentil dal']);
    expect(activeFilterCount(f)).toBe(2);
  });
  it('removing Gluten-free → 4 recipes', () => {
    expect(names({ ...NO_FILTERS, query: 'lentil', diets: ['vegan'] })).toHaveLength(4);
  });
  it('limits are inclusive: a 15-minute recipe matches ≤ 15 min', () => {
    expect(names({ ...NO_FILTERS, query: 'lentil', maxMinutes: 15 })).toEqual(['Lentil & walnut salad']);
  });
  it('vegan implies dairy-free', () => {
    expect(names({ ...NO_FILTERS, query: 'lentil', diets: ['dairy-free'] })).toHaveLength(4);
  });
  it('exclude removes recipes containing the ingredient', () => {
    expect(names({ ...NO_FILTERS, query: 'lentil', diets: ['vegan', 'gluten-free'], exclude: ['coconut milk'] })).toEqual(['Red lentil dal']);
  });
  it('no results: removal effects and closest match explain why', () => {
    const f: RecipeFilters = { ...NO_FILTERS, query: 'lentil', diets: ['vegan'], maxMinutes: 15, maxKcalPerServing: 300, include: ['lentils'] };
    expect(names(f)).toEqual([]);
    expect(removalEffects(R, f, F).map((e) => [e.constraint.kind, e.count])).toEqual([['diet', 0], ['time', 0], ['kcal', 1], ['include', 0]]);
    const close = closestMatch(R, f, F)!;
    expect(close.recipe.name).toBe('Lentil & walnut salad');
    expect(close.unmet.map((c) => c.kind)).toEqual(['kcal']);
  });
});
