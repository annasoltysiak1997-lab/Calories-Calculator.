import { useMemo, useState } from 'react';
import { DemoNote } from '../../components/feedback/Feedback';
import { CalcHeader } from '../../components/layout/CalcHeader';
import { CalculatorTabs } from '../../components/layout/AppHeader';
import { Screen, SectionHeading } from '../../components/layout/Screen';
import { RemovableChip } from '../../components/primitives/Chip';
import { Check, iconProps, Search, SlidersHorizontal, X } from '../../components/primitives/Icon';
import { IconButton } from '../../components/primitives/IconButton';
import { RecipeCard } from '../../components/recipes/RecipeCard';
import { RecipeIllustration } from '../../components/recipes/RecipeIllustration';
import { DEMO_FOODS } from '../../data/foods.demo';
import { DEMO_RECIPES } from '../../data/recipes.demo';
import {
  activeFilterCount, allIngredientNames, applyFilters, closestMatch, constraintLabel, constraintsOf,
  kcalPerServing, NO_FILTERS, removalEffects, withoutConstraint, type Constraint, type RecipeFilters,
} from '../../domain/filters';
import { formatKcal } from '../../domain/format';
import type { Food, Recipe } from '../../domain/types';
import { actions, useAppState } from '../../state/store';
import { FilterSheet } from './FilterSheet';

const CATEGORIES: { title: string; sub: string; recipeId: string; filters: Partial<RecipeFilters> }[] = [
  { title: 'Quick meals', sub: '30 min or less', recipeId: 'shakshuka', filters: { maxMinutes: 30 } },
  { title: 'Vegetarian', sub: 'Meat-free dinners', recipeId: 'greek-salad', filters: { diets: ['vegetarian'] } },
  { title: 'Lighter meals', sub: '500 kcal or less', recipeId: 'pumpkin-ginger-soup', filters: { maxKcalPerServing: 500 } },
  { title: 'Soups', sub: 'Warm and hearty', recipeId: 'white-bean-stew', filters: { query: 'soup' } },
];
const PANTRY = ['Lentils', 'Chickpeas', 'Tomatoes', 'Eggs', 'Spinach', 'Coconut milk'];

export function RecipesScreen() {
  const filters = useAppState((s) => s.filters);
  const custom = useAppState((s) => s.customFoods);
  const foods = useMemo<Record<string, Food>>(() => ({ ...DEMO_FOODS, ...custom }), [custom]);
  const [sheet, setSheet] = useState(false);
  const kcal = (r: Recipe) => kcalPerServing(r, foods);
  const results = useMemo(() => applyFilters(DEMO_RECIPES, filters, foods), [filters, foods]);
  const chips = constraintsOf(filters).filter((c) => c.kind !== 'query');
  const browsing = !filters.query.trim() && chips.length === 0;
  const byId = (id: string) => DEMO_RECIPES.find((r) => r.id === id)!;
  const set = (f: RecipeFilters) => actions.setFilters(f);

  const removeChip = (c: Constraint) => {
    const before = filters;
    set(withoutConstraint(filters, c));
    actions.toast(`${constraintLabel(c)} removed`, () => set(before));
  };

  return (
    <Screen>
      <CalcHeader />
      <CalculatorTabs active="recipes" />

      <div className="dl-search-row">
        <div role="search" className="dl-field__control dl-search__control">
          <Search {...iconProps(20)} />
          <label htmlFor="recipe-search" className="dl-visually-hidden">Search recipes</label>
          <input id="recipe-search" className="dl-field__input" type="search" placeholder="Recipes, dishes or ingredients" autoComplete="off"
            value={filters.query} onChange={(e) => set({ ...filters, query: e.target.value })} enterKeyHint="search" />
          {filters.query ? <button type="button" className="dl-clear" aria-label="Clear search" onClick={() => set({ ...filters, query: '' })}><X size={14} strokeWidth={2.6} /></button> : null}
        </div>
        <IconButton icon={SlidersHorizontal} label="Filters" variant="filled" badge={activeFilterCount(filters) || undefined} onClick={() => setSheet(true)} className="dl-filter-button" />
      </div>

      {chips.length ? (
        <div className="dl-active-filters">
          <span className="dl-overline">Active filters · {chips.length}</span>
          <div className="dl-chip-group">
            {chips.map((c) => (
              <RemovableChip key={`${c.kind}-${c.value}`} kind={c.kind === 'include' ? 'include' : c.kind === 'exclude' ? 'exclude' : 'filter'} onRemove={() => removeChip(c)}>
                {constraintLabel(c)}
              </RemovableChip>
            ))}
            <button type="button" className="dl-text-button dl-text-button--muted" onClick={() => set({ ...NO_FILTERS, query: filters.query })}>Clear all</button>
          </div>
        </div>
      ) : null}

      {browsing ? (
        <Discover kcal={kcal} byId={byId} onFilter={(f) => set({ ...NO_FILTERS, ...f })} />
      ) : results.length ? (
        <section className="dl-stack" aria-label="Results" style={{ gap: 'var(--dl-space-5)' }}>
          <p className="dl-results-head" role="status"><b>{results.length} {results.length === 1 ? 'recipe' : 'recipes'}</b>
            {filters.query.trim() ? <> for “{filters.query.trim()}”</> : null}
            {chips.length ? <span className="dl-muted"> · {applyFilters(DEMO_RECIPES, { ...NO_FILTERS, query: filters.query }, foods).length - results.length} hidden by filters</span> : null}
          </p>
          {results.map((r) => <RecipeCard key={r.id} recipe={r} kcal={kcal(r)} />)}
        </section>
      ) : (
        <NoResults filters={filters} foods={foods} kcal={kcal} onChange={set} onRemove={removeChip} />
      )}

      <DemoNote>Recipes and nutrition are demo content, calculated from typical per-100 g values.</DemoNote>
      <FilterSheet open={sheet} value={filters} recipes={DEMO_RECIPES} foods={foods} ingredientOptions={allIngredientNames(DEMO_RECIPES, foods)}
        onClose={() => setSheet(false)} onApply={(f) => { set(f); setSheet(false); }} />
    </Screen>
  );
}

function Discover({ kcal, byId, onFilter }: { kcal: (r: Recipe) => number; byId: (id: string) => Recipe; onFilter: (f: Partial<RecipeFilters>) => void }) {
  const quick = DEMO_RECIPES.filter((r) => r.minutes <= 30).slice(0, 3);
  return (
    <>
      <RecipeCard recipe={byId('lentil-soup')} kcal={kcal(byId('lentil-soup'))} variant="hero" eyebrow="This week · soups that serve four" />
      <section className="dl-stack" aria-label="Browse by category" style={{ gap: 'var(--dl-space-3)' }}>
        <SectionHeading title="Browse by category" />
        <div className="dl-category-grid">
          {CATEGORIES.map((c) => (
            <button key={c.title} type="button" className="dl-category" onClick={() => onFilter(c.filters)}>
              <RecipeIllustration art={byId(c.recipeId).art} className="dl-category__art" />
              <span className="dl-category__title">{c.title}</span>
              <span className="dl-category__sub">{c.sub}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="dl-stack" aria-label="Ready in 30 minutes" style={{ gap: 'var(--dl-space-4)' }}>
        <SectionHeading title="Ready in 30 minutes" sub="30 min or less, start to finish" />
        {quick.map((r) => <RecipeCard key={r.id} recipe={r} kcal={kcal(r)} />)}
        <button type="button" className="dl-text-button" onClick={() => onFilter({ maxMinutes: 30 })}>See all quick recipes</button>
      </section>
      <section className="dl-card dl-stack" aria-label="Cook with what you have" style={{ gap: 'var(--dl-space-3)' }}>
        <SectionHeading title="Cook with what you have" sub="Tap an ingredient to see recipes that use it" />
        <div className="dl-chip-group">
          {PANTRY.map((p) => <button key={p} type="button" className="dl-chip" onClick={() => onFilter({ include: [p] })}>{p}</button>)}
        </div>
      </section>
      <section className="dl-stack" aria-label="All recipes" style={{ gap: 'var(--dl-space-4)' }}>
        <SectionHeading title="All recipes" sub={`${DEMO_RECIPES.length} recipes`} />
        {DEMO_RECIPES.map((r) => <RecipeCard key={r.id} recipe={r} kcal={kcal(r)} variant="row" />)}
      </section>
    </>
  );
}

function NoResults({ filters, foods, kcal, onChange, onRemove }: { filters: RecipeFilters; foods: Record<string, Food>; kcal: (r: Recipe) => number; onChange: (f: RecipeFilters) => void; onRemove: (c: Constraint) => void }) {
  const effects = removalEffects(DEMO_RECIPES, filters, foods);
  const close = closestMatch(DEMO_RECIPES, filters, foods);
  const queryCount = applyFilters(DEMO_RECIPES, { ...NO_FILTERS, query: filters.query }, foods).length;
  const n = effects.length;
  return (
    <section className="dl-stack" aria-live="polite" style={{ gap: 'var(--dl-space-4)' }}>
      <div className="dl-empty dl-empty--compact">
        <h2 className="dl-empty__title">{n ? `No recipes match all ${n} ${n === 1 ? 'filter' : 'filters'}` : `No recipes for “${filters.query.trim()}”`}</h2>
        <p className="dl-empty__text">{filters.query.trim() ? `“${filters.query.trim()}” has ${queryCount} ${queryCount === 1 ? 'recipe' : 'recipes'}.` : ''} {n ? 'Remove a filter to see what fits.' : 'Try a dish or an ingredient, like “lentil” or “tomato”.'}</p>
      </div>
      {n ? (
        <ul className="dl-card dl-card--flush dl-list" role="list" aria-label="Active filters">
          {effects.map(({ constraint, count }) => (
            <li key={`${constraint.kind}-${constraint.value}`} className="dl-relax">
              <span className="dl-relax__main"><b>{constraint.kind === 'include' ? '+ ' : constraint.kind === 'exclude' ? '− ' : ''}{constraintLabel(constraint)}</b>
                <span className={count ? 'dl-accent' : 'dl-muted'}>{count ? `Remove it → ${count} ${count === 1 ? 'recipe' : 'recipes'}` : 'Removing it alone still leaves 0'}</span></span>
              <button type="button" className={`dl-button dl-button--md ${count ? 'dl-button--primary' : 'dl-button--secondary'}`} onClick={() => onRemove(constraint)}>Remove</button>
            </li>
          ))}
        </ul>
      ) : null}
      {close ? (
        <section className="dl-stack" aria-label="Closest match" style={{ gap: 'var(--dl-space-2)' }}>
          <span className="dl-overline">Closest match · misses {close.unmet.length} {close.unmet.length === 1 ? 'filter' : 'filters'}</span>
          <RecipeCard recipe={close.recipe} kcal={kcal(close.recipe)} variant="row" />
          <ul className="dl-criteria" role="list">
            {close.met.map((c) => <li key={`m-${c.kind}-${c.value}`}><span className="dl-criteria__ok"><Check {...iconProps(16)} /></span>{criterionText(c, close.recipe, kcal, true)}</li>)}
            {close.unmet.map((c) => <li key={`u-${c.kind}-${c.value}`}><span className="dl-criteria__no"><X {...iconProps(16)} /></span><b>{criterionText(c, close.recipe, kcal, false)}</b></li>)}
          </ul>
        </section>
      ) : null}
      {n ? <button type="button" className="dl-button dl-button--secondary dl-button--full" onClick={() => onChange({ ...NO_FILTERS, query: filters.query })}>
        Clear all filters · show {queryCount} {queryCount === 1 ? 'recipe' : 'recipes'}
      </button> : null}
    </section>
  );
}

function criterionText(c: Constraint, r: Recipe, kcal: (r: Recipe) => number, ok: boolean): string {
  switch (c.kind) {
    case 'time': return ok ? `${r.minutes} min (limit: ${c.value} min or less)` : `${r.minutes} min, over the ${c.value} min limit`;
    case 'kcal': return ok ? `≈ ${formatKcal(kcal(r))} kcal per serving (limit ${c.value})` : `≈ ${formatKcal(kcal(r))} kcal per serving, above the ${c.value} kcal limit`;
    case 'diet': return ok ? constraintLabel(c) : `Not ${constraintLabel(c).toLowerCase()}`;
    case 'include': return ok ? `Contains ${c.value.toLowerCase()}` : `Doesn’t contain ${c.value.toLowerCase()}`;
    case 'exclude': return ok ? `No ${c.value.toLowerCase()}` : `Contains ${c.value.toLowerCase()}`;
    default: return constraintLabel(c);
  }
}
