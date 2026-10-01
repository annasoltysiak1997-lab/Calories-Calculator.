import { recipeNutrition, roundHalfUp } from './nutrition';
import type { Diet, Food, Recipe } from './types';

export type TimeLimit = 15 | 30 | 60;
export type KcalLimit = 300 | 500 | 700;

/** Limits are inclusive: "≤ 15 min" matches a 15-minute recipe. */
export interface RecipeFilters {
  query: string;
  maxMinutes?: TimeLimit;
  diets: Diet[];
  maxKcalPerServing?: KcalLimit;
  include: string[];
  exclude: string[];
}

export const NO_FILTERS: RecipeFilters = { query: '', diets: [], include: [], exclude: [] };

export const DIET_LABELS: Record<Diet, string> = {
  vegetarian: 'Vegetarian', vegan: 'Vegan', 'gluten-free': 'Gluten-free', 'dairy-free': 'Dairy-free',
};

export function kcalPerServing(recipe: Recipe, foods: Record<string, Food>): number {
  return recipeNutrition(recipe, foods).perServing.kcal;
}

/** Lower-case names of counted ingredients and extras, for search and include/exclude. */
export function ingredientNames(recipe: Recipe, foods: Record<string, Food>): string[] {
  return [...recipe.lines.map((l) => foods[l.foodId]?.name ?? l.foodId), ...recipe.extras].map((n) => n.toLowerCase());
}

/** Vegan implies vegetarian and dairy-free. */
export function effectiveDiets(recipe: Recipe): Set<Diet> {
  const d = new Set(recipe.diets);
  if (d.has('vegan')) { d.add('vegetarian'); d.add('dairy-free'); }
  return d;
}

const norm = (s: string) => s.trim().toLowerCase();
/** "lentils" should match "Red lentils, dry"; also match singular forms. */
const mentions = (hay: string, needle: string) => {
  const n = norm(needle);
  return hay.includes(n) || (n.endsWith('s') && hay.includes(n.slice(0, -1)));
};

export type Constraint =
  | { kind: 'query'; value: string }
  | { kind: 'time'; value: TimeLimit }
  | { kind: 'diet'; value: Diet }
  | { kind: 'kcal'; value: KcalLimit }
  | { kind: 'include'; value: string }
  | { kind: 'exclude'; value: string };

/** Active constraints in chip order. The query is not a chip but still constrains results. */
export function constraintsOf(f: RecipeFilters): Constraint[] {
  const out: Constraint[] = [];
  if (f.query.trim()) out.push({ kind: 'query', value: f.query });
  f.diets.forEach((value) => out.push({ kind: 'diet', value }));
  if (f.maxMinutes) out.push({ kind: 'time', value: f.maxMinutes });
  if (f.maxKcalPerServing) out.push({ kind: 'kcal', value: f.maxKcalPerServing });
  f.include.forEach((value) => out.push({ kind: 'include', value }));
  f.exclude.forEach((value) => out.push({ kind: 'exclude', value }));
  return out;
}

export function constraintLabel(c: Constraint): string {
  switch (c.kind) {
    case 'query': return `“${c.value}”`;
    case 'time': return `≤ ${c.value} min`;
    case 'kcal': return `≤ ${c.value} kcal`;
    case 'diet': return DIET_LABELS[c.value];
    case 'include': return c.value;
    case 'exclude': return c.value;
  }
}

/** Number shown on the filter button badge: chips only, not the search text. */
export function activeFilterCount(f: RecipeFilters): number {
  return constraintsOf(f).filter((c) => c.kind !== 'query').length;
}

export function meets(recipe: Recipe, c: Constraint, foods: Record<string, Food>): boolean {
  const names = ingredientNames(recipe, foods);
  switch (c.kind) {
    case 'query': return mentions(norm(recipe.name), c.value) || names.some((n) => mentions(n, c.value));
    case 'time': return recipe.minutes <= c.value;
    case 'diet': return effectiveDiets(recipe).has(c.value);
    case 'kcal': return roundHalfUp(kcalPerServing(recipe, foods)) <= c.value;
    case 'include': return names.some((n) => mentions(n, c.value));
    case 'exclude': return !names.some((n) => mentions(n, c.value));
  }
}

export function matches(recipe: Recipe, f: RecipeFilters, foods: Record<string, Food>): boolean {
  return constraintsOf(f).every((c) => meets(recipe, c, foods));
}

export function applyFilters(recipes: Recipe[], f: RecipeFilters, foods: Record<string, Food>): Recipe[] {
  return recipes.filter((r) => matches(r, f, foods));
}

export function withoutConstraint(f: RecipeFilters, c: Constraint): RecipeFilters {
  switch (c.kind) {
    case 'query': return { ...f, query: '' };
    case 'time': return { ...f, maxMinutes: undefined };
    case 'kcal': return { ...f, maxKcalPerServing: undefined };
    case 'diet': return { ...f, diets: f.diets.filter((d) => d !== c.value) };
    case 'include': return { ...f, include: f.include.filter((d) => d !== c.value) };
    case 'exclude': return { ...f, exclude: f.exclude.filter((d) => d !== c.value) };
  }
}

/** For the no-results screen: how many recipes appear if each single chip is removed. */
export function removalEffects(recipes: Recipe[], f: RecipeFilters, foods: Record<string, Food>) {
  return constraintsOf(f)
    .filter((c) => c.kind !== 'query')
    .map((c) => ({ constraint: c, count: applyFilters(recipes, withoutConstraint(f, c), foods).length }));
}

/** Closest match: fewest unmet chips among recipes matching the search text. Lists every unmet chip. */
export function closestMatch(recipes: Recipe[], f: RecipeFilters, foods: Record<string, Food>) {
  const cs = constraintsOf(f);
  const q = cs.filter((c) => c.kind === 'query');
  const chips = cs.filter((c) => c.kind !== 'query');
  const ranked = recipes
    .filter((r) => q.every((c) => meets(r, c, foods)))
    .map((r) => ({ recipe: r, met: chips.filter((c) => meets(r, c, foods)), unmet: chips.filter((c) => !meets(r, c, foods)) }))
    .filter((x) => x.unmet.length > 0)
    .sort((a, b) => a.unmet.length - b.unmet.length || a.recipe.minutes - b.recipe.minutes);
  return ranked[0];
}

/** All ingredient names across recipes, for include/exclude suggestions. */
export function allIngredientNames(recipes: Recipe[], foods: Record<string, Food>): string[] {
  const set = new Set<string>();
  recipes.forEach((r) => r.lines.forEach((l) => { const n = foods[l.foodId]?.name; if (n) set.add(n.split(',')[0]); }));
  return [...set].sort((a, b) => a.localeCompare(b));
}
