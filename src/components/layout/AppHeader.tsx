import type { ReactNode } from 'react';
import { goBack, href } from '../../app/router';
import { ChevronLeft, iconProps } from '../primitives/Icon';
import { SegmentedControl } from '../primitives/SegmentedControl';

interface AppHeaderProps {
  title: string;
  /** Large title for top-level screens (Home). */
  large?: boolean;
  back?: { label: string; fallback: string };
  trailing?: ReactNode;
}

/** NavBar: back + title + trailing action. The title shrinks; it never overlaps the action. */
export function AppHeader({ title, large, back, trailing }: AppHeaderProps) {
  return (
    <header className={`dl-appbar ${large ? 'dl-appbar--large' : ''}`}>
      <div className="dl-appbar__row">
        {back ? (
          <button type="button" className="dl-appbar__back" onClick={() => goBack(back.fallback)}>
            <ChevronLeft {...iconProps(20)} />{back.label}
          </button>
        ) : null}
        {!large && !back ? <h1 className="dl-appbar__title">{title}</h1> : null}
        {trailing ? <div className="dl-appbar__trailing">{trailing}</div> : null}
      </div>
      {large ? <h1 className="dl-appbar__large">{title}</h1> : null}
      {back && title ? <h1 className="dl-appbar__page-title">{title}</h1> : null}
    </header>
  );
}

type Tab = 'food' | 'dish' | 'recipes';

/** Food / Dish / Recipes switch shown inside the calculator (not on Home). */
export function CalculatorTabs({ active }: { active: Tab }) {
  return (
    <nav aria-label="Calculator">
      <SegmentedControl<Tab>
        label="Calculator"
        value={active}
        onChange={(v) => { window.location.hash = href(v === 'food' ? '/food' : v === 'dish' ? '/dish' : '/recipes'); }}
        options={[{ value: 'food', label: 'Food' }, { value: 'dish', label: 'Dish' }, { value: 'recipes', label: 'Recipes' }]}
      />
    </nav>
  );
}
