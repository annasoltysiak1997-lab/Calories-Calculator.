import { useSyncExternalStore } from 'react';
import { DEMO_FOODS } from '../data/foods.demo';
import { NO_FILTERS, type RecipeFilters } from '../domain/filters';
import { forAmount } from '../domain/nutrition';
import type { Food, Nutrients, Recipe } from '../domain/types';

/** One ingredient in the current dish. */
export interface DishLine {
  id: string;
  foodId: string;
  grams: number;
}

export interface Dish {
  name: string;
  lines: DishLine[];
  servings: number;
  /** Optional weight of the finished dish in grams, for portions by weight. */
  cookedGrams?: number;
  /** Set when the dish is an editable copy of a recipe. The recipe itself is never changed. */
  source?: { recipeId: string; recipeName: string; servings: number; lines: { foodId: string; grams: number }[] };
  /** Last change, used for "Just added" and "+133 kcal" feedback. */
  lastChange?: { lineId: string; kind: 'added' | 'edited'; deltaKcal: number; before: Nutrients };
}

export interface RecentFood { foodId: string; grams: number }

export interface AppState {
  dish: Dish | null;
  customFoods: Record<string, Food>;
  recent: RecentFood[];
  filters: RecipeFilters;
  toast?: { id: number; message: string; undo?: () => void };
}

const STORAGE_KEY = 'daylight-calories-calculator:v1';
const initial: AppState = { dish: null, customFoods: {}, recent: [], filters: NO_FILTERS };

function load(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...initial, ...parsed, toast: undefined, filters: { ...NO_FILTERS, ...parsed.filters } };
  } catch {
    return initial;
  }
}

let state: AppState = typeof window === 'undefined' ? initial : load();
const listeners = new Set<() => void>();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, toast: undefined }));
  } catch {
    /* storage unavailable: keep working in memory */
  }
}

export function getState() { return state; }

export function setState(update: (s: AppState) => AppState) {
  state = update(state);
  persist();
  listeners.forEach((l) => l());
}

export function useAppState<T>(select: (s: AppState) => T): T {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => select(state), () => select(initial));
}

/** Demo foods plus foods the person entered. */
export function allFoods(s: AppState = state): Record<string, Food> {
  return { ...DEMO_FOODS, ...s.customFoods };
}

let seq = 0;
const newId = (p: string) => `${p}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

function dishTotal(d: Dish, foods: Record<string, Food>): Nutrients {
  return d.lines.reduce((t, l) => {
    const n = forAmount(foods[l.foodId], l.grams);
    return { kcal: t.kcal + n.kcal, protein: t.protein + n.protein, carbs: t.carbs + n.carbs, fat: t.fat + n.fat };
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
}

export const actions = {
  toast(message: string, undo?: () => void) {
    setState((s) => ({ ...s, toast: { id: Date.now(), message, undo } }));
  },
  dismissToast() { setState((s) => ({ ...s, toast: undefined })); },

  addCustomFood(input: { name: string; per100g: Nutrients }): Food {
    const food: Food = { id: newId('user'), name: input.name.trim(), per100g: input.per100g, source: 'user' };
    setState((s) => ({ ...s, customFoods: { ...s.customFoods, [food.id]: food } }));
    return food;
  },

  saveRecent(foodId: string, grams: number) {
    setState((s) => ({ ...s, recent: [{ foodId, grams }, ...s.recent.filter((r) => r.foodId !== foodId)].slice(0, 5) }));
  },

  startDish(name = 'My dish') {
    setState((s) => ({ ...s, dish: { name, lines: [], servings: 2 } }));
  },

  addToDish(foodId: string, grams: number) {
    setState((s) => {
      const foods = allFoods(s);
      const dish: Dish = s.dish ?? { name: 'My dish', lines: [], servings: 2 };
      const before = dishTotal(dish, foods);
      const line: DishLine = { id: newId('line'), foodId, grams };
      return {
        ...s,
        dish: { ...dish, lines: [...dish.lines, line], lastChange: { lineId: line.id, kind: 'added', deltaKcal: forAmount(foods[foodId], grams).kcal, before } },
      };
    });
  },

  updateLine(lineId: string, grams: number) {
    setState((s) => {
      if (!s.dish) return s;
      const foods = allFoods(s);
      const before = dishTotal(s.dish, foods);
      const old = s.dish.lines.find((l) => l.id === lineId);
      if (!old || old.grams === grams) return s;
      const delta = forAmount(foods[old.foodId], grams).kcal - forAmount(foods[old.foodId], old.grams).kcal;
      return { ...s, dish: { ...s.dish, lines: s.dish.lines.map((l) => (l.id === lineId ? { ...l, grams } : l)), lastChange: { lineId, kind: 'edited', deltaKcal: delta, before } } };
    });
  },

  removeLine(lineId: string) {
    const prev = state.dish;
    setState((s) => (s.dish ? { ...s, dish: { ...s.dish, lines: s.dish.lines.filter((l) => l.id !== lineId), lastChange: undefined } } : s));
    const food = prev?.lines.find((l) => l.id === lineId);
    if (prev && food) actions.toast(`${allFoods()[food.foodId]?.name ?? 'Ingredient'} removed`, () => setState((s) => ({ ...s, dish: prev })));
  },

  renameDish(name: string) { setState((s) => (s.dish ? { ...s, dish: { ...s.dish, name } } : s)); },
  setServings(servings: number) { setState((s) => (s.dish ? { ...s, dish: { ...s.dish, servings } } : s)); },
  setCookedGrams(cookedGrams: number | undefined) { setState((s) => (s.dish ? { ...s, dish: { ...s.dish, cookedGrams } } : s)); },

  clearDish() {
    const prev = state.dish;
    setState((s) => ({ ...s, dish: null }));
    if (prev) actions.toast('Dish cleared', () => setState((s) => ({ ...s, dish: prev })));
  },

  /** "Make an editable copy": clones the recipe into the dish. The recipe data is read-only. */
  copyRecipe(recipe: Recipe) {
    const prev = state.dish;
    setState((s) => ({
      ...s,
      dish: {
        name: `${recipe.name} (my copy)`,
        servings: recipe.servings,
        lines: recipe.lines.map((l) => ({ id: newId('line'), foodId: l.foodId, grams: l.grams })),
        source: { recipeId: recipe.id, recipeName: recipe.name, servings: recipe.servings, lines: recipe.lines.map((l) => ({ ...l })) },
      },
    }));
    actions.toast('Copy created. The original recipe is unchanged.', prev && prev.lines.length ? () => setState((s) => ({ ...s, dish: prev })) : undefined);
  },

  setFilters(filters: RecipeFilters) { setState((s) => ({ ...s, filters })); },
};
