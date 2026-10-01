import type { ReactNode } from 'react';

/** Single-column page, 560 px max, vertical scrolling only. `bottomBar` stays pinned. */
export function Screen({ children, bottomBar }: { children: ReactNode; bottomBar?: ReactNode }) {
  return (
    <>
      <main className={`dl-page ${bottomBar ? 'dl-page--with-bar' : ''}`}>{children}</main>
      {bottomBar ? <div className="dl-bottom-bar"><div className="dl-bottom-bar__inner">{bottomBar}</div></div> : null}
    </>
  );
}

export function Stack({ gap = 4, children, className = '' }: { gap?: 2 | 3 | 4 | 5 | 6 | 8; children: ReactNode; className?: string }) {
  return <div className={`dl-stack ${className}`} style={{ gap: `var(--dl-space-${gap})` }}>{children}</div>;
}

export function SectionHeading({ title, action, sub }: { title: string; action?: ReactNode; sub?: string }) {
  return (
    <div className="dl-section-heading">
      <div>
        <h2 className="dl-section-heading__title">{title}</h2>
        {sub ? <p className="dl-section-heading__sub">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}
