import type { Recipe } from '../domain/types';

/** DEMO DATA — recipes are illustrative; nutrition is calculated from DEMO_FOODS. */
export const DEMO_RECIPES: Recipe[] = [
  {
    id: 'lentil-soup', name: 'Lentil soup with smoked paprika',
    photo: 'images/recipes/lentil-soup.webp',
    collections: ['comfort'],
    description: 'Velvety red lentils, sweet carrot and coconut, with a smoky finish. One pot, freezes well.',
    minutes: 35, servings: 4, diets: ['vegan', 'gluten-free'],
    lines: [
      { foodId: 'red-lentils-dry', grams: 300 },
      { foodId: 'carrots-raw', grams: 300 },
      { foodId: 'coconut-milk', grams: 240 },
      { foodId: 'olive-oil', grams: 15 },
    ],
    extras: ['Water or vegetable stock, 1 litre', 'Onion, garlic, smoked paprika, salt'],
    steps: [
      'Soften the onion and garlic in the olive oil for 5 minutes, then stir in the smoked paprika.',
      'Add the lentils, chopped carrots and stock. Simmer for 20 minutes until the lentils collapse.',
      'Stir in the coconut milk and warm through. Blend half for a thicker soup.',
      'Season, then serve with a swirl of coconut milk and a pinch of paprika.',
    ],
    art: { backdrop: 'terracotta', food: 'paprikaSoup', vessel: 'bowl', garnish: [
      { x: 38, y: 36, r: 9, color: 'cream', shape: 'ring' }, { x: 60, y: 34, r: 3, color: 'herb', shape: 'leaf' },
      { x: 64, y: 60, r: 3, color: 'herb', shape: 'leaf' }, { x: 46, y: 62, r: 2, color: 'chili', shape: 'dot' }, { x: 55, y: 50, r: 1.6, color: 'chili', shape: 'dot' }] },
    source: 'demo',
  },
  {
    id: 'red-lentil-dal', name: 'Red lentil dal',
    photo: 'images/recipes/red-lentil-dal.webp',
    collections: ['comfort'],
    description: 'A golden, gently spiced dal with tomato and ginger. Ready in under half an hour.',
    minutes: 25, servings: 4, diets: ['vegan', 'gluten-free'],
    lines: [
      { foodId: 'red-lentils-dry', grams: 250 }, { foodId: 'tomatoes-canned', grams: 400 }, { foodId: 'onion', grams: 150 },
      { foodId: 'garlic', grams: 10 }, { foodId: 'ginger', grams: 15 }, { foodId: 'olive-oil', grams: 20 },
    ],
    extras: ['Water, 700 ml', 'Turmeric, cumin, salt'],
    steps: ['Fry the onion, garlic and ginger in the oil until soft.', 'Add the spices, lentils, tomatoes and water. Simmer for 18 minutes, stirring often.', 'Season and serve with coriander.'],
    art: { backdrop: 'butter', food: 'dal', vessel: 'bowl', garnish: [
      { x: 44, y: 38, r: 7, color: 'white', shape: 'dot' }, { x: 60, y: 56, r: 3.4, color: 'herb', shape: 'leaf' }, { x: 36, y: 60, r: 3, color: 'herb', shape: 'leaf' }, { x: 58, y: 36, r: 2, color: 'red', shape: 'dot' }] },
    source: 'demo',
  },
  {
    id: 'lentil-walnut-salad', name: 'Lentil & walnut salad',
    photo: 'images/recipes/lentil-walnut-salad.webp',
    description: 'Peppery rocket, earthy lentils and toasted walnuts with a sharp lemon dressing.',
    minutes: 15, servings: 2, diets: ['vegan'],
    lines: [
      { foodId: 'green-lentils-cooked', grams: 250 }, { foodId: 'walnuts', grams: 40 }, { foodId: 'rocket', grams: 50 },
      { foodId: 'lemon-juice', grams: 20 }, { foodId: 'olive-oil', grams: 15 },
    ],
    extras: ['Salt, pepper, mustard'],
    steps: ['Toast the walnuts in a dry pan for 3 minutes.', 'Whisk the lemon juice, oil and mustard.', 'Toss the lentils and rocket with the dressing and top with walnuts.'],
    art: { backdrop: 'sand', food: 'lentilBrown', vessel: 'plate', garnish: [
      { x: 32, y: 34, r: 7, color: 'green', shape: 'leaf' }, { x: 64, y: 30, r: 7, color: 'green', shape: 'leaf' }, { x: 48, y: 56, r: 5, color: 'nut', shape: 'cube' }, { x: 66, y: 60, r: 4.4, color: 'nut', shape: 'cube' }, { x: 36, y: 62, r: 3, color: 'red', shape: 'dot' }] },
    source: 'demo',
  },
  {
    id: 'lentil-bolognese', name: 'Lentil bolognese',
    photo: 'images/recipes/lentil-bolognese.webp',
    collections: ['comfort'],
    description: 'A rich, slow-tasting tomato and lentil sauce over spaghetti, without the meat.',
    minutes: 40, servings: 4, diets: ['vegan'],
    lines: [
      { foodId: 'brown-lentils-dry', grams: 200 }, { foodId: 'spaghetti-dry', grams: 320 }, { foodId: 'tomatoes-canned', grams: 400 },
      { foodId: 'onion', grams: 150 }, { foodId: 'carrots-raw', grams: 150 }, { foodId: 'olive-oil', grams: 15 },
    ],
    extras: ['Water, 500 ml', 'Garlic, oregano, salt'],
    steps: ['Soften the onion and carrot in the oil.', 'Add the lentils, tomatoes and water; simmer for 30 minutes.', 'Cook the spaghetti, then toss with the sauce.'],
    art: { backdrop: 'peach', food: 'pasta', vessel: 'plate', garnish: [
      { x: 50, y: 48, r: 16, color: 'red', shape: 'dot' }, { x: 46, y: 42, r: 3, color: 'herb', shape: 'leaf' }, { x: 62, y: 64, r: 2.4, color: 'white', shape: 'cube' }] },
    source: 'demo',
  },
  {
    id: 'lentil-feta-bake', name: 'Lentil & feta bake',
    photo: 'images/recipes/lentil-feta-bake.webp',
    collections: ['comfort'],
    description: 'Roasted peppers and tomatoes baked with lentils under a salty feta crust.',
    minutes: 50, servings: 4, diets: ['vegetarian', 'gluten-free'],
    lines: [
      { foodId: 'green-lentils-cooked', grams: 500 }, { foodId: 'feta', grams: 150 }, { foodId: 'peppers', grams: 300 },
      { foodId: 'tomatoes-fresh', grams: 300 }, { foodId: 'olive-oil', grams: 20 },
    ],
    extras: ['Oregano, salt, pepper'],
    steps: ['Roast the peppers and tomatoes with the oil for 20 minutes.', 'Stir through the lentils, crumble over the feta.', 'Bake for 20 minutes until golden.'],
    art: { backdrop: 'sand', food: 'bake', vessel: 'plate', garnish: [
      { x: 36, y: 36, r: 5, color: 'white', shape: 'cube' }, { x: 58, y: 44, r: 5, color: 'white', shape: 'cube' }, { x: 44, y: 62, r: 4.4, color: 'white', shape: 'cube' }, { x: 64, y: 30, r: 3, color: 'herb', shape: 'leaf' }] },
    source: 'demo',
  },
  {
    id: 'greek-salad', name: 'Greek salad with feta',
    photo: 'images/recipes/greek-salad.webp',
    description: 'Ripe tomato, crunchy cucumber, olives and a slab of feta. No cooking needed.',
    minutes: 15, servings: 2, diets: ['vegetarian', 'gluten-free'],
    lines: [
      { foodId: 'tomatoes-fresh', grams: 300 }, { foodId: 'cucumber', grams: 200 }, { foodId: 'feta', grams: 100 },
      { foodId: 'olives', grams: 50 }, { foodId: 'onion', grams: 50 }, { foodId: 'olive-oil', grams: 20 },
    ],
    extras: ['Oregano, salt'],
    steps: ['Cut the vegetables into chunks.', 'Add the olives and feta.', 'Dress with oil, oregano and salt.'],
    art: { backdrop: 'mist', food: 'greens', vessel: 'plate', garnish: [
      { x: 32, y: 32, r: 6, color: 'red', shape: 'dot' }, { x: 62, y: 30, r: 6, color: 'red', shape: 'dot' }, { x: 46, y: 60, r: 6, color: 'red', shape: 'dot' },
      { x: 40, y: 44, r: 5, color: 'white', shape: 'cube' }, { x: 66, y: 50, r: 2.6, color: 'dark', shape: 'dot' }, { x: 30, y: 58, r: 2.6, color: 'dark', shape: 'dot' }] },
    source: 'demo',
  },
  {
    id: 'white-bean-stew', name: 'Tomato & white bean stew',
    photo: 'images/recipes/white-bean-stew.webp',
    collections: ['comfort'],
    description: 'Creamy white beans in a garlicky tomato sauce with wilted spinach.',
    minutes: 30, servings: 4, diets: ['vegan', 'gluten-free'],
    lines: [
      { foodId: 'white-beans-canned', grams: 800 }, { foodId: 'tomatoes-canned', grams: 400 }, { foodId: 'onion', grams: 150 },
      { foodId: 'garlic', grams: 10 }, { foodId: 'spinach', grams: 100 }, { foodId: 'olive-oil', grams: 20 },
    ],
    extras: ['Rosemary, salt, pepper'],
    steps: ['Soften the onion and garlic in the oil.', 'Add the beans and tomatoes; simmer for 15 minutes.', 'Stir in the spinach until wilted.'],
    art: { backdrop: 'blush', food: 'stew', vessel: 'bowl', garnish: [
      { x: 36, y: 38, r: 4, color: 'cream', shape: 'dot' }, { x: 54, y: 34, r: 4, color: 'cream', shape: 'dot' }, { x: 60, y: 56, r: 4, color: 'cream', shape: 'dot' }, { x: 40, y: 60, r: 4, color: 'cream', shape: 'dot' }, { x: 48, y: 48, r: 3.4, color: 'herb', shape: 'leaf' }] },
    source: 'demo',
  },
  {
    id: 'shakshuka', name: 'Shakshuka',
    photo: 'images/recipes/shakshuka.webp',
    description: 'Eggs gently poached in a spiced tomato and pepper sauce. Good any time of day.',
    minutes: 25, servings: 2, diets: ['vegetarian', 'gluten-free'],
    lines: [
      { foodId: 'eggs', grams: 240 }, { foodId: 'tomatoes-canned', grams: 400 }, { foodId: 'peppers', grams: 150 },
      { foodId: 'onion', grams: 100 }, { foodId: 'olive-oil', grams: 15 },
    ],
    extras: ['Cumin, paprika, salt'],
    steps: ['Soften the onion and pepper in the oil.', 'Add the tomatoes and spices; simmer for 10 minutes.', 'Make four wells, crack in the eggs, cover and cook for 6 minutes.'],
    art: { backdrop: 'peach', food: 'tomato', vessel: 'pan', garnish: [
      { x: 34, y: 36, r: 10, color: 'white', shape: 'dot' }, { x: 34, y: 36, r: 4, color: 'yolk', shape: 'dot' }, { x: 60, y: 58, r: 10, color: 'white', shape: 'dot' }, { x: 60, y: 58, r: 4, color: 'yolk', shape: 'dot' }, { x: 60, y: 30, r: 3, color: 'herb', shape: 'leaf' }] },
    source: 'demo',
  },
  {
    id: 'pumpkin-ginger-soup', name: 'Pumpkin soup with ginger',
    photo: 'images/recipes/pumpkin-ginger-soup.webp',
    description: 'Silky roasted pumpkin with fresh ginger and a little coconut.',
    minutes: 45, servings: 4, diets: ['vegan', 'gluten-free'],
    lines: [
      { foodId: 'pumpkin', grams: 1000 }, { foodId: 'onion', grams: 150 }, { foodId: 'ginger', grams: 20 },
      { foodId: 'coconut-milk', grams: 200 }, { foodId: 'olive-oil', grams: 15 },
    ],
    extras: ['Vegetable stock, 600 ml', 'Salt, pepper'],
    steps: ['Roast the pumpkin with the oil for 25 minutes.', 'Simmer with the onion, ginger and stock for 10 minutes.', 'Blend with the coconut milk until smooth.'],
    art: { backdrop: 'sky', food: 'pumpkin', vessel: 'bowl', garnish: [
      { x: 40, y: 40, r: 10, color: 'cream', shape: 'ring' }, { x: 62, y: 34, r: 2.4, color: 'seed', shape: 'dot' }, { x: 64, y: 44, r: 2.4, color: 'seed', shape: 'dot' }, { x: 58, y: 62, r: 2.4, color: 'seed', shape: 'dot' }] },
    source: 'demo',
  },
  {
    id: 'salmon-rice-bowl', name: 'Salmon rice bowl',
    photo: 'images/recipes/salmon-rice-bowl.webp',
    description: 'Flaked salmon over rice with crisp cucumber, spinach and lemon.',
    minutes: 20, servings: 2, diets: ['gluten-free', 'dairy-free'],
    lines: [
      { foodId: 'salmon', grams: 250 }, { foodId: 'rice-cooked', grams: 300 }, { foodId: 'cucumber', grams: 100 },
      { foodId: 'spinach', grams: 50 }, { foodId: 'lemon-juice', grams: 10 },
    ],
    extras: ['Sesame seeds, salt'],
    steps: ['Roast the salmon for 12 minutes.', 'Warm the rice and slice the cucumber.', 'Build the bowls and squeeze over the lemon.'],
    art: { backdrop: 'sky', food: 'rice', vessel: 'bowl', garnish: [
      { x: 30, y: 32, r: 10, color: 'salmon', shape: 'cube' }, { x: 62, y: 34, r: 7, color: 'green', shape: 'dot' }, { x: 60, y: 60, r: 7, color: 'green', shape: 'leaf' }, { x: 36, y: 62, r: 2, color: 'dark', shape: 'dot' }] },
    source: 'demo',
  },
];
