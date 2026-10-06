import type { ReactNode } from 'react';
import { href } from '../../app/router';
import { Wordmark } from '../brand/Wordmark';

/** Header for calculator screens: the wordmark links Home. */
export function CalcHeader({ trailing }: { trailing?: ReactNode }) {
  return (
    <header className="dl-appbar">
      <div className="dl-appbar__row">
        <a href={href('/')} className="dl-appbar__home" aria-label="Bitewise home">
          <Wordmark size={24} />
        </a>
        {trailing ? <div className="dl-appbar__trailing">{trailing}</div> : null}
      </div>
    </header>
  );
}
