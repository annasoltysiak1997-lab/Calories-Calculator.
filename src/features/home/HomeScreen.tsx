import { useState } from 'react';
import { href, navigate } from '../../app/router';
import { Mark } from '../../components/brand/Mark';
import { DemoNote } from '../../components/feedback/Feedback';
import { Screen, SectionHeading } from '../../components/layout/Screen';
import { MacroBar } from '../../components/nutrition/MacroBar';
import { InlineMacros } from '../../components/nutrition/NutritionSummary';
import { ScopeBadge } from '../../components/nutrition/ScopeBadge';
import { ChevronRight, iconProps, Search } from '../../components/primitives/Icon';
import { formatKcal } from '../../domain/format';
import { dishTotals, forAmount } from '../../domain/nutrition';
import { allFoods, useAppState } from '../../state/store';

const START = [
  { op: '×', title: 'One food', text: 'Weigh a single food and see what’s in it', to: '/food' },
  { op: '+', title: 'Homemade dish', text: 'Add ingredients, then divide into servings', to: '/dish' },
  { op: '÷', title: 'Recipe', text: 'Find a recipe and calculate per serving', to: '/recipes' },
];

export function HomeScreen() {
  const dish = useAppState((s) => s.dish);
  const recent = useAppState((s) => s.recent);
  const custom = useAppState((s) => s.customFoods);
  const foods = { ...allFoods(), ...custom };
  const [q, setQ] = useState('');
  const hasDish = dish && dish.lines.length > 0;
  const total = hasDish ? dishTotals(dish.lines, foods).total : null;

  return (
    <Screen>
      <header className="dl-home-head">
        <Mark size={44} />
        <h1 className="dl-home-head__title">Calories Calculator</h1>
        <p className="dl-home-head__formula">food <b>×</b> amount <b>=</b> kcal · protein · carbs · fat</p>
      </header>

      {hasDish && total ? (
        <section className="dl-card dl-resume" aria-labelledby="resume-title">
          <div className="dl-resume__top">
            <ScopeBadge scope="in-progress" />
            <span className="dl-muted">{dish.lines.length} {dish.lines.length === 1 ? 'ingredient' : 'ingredients'}</span>
          </div>
          <div className="dl-resume__main">
            <h2 id="resume-title" className="dl-resume__name">{dish.name}</h2>
            <span className="dl-resume__kcal"><b>{formatKcal(total.kcal)}</b> kcal</span>
          </div>
          <MacroBar nutrients={total} />
          <InlineMacros nutrients={total} />
          <div className="dl-two-buttons">
            <a className="dl-button dl-button--primary dl-button--md" href={href('/dish')}>Resume dish</a>
            <a className="dl-button dl-button--secondary dl-button--md" href={href('/portion')}>My portion</a>
          </div>
        </section>
      ) : null}

      <form className="dl-search" role="search" onSubmit={(e) => { e.preventDefault(); navigate(`/food${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`); }}>
        <label className="dl-field__control dl-search__control">
          <Search {...iconProps(20)} />
          <span className="dl-visually-hidden">Search foods</span>
          <input className="dl-field__input" type="search" placeholder="Search a food, e.g. skyr" value={q} onChange={(e) => setQ(e.target.value)} enterKeyHint="search" />
        </label>
      </form>

      <section aria-label="Start a calculation" className="dl-stack">
        <SectionHeading title="Start" />
        <ul className="dl-card dl-card--flush dl-list" role="list">
          {START.map((s) => (
            <li key={s.to}>
              <a className="dl-start-row" href={href(s.to)}>
                <span className="dl-start-row__op" aria-hidden="true">{s.op}</span>
                <span className="dl-start-row__text"><b>{s.title}</b><span>{s.to === '/dish' && hasDish ? `Continue “${dish!.name}”` : s.text}</span></span>
                <ChevronRight {...iconProps(20)} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {recent.length ? (
        <section aria-label="Recent foods" className="dl-stack">
          <SectionHeading title="Recent" />
          <ul className="dl-card dl-card--flush dl-list" role="list">
            {recent.filter((r) => foods[r.foodId]).map((r) => (
              <li key={r.foodId}>
                <a className="dl-list-row" href={href(`/food?id=${r.foodId}&g=${r.grams}`)}>
                  <span className="dl-list-row__main"><b>{foods[r.foodId].name}</b><span>{r.grams} g</span></span>
                  <span className="dl-list-row__value"><b>{formatKcal(forAmount(foods[r.foodId], r.grams).kcal)}</b> kcal</span>
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
