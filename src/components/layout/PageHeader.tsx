import { href } from '../../app/router';

/** Screen title with a small context link on the right, e.g. "Your portion · Lentil soup" (links back). */
export function PageHeader({ title, context }: { title: string; context?: { label: string; to: string; spoken: string } }) {
  return (
    <header className="dl-appbar dl-page-header">
      <div className="dl-appbar__row">
        <h1 className="dl-page-header__title">{title}</h1>
        {context ? <a className="dl-page-header__context" href={href(context.to)} aria-label={context.spoken}>{context.label}</a> : null}
      </div>
    </header>
  );
}
