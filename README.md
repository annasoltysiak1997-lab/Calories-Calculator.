# Bitewise

A calculator-first nutrition app for quickly calculating calories and macros for food, homemade dishes, portions, and recipes.

## What it does

Bitewise answers one question at a time: *how many calories, and how much protein, carbohydrate and fat, are in this?*

- **Home** — start a food, a homemade dish or a recipe; resume the dish in progress; see recent foods.
- **Food Calculator** — search demo foods or enter your own (kcal, protein, carbs, fat per 100 g), set an amount in grams or household units, and see the result update live. Add the food to a dish.
- **Homemade Dish** — add, edit and remove ingredients; see whole-dish totals; set the number of servings and an optional cooked weight to get per-serving values.
- **Your Portion** — work out your portion by servings (½ steps) or by weight, with the working shown.
- **Recipes** — browse and search recipes, use category shortcuts and filters (time, diet, calories, include/exclude ingredients), with help when nothing matches.
- **Recipe Detail** — ingredients with quantities and kcal, method, and per-serving nutrition.
- **Make an editable copy** — turn a read-only recipe into your own homemade dish, edit it, and compare it with the original.

Bitewise is **not** a daily calorie tracker or food diary. There is no diary, goals, streaks or weight tracking.

The current dish, your own foods, recent foods and recipe filters are saved in the browser (localStorage).

## Design

- Warm off-white background
- Cobalt blue primary accent
- Macro-specific colours for protein, carbohydrates and fat
- Plus Jakarta Sans typography
- Compact, mobile-first interface (designed at 390 × 844, works from 320 px wide)
- Bitewise branding: a text wordmark in the app header and a short launch animation when the app opens

All colours, spacing, radii, shadows and type come from design tokens in `src/theme`. The in-app design-system page (`#/design-system`) shows them.

## AI-assisted workflow

The visual design was created in Figma, and Figma was the source of truth for every screen. Claude Code was used as an implementation and iteration tool to:

- translate the Figma designs into React components
- implement the interaction flows between screens
- refactor shared UI into reusable components
- write and run tests, type checks and builds to validate the implementation

Claude did not design the product. Its output was reviewed and iterated against the Figma designs.

## Tech stack

- React 19
- TypeScript (strict)
- Vite
- Plain CSS with custom properties
- Vitest for tests
- lucide-react icons, @fontsource/plus-jakarta-sans

### Checks
```bash
npm test             # nutrition and filter logic (Vitest)
npm run check        # no colour literals outside src/theme
npm run typecheck    # TypeScript
npm run build        # all of the above + production build into dist/
npm run preview      # serve the production build locally
```

### Structure
```
src/
  app/          router.ts (hash routes)
  state/        store.ts (dish, own foods, recent, filters; persisted) · selectors.ts
  domain/       nutrition · format · filters · types (+ __tests__) — pure, no UI
  data/         foods.demo.ts · recipes.demo.ts (demo data)
  theme/        tokens.ts · typography.ts · cssVars.ts · foodArt.ts
  styles/       global.css · components.css · app.css (var(--dl-…) only)
  components/   brand · primitives · nutrition · calculator · recipes · layout · feedback
  features/     home · food · dish · portion · recipes · design-system
```

## Routes

| Screen | Route | Description |
| --- | --- | --- |
| Home | `#/` | Start a food, homemade dish or recipe; resume the current dish; recent foods |
| Food Calculator | `#/food` | Calories and macros for one food, demo or your own |
| Homemade Dish | `#/dish` | Ingredients, whole-dish totals, servings, optional cooked weight, per-serving values |
| Original vs copy | `#/dish/original` | Read-only original recipe next to your edited copy |
| Your Portion | `#/portion` | Your portion by servings or by weight |
| Recipes | `#/recipes` | Browse, search, filters and no-results help |
| Recipe Detail | `#/recipes/:id` | Ingredients, method, per-serving nutrition, **Make an editable copy** |
| Design system | `#/design-system` | Bitewise tokens and components |

## Run locally

Requires Node.js 18 or newer.
```bash
npm install
npm run dev          # open the URL it prints (usually http://localhost:5173)
```

### Deploy (share a link with reviewers)
The app uses hash routes (`#/recipes`), so it works on any static host with no server configuration.

- **Netlify (quickest):** run `npm run build`, then drag the `dist/` folder onto https://app.netlify.com/drop. You get a public link immediately.
- **Vercel:** import the repository at https://vercel.com/new — framework "Vite", build command `npm run build`, output `dist`.
- **GitHub Pages:** push to GitHub, then Settings → Pages → Source: GitHub Actions and use the "Static HTML" workflow with `dist/` as the path (after `npm ci && npm run build`). `base: './'` in `vite.config.ts` already handles the sub-path.

## Notes

Nutrition values are **demo data**: typical per-100 g figures, not verified against labels or lab analysis. Foods you enter yourself use your own values.
