import type { ReactNode } from 'react';
import { formatGrams, formatKcal } from '../../domain/format';
import type { Nutrients } from '../../domain/types';
import { MacroBar } from './MacroBar';
import { MacroTiles } from './MacroTiles';
import { ResultRow } from './ResultRow';
import { ScopeBadge, type Scope } from './ScopeBadge';

interface NutritionSummaryProps {
  scope?: Scope;
  label: string;
  nutrients: Nutrients;
  approximate?: boolean;
  size?: 'xl' | 'lg' | 'md';
  delta?: string;
  note?: string;
  highlight?: { macro: 'protein' | 'carbs' | 'fat'; note: string };
  bar?: boolean;
  accent?: boolean;
  footer?: ReactNode;
}

/** Result + protein/carbs/fat together. Used for a single food, a whole dish, a serving and my portion. */
export function NutritionSummary({ scope, label, nutrients, approximate, size = 'lg', delta, note, highlight, bar, accent, footer }: NutritionSummaryProps) {
  return (
    <section className={`dl-card dl-nutrition ${accent ? 'dl-card--accent' : ''}`} aria-label={`${label}: ${approximate ? 'approximately ' : ''}${formatKcal(nutrients.kcal)} kilocalories, ${formatGrams(nutrients.protein)} grams protein, ${formatGrams(nutrients.carbs)} grams carbs, ${formatGrams(nutrients.fat)} grams fat`}>
      {scope ? <ScopeBadge scope={scope} /> : null}
      <ResultRow label={label} kcal={nutrients.kcal} approximate={approximate} size={size} delta={delta} note={note} />
      <MacroTiles nutrients={nutrients} highlight={highlight} />
      {bar ? <MacroBar nutrients={nutrients} /> : null}
      {footer}
    </section>
  );
}

/** One-line summary: "P 80 g · C 216 g · F 68 g" with macro dots. */
export function InlineMacros({ nutrients }: { nutrients: Nutrients }) {
  return (
    <span className="dl-inline-macros">
      <span><i className="dl-dot dl-dot--protein" aria-hidden="true" />Protein <b>{formatGrams(nutrients.protein)} g</b></span>
      <span><i className="dl-dot dl-dot--carbs" aria-hidden="true" />Carbs <b>{formatGrams(nutrients.carbs)} g</b></span>
      <span><i className="dl-dot dl-dot--fat" aria-hidden="true" />Fat <b>{formatGrams(nutrients.fat)} g</b></span>
    </span>
  );
}
