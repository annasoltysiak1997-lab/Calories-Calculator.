import { useMemo } from 'react';
import { href } from '../../app/router';
import { DemoNote, EmptyState } from '../../components/feedback/Feedback';
import { AppHeader } from '../../components/layout/AppHeader';
import { Screen } from '../../components/layout/Screen';
import { ScopeBadge } from '../../components/nutrition/ScopeBadge';
import { DEMO_FOODS } from '../../data/foods.demo';
import { formatGrams, formatKcal } from '../../domain/format';
import { dishTotals, forAmount } from '../../domain/nutrition';
import type { Food } from '../../domain/types';
import { useAppState } from '../../state/store';

/** Read-only reference: the original recipe next to your copy. */
export function OriginalScreen() {
  const dish = useAppState((s) => s.dish);
  const custom = useAppState((s) => s.customFoods);
  const foods = useMemo<Record<string, Food>>(() => ({ ...DEMO_FOODS, ...custom }), [custom]);
  if (!dish?.source) {
    return (
      <Screen>
        <AppHeader title="Original recipe" back={{ label: 'Dish', fallback: '/dish' }} />
        <EmptyState title="This dish isn’t a recipe copy" actions={<a className="dl-button dl-button--secondary" href={href('/dish')}>Back to dish</a>} />
      </Screen>
    );
  }
  const src = dish.source;
  const orig = dishTotals(src.lines, foods).total;
  const mine = dishTotals(dish.lines, foods).total;
  const rows = src.lines.map((o) => {
    const now = dish.lines.find((l) => l.foodId === o.foodId);
    return { name: foods[o.foodId]?.name ?? o.foodId, o, now, changed: !now || now.grams !== o.grams };
  });
  const added = dish.lines.filter((l) => !src.lines.some((o) => o.foodId === l.foodId));

  return (
    <Screen>
      <AppHeader title="Original recipe" back={{ label: 'My copy', fallback: '/dish' }} />
      <ScopeBadge scope="original" />
      <div className="dl-stack" style={{ gap: 'var(--dl-space-2)' }}>
        <h2 className="dl-card-title">{src.recipeName}</h2>
        <p className="dl-muted">The published recipe stays exactly as it is. Changes below are only in your copy.</p>
      </div>
      <section className="dl-card dl-card--flush" aria-label="Ingredients compared">
        <ul className="dl-list" role="list">
          {rows.map((r) => (
            <li key={r.o.foodId} className={`dl-compare ${r.changed ? 'dl-compare--changed' : ''}`}>
              <span className="dl-compare__main"><b>{r.name}</b><span>{formatGrams(r.o.grams)} g</span>
                {r.changed ? <span className="dl-status">{r.now ? `Your copy: ${formatGrams(r.now.grams)} g · ${formatKcal(forAmount(foods[r.o.foodId], r.now.grams).kcal)} kcal` : 'Removed in your copy'}</span> : null}
              </span>
              <span className="dl-compare__kcal"><b>{formatKcal(forAmount(foods[r.o.foodId], r.o.grams).kcal)}</b> kcal</span>
            </li>
          ))}
          {added.map((l) => (
            <li key={l.id} className="dl-compare dl-compare--changed">
              <span className="dl-compare__main"><b>{foods[l.foodId]?.name}</b><span className="dl-status">Only in your copy: {formatGrams(l.grams)} g</span></span>
              <span className="dl-compare__kcal">—</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="dl-card dl-compare-totals" aria-label="Totals compared">
        <div><span className="dl-amount__label">Original</span><b>{formatKcal(orig.kcal)} kcal ÷ {src.servings}</b><span className="dl-compare-totals__big">≈ {formatKcal(orig.kcal / src.servings)}</span><span className="dl-muted">kcal per serving</span></div>
        <div><span className="dl-amount__label dl-accent">Your copy</span><b>{formatKcal(mine.kcal)} kcal ÷ {dish.servings}</b><span className="dl-compare-totals__big">≈ {formatKcal(mine.kcal / dish.servings)}</span><span className="dl-muted">kcal per serving</span></div>
      </section>
      <div className="dl-two-buttons">
        <a className="dl-button dl-button--primary" href={href('/dish')}>Back to my copy</a>
        <a className="dl-button dl-button--secondary" href={href(`/recipes/${src.recipeId}`)}>Full recipe</a>
      </div>
      <DemoNote />
    </Screen>
  );
}
