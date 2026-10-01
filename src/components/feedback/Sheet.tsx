import { useEffect, useRef, type ReactNode } from 'react';
import { iconProps, X } from '../primitives/Icon';

interface SheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  headerAction?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/** Bottom sheet on mobile, centred dialog on wide screens. Scrolls vertically; Esc closes. */
export function Sheet({ open, title, onClose, headerAction, footer, children }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="dl-sheet" aria-label={title} onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="dl-sheet__panel">
        <div className="dl-sheet__handle" aria-hidden="true" />
        <div className="dl-sheet__header">
          <button type="button" className="dl-icon-button dl-icon-button--subtle" aria-label="Close" onClick={onClose}><X {...iconProps(20)} /></button>
          <h2 className="dl-sheet__title">{title}</h2>
          <div className="dl-sheet__header-action">{headerAction}</div>
        </div>
        <div className="dl-sheet__body">{children}</div>
        {footer ? <div className="dl-sheet__footer">{footer}</div> : null}
      </div>
    </dialog>
  );
}
