import { ChevronRight, iconProps, Plus } from '../primitives/Icon';
import { formatKcal, spokenKcal } from '../../domain/format';

interface ContinueCardProps {
  name: string;
  ingredients: number;
  kcal: number;
  href: string;
}

/** "Continue · Lentil soup / 3 ingredients = 1,640 kcal". The whole card is one link. */
export function ContinueCard({ name, ingredients, kcal, href }: ContinueCardProps) {
  const count = `${ingredients} ${ingredients === 1 ? 'ingredient' : 'ingredients'}`;
  return (
    <a className="dl-card dl-continue" href={href} aria-label={`Continue ${name}: ${count}, ${spokenKcal(kcal, false)}`}>
      <span className="dl-continue__icon" aria-hidden="true"><Plus {...iconProps(20)} /></span>
      <span className="dl-continue__text">
        <span className="dl-continue__title">Continue · {name}</span>
        <span className="dl-continue__sum">{count} = {formatKcal(kcal)} kcal</span>
      </span>
      <ChevronRight {...iconProps(20)} />
    </a>
  );
}
