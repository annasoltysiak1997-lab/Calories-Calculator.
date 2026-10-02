/** Keypad editing of an amount, kept as text so "1." and "0.5" survive while typing. */
export type AmountKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.' | 'back';

interface KeyOptions {
  /** Largest allowed value; keys that would exceed it are ignored. */
  max: number;
  /** Digits allowed after the decimal point. */
  decimals: number;
  /** Start over instead of appending, e.g. after a quick amount was chosen. */
  replace?: boolean;
}

export function applyAmountKey(text: string, key: AmountKey, { max, decimals, replace = false }: KeyOptions): string {
  if (key === 'back') return replace ? '' : text.slice(0, -1);
  const base = replace ? '' : text;
  if (key === '.') {
    if (decimals === 0 || base.includes('.')) return base;
    return base === '' ? '0.' : `${base}.`;
  }
  const [, frac] = base.split('.');
  if (frac !== undefined && frac.length >= decimals) return base;
  const next = base === '0' ? key : base + key;
  return Number(next) > max ? base : next;
}
