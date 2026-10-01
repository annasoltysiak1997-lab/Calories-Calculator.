import type { ReactNode } from 'react';
import { Wordmark } from '../brand/Wordmark';

/** Home top bar: wordmark on the left, one text action on the right. */
export function HomeHeader({ trailing }: { trailing?: ReactNode }) {
  return (
    <header className="dl-appbar dl-home-header">
      <div className="dl-appbar__row">
        <h1 className="dl-home-brand"><Wordmark size={24} /></h1>
        {trailing ? <div className="dl-appbar__trailing">{trailing}</div> : null}
      </div>
    </header>
  );
}
