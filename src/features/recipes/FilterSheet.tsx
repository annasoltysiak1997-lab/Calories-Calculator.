import { useEffect, useMemo, useState } from 'react';
import { Sheet } from '../../components/feedback/Sheet';
import { Check, iconProps, Minus, Plus, X } from '../../components/primitives/Icon';
import { applyFilters, DIET_LABELS, type KcalLimit, type RecipeFilters, type TimeLimit } from '../../domain/filters';
import type { Diet, Food, Recipe } from '../../domain/types';

interface Props {
  open: boolean;
  value: RecipeFilters;
  recipes: Recipe[];
  foods: Record<string, Food>;
  ingredientOptions: string[];
  onApply: (f: RecipeFilters) => void;
  onClose: () => void;
}

const TIMES: (TimeLimit | undefined)[] = [undefined, 15, 30, 60];
const KCALS: (KcalLimit | undefined)[] = [300, 500, 700, undefined];
const DIETS: Diet[] = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'];

/** Edit all filters on a draft; the button shows the live result count. Close keeps the previous filters. */
export function FilterSheet({ open, value, recipes, foods, ingredientOptions, onApply, onClose }: Props) {
  const [draft, setDraft] = useState(value);
  useEffect(() => { if (open) setDraft(value); }, [open, value]);
  const count = useMemo(() => applyFilters(recipes, draft, foods).length, [recipes, draft, foods]);
  const toggleDiet = (d: Diet) => setDraft((f) => ({ ...f, diets: f.diets.includes(d) ? f.diets.filter((x) => x !== d) : [...f.diets, d] }));

  return (
    <Sheet open={open} title="Filters" onClose={onClose}
      headerAction={<button type="button" className="dl-text-button" onClick={() => setDraft((f) => ({ ...f, maxMinutes: undefined, maxKcalPerServing: undefined, diets: [], include: [], exclude: [] }))}>Clear all</button>}
      footer={<button type="button" className="dl-button dl-button--primary dl-button--full" onClick={() => onApply(draft)}>
        {count === 0 ? 'Show results (0 recipes)' : `Show ${count} ${count === 1 ? 'recipe' : 'recipes'}`}
      </button>}>
      {draft.query ? <p className="dl-muted">Filtering results for <b>“{draft.query}”</b></p> : null}

      <fieldset className="dl-filter-group">
        <legend>Time</legend>
        <p className="dl-filter-group__hint">Total time, up to and including the limit</p>
        <div className="dl-radio-grid">
          {TIMES.map((t) => (
            <label key={String(t)} className="dl-radio-tile">
              <input type="radio" name="time" checked={draft.maxMinutes === t} onChange={() => setDraft((f) => ({ ...f, maxMinutes: t }))} />
              <span>{t ? `≤ ${t} min` : 'Any'}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="dl-filter-group">
        <legend>Diet</legend>
        <p className="dl-filter-group__hint">Recipes must match every diet you pick. Vegan recipes are also vegetarian and dairy-free.</p>
        <div className="dl-chip-group">
          {DIETS.map((d) => (
            <label key={d} className="dl-check-chip">
              <input type="checkbox" checked={draft.diets.includes(d)} onChange={() => toggleDiet(d)} />
              <span>{draft.diets.includes(d) ? <Check {...iconProps(16)} /> : null}{DIET_LABELS[d]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="dl-filter-group">
        <legend>Calories per serving</legend>
        <p className="dl-filter-group__hint">Up to and including the limit</p>
        <div className="dl-radio-grid">
          {KCALS.map((k) => (
            <label key={String(k)} className="dl-radio-tile">
              <input type="radio" name="kcal" checked={draft.maxKcalPerServing === k} onChange={() => setDraft((f) => ({ ...f, maxKcalPerServing: k }))} />
              <span>{k ? `≤ ${k} kcal` : 'No limit'}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="dl-filter-group">
        <legend>Ingredients</legend>
        <p className="dl-filter-group__hint">Include: every listed ingredient must be in the recipe. Exclude: none of them may be.</p>
        <IngredientPicker kind="include" values={draft.include} options={ingredientOptions}
          onChange={(include) => setDraft((f) => ({ ...f, include }))} />
        <IngredientPicker kind="exclude" values={draft.exclude} options={ingredientOptions}
          onChange={(exclude) => setDraft((f) => ({ ...f, exclude }))} />
      </fieldset>
    </Sheet>
  );
}

function IngredientPicker({ kind, values, options, onChange }: { kind: 'include' | 'exclude'; values: string[]; options: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState('');
  const t = text.trim().toLowerCase();
  const suggestions = t ? options.filter((o) => o.toLowerCase().includes(t) && !values.includes(o)).slice(0, 5) : [];
  const add = (v: string) => { const clean = v.trim(); if (clean && !values.includes(clean)) onChange([...values, clean]); setText(''); };
  const label = kind === 'include' ? 'Include' : 'Exclude';
  return (
    <div className="dl-ing-picker">
      <span className={`dl-ing-picker__label dl-ing-picker__label--${kind}`}>{kind === 'include' ? <Plus {...iconProps(16)} /> : <Minus {...iconProps(16)} />}{label}</span>
      <form className="dl-field__control" onSubmit={(e) => { e.preventDefault(); add(text); }}>
        <label className="dl-visually-hidden" htmlFor={`ing-${kind}`}>{label} an ingredient</label>
        <input id={`ing-${kind}`} className="dl-field__input" value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" enterKeyHint="done"
          placeholder={kind === 'include' ? 'Add an ingredient' : 'Add one to leave out'} />
        {text ? <button type="submit" className="dl-text-button">Add</button> : null}
      </form>
      {suggestions.length ? (
        <ul className="dl-suggestions" role="list" aria-label={`${label} suggestions`}>
          {suggestions.map((s) => <li key={s}><button type="button" onClick={() => add(s)}>{s}</button></li>)}
        </ul>
      ) : null}
      {values.length ? (
        <div className="dl-chip-group">
          {values.map((v) => (
            <button key={v} type="button" className={`dl-chip dl-chip--removable ${kind === 'exclude' ? 'dl-chip--exclude' : ''}`} aria-label={`Remove ${label.toLowerCase()} ${v}`}
              onClick={() => onChange(values.filter((x) => x !== v))}>
              {kind === 'include' ? <Plus {...iconProps(16)} /> : <Minus {...iconProps(16)} />}
              <span className="dl-chip__label">{v}</span>
              <span className="dl-chip__remove" aria-hidden="true"><X size={12} strokeWidth={2.6} /></span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
