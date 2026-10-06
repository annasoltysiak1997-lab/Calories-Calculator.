import { useEffect, useRef, useState, type FocusEvent, type RefObject } from 'react';

/**
 * Which field the on-screen keypad is editing, if any.
 * The keypad stays open while the person works inside the keypad or any of the `inside` elements
 * (the fields, plus e.g. action buttons). A tap elsewhere closes it only after that tap's click has
 * been handled, so closing (which shortens the page) never moves a button out from under the finger.
 * Keyboard focus moving elsewhere closes it straight away.
 */
export function useKeypadFocus<K extends string>(inside: RefObject<HTMLElement | null>[]) {
  const [active, setActive] = useState<K | null>(null);
  const keypadRef = useRef<HTMLDivElement>(null);
  const pointerDown = useRef(false);
  const isInside = (node: Node | null) =>
    !!node && (!!keypadRef.current?.contains(node) || inside.some((r) => !!r.current?.contains(node)));
  const onBlur = (e: FocusEvent) => {
    if (pointerDown.current) return; // a tap: decided on click below
    const next = e.relatedTarget as Node | null;
    if (next && !isInside(next)) setActive(null);
  };
  useEffect(() => {
    if (active === null) return;
    const down = () => { pointerDown.current = true; };
    const cancel = () => { pointerDown.current = false; }; // e.g. a scroll gesture: keep the keypad
    const click = (e: MouseEvent) => {
      pointerDown.current = false;
      if (!isInside(e.target as Node)) setActive(null);
    };
    document.addEventListener('pointerdown', down, true);
    document.addEventListener('pointercancel', cancel, true);
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('pointerdown', down, true);
      document.removeEventListener('pointercancel', cancel, true);
      document.removeEventListener('click', click);
    };
  });
  return { active, setActive, keypadRef, onBlur };
}
