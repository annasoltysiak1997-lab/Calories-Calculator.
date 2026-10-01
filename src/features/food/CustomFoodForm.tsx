import { useState } from 'react';
import { AmountField } from '../../components/calculator/AmountField';
import { Button } from '../../components/primitives/Button';
import { TextField } from '../../components/primitives/TextField';
import type { Nutrients } from '../../domain/types';

interface Props {
  initialName?: string;
  onSave: (input: { name: string; per100g: Nutrients }) => void;
  onCancel: () => void;
}

/** Enter a food's values per 100 g (from its label). Validates ranges before saving. */
export function CustomFoodForm({ initialName = '', onSave, onCancel }: Props) {
  const [name, setName] = useState(initialName);
  const [v, setV] = useState<Partial<Nutrients>>({});
  const [submitted, setSubmitted] = useState(false);
  const set = (k: keyof Nutrients) => (n: number | undefined) => setV((x) => ({ ...x, [k]: n }));
  const complete = v.kcal !== undefined && v.protein !== undefined && v.carbs !== undefined && v.fat !== undefined;
  const macroSum = (v.protein ?? 0) + (v.carbs ?? 0) + (v.fat ?? 0);
  const errors = [
    !name.trim() && 'Give the food a name.',
    !complete && 'Enter calories, protein, carbs and fat per 100 g.',
    macroSum > 100 && 'Protein, carbs and fat can’t add up to more than 100 g per 100 g.',
  ].filter(Boolean) as string[];

  return (
    <form
      className="dl-card dl-stack dl-custom-food"
      style={{ gap: 'var(--dl-space-4)' }}
      aria-labelledby="custom-food-title"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (errors.length) return;
        onSave({ name: name.trim(), per100g: v as Nutrients });
      }}
    >
      <div>
        <h2 id="custom-food-title" className="dl-card-title">Enter your own food</h2>
        <p className="dl-muted">Copy the values per 100 g from the label.</p>
      </div>
      <TextField label="Food name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Greek yoghurt" autoComplete="off" />
      <div className="dl-form-grid">
        <AmountField size="md" label="Calories" unit="kcal" value={v.kcal} onChange={set('kcal')} max={900} />
        <AmountField size="md" label="Protein" unit="g" value={v.protein} onChange={set('protein')} max={100} />
        <AmountField size="md" label="Carbohydrates" unit="g" value={v.carbs} onChange={set('carbs')} max={100} />
        <AmountField size="md" label="Fat" unit="g" value={v.fat} onChange={set('fat')} max={100} />
      </div>
      {submitted && errors.length ? (
        <ul className="dl-form-errors" role="alert">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
      ) : null}
      <div className="dl-two-buttons">
        <Button type="submit" size="md">Use this food</Button>
        <Button type="button" variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
