import { useEffect, useMemo, useRef, useState } from 'react';
import { href } from '../../app/router';
import { AmountField } from '../../components/calculator/AmountField';
import { Keypad } from '../../components/calculator/Keypad';
import { useKeypadFocus } from '../../components/calculator/useKeypadFocus';
import { EmptyState } from '../../components/feedback/Feedback';
import { AppHeader } from '../../components/layout/AppHeader';
import { PageHeader } from '../../components/layout/PageHeader';
import { Screen } from '../../components/layout/Screen';
import { MacroBar } from '../../components/nutrition/MacroBar';
import { MacroTiles } from '../../components/nutrition/MacroTiles';
import { OperatorGlyph } from '../../components/nutrition/OperatorGlyph';
import { ResultRow } from '../../components/nutrition/ResultRow';
import { SegmentedControl } from '../../components/primitives/SegmentedControl';
import { DEMO_FOODS } from '../../data/foods.demo';
import { formatGrams, formatKcal, workingLine } from '../../domain/format';
import { applyAmountKey, withFraction } from '../../domain/amountInput';
import { dishTotals, parseAmount, portionByServings, portionByWeight } from '../../domain/nutrition';
import type { Food } from '../../domain/types';
import { actions, useAppState, type Dish } from '../../state/store';

export function PortionScreen() {
  const dish = useAppState((s) => s.dish);
  const custom = useAppState((s) => s.customFoods);
  const foods = useMemo<Record<string, Food>>(() => ({ ...DEMO_FOODS, ...custom }), [custom]);

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

  return <Division dish={dish} foods={foods} />;
}

type Field = 'servings' | 'eaten' | 'cooked' | 'bowl';
const SERVINGS_MAX = 24;
const GRAMS_MAX = 20000;

/** C4: whole dish ÷ servings × what I had, or by weight. The keypad edits whichever row is active. */
function Division({ dish, foods }: { dish: Dish; foods: Record<string, Food> }) {
  const [mode, setMode] = useState<'servings' | 'weight'>('servings');
  // Each row keeps its own text so "4." or "1.5" survive while typing.
  const [text, setText] = useState<Record<Field, string>>({
    servings: String(dish.servings), eaten: '1', cooked: dish.cookedGrams ? String(dish.cookedGrams) : '', bowl: '',
  });
  const [replaceNext, setReplaceNext] = useState(false);
  const refs = { servings: useRef<HTMLInputElement>(null), eaten: useRef<HTMLInputElement>(null), cooked: useRef<HTMLInputElement>(null), bowl: useRef<HTMLInputElement>(null) };
  const keypad = useKeypadFocus<Field>(Object.values(refs));

  const total = dishTotals(dish.lines, foods).total;
  const num = (f: Field, max: number) => { const n = parseAmount(text[f]); return text[f] !== '' && n > 0 && n <= max ? n : undefined; };
  const servings = num('servings', SERVINGS_MAX);
  const eaten = servings ? num('eaten', servings) : undefined;
  const cooked = num('cooked', GRAMS_MAX);
  const bowl = cooked ? num('bowl', cooked) : undefined;
  const portion = mode === 'servings'
    ? (servings && eaten ? portionByServings(total, servings, eaten) : undefined)
    : (cooked && bowl ? portionByWeight(total, cooked, bowl) : undefined);

  const maxOf = (f: Field) => (f === 'servings' ? SERVINGS_MAX : f === 'eaten' ? (servings ?? SERVINGS_MAX) : f === 'cooked' ? GRAMS_MAX : (cooked ?? GRAMS_MAX));
  const isServings = (f: Field) => f === 'servings' || f === 'eaten';
  // Store the dish's servings and cooked weight as soon as they are valid; "I had" and the bowl stay on this screen.
  const update = (f: Field, next: string) => {
    setText((t) => ({ ...t, [f]: next }));
    setReplaceNext(false);
    const n = parseAmount(next);
    const valid = next !== '' && n > 0 && n <= maxOf(f);
    if (f === 'servings' && valid) actions.setServings(n);
    if (f === 'cooked') actions.setCookedGrams(valid ? n : undefined);
  };
  const focus = (f: Field) => { keypad.setActive(f); setReplaceNext(true); };
  // C4 opens with "Servings" ready to edit on the keypad.
  useEffect(() => { refs.servings.current?.focus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const active = keypad.active;

  const row = (f: Field, op: '÷' | '×', label: string, unit: string | undefined, placeholder: string) => (
    <div className="dl-portion-row">
      <OperatorGlyph op={op} />
      <AmountField layout="inline" size="md" label={label} placeholder={placeholder} unit={unit} max={maxOf(f)}
        value={parseAmount(text[f]) || undefined} text={text[f]} onTextChange={(t) => update(f, t)} keypad inputRef={refs[f]}
        onFocus={() => focus(f)} onBlur={keypad.onBlur} />
    </div>
  );

  return (
    <Screen className={`dl-page--portion ${active ? 'dl-page--keypad' : ''}`}>
      <PageHeader title="Your portion" context={{ label: dish.name, to: '/dish', spoken: `Back to ${dish.name}` }} />
      <SegmentedControl label="Calculate by" value={mode} onChange={(m) => { setMode(m); keypad.setActive(null); }}
        options={[{ value: 'servings', label: 'By servings' }, { value: 'weight', label: 'By weight' }]} />

      <section className="dl-card dl-portion-card" aria-label="My portion">
        <div className="dl-portion-row dl-portion-row--static">
          <OperatorGlyph op="" />
          <span className="dl-portion-row__label">Whole dish</span>
          <span className="dl-portion-row__value">{formatKcal(total.kcal)} kcal</span>
        </div>
        {mode === 'servings' ? (
          <>
            {row('servings', '÷', 'Servings', undefined, 'Servings')}
            {row('eaten', '×', 'I had', eaten === 1 ? 'serving' : 'servings', 'Servings')}
          </>
        ) : (
          <>
            {row('cooked', '÷', 'Cooked weight', 'g', 'Weigh the pot')}
            {row('bowl', '×', 'I had', 'g', 'Weigh your bowl')}
          </>
        )}
        <hr className="dl-dish-card__divider" />
        {portion ? (
          <div className="dl-dish-result">
            <ResultRow label="My portion" kcal={portion.nutrients.kcal} approximate={portion.approximate} size="md" />
            <MacroBar nutrients={portion.nutrients} />
            <MacroTiles nutrients={portion.nutrients} />
            <p className="dl-portion-card__working">{mode === 'servings'
              ? workingLine(total.kcal, servings!, eaten!)
              : `${formatKcal(total.kcal)} × ${formatGrams(bowl!)} ÷ ${formatGrams(cooked!)} = ${(Math.round(portion.nutrients.kcal * 10) / 10).toLocaleString('en-GB')} → ${formatKcal(portion.nutrients.kcal)} kcal`}</p>
          </div>
        ) : (
          <p className="dl-portion-card__hint">{mode === 'servings'
            ? 'Enter the servings in the dish and how many you had.'
            : cooked ? 'Enter how much you had to see your portion.' : 'Enter the cooked weight and your bowl’s weight to see your portion.'}</p>
        )}
      </section>

      {active ? (
        <Keypad panelRef={keypad.keypadRef} onBlur={keypad.onBlur}
          label={{ servings: 'Servings in the whole dish', eaten: 'Servings you had', cooked: 'Cooked weight of the whole dish', bowl: 'Weight of your portion' }[active]}
          units={[isServings(active) ? { value: 'servings', label: 'servings' } : { value: 'g', label: 'g' }]} unit={isServings(active) ? 'servings' : 'g'} onUnitChange={() => undefined}
          shortcuts={isServings(active) ? [
            { label: '½', spoken: 'Half', onPress: () => update(active, withFraction(text[active], 0.5, maxOf(active))) },
            { label: '¼', spoken: 'Quarter', onPress: () => update(active, withFraction(text[active], 0.25, maxOf(active))) },
          ] : undefined}
          onKey={(k) => update(active, applyAmountKey(text[active], k, { max: maxOf(active), decimals: isServings(active) ? 2 : 0, replace: replaceNext }))} />
      ) : null}
    </Screen>
  );
}
