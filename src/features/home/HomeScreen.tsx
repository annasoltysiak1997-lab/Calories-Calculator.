import { useRef, useState } from 'react';
import { href, navigate } from '../../app/router';
import { CalcEntry } from '../../components/home/CalcEntry';
import { ContinueCard } from '../../components/home/ContinueCard';
import { ModeOptions, type ModeOption } from '../../components/home/ModeOptions';
import { HomeHeader } from '../../components/layout/HomeHeader';
import { Screen, SectionHeading } from '../../components/layout/Screen';
import { DEMO_DISH, DEMO_RECENT } from '../../data/home.demo';
import { formatAmount, formatKcal } from '../../domain/format';
import { dishTotals, forAmount } from '../../domain/nutrition';
import { actions, allFoods, getState, useAppState } from '../../state/store';

type Mode = 'food' | 'dish' | 'recipe';

const MODES: ModeOption<Mode>[] = [
  { value: 'food', title: 'One food', sub: 'food × grams', href: href('/food') },
  { value: 'dish', title: 'Homemade dish', sub: 'add ingredients', href: href('/dish') },
  { value: 'recipe', title: 'Recipe', sub: 'per serving', href: href('/recipes') },
];

/** Highlighted option card, as in the approved Home design. The entry field follows it. */
const ACTIVE_MODE: Mode = 'dish';

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
  const [showAll, setShowAll] = useState(false);
  const recentRef = useRef<HTMLElement>(null);

  // Until the person has their own dish and recent foods, Home shows the demo ones.
  const ownDish = dish && dish.lines.length > 0 ? dish : null;
  const shownDish = ownDish ?? DEMO_DISH;
  const dishKcal = dishTotals(shownDish.lines, foods).total.kcal;
  const ownRecent = recent.filter((r) => foods[r.foodId]);
  const recentRows = ownRecent.length ? ownRecent : DEMO_RECENT;
  const shown = showAll ? recentRows : recentRows.slice(0, RECENT_PREVIEW);

  const openHistory = () => {
    setShowAll(true);
    recentRef.current?.scrollIntoView({ block: 'start' });
    recentRef.current?.focus({ preventScroll: true });
  };

  return (
    <Screen className="dl-page--home">
      <HomeHeader trailing={<button type="button" className="dl-text-button dl-home-history" onClick={openHistory}>History</button>} />

      <CalcEntry label="What are you calculating?" placeholder="Food, dish or recipe" onSubmit={(q) => go(ACTIVE_MODE, q)}
        onScan={() => actions.toast('Barcode scanning isn’t available yet. Search for the food instead.')} />

      <ModeOptions label="Calculators" options={MODES} active={ACTIVE_MODE} />

      <ContinueCard name={shownDish.name} ingredients={shownDish.lines.length} kcal={dishKcal} href={href('/dish')}
        onOpen={ownDish ? undefined : () => actions.startDishWith(DEMO_DISH.name, DEMO_DISH.servings, DEMO_DISH.lines)} />

      <section ref={recentRef} tabIndex={-1} aria-label="Recent foods" className="dl-stack dl-home-recent">
        <SectionHeading
          title="Recent"
          action={recentRows.length > RECENT_PREVIEW ? (
            <button type="button" className="dl-text-button" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
              See all
            </button>
          ) : undefined}
        />
        <ul className="dl-card dl-card--flush dl-list dl-recent-list" role="list">
          {shown.map((r) => (
            <li key={r.foodId}>
              <a className="dl-list-row dl-recent-row" href={href(`/food?id=${r.foodId}`)}>
                <span className="dl-recent-row__main"><b>{foods[r.foodId].name}</b><span>{formatAmount(foods[r.foodId], r.grams, r.unit)}</span></span>
                <span className="dl-recent-row__value"><b>{formatKcal(forAmount(foods[r.foodId], r.grams).kcal)}</b> kcal</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Screen>
  );
}
