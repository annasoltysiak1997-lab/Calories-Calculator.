# Calories Calculator — Daylight

A responsive web app (React + TypeScript + Vite) for working out the calories, protein, carbohydrates and fat in a single food, a homemade dish, one serving and your own portion — plus recipe discovery with an editable-copy handoff. Built on the **Daylight** design system.

> Nutrition values are **demo data**: typical per-100 g figures, not verified against a label or lab. Foods you enter yourself use your values.

## What it does
| Screen | Route | What works |
| --- | --- | --- |
| Home | `#/` | Start a food, dish or recipe; resume the dish in progress; recent foods |
| Food calculator | `#/food` | Search demo foods or enter your own (kcal, protein, carbs, fat per 100 g); amount in grams or household units; live result; add to dish |
| Dish builder | `#/dish` | Add, edit and remove ingredients; whole-dish totals; servings; optional cooked weight; per-serving values |
| Portion | `#/portion` | Your portion by servings (½ steps) or by weight; working shown |
| Recipes | `#/recipes` | Browse, search, category shortcuts, filters (time, diet, calories, include/exclude ingredients), no-results help |
| Recipe detail | `#/recipes/:id` | Ingredients with quantities and kcal, method, per-serving nutrition, **Make an editable copy** |
| Original vs copy | `#/dish/original` | Read-only original next to your edited copy |
| Design system | `#/design-system` | Daylight tokens and components |

The current dish, your own foods, recent foods and filters are saved in the browser (localStorage).

## Run locally
Requires Node.js 18 or newer.
```bash
npm install
npm run dev          # open the URL it prints (usually http://localhost:5173)
```

## Checks
```bash
npm test             # nutrition and filter logic (Vitest)
npm run check        # no colour literals outside src/theme
npm run typecheck    # TypeScript
npm run build        # all of the above + production build into dist/
npm run preview      # serve the production build locally
```

## Deploy (share a link with reviewers)
The app uses hash routes (`#/recipes`), so it works on any static host with no server configuration.

- **Netlify (quickest):** run `npm run build`, then drag the `dist/` folder onto https://app.netlify.com/drop. You get a public link immediately.
- **Vercel:** import the repository at https://vercel.com/new — framework "Vite", build command `npm run build`, output `dist`.
- **GitHub Pages:** push to GitHub, then Settings → Pages → Source: GitHub Actions and use the "Static HTML" workflow with `dist/` as the path (after `npm ci && npm run build`). `base: './'` in `vite.config.ts` already handles the sub-path.

## Structure
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
