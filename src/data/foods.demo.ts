import type { Food } from '../domain/types';

/**
 * DEMO DATA — typical per-100 g reference values for the prototype.
 * Not verified against a product label or a lab analysis.
 */
const f = (id: string, name: string, kcal: number, protein: number, carbs: number, fat: number, units?: Record<string, number>): Food =>
  ({ id, name, per100g: { kcal, protein, carbs, fat }, units, source: 'demo' });

export const DEMO_FOODS: Record<string, Food> = Object.fromEntries([
  f('red-lentils-dry', 'Red lentils, dry', 350, 24, 60, 1.5),
  f('green-lentils-cooked', 'Green lentils, cooked', 116, 9, 20, 0.4),
  f('brown-lentils-dry', 'Brown lentils, dry', 352, 25, 60, 1.1),
  f('carrots-raw', 'Carrots, raw', 40, 0.9, 9.6, 0.2, { medium: 60 }),
  f('coconut-milk', 'Coconut milk', 196, 2, 2.8, 20, { tbsp: 15 }),
  f('olive-oil', 'Olive oil', 884, 0, 0, 100, { tbsp: 15, tsp: 5 }),
  f('butter', 'Butter', 717, 0.9, 0.1, 81, { tbsp: 14 }),
  f('skyr-natural', 'Skyr, natural', 65, 11, 4, 0.2, { pot: 150, tbsp: 15 }),
  f('rice-cooked', 'Rice, cooked', 130, 2.7, 28, 0.3),
  f('apple', 'Apple', 52, 0.3, 14, 0.2, { medium: 180 }),
  f('banana', 'Banana', 89, 1.1, 23, 0.3, { medium: 120 }),
  f('onion', 'Onion', 40, 1.1, 9.3, 0.1, { medium: 110 }),
  f('garlic', 'Garlic', 149, 6.4, 33, 0.5, { clove: 5 }),
  f('ginger', 'Ginger, fresh', 80, 1.8, 18, 0.8),
  f('tomatoes-canned', 'Tomatoes, canned', 21, 1, 3.5, 0.2, { can: 400 }),
  f('tomatoes-fresh', 'Tomatoes, fresh', 18, 0.9, 3.9, 0.2, { medium: 120 }),
  f('walnuts', 'Walnuts', 654, 15, 14, 65, { handful: 30 }),
  f('rocket', 'Rocket', 25, 2.6, 3.7, 0.7),
  f('lemon-juice', 'Lemon juice', 22, 0.4, 6.9, 0.2, { tbsp: 15 }),
  f('spaghetti-dry', 'Spaghetti, dry', 359, 13, 72, 1.5),
  f('feta', 'Feta', 264, 14, 4, 21),
  f('peppers', 'Peppers', 31, 1, 6, 0.3, { medium: 150 }),
  f('cucumber', 'Cucumber', 15, 0.7, 3.6, 0.1),
  f('olives', 'Olives', 145, 1, 3.8, 15),
  f('white-beans-canned', 'White beans, canned', 114, 7.5, 20, 0.5, { can: 240 }),
  f('chickpeas-canned', 'Chickpeas, canned', 139, 7, 21, 2.6, { can: 240 }),
  f('spinach', 'Spinach', 23, 2.9, 3.6, 0.4),
  f('eggs', 'Eggs', 143, 12.6, 0.7, 9.5, { egg: 60 }),
  f('pumpkin', 'Pumpkin', 26, 1, 6.5, 0.1),
  f('oats', 'Oats', 379, 13, 67, 6.5, { tbsp: 10 }),
  f('milk-semi', 'Milk, semi-skimmed', 46, 3.4, 4.8, 1.6, { glass: 200 }),
  f('berries', 'Mixed berries', 50, 0.7, 12, 0.3),
  f('salmon', 'Salmon fillet', 208, 20, 0, 13, { fillet: 125 }),
  f('chicken-breast', 'Chicken breast, raw', 120, 22.5, 0, 2.6),
  f('bread-wholemeal', 'Wholemeal bread', 247, 13, 41, 3.4, { slice: 40 }),
].map((food) => [food.id, food]));
