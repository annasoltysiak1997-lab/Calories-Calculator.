/** The equals mark: the moment a calculation becomes an answer. Primary app icon. */
export function Mark({ size = 40, title }: { size?: number; title?: string }) {
  return (
    <svg className="dl-mark" width={size} height={size} viewBox="0 0 64 64" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <rect width="64" height="64" rx="14.4" style={{ fill: 'var(--dl-color-accent-default)' }} />
      <rect x="17" y="22" width="30" height="7" rx="3.5" style={{ fill: 'var(--dl-color-text-on-accent)' }} />
      <rect x="17" y="35" width="30" height="7" rx="3.5" style={{ fill: 'var(--dl-color-text-on-accent)' }} />
    </svg>
  );
}
