import { href } from '../../app/router';
import { DIET_LABELS, effectiveDiets } from '../../domain/filters';
import { formatKcal } from '../../domain/format';
import type { Recipe } from '../../domain/types';
import { Tag } from '../primitives/Chip';
import { Clock, iconProps } from '../primitives/Icon';
import { RecipeIllustration } from './RecipeIllustration';

/** time · ≈ kcal per serving, then diet tags. Always in this order. */
export function RecipeMeta({ recipe, kcal, tags = true, onPhoto = false }: { recipe: Recipe; kcal: number; tags?: boolean; onPhoto?: boolean }) {
  const diets = [...effectiveDiets(recipe)].filter((d) => !(d === 'vegetarian' && recipe.diets.includes('vegan')));
  return (
    <span className={`dl-recipe-meta ${onPhoto ? 'dl-recipe-meta--on-photo' : ''}`}>
      <span className="dl-recipe-meta__line">
        <span className="dl-recipe-meta__time"><Clock {...iconProps(16)} />{recipe.minutes} min</span>
        <span aria-hidden="true" className="dl-recipe-meta__dot">·</span>
        <span>≈ {formatKcal(kcal)} kcal per serving</span>
      </span>
      {tags && diets.length ? <span className="dl-recipe-meta__tags">{diets.map((d) => <Tag key={d}>{DIET_LABELS[d]}</Tag>)}</span> : null}
    </span>
  );
}

/** Recipe entry point: hero (text on scrim) or standard (illustration above text). Whole card is one link. */
export function RecipeCard({ recipe, kcal, variant = 'standard', eyebrow }: { recipe: Recipe; kcal: number; variant?: 'hero' | 'standard' | 'row'; eyebrow?: string }) {
  const to = href(`/recipes/${recipe.id}`);
  if (variant === 'hero') {
    return (
      <a href={to} className="dl-recipe-card dl-recipe-card--hero">
        <RecipeIllustration art={recipe.art} className="dl-recipe-card__art" />
        <span className="dl-recipe-card__scrim" aria-hidden="true" />
        <span className="dl-recipe-card__overlay">
          {eyebrow ? <span className="dl-recipe-card__eyebrow">{eyebrow}</span> : null}
          <span className="dl-recipe-card__title dl-recipe-card__title--lg">{recipe.name}</span>
          <RecipeMeta recipe={recipe} kcal={kcal} onPhoto />
        </span>
      </a>
    );
  }
  if (variant === 'row') {
    return (
      <a href={to} className="dl-recipe-card dl-recipe-card--row">
        <RecipeIllustration art={recipe.art} className="dl-recipe-card__thumb" />
        <span className="dl-recipe-card__text">
          <span className="dl-recipe-card__title">{recipe.name}</span>
          <RecipeMeta recipe={recipe} kcal={kcal} tags={false} />
        </span>
      </a>
    );
  }
  return (
    <a href={to} className="dl-recipe-card">
      <RecipeIllustration art={recipe.art} className="dl-recipe-card__art dl-recipe-card__art--standard" />
      <span className="dl-recipe-card__text">
        <span className="dl-recipe-card__title">{recipe.name}</span>
        <RecipeMeta recipe={recipe} kcal={kcal} />
      </span>
    </a>
  );
}
