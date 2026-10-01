import { Mark } from './Mark';

/** Text wordmark; with `lockup` the mark sits to its left (gap = half the mark height). */
export function Wordmark({ size = 22, lockup = false }: { size?: number; lockup?: boolean }) {
  const text = <span className="dl-wordmark" style={{ fontSize: size, lineHeight: 1.1 }}>Calories Calculator</span>;
  if (!lockup) return text;
  const mark = Math.round(size * 1.6);
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: mark / 2 }}><Mark size={mark} />{text}</span>;
}
