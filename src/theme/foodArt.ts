/**
 * Illustration palette for the parametric food illustrations (RecipeIllustration).
 * Backdrops are pastel tints; foods are flat colours. Kept in theme/ so colour stays tokenised.
 */
export const backdrops = {
  terracotta: '#F6D9C3',
  butter: '#FFE7AE',
  sky: '#DCE9F5',
  blush: '#FCE1D6',
  sand: '#EFE9DC',
  mist: '#E3EEF7',
  peach: '#FFE4D6',
  lilac: '#F4E4F0',
} as const;

export const foods = {
  paprikaSoup: '#D2652B',
  dal: '#E4A23A',
  pumpkin: '#F0913A',
  curry: '#D98A2E',
  greens: '#DDEBC7',
  tomato: '#C8452B',
  lentilBrown: '#8A6A48',
  pasta: '#F1D48A',
  bake: '#C96A3A',
  rice: '#FAF6EE',
  oats: '#F5EBDA',
  stew: '#C75B32',
} as const;

export const garnish = {
  cream: '#F7EBD6',
  herb: '#5E8A3A',
  chili: '#8E2A16',
  red: '#E0412F',
  white: '#FFFFFF',
  dark: '#2A2A2E',
  seed: '#3F5B2E',
  nut: '#D8B27A',
  yolk: '#F6B31E',
  berry: '#3A3F8F',
  berryRed: '#C4304A',
  salmon: '#F08A5D',
  green: '#8DB24D',
  mushroom: '#8A6242',
} as const;

export const vessel = { bowl: '#FFFFFF', plate: '#FBFAF6', pan: '#2B2B2E', highlight: 'rgba(255,255,255,0.3)', shadow: 'rgba(40,30,20,0.18)' } as const;

export type Backdrop = keyof typeof backdrops;
export type FoodColour = keyof typeof foods;
export type GarnishColour = keyof typeof garnish;
