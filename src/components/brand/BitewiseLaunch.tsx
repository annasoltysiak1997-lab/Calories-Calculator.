import { useEffect, useId, useRef, useState } from 'react';

/*
 * Bitewise launch animation, recreated from the Figma animation plugin (frame 390 × 844).
 * The keyframe timing lives in app.css (.dl-launch*); every step starts after the previous
 * one ends plus its delay:
 *   02 Ring   0.30–1.00 s   03 Bite   1.05–1.35 s   04 Settle 1.36–1.56 s
 *   05 Name   1.61–2.06 s   06 Dot 1  2.21–2.51 s   07 Dot 2  2.56–2.86 s   08 Dot 3 2.91–3.21 s
 * after which the dots keep looping until the splash fades into the app.
 */
const EXIT_AT_MS = 3550; // Dot 3 has settled and the loop has started again on dot 1.
const EXIT_MS = 400;
const STATIC_MS = 900; // Reduced motion: a short still splash, no animation.

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

/*
 * The Bitewise mark (plugin geometry, 160 px box): a white ring, outer radius 56.875 and inner
 * radius 33, with the three bite circles cut out of its right side. The bites open it into a C
 * with two rounded bitten ends and thin tapering points between them, as in the brand logo.
 */
export const MARK = {
  centre: 80,
  outerR: 56.875,
  innerR: 33,
  bites: [
    { cx: 125, cy: 48.75, r: 20 },
    { cx: 137.5, cy: 80, r: 24.5 },
    { cx: 125, cy: 111.25, r: 20 },
  ],
} as const;

export function BitewiseMark({ size = 160 }: { size?: number }) {
  const mask = `dl-bite-${useId().replace(/:/g, '')}`;
  const { centre, outerR, innerR, bites } = MARK;
  return (
    <svg className="dl-launch__mark" width={size} height={size} viewBox="0 0 160 160" aria-hidden="true">
      <defs>
        <mask id={mask} maskUnits="userSpaceOnUse" x="-20" y="-20" width="200" height="200">
          <rect x="-20" y="-20" width="200" height="200" fill="white" />
          {bites.map((b) => <circle key={b.cy} className="dl-launch__bite" cx={b.cx} cy={b.cy} r={b.r} fill="black" />)}
        </mask>
      </defs>
      <g className="dl-launch__logo">
        <g mask={`url(#${mask})`}>
          <circle className="dl-launch__ring" cx={centre} cy={centre} r={(outerR + innerR) / 2} strokeWidth={outerR - innerR} />
        </g>
      </g>
    </svg>
  );
}

/**
 * Full-screen startup splash. Shown once per page load on top of the already-rendered
 * screen, then fades away to reveal it. Any key or tap skips it; it never takes focus.
 */
export function BitewiseLaunch({ onDone }: { onDone: () => void }) {
  const [reduced] = useState(prefersReducedMotion);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;

  // Hand over to the app: fade out, or switch straight away with reduced motion.
  useEffect(() => {
    if (leaving) {
      const t = window.setTimeout(() => done.current(), EXIT_MS);
      return () => window.clearTimeout(t);
    }
    const finish = () => (reduced ? done.current() : setLeaving(true));
    const t = window.setTimeout(finish, reduced ? STATIC_MS : EXIT_AT_MS);
    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
    };
  }, [leaving, reduced]);

  // Match the browser chrome to the splash while it is on screen.
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;
    const before = meta.content;
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--dl-color-accent-default').trim();
    if (accent) meta.content = accent;
    return () => { meta.content = before; };
  }, []);

  return (
    <div className={`dl-launch${leaving ? ' dl-launch--leaving' : ''}`} aria-hidden="true">
      <div className="dl-launch__stack">
        <BitewiseMark />
        <span className="dl-launch__name">Bitewise</span>
        <span className="dl-launch__dots"><i /><i /><i /></span>
      </div>
    </div>
  );
}
