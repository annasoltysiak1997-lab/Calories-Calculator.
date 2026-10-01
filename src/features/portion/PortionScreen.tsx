import { useMemo, useState } from 'react';
import { href } from '../../app/router';
import { AmountField } from '../../components/calculator/AmountField';
import { Stepper } from '../../components/calculator/Stepper';
import { DemoNote, EmptyState } from '../../components/feedback/Feedback';
import { AppHeader } from '../../components/layout/AppHeader';
import { Screen } from '../../components/layout/Screen';
import { InlineMacros, NutritionSummary } from '../../components/nutrition/NutritionSummary';
import { OperatorGlyph } from '../../components/nutrition/OperatorGlyph';
import { SegmentedControl } from '../../components/primitives/SegmentedControl';
import { CookingPot, iconProps } from '../../components/primitives/Icon';
import { DEMO_FOODS } from '../../data/foods.demo';
import { formatGrams, formatKcal, workingLine } from '../../domain/format';
import { dishTotals, portionByServings, portionByWeight } from '../../domain/nutrition';
import type { Food } from '../../domain/types';
import { actions, useAppState } from '../../state/store';

const fmtServings = (v: number) => (v === 1 ? '1 serving' : `${v % 1 === 0.5 ? `${Math.floor(v) || ''}½` : v.toLocaleString('en-GB')} servings`);

export function PortionScreen() {
  const dish = useAppState((s) => s.dish);
  const custom = useAppState((s) => s.customFoods);
  const foods = useMemo<Record<string, Food>>(() => ({ ...DEMO_FOODS, ...custom }), [custom]);
  const [mode, setMode] = useState<'servings' | 'weight'>('servings');
  const [eaten, setEaten] = useState(1);
  const [bowl, setBowl] = useState<number | undefined>(undefined);

  if (!dish || dish.lines.length === 0) {
    return (
      <Screen>
        <AppHeader title="Your portion" back={{ label: 'Home', fallback: '/' }} />
        <EmptyState title="Nothing to divide yet" actions={<a className="dl-button dl-button--primary" href={href('/dish')}>Build a dish</a>}>
          A portion is part of a dish. Add ingredients first, then come back here.
        </EmptyState>
      </Screen>
    );
  }

  const total = dishTotals(dish.lines, foods).total;
  const byServings = portionByServings(total, dish.servings, eaten);
  const byWeight = dish.cookedGrams && bowl ? portionByWeight(total, dish.cookedGrams, bowl) : undefined;
  const portion = mode === 'servings' ? byServings : byWeight;
  const sharePct = portion ? Math.round(portion.share * 100) : 0;

  return (
    <Screen>
      <AppHeader title="Your portion" back={{ label: 'Dish', fallback: '/dish' }} />

      <section className="dl-whole-strip" aria-label="Whole dish">
        <span className="dl-whole-strip__icon" aria-hidden="true"><CookingPot {...iconProps(20)} /></span>
        <span className="dl-whole-strip__body">
          <span className="dl-whole-strip__top"><span className="dl-overline">Whole dish</span><b>{formatKcal(total.kcal)} kcal</b></span>
          <InlineMacros nutrients={total} />
          <span className="dl-muted">{dish.name} · {dish.servings} servings{dish.cookedGrams ? ` · ${formatGrams(dish.cookedGrams)} g cooked` : ''}</span>
        </span>
      </section>

      <SegmentedControl label="Calculate by" value={mode} onChange={setMode}
        options={[{ value: 'servings', label: 'By servings' }, { value: 'weight', label: 'By weight' }]} />

      {mode === 'servings' ? (
        <section className="dl-card dl-stack" style={{ gap: 'var(--dl-space-4)' }} aria-label="Servings">
          <div className="dl-eq-row">
            <OperatorGlyph op="÷" /><span className="dl-eq-row__label">Servings in the dish</span>
            <Stepper label="servings in the dish" value={dish.servings} min={1} max={24} onChange={(v) => { actions.setServings(v); if (eaten > v) setEaten(v); }} />
          </div>
          <div className="dl-eq-row">
            <OperatorGlyph op="×" /><span className="dl-eq-row__label">I had</span>
            <Stepper label="servings I had" value={eaten} step={0.5} min={0.5} max={dish.servings} format={fmtServings} onChange={setEaten} />
          </div>
        </section>
      ) : (
        <section className="dl-card dl-stack" style={{ gap: 'var(--dl-space-4)' }} aria-label="Weights">
          <AmountField size="md" label="Cooked weight of the whole dish" unit="g" min={1} max={20000} value={dish.cookedGrams}
            placeholder="Weigh the pot" onChange={(v) => actions.setCookedGrams(v)}
            sub="Weigh the finished dish without the pot." />
          <AmountField size="md" label="I had" unit="g" min={1} max={dish.cookedGrams ?? 20000} value={bowl} onChange={setBowl}
            placeholder="Weigh your bowl" sub={dish.cookedGrams ? `Up to ${formatGrams(dish.cookedGrams)} g` : undefined} />
        </section>
      )}

      {portion ? (
        <NutritionSummary accent scope="my-portion" label="My portion" nutrients={portion.nutrients} approximate size="lg"
          note={mode === 'servings' ? `${fmtServings(eaten)} of ${dish.servings}` : `${sharePct}% of the dish · ≈ ${fmtServings(Math.round(portion.share * dish.servings * 10) / 10)}`}
          footer={<p className="dl-caption">{mode === 'servings'
            ? workingLine(total.kcal, dish.servings, eaten)
            : `${formatKcal(total.kcal)} × ${formatGrams(bowl!)} ÷ ${formatGrams(dish.cookedGrams!)} = ${(Math.round(portion.nutrients.kcal * 10) / 10).toLocaleString('en-GB')} → ${formatKcal(portion.nutrients.kcal)} kcal`}</p>} />
      ) : (
        <div className="dl-card dl-card--subtle dl-hint">
          {dish.cookedGrams ? 'Enter how much you had to see your portion.' : 'Enter the cooked weight and your bowl’s weight to see your portion.'}
        </div>
      )}
      <p className="dl-caption">≈ because portions are rarely exactly equal. Values are calculated from exact totals, then rounded to whole kcal and grams.</p>
      <DemoNote />
    </Screen>
  );
}
