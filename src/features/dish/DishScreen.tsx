import { useMemo } from 'react';
import { href, navigate } from '../../app/router';
import { IngredientRow } from '../../components/calculator/IngredientRow';
import { AmountField } from '../../components/calculator/AmountField';
import { Stepper } from '../../components/calculator/Stepper';
import { Banner, DemoNote, EmptyState } from '../../components/feedback/Feedback';
import { CalcHeader } from '../../components/layout/CalcHeader';
import { CalculatorTabs } from '../../components/layout/AppHeader';
import { Screen } from '../../components/layout/Screen';
import { NutritionSummary } from '../../components/nutrition/NutritionSummary';
import { ScopeBadge } from '../../components/nutrition/ScopeBadge';
import { Button } from '../../components/primitives/Button';
import { Copy, iconProps, Pencil, Plus } from '../../components/primitives/Icon';
import { DEMO_FOODS } from '../../data/foods.demo';
import { formatGrams, formatKcal } from '../../domain/format';
import { portionByServings } from '../../domain/nutrition';
import type { Food } from '../../domain/types';
import { biggestMacroChange, dishView } from '../../state/selectors';
import { actions, useAppState } from '../../state/store';

export function DishScreen() {
  const dish = useAppState((s) => s.dish);
  const custom = useAppState((s) => s.customFoods);
  const foods = useMemo<Record<string, Food>>(() => ({ ...DEMO_FOODS, ...custom }), [custom]);

  if (!dish || dish.lines.length === 0) {
    return (
      <Screen>
        <CalcHeader />
        <CalculatorTabs active="dish" />
        <EmptyState title="Build a dish like a sum"
          actions={<>
            <Button icon={Plus} onClick={() => { if (!dish) actions.startDish(); navigate('/food'); }}>Add first ingredient</Button>
            <a className="dl-button dl-button--secondary" href={href('/recipes')}>Start from a recipe</a>
          </>}>
          Add ingredients with their amounts, set how many servings the dish makes, then work out your portion.
        </EmptyState>
      </Screen>
    );
  }

  const view = dishView(dish, foods);
  const per = portionByServings(view.total, dish.servings, 1);
  const lc = dish.lastChange;
  const moved = lc ? biggestMacroChange(lc.before, view.total) : null;
  const delta = lc && Math.abs(lc.deltaKcal) >= 0.5 ? `${lc.deltaKcal > 0 ? '+' : '−'}${formatKcal(Math.abs(lc.deltaKcal))} kcal` : undefined;
  const servingGrams = dish.cookedGrams ? dish.cookedGrams / dish.servings : undefined;

  return (
    <Screen bottomBar={<Button fullWidth onClick={() => navigate('/portion')} sub={`≈ ${formatKcal(per.nutrients.kcal)} kcal per serving`}>Work out my portion</Button>}>
      <CalcHeader trailing={<button type="button" className="dl-text-button" onClick={() => { actions.clearDish(); }}>Clear dish</button>} />
      <CalculatorTabs active="dish" />

      {dish.source ? (
        <Banner tone="accent" icon={<Copy {...iconProps(20)} />}
          title={`Your editable copy${view.changes ? ` · ${view.changes} ${view.changes === 1 ? 'change' : 'changes'}` : ''}`}
          action={<a className="dl-link" href={href('/dish/original')}>Compare with original</a>}>
          From “{dish.source.recipeName}” (serves {dish.source.servings}). The original recipe is unchanged.
        </Banner>
      ) : null}

      <section className="dl-card dl-stack dl-dish" style={{ gap: 'var(--dl-space-3)' }} aria-label="Ingredients">
        <div className="dl-dish__head">
          <ScopeBadge scope="whole-dish" />
          <span className="dl-muted">{view.lines.length} {view.lines.length === 1 ? 'ingredient' : 'ingredients'}</span>
        </div>
        <label className="dl-dish-name">
          <span className="dl-visually-hidden">Dish name</span>
          <input value={dish.name} onChange={(e) => actions.renameDish(e.target.value)} maxLength={60} />
          <Pencil {...iconProps(16)} />
        </label>
        <ul className="dl-ingredients" role="list">
          {view.lines.map((l, i) => (
            <IngredientRow key={l.id} first={i === 0} food={l.food} grams={l.grams} nutrients={l.nutrients} status={l.status}
              onGrams={(g) => actions.updateLine(l.id, g)} onRemove={() => actions.removeLine(l.id)} />
          ))}
        </ul>
        {view.removed.length ? <p className="dl-muted">Removed from the original: {view.removed.join(', ')}</p> : null}
        <div className="dl-two-buttons">
          <Button variant="dark" size="md" icon={Plus} onClick={() => navigate('/food')}>Add food</Button>
          <Button variant="secondary" size="md" onClick={() => navigate('/food?q=oil')}>Cooking fat</Button>
        </div>
      </section>

      <NutritionSummary label="Whole dish" nutrients={view.total} size="lg" bar delta={delta}
        note={view.original ? `Original ${formatKcal(view.original.kcal)} kcal` : undefined}
        highlight={lc && moved ? { macro: moved, note: `was ${formatGrams(lc.before[moved])} g` } : undefined} />

      <section className="dl-card dl-stack" style={{ gap: 'var(--dl-space-4)' }} aria-labelledby="finished-title">
        <div>
          <h2 id="finished-title" className="dl-card-title dl-card-title--sm">Finished dish</h2>
          <p className="dl-muted">Used to divide the dish into portions.</p>
        </div>
        <div className="dl-finished">
          <div className="dl-finished__cell">
            <span className="dl-amount__label">Servings</span>
            <Stepper label="servings" value={dish.servings} min={1} max={24} onChange={(v) => actions.setServings(v)} />
          </div>
          <div className="dl-finished__cell">
            <AmountField size="md" label="Cooked weight (optional)" unit="g" value={dish.cookedGrams} min={1} max={20000}
              placeholder="Not weighed" onChange={(v) => actions.setCookedGrams(v)} />
          </div>
        </div>
        <p className="dl-caption">
          1 serving = 1/{dish.servings} of the dish{servingGrams ? ` ≈ ${formatGrams(servingGrams)} g` : ''} · ≈ {formatKcal(per.nutrients.kcal)} kcal
          {dish.source ? ` (original ≈ ${formatKcal(view.original!.kcal / dish.source.servings)})` : ''}
        </p>
      </section>

      <NutritionSummary label="Per serving" nutrients={per.nutrients} approximate size="md" note={`Whole dish ÷ ${dish.servings}`} />
      <DemoNote />
    </Screen>
  );
}
