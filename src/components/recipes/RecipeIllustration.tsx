import { backdrops, foods, garnish as garnishColours, vessel as vesselColours } from '../../theme/foodArt';
import type { RecipeArt } from '../../domain/types';

/**
 * Parametric top-down food illustration (stand-in for photography).
 * Backdrop tint, white bowl/plate or dark pan, flat food disc and simple garnish shapes.
 */
export function RecipeIllustration({ art, label, className = '' }: { art: RecipeArt; label?: string; className?: string }) {
  const bg = backdrops[art.backdrop as keyof typeof backdrops] ?? backdrops.sand;
  const food = foods[art.food as keyof typeof foods] ?? foods.paprikaSoup;
  const rim = vesselColours[art.vessel];
  const foodR = art.vessel === 'bowl' ? 27 : 30;
  const gid = `g-${art.backdrop}-${art.food}`;
  return (
    <svg className={`dl-illustration ${className}`} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <radialGradient id={gid} cx="0.32" cy="0.28" r="0.7">
          <stop offset="0" stopColor={vesselColours.highlight} />
          <stop offset="0.6" stopColor={vesselColours.highlight} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={bg} />
      <ellipse cx="53" cy="56" rx="38" ry="38" fill={vesselColours.shadow} />
      {art.vessel === 'pan' ? <rect x="84" y="46" width="20" height="8" rx="3" fill={rim} /> : null}
      <circle cx="50" cy="50" r="38" fill={rim} />
      <circle cx="50" cy="50" r={foodR} fill={food} />
      <g transform={`translate(${50 - foodR} ${50 - foodR}) scale(${(foodR * 2) / 100})`}>
        {art.garnish.map((g, i) => {
          const c = garnishColours[g.color as keyof typeof garnishColours] ?? garnishColours.herb;
          const r = g.r * 1.9;
          if (g.shape === 'ring') return <circle key={i} cx={g.x} cy={g.y} r={r} fill="none" stroke={c} strokeWidth={r / 3.5} />;
          if (g.shape === 'cube') return <rect key={i} x={g.x - r} y={g.y - r} width={r * 2} height={r * 2} rx={r / 3} fill={c} />;
          if (g.shape === 'leaf') return <ellipse key={i} cx={g.x} cy={g.y} rx={r * 1.4} ry={r * 0.7} transform={`rotate(-35 ${g.x} ${g.y})`} fill={c} />;
          return <circle key={i} cx={g.x} cy={g.y} r={r} fill={c} />;
        })}
      </g>
      <circle cx="50" cy="50" r={foodR} fill={`url(#${gid})`} />
    </svg>
  );
}
