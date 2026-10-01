import { useEffect, type ReactNode } from 'react';
import { actions, useAppState } from '../../state/store';
import { iconProps, Info, X } from '../primitives/Icon';

/** Info (neutral) or accent banner. */
export function Banner({ tone = 'info', icon, title, children, action }: { tone?: 'info' | 'accent'; icon?: ReactNode; title?: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className={`dl-banner dl-banner--${tone}`}>
      <span className="dl-banner__icon">{icon ?? <Info {...iconProps(20)} />}</span>
      <div className="dl-banner__body">
        {title ? <p className="dl-banner__title">{title}</p> : null}
        {children ? <div className="dl-banner__text">{children}</div> : null}
        {action}
      </div>
    </div>
  );
}

/** Demo-data note shown wherever nutrition appears. */
export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <p className="dl-demo-note">
      <Info {...iconProps(16)} />
      <span>{children ?? 'Demo data: typical per-100 g values, not verified against a label or lab.'}</span>
    </p>
  );
}

export function EmptyState({ title, children, actions: act }: { title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="dl-empty">
      <span className="dl-empty__plate" aria-hidden="true"><span /></span>
      <h2 className="dl-empty__title">{title}</h2>
      {children ? <div className="dl-empty__text">{children}</div> : null}
      {act ? <div className="dl-empty__actions">{act}</div> : null}
    </div>
  );
}

/** Confirmation with optional Undo; announced politely, dismisses after 5 s. */
export function Toast() {
  const toast = useAppState((s) => s.toast);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => actions.dismissToast(), 5000);
    return () => window.clearTimeout(t);
  }, [toast]);
  return (
    <div className="dl-toast-region" role="status" aria-live="polite">
      {toast ? (
        <div className="dl-toast" key={toast.id}>
          <span className="dl-toast__msg">{toast.message}</span>
          {toast.undo ? <button type="button" className="dl-toast__action" onClick={() => { toast.undo!(); actions.dismissToast(); }}>Undo</button> : null}
          <button type="button" className="dl-toast__close" aria-label="Dismiss" onClick={() => actions.dismissToast()}><X {...iconProps(16)} /></button>
        </div>
      ) : null}
    </div>
  );
}
