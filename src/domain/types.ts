/** Nutrients for any amount. Unrounded; round only when formatting. */
export interface Nutrients {
  kcal: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
}

export interface Food {
  id: string;
  name: string;
  per100g: Nutrients;
  /** Household units, e.g. { pot: 150, tbsp: 15 } grams per unit. */
  units?: Record<string, number>;
  /** "demo" = illustrative reference values; "user" = values the person entered. */
  source: 'demo' | 'user';
}

export interface IngredientLine {
  foodId: string;
  grams: number;
}

export type Diet = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  minutes: number;
  servings: number;
  diets: Diet[];
  /** Counted ingredients; all nutrition is calculated from these. */
  lines: IngredientLine[];
  /** Seasonings and water, listed but not counted (under 5 kcal per serving). */
  extras: string[];
  steps: string[];
  /** Illustration recipe, see RecipeIllustration and theme/foodArt.ts. */
  art: RecipeArt;
  source: 'demo';
}

export interface RecipeArt {
  backdrop: string; // foodArt backdrop key
  food: string; // foodArt food key
  vessel: 'bowl' | 'plate' | 'pan';
  garnish: { x: number; y: number; r: number; color: string; shape: 'dot' | 'leaf' | 'cube' | 'ring' }[];
}
