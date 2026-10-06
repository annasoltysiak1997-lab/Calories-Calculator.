import { assetUrl } from '../../app/assets';
import type { Recipe } from '../../domain/types';
import { RecipeIllustration } from './RecipeIllustration';

/** The recipe's photo, cropped to fill its box; recipes without a photo keep their illustration. */
export function RecipeImage({ recipe, className = '', label, eager }: { recipe: Recipe; className?: string; label?: string; eager?: boolean }) {
  if (!recipe.photo) return <RecipeIllustration art={recipe.art} className={className} label={label} />;
  return <Photo src={recipe.photo} className={className} label={label} eager={eager} />;
}

/** A photo from public/ filling its box (object-fit: cover). Decorative unless a label is given. */
export function Photo({ src, className = '', label, eager }: { src: string; className?: string; label?: string; eager?: boolean }) {
  return (
    <img className={`dl-photo ${className}`} src={assetUrl(src)} alt={label ?? ''} aria-hidden={label ? undefined : true}
      loading={eager ? 'eager' : 'lazy'} decoding="async" />
  );
}
