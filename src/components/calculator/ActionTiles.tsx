export interface ActionTile {
  title: string;
  sub: string;
  /** "dark" = main action, "accent" = the highlighted next step. */
  tone?: 'default' | 'dark' | 'accent';
  onClick: () => void;
}

/** Two-column grid of large actions with a subtitle, e.g. "Add food · search or scan". */
export function ActionTiles({ label, tiles }: { label: string; tiles: ActionTile[] }) {
  return (
    <div className="dl-action-tiles" role="group" aria-label={label}>
      {tiles.map((t) => (
        <button key={t.title} type="button" className={`dl-action-tile dl-action-tile--${t.tone ?? 'default'}`} onClick={t.onClick}>
          <span className="dl-action-tile__title">{t.title}</span>
          <span className="dl-action-tile__sub">{t.sub}</span>
        </button>
      ))}
    </div>
  );
}
