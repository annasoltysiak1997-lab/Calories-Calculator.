import { useRef, useState } from 'react';
import { href, navigate } from '../../app/router';
import { DemoNote } from '../../components/feedback/Feedback';
import { CalcEntry } from '../../components/home/CalcEntry';
import { ContinueCard } from '../../components/home/ContinueCard';
import { ModeOptions, type ModeOption } from '../../components/home/ModeOptions';
import { HomeHeader } from '../../components/layout/HomeHeader';
import { Screen, SectionHeading } from '../../components/layout/Screen';
import { formatGrams, formatKcal } from '../../domain/format';
import { dishTotals, forAmount } from '../../domain/nutrition';
import { actions, allFoods, getState, useAppState } from '../../state/store';

type Mode = 'food' | 'dish' | 'recipe';

const MODES: ModeOption<Mode>[] = [
  { value: 'food', title: 'One food', sub: 'food × grams' },
  { value: 'dish', title: 'Homemade dish', sub: 'add ingredients' },
  { value: 'recipe', title: 'Recipe', sub: 'per serving' },
];

const RECENT_PREVIEW = 3;

/** Where the entry field leads for each option. */
function go(mode: Mode, q: string) {
  if (mode === 'recipe') {
    // Keep the active filters; only the search text changes.
    if (q) actions.setFilters({ ...getState().filters, query: q });
    navigate('/recipes');
  } else if (mode === 'dish' && !q) {
    navigate('/dish');
  } else {
    // One food, or an ingredient for the dish: the food calculator adds it to the dish.
    navigate(`/food${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  }
}

export function HomeScreen() {
  const dish = useAppState((s) => s.dish);
  const recent = useAppState((s) => s.recent);
  const custom = useAppState((s) => s.customFoods);
  const foods = { ...allFoods(), ...custom };
  const hasDish = dish && dish.lines.length > 0;
  // A dish in progress makes "Homemade dish" the natural starting point.
  const [mode, setMode] = useState<Mode>(hasDish ? 'dish' : 'food');
  const [showAll, setShowAll] = useState(false);
  const recentRef = useRef<HTMLElement>(null);
  const total = hasDish ? dishTotals(dish.lines, foods).total : null;
  const recentRows = recent.filter((r) => foods[r.foodId]);
  const shown = showAll ? recentRows : recentRows.slice(0, RECENT_PREVIEW);

  const openHistory = () => {
    setShowAll(true);
    recentRef.current?.scrollIntoView({ block: 'start' });
    recentRef.current?.focus({ preventScroll: true });
  };

  return (
    <Screen className="dl-page--home">
      <HomeHeader trailing={recentRows.length ? <button type="button" className="dl-text-button dl-home-history" onClick={openHistory}>History</button> : null} />

      <CalcEntry label="What are you calculating?" placeholder="Food, dish or recipe" onSubmit={(q) => go(mode, q)}
        onScan={() => actions.toast('Barcode scanning isn’t available yet. Search for the food instead.')} />

      <ModeOptions label="Calculation type" options={MODES} value={mode} onChange={setMode} />

      {hasDish && total ? <ContinueCard name={dish.name} ingredients={dish.lines.length} kcal={total.kcal} href={href('/dish')} /> : null}

      {recentRows.length ? (
        <section ref={recentRef} tabIndex={-1} aria-label="Recent foods" className="dl-stack dl-home-recent">
          <SectionHeading
            title="Recent"
            action={recentRows.length > RECENT_PREVIEW ? (
              <button type="button" className="dl-text-button" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
                {showAll ? 'Show less' : 'See all'}
              </button>
            ) : undefined}
          />
          <ul className="dl-card dl-card--flush dl-list dl-recent-list" role="list">
            {shown.map((r) => (
              <li key={r.foodId}>
                <a className="dl-list-row dl-recent-row" href={href(`/food?id=${r.foodId}&g=${r.grams}`)}>
                  <span className="dl-recent-row__main"><b>{foods[r.foodId].name}</b><span>{formatGrams(r.grams)} g</span></span>
                  <span className="dl-recent-row__value"><b>{formatKcal(forAmount(foods[r.foodId], r.grams).kcal)}</b> kcal</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="dl-home-foot">
        <DemoNote />
        <a href={href('/design-system')} className="dl-link">Daylight design system</a>
      </footer>
    </Screen>
  );
}
