import { useMemo, useState } from 'react';
import { navigate, type Route } from '../../app/router';
import { AmountField } from '../../components/calculator/AmountField';
import { DemoNote } from '../../components/feedback/Feedback';
import { CalcHeader } from '../../components/layout/CalcHeader';
import { CalculatorTabs } from '../../components/layout/AppHeader';
import { Screen } from '../../components/layout/Screen';
import { NutritionSummary } from '../../components/nutrition/NutritionSummary';
import { OperatorGlyph } from '../../components/nutrition/OperatorGlyph';
import { Button } from '../../components/primitives/Button';
import { Check, iconProps, Pencil, Plus, Search, X } from '../../components/primitives/Icon';
import { formatGrams, formatKcal } from '../../domain/format';
import { forAmount } from '../../domain/nutrition';
import type { Food } from '../../domain/types';
import { DEMO_FOODS } from '../../data/foods.demo';
import { actions, useAppState } from '../../state/store';
import { CustomFoodForm } from './CustomFoodForm';

type FoodRoute = Extract<Route, { name: 'food' }>;

export function FoodScreen({ route }: { route: FoodRoute }) {
  const custom = useAppState((s) => s.customFoods);
  const dish = useAppState((s) => s.dish);
  const foods = useMemo<Record<string, Food>>(() => ({ ...DEMO_FOODS, ...custom }), [custom]);
  const [query, setQuery] = useState(route.query ?? '');
  const [selectedId, setSelectedId] = useState<string | undefined>(route.foodId && foods[route.foodId] ? route.foodId : undefined);
  const [entering, setEntering] = useState(false);
  const selected = selectedId ? foods[selectedId] : undefined;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.values(foods)
      .filter((f) => !q || f.name.toLowerCase().includes(q))
      .sort((a, b) => (a.source === b.source ? a.name.localeCompare(b.name) : a.source === 'user' ? -1 : 1));
  }, [foods, query]);

  const pick = (f: Food) => { setSelectedId(f.id); setEntering(false); };

  if (selected) {
    return (
      <FoodCalculation key={selected.id} food={selected} initialGrams={route.foodId === selected.id ? route.grams : undefined}
        dishName={dish?.name} hasDish={Boolean(dish)} onChange={() => { setSelectedId(undefined); setQuery(''); }} />
    );
  }

  return (
    <Screen>
      <CalcHeader />
      <CalculatorTabs active="food" />
      {entering ? (
        <CustomFoodForm initialName={query} onCancel={() => setEntering(false)} onSave={(input) => pick(actions.addCustomFood(input))} />
      ) : (
        <>
          <div role="search" className="dl-field__control dl-search__control">
            <Search {...iconProps(20)} />
            <label htmlFor="food-search" className="dl-visually-hidden">Search foods</label>
            <input id="food-search" className="dl-field__input" type="search" placeholder="Search foods" value={query}
              onChange={(e) => setQuery(e.target.value)} autoComplete="off" autoFocus={Boolean(route.query)} />
            {query ? <button type="button" className="dl-clear" aria-label="Clear search" onClick={() => setQuery('')}><X size={14} strokeWidth={2.6} /></button> : null}
          </div>
          <section className="dl-card dl-card--flush" aria-label={query ? `Foods matching ${query}` : 'All foods'}>
            {list.length ? (
              <ul className="dl-list" role="list">
                {list.map((f) => (
                  <li key={f.id}>
                    <button type="button" className="dl-list-row" onClick={() => pick(f)}>
                      <span className="dl-list-row__main"><b>{f.name}</b><span>{formatKcal(f.per100g.kcal)} kcal per 100 g{f.source === 'user' ? ' · your values' : ''}</span></span>
                      <span className="dl-list-row__chev" aria-hidden="true">›</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dl-list-empty">No food called “{query}” yet.</p>
            )}
          </section>
          <Button variant="secondary" icon={Plus} onClick={() => setEntering(true)}>Enter your own food</Button>
          <DemoNote>Demo foods use typical per-100 g values. Foods you enter use your values.</DemoNote>
        </>
      )}
    </Screen>
  );
}

function FoodCalculation({ food, initialGrams, dishName, hasDish, onChange }: { food: Food; initialGrams?: number; dishName?: string; hasDish: boolean; onChange: () => void }) {
  const units = Object.entries(food.units ?? {});
  const [unit, setUnit] = useState<string>('g');
  const [qty, setQty] = useState<number | undefined>(initialGrams);
  const grams = qty === undefined ? undefined : unit === 'g' ? qty : qty * (food.units?.[unit] ?? 1);
  const result = grams !== undefined && grams > 0 ? forAmount(food, grams) : undefined;
  const [saved, setSaved] = useState(false);

  const add = () => {
    if (!grams) return;
    actions.addToDish(food.id, grams);
    actions.saveRecent(food.id, grams);
    navigate('/dish');
  };

  return (
    <Screen
      bottomBar={
        <div className="dl-bar-actions">
          <Button fullWidth disabled={!result} onClick={add}
            sub={result ? `${hasDish ? `${dishName} · ` : ''}${formatGrams(grams!)} g · ${formatKcal(result.kcal)} kcal` : 'Enter an amount first'}>
            {hasDish ? 'Add to dish' : 'Start a dish with this'}
          </Button>
          <Button variant="secondary" disabled={!result || saved} icon={saved ? Check : undefined}
            onClick={() => { if (grams) { actions.saveRecent(food.id, grams); setSaved(true); } }}>
            {saved ? 'Saved' : 'Save as recent'}
          </Button>
        </div>
      }
    >
      <CalcHeader />
      <CalculatorTabs active="food" />
      <section className="dl-card dl-stack" style={{ gap: 'var(--dl-space-4)' }} aria-labelledby="food-name">
        <div className="dl-food-head">
          <div className="dl-food-head__text">
            <h2 id="food-name" className="dl-card-title">{food.name}</h2>
            <span className="dl-muted">{formatKcal(food.per100g.kcal)} kcal per 100 g · {food.source === 'user' ? 'your values' : 'demo values'}</span>
          </div>
          <button type="button" className="dl-text-button" onClick={onChange}><Pencil {...iconProps(16)} />Change</button>
        </div>
        <div className="dl-amount-row">
          <OperatorGlyph op="×" />
          <AmountField label="Amount" unit={unit === 'g' ? 'g' : unit} value={qty} onChange={setQty} max={unit === 'g' ? 5000 : 50}
            sub={unit !== 'g' ? (qty !== undefined && qty !== 1 && grams ? `${qty} ${unit} = ${formatGrams(grams)} g` : `1 ${unit} = ${formatGrams(food.units?.[unit] ?? 0)} g`) : undefined} autoFocus={initialGrams === undefined} />
        </div>
        {units.length ? (
          <div className="dl-segmented dl-segmented--sm" role="radiogroup" aria-label="Unit">
            {[['g', 1] as [string, number], ...units].map(([u, g]) => (
              <button key={u} type="button" role="radio" aria-checked={unit === u} className="dl-segmented__item"
                onClick={() => { setUnit(u); if (qty !== undefined) setQty(u === 'g' ? (grams ?? qty) : 1); }}>
                {u === 'g' ? 'grams' : u}<span className="dl-visually-hidden">{u === 'g' ? '' : ` (${g} g)`}</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="dl-chip-group" role="group" aria-label="Quick amounts">
          {[['100 g', 'g', 100] as const, ...units.map(([u]) => [`1 ${u}`, u, 1] as const)].map(([label, u, n]) => (
            <button key={label} type="button" className="dl-chip" onClick={() => { setUnit(u); setQty(n); }}>{label}</button>
          ))}
        </div>
      </section>

      {result ? (
        <NutritionSummary label="This amount" nutrients={result} size="xl" bar />
      ) : (
        <div className="dl-reference">
          <NutritionSummary label="Per 100 g" nutrients={food.per100g} size="lg" note="Reference until you enter an amount" />
        </div>
      )}
      <DemoNote>{food.source === 'user' ? 'Calculated from the values you entered.' : undefined}</DemoNote>
    </Screen>
  );
}
