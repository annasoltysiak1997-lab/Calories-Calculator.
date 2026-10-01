import type { ReactNode } from 'react';
import { href } from '../../app/router';
import { Mark } from '../brand/Mark';

/** Header for calculator screens: the mark links Home, title is the wordmark. */
export function CalcHeader({ trailing }: { trailing?: ReactNode }) {
  return (
    <header className="dl-appbar">
      <div className="dl-appbar__row">
        <a href={href('/')} className="dl-appbar__home" aria-label="Home">
          <Mark size={32} />
          <span className="dl-appbar__title dl-wordmark">Calories Calculator</span>
        </a>
        {trailing ? <div className="dl-appbar__trailing">{trailing}</div> : null}
      </div>
    </header>
  );
}
