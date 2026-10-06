import { useMemo, useState } from 'react';
import { href, navigate } from '../../app/router';
import { IngredientRow } from '../../components/calculator/IngredientRow';
import { AmountField } from '../../components/calculator/AmountField';
import { Stepper } from '../../components/calculator/Stepper';
import { ActionTiles } from '../../components/calculator/ActionTiles';
import { Banner, EmptyState } from '../../components/feedback/Feedback';
import { Sheet } from '../../components/feedback/Sheet';
import { CalcHeader } from '../../components/layout/CalcHeader';
import { CalculatorTabs } from '../../components/layout/AppHeader';
import { Screen } from '../../components/layout/Screen';
import { MacroBar } from '../../components/nutrition/MacroBar';
import { MacroTiles } from '../../components/nutrition/MacroTiles';
import { ResultRow } from '../../components/nutrition/ResultRow';
import { Button } from '../../components/primitives/Button';
import { Copy, iconProps, Plus, Undo2 } from '../../components/primitives/Icon';
import { DEMO_FOODS } from '../../data/foods.demo';
import { describeMacroChange, formatGrams, formatKcal } from '../../domain/format';
import { portionByServings } from '../../domain/nutrition';
import type { Food } from '../../domain/types';
import { dishView } from '../../state/selectors';
import { actions, useAppState } from '../../state/store';

export function DishScreen() {
  const dish = useAppState((s) => s.dish);
  const custom = useAppState((s) => s.customFoods);
  const foods = useMemo<Record<string, Food>>(() => ({ ...DEMO_FOODS, ...custom }), [custom]);
  const [finishing, setFinishing] = useState(false);

  if (!dish || dish.lines.length === 0) {
    return (
      <Screen>
        <CalcHeader trailing={<UndoButton />} />
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
  const changedLine = lc ? view.lines.find((l) => l.id === lc.lineId) : undefined;
  const delta = lc && Math.abs(lc.deltaKcal) >= 0.5 ? `${lc.deltaKcal > 0 ? '+' : '−'}${formatKcal(Math.abs(lc.deltaKcal))} kcal` : undefined;
  const note = lc && changedLine ? describeMacroChange(changedLine.food.name, lc.before, view.total, lc.kind === 'added' ? 'added' : 'changed') : undefined;
  const servingGrams = dish.cookedGrams ? dish.cookedGrams / dish.servings : undefined;
  const count = `${view.lines.length} ${view.lines.length === 1 ? 'ingredient' : 'ingredients'}`;

  return (
    <Screen className="dl-page--dish">
      <CalcHeader trailing={<UndoButton />} />
      <CalculatorTabs active="dish" />

      {dish.source ? (
        <Banner tone="accent" icon={<Copy {...iconProps(20)} />}
          title={`Your editable copy${view.changes ? ` · ${view.changes} ${view.changes === 1 ? 'change' : 'changes'}` : ''}`}
          action={<a className="dl-link" href={href('/dish/original')}>Compare with original</a>}>
          From “{dish.source.recipeName}” (serves {dish.source.servings}). The original recipe is unchanged.
        </Banner>
      ) : null}

      <section className="dl-card dl-dish-card" aria-label={`${dish.name}, ${count}`}>
        <div className="dl-dish-card__head">
          <label className="dl-dish-name">
            <span className="dl-visually-hidden">Dish name</span>
            <input value={dish.name} onChange={(e) => actions.renameDish(e.target.value)} maxLength={60} />
          </label>
          <span className="dl-dish-card__count">{count}</span>
        </div>
        <ul className="dl-ingredients" role="list">
          {view.lines.map((l, i) => (
            <IngredientRow key={l.id} first={i === 0} food={l.food} grams={l.grams} nutrients={l.nutrients} status={l.status}
              onGrams={(g) => actions.updateLine(l.id, g)} onRemove={() => actions.removeLine(l.id)} />
          ))}
        </ul>
        {view.removed.length ? <p className="dl-caption dl-dish-card__removed">Removed from the original: {view.removed.join(', ')}</p> : null}
        <hr className="dl-dish-card__divider" />
        <div className="dl-dish-result">
          <ResultRow label="Whole dish" kcal={view.total.kcal} size="md" delta={delta}
            note={view.original ? `Original ${formatKcal(view.original.kcal)} kcal` : undefined} />
          <MacroBar nutrients={view.total} />
          <MacroTiles nutrients={view.total} />
          {note ? <p className="dl-dish-result__note" aria-live="polite">{note}</p> : null}
        </div>
      </section>

      <ActionTiles label="Dish actions" tiles={[
        { title: 'Add food', sub: 'search or scan', tone: 'dark', onClick: () => navigate('/food') },
        { title: 'Cooking fat', sub: 'oil, butter', onClick: () => navigate('/food?q=oil') },
        { title: 'Servings', sub: 'or weigh the pot', onClick: () => setFinishing(true) },
        { title: 'My portion', sub: 'see my kcal', tone: 'accent', onClick: () => navigate('/portion') },
      ]} />

      <Sheet open={finishing} title="Finished dish" onClose={() => setFinishing(false)}
        footer={<Button fullWidth onClick={() => setFinishing(false)}>Done</Button>}>
        <p className="dl-muted">Used to divide the dish into portions.</p>
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
      </Sheet>
    </Screen>
  );
}

/** Header Undo: steps back through dish changes (add, edit, remove, clear). */
function UndoButton() {
  const canUndo = useAppState((s) => s.history.length > 0);
  return (
    <button type="button" className="dl-text-button dl-undo" disabled={!canUndo} onClick={() => actions.undo()}>
      <Undo2 {...iconProps(16)} />Undo
    </button>
  );
}
