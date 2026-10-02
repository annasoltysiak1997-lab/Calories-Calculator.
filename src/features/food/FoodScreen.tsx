import { useEffect, useMemo, useRef, useState, type FocusEvent } from 'react';
import { navigate, type Route } from '../../app/router';
import { AmountField } from '../../components/calculator/AmountField';
import { DemoNote } from '../../components/feedback/Feedback';
import { CalcHeader } from '../../components/layout/CalcHeader';
import { CalculatorTabs } from '../../components/layout/AppHeader';
import { Screen } from '../../components/layout/Screen';
import { Keypad } from '../../components/calculator/Keypad';
import { SelectedFoodField } from '../../components/calculator/SelectedFoodField';
import { MacroBar } from '../../components/nutrition/MacroBar';
import { MacroTiles } from '../../components/nutrition/MacroTiles';
import { OperatorGlyph } from '../../components/nutrition/OperatorGlyph';
import { ResultRow } from '../../components/nutrition/ResultRow';
import { Button } from '../../components/primitives/Button';
import { ChipGroup, ToggleChip } from '../../components/primitives/Chip';
import { Check, iconProps, Plus, ScanBarcode, Search, X } from '../../components/primitives/Icon';
import { IconButton } from '../../components/primitives/IconButton';
import { DEMO_DISH } from '../../data/home.demo';
import { applyAmountKey, type AmountKey } from '../../domain/amountInput';
import { formatAmount, formatGrams, formatKcal, shortFoodName } from '../../domain/format';
import { convertAmount, forAmount, parseAmount, unitToGrams } from '../../domain/nutrition';
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
  // Nothing is selected until the person picks a food; a food named in the link opens directly (no amount).
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

  /** Adds to the dish in progress; until there is one, that is the demo dish shown on Home. */
  const add = (grams: number) => {
    if (!selectedId) return;
    if (!dish) actions.startDishWith(DEMO_DISH.name, DEMO_DISH.servings, DEMO_DISH.lines);
    actions.addToDish(selectedId, grams);
    actions.saveRecent(selectedId, grams);
    navigate('/dish');
  };

  if (selected) {
    return (
      <FoodCalculation key={selected.id} food={selected}
        dishName={dish?.name ?? DEMO_DISH.name} onChange={() => { setSelectedId(undefined); setQuery(''); }} onAdd={add} />
    );
  }

  return (
    <Screen className="dl-page--food">
      <CalcHeader trailing={<ScanButton />} />
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

function FoodCalculation({ food, dishName, onChange, onAdd }: { food: Food; dishName: string; onChange: () => void; onAdd: (grams: number) => void }) {
  const units = Object.entries(food.units ?? {});
  const [unit, setUnit] = useState<string>('g');
  // The amount as typed (keypad, keyboard or quick amount). Always starts empty.
  const [text, setText] = useState('');
  // After a quick amount or unit switch, the next key starts a new number instead of appending.
  const [replaceNext, setReplaceNext] = useState(false);
  // Exact weight kept across a unit switch, so 10 g → 0.07 pot → g is still 10 g. Cleared by any edit.
  const [pinnedGrams, setPinnedGrams] = useState<number>();
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const keypadRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const max = unit === 'g' ? 5000 : 50;
  const parsed = parseAmount(text);
  const qty = text !== '' && parsed > 0 && parsed <= max ? parsed : undefined;
  const grams = qty === undefined ? undefined : pinnedGrams ?? unitToGrams(food, unit, qty);
  const result = grams !== undefined ? forAmount(food, grams) : undefined;
  const [savedGrams, setSavedGrams] = useState<number>();
  // Without an amount, "Save as recent" keeps the 100 g reference.
  const saveGrams = grams ?? 100;
  const quick: { label: string; unit: string; qty: number }[] = [
    { label: formatAmount(food, 100), unit: 'g', qty: 100 },
    ...units.map(([u, g]) => ({ label: formatAmount(food, g, u), unit: u, qty: 1 })),
  ];

  const edit = (next: string) => { setText(next); setReplaceNext(false); setPinnedGrams(undefined); };
  const setAmount = (u: string, n: number | undefined) => { setUnit(u); setText(n === undefined ? '' : String(n)); setReplaceNext(true); setPinnedGrams(undefined); };
  const switchUnit = (u: string) => {
    if (grams === undefined) { setUnit(u); return; }
    setAmount(u, convertAmount(food, grams, 'g', u));
    setPinnedGrams(grams);
  };
  const pressKey = (k: AmountKey) => edit(applyAmountKey(text, k, { max, decimals: unit === 'g' ? 1 : 2, replace: replaceNext }));
  // The keypad stays open while the person works with the amount field, the keypad or the actions below the card.
  // Closing it on a tap of "Add" would move that button before the tap ends, so the actions count as inside.
  const isInside = (node: Node | null) =>
    !!node && (node === inputRef.current || !!keypadRef.current?.contains(node) || !!actionsRef.current?.contains(node));
  const closeUnlessInside = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && !isInside(next)) setEditing(false); // keyboard focus moved elsewhere (taps are handled below)
  };
  useEffect(() => {
    if (!editing) return;
    const onPointerDown = (e: PointerEvent) => { if (!isInside(e.target as Node)) setEditing(false); };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  });

  return (
    <Screen className={`dl-page--food ${editing ? 'dl-page--keypad' : ''}`}>
      <CalcHeader trailing={<ScanButton />} />
      <CalculatorTabs active="food" />
      <SelectedFoodField name={food.name} meta={food.source === 'user' ? 'Your values' : 'Demo values'} onChange={onChange} />

      <section className="dl-card dl-food-card" aria-labelledby="food-name">
        <div className="dl-food-card__head">
          <h2 id="food-name" className="dl-food-card__title">{food.name}</h2>
          <span className="dl-food-card__per">{formatKcal(food.per100g.kcal)} kcal / 100 g</span>
        </div>
        <div className="dl-food-amount">
          <OperatorGlyph op="×" />
          <AmountField layout="inline" size="md" label="Amount" placeholder="Enter amount" unit={unit} value={qty} max={max}
            text={text} onTextChange={edit} keypad inputRef={inputRef}
            onFocus={() => setEditing(true)} onBlur={closeUnlessInside}
            sub={unit !== 'g' && grams ? formatAmount(food, grams, unit) : undefined} />
        </div>
        <hr className="dl-food-card__divider" />
        <div className={result ? 'dl-food-result' : 'dl-food-result dl-food-result--reference'}>
          <ResultRow label={result ? 'This amount' : 'Per 100 g'} kcal={(result ?? food.per100g).kcal} size="md"
            note={result ? undefined : 'Reference until you enter an amount'} />
          {result ? <MacroBar nutrients={result} /> : null}
          <MacroTiles nutrients={result ?? food.per100g} />
        </div>
      </section>

      {editing ? null : (
        <section className="dl-stack dl-food-quick" aria-labelledby="quick-amounts">
          <h3 id="quick-amounts" className="dl-food-quick__title">Quick amounts</h3>
          <ChipGroup label="Quick amounts" fill>
            {quick.map((q) => (
              <ToggleChip key={q.label} selected={unit === q.unit && qty === q.qty} onToggle={() => setAmount(q.unit, q.qty)}>{q.label}</ToggleChip>
            ))}
          </ChipGroup>
        </section>
      )}

      <div className="dl-food-actions" ref={actionsRef}>
        <Button variant="dark" disabled={!result} onClick={() => { if (grams) onAdd(grams); }}>Add to {dishName}</Button>
        <Button variant="secondary" disabled={savedGrams === saveGrams} icon={savedGrams === saveGrams ? Check : undefined}
          onClick={() => { actions.saveRecent(food.id, saveGrams); setSavedGrams(saveGrams); }}>
          {savedGrams === saveGrams ? 'Saved' : 'Save as recent'}
        </Button>
      </div>
      <p className={editing ? 'dl-visually-hidden' : 'dl-food-hint'} aria-live="polite">
        {result ? `${formatGrams(grams!)} g · ${formatKcal(result.kcal)} kcal will be added to ${dishName}` : 'Enter an amount to add it to your dish'}
      </p>

      {editing ? (
        <Keypad panelRef={keypadRef} label={`Amount of ${shortFoodName(food.name)}`} unit={unit} onUnitChange={switchUnit} onKey={pressKey}
          onBlur={closeUnlessInside} units={[{ value: 'g', label: 'g' }, ...units.map(([u]) => ({ value: u, label: u }))]} />
      ) : null}
    </Screen>
  );
}

function ScanButton() {
  return <IconButton icon={ScanBarcode} label="Scan barcode" variant="outline" onClick={() => actions.toast('Barcode scanning isn’t available yet. Search for the food instead.')} />;
}
