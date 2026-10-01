import { useMemo, useState } from 'react';
import { href, navigate } from '../../app/router';
import { DemoNote, EmptyState } from '../../components/feedback/Feedback';
import { Sheet } from '../../components/feedback/Sheet';
import { AppHeader } from '../../components/layout/AppHeader';
import { Screen } from '../../components/layout/Screen';
import { NutritionSummary } from '../../components/nutrition/NutritionSummary';
import { Button } from '../../components/primitives/Button';
import { Tag } from '../../components/primitives/Chip';
import { Clock, Copy, Flame, iconProps, Users } from '../../components/primitives/Icon';
import { RecipeIllustration } from '../../components/recipes/RecipeIllustration';
import { DEMO_FOODS } from '../../data/foods.demo';
import { DEMO_RECIPES } from '../../data/recipes.demo';
import { DIET_LABELS, effectiveDiets } from '../../domain/filters';
import { formatGrams, formatKcal } from '../../domain/format';
import { recipeNutrition } from '../../domain/nutrition';
import type { Food } from '../../domain/types';
import { actions, useAppState } from '../../state/store';

export function RecipeDetailScreen({ id }: { id: string }) {
  const custom = useAppState((s) => s.customFoods);
  const dish = useAppState((s) => s.dish);
  const foods = useMemo<Record<string, Food>>(() => ({ ...DEMO_FOODS, ...custom }), [custom]);
  const [confirm, setConfirm] = useState(false);
  const recipe = DEMO_RECIPES.find((r) => r.id === id);

  if (!recipe) {
    return (
      <Screen>
        <AppHeader title="Recipe" back={{ label: 'Recipes', fallback: '/recipes' }} />
        <EmptyState title="Recipe not found" actions={<a className="dl-button dl-button--secondary" href={href('/recipes')}>Browse recipes</a>} />
      </Screen>
    );
  }

  const n = recipeNutrition(recipe, foods);
  const diets = [...effectiveDiets(recipe)].filter((d) => !(d === 'vegetarian' && recipe.diets.includes('vegan')));
  const makeCopy = () => {
    actions.copyRecipe(recipe);
    navigate('/dish');
  };
  const onCopy = () => (dish && dish.lines.length ? setConfirm(true) : makeCopy());

  return (
    <Screen bottomBar={
      <div className="dl-bar-stack">
        <Button fullWidth icon={Copy} onClick={onCopy}>Make an editable copy</Button>
        <span className="dl-caption dl-center">Opens your copy in Dish. This recipe stays read-only.</span>
      </div>
    }>
      <AppHeader title="" back={{ label: 'Recipes', fallback: '/recipes' }} />
      <RecipeIllustration art={recipe.art} className="dl-detail-hero" label={`Illustration of ${recipe.name}`} />
      <header className="dl-stack" style={{ gap: 'var(--dl-space-2)' }}>
        <h1 className="dl-detail-title">{recipe.name}</h1>
        <p className="dl-detail-lead">{recipe.description}</p>
      </header>
      <div className="dl-facts">
        <div className="dl-fact"><Clock {...iconProps(20)} /><b>{recipe.minutes} min</b><span>total time</span></div>
        <div className="dl-fact"><Users {...iconProps(20)} /><b>Serves {recipe.servings}</b><span>equal portions</span></div>
        <div className="dl-fact"><Flame {...iconProps(20)} /><b>≈ {formatKcal(n.perServing.kcal)}</b><span>kcal per serving</span></div>
      </div>
      <div className="dl-chip-group">{diets.map((d) => <Tag key={d}>{DIET_LABELS[d]}</Tag>)}</div>

      <section className="dl-stack" aria-labelledby="ing-title" style={{ gap: 'var(--dl-space-2)' }}>
        <div className="dl-section-heading">
          <h2 id="ing-title" className="dl-section-heading__title">Ingredients</h2>
          <span className="dl-muted">{recipe.servings} servings · {formatKcal(n.total.kcal)} kcal total</span>
        </div>
        <ul className="dl-card dl-card--flush dl-list" role="list">
          {n.lines.map((l) => (
            <li key={l.foodId} className="dl-list-row dl-list-row--static">
              <span className="dl-list-row__main"><b>{l.food.name}</b><span>{formatGrams(l.grams)} g</span></span>
              <span className="dl-list-row__value">{formatKcal(l.nutrients.kcal)} kcal</span>
            </li>
          ))}
          {recipe.extras.map((e) => (
            <li key={e} className="dl-list-row dl-list-row--static dl-list-row--muted">
              <span className="dl-list-row__main"><b>{e}</b><span>not counted</span></span>
            </li>
          ))}
        </ul>
        <p className="dl-caption">Seasonings and water add under 5 kcal per serving and aren’t counted.</p>
      </section>

      <section className="dl-stack" aria-labelledby="method-title" style={{ gap: 'var(--dl-space-3)' }}>
        <h2 id="method-title" className="dl-section-heading__title">Method</h2>
        <ol className="dl-steps">{recipe.steps.map((s, i) => <li key={i}><span className="dl-steps__n" aria-hidden="true">{i + 1}</span><span>{s}</span></li>)}</ol>
      </section>

      <NutritionSummary label="Per serving" nutrients={n.perServing} approximate size="md"
        note={`${formatKcal(n.total.kcal)} kcal ÷ ${recipe.servings}`} />
      <DemoNote>Demo data: calculated from typical per-100 g values, not verified against a label or lab.</DemoNote>

      <Sheet open={confirm} title="Replace your current dish?" onClose={() => setConfirm(false)}
        footer={<div className="dl-bar-stack">
          <Button fullWidth onClick={() => { setConfirm(false); makeCopy(); }}>Replace with a copy of this recipe</Button>
          <Button fullWidth variant="secondary" onClick={() => setConfirm(false)}>Keep “{dish?.name}”</Button>
        </div>}>
        <p className="dl-muted">You have “{dish?.name}” in progress with {dish?.lines.length} ingredients. Making a copy replaces it; you can undo this from the next screen.</p>
      </Sheet>
    </Screen>
  );
}
