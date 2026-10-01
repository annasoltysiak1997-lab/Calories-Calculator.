# CLAUDE.md — Calories Calculator (Daylight)

Read this before changing code. The design spec is the approved "Daylight — Visual Identity & Design System" doc; the approved screens are on the design canvas (pages "C · UX refinement" and "D · Recipe Discovery"). Do not change flows or information architecture.

## Stack
Vite + React 19 + TypeScript (strict), plain CSS with custom properties, Vitest, lucide-react, @fontsource/plus-jakarta-sans. Responsive web app, designed at 390 × 844, must work from 320 px wide.

## Rules
1. **Tokens only.** All colours, spacing, radii, shadows and type come from `src/theme/tokens.ts` and `src/theme/typography.ts`, exposed as CSS variables `--dl-*` by `applyTheme()`. No colour literals outside `src/theme` — `npm run check` enforces it.
2. **Domain ≠ UI.** Nutrition maths (`src/domain/nutrition.ts`), formatting (`format.ts`) and filtering (`filters.ts`) are pure TypeScript with tests. Components never calculate; they receive numbers or call the domain.
3. **Rounding.** Calculate from unrounded values; round half up only when formatting. kcal and grams are whole numbers; 0 < g < 1 shows "< 1 g". Values from dividing a dish are approximate ("≈").
4. **Filters.** Limits are inclusive (≤). Diets: every selected diet must match; vegan implies vegetarian and dairy-free. Include = contains all; exclude = contains none. Active filters live in one store and survive navigation.
5. **Recipe copy.** "Make an editable copy" clones recipe ingredients into a new dish with `sourceRecipeId`. Recipes are read-only.
6. **Layout.** Single column, vertical scrolling only. No horizontal scroll or carousels; chips wrap. Keep label columns shrinkable (`min-width: 0`) and values unwrapped.
7. **Accessibility.** 44 px targets, visible focus (2 px accent ring), icon + text for states, spoken labels for values ("approximately 443 kilocalories"), reduced motion respected.
8. **Demo data.** `src/data/*.demo.ts` is illustrative. Show the demo-data note wherever nutrition is displayed.

## Commands
- `npm run dev` — preview (currently the design-system page)
- `npm test` — domain tests (lentil soup fixtures: 1,773 / ≈ 443 / copy 1,597 / ≈ 399)
- `npm run check` — token rule; `npm run typecheck`; `npm run build`

## App structure
- Routes (hash): `#/`, `#/food`, `#/dish`, `#/dish/original`, `#/portion`, `#/recipes`, `#/recipes/:id`, `#/design-system` — see `src/app/router.ts`.
- State: `src/state/store.ts` (current dish, own foods, recent foods, recipe filters; persisted to localStorage). Screens read state with `useAppState` and change it only through `actions`.
- Screens live in `src/features/*`; they call `src/domain` for every number.

## Status
All screens are implemented: Home, Food calculator (demo foods + own food entry), Dish builder, Portion (by servings / by weight), Recipe discovery with filters and no-results help, Recipe detail, editable recipe copy with original comparison. Not in scope: diary, goals, streaks, weight tracking.
