import { color, elevation, focus, motion, radius, size, space } from './tokens';
import { fontFamily, textStyles } from './typography';

type Tree = { [k: string]: string | number | Tree };

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function flatten(prefix: string, tree: Tree, out: Record<string, string>, unit = '') {
  for (const [k, v] of Object.entries(tree)) {
    const name = `${prefix}-${kebab(String(k))}`;
    if (typeof v === 'object') flatten(name, v, out, unit);
    else out[name] = typeof v === 'number' ? `${v}${unit}` : v;
  }
}

/** All Bitewise tokens as CSS custom properties, e.g. --dl-color-text-primary. */
export function buildCssVars(): Record<string, string> {
  const out: Record<string, string> = {};
  flatten('--dl-color', color as unknown as Tree, out);
  flatten('--dl-space', space as unknown as Tree, out, 'px');
  flatten('--dl-size', size as unknown as Tree, out, 'px');
  flatten('--dl-radius', radius as unknown as Tree, out, 'px');
  flatten('--dl-elevation', elevation as unknown as Tree, out);
  flatten('--dl-motion', motion as unknown as Tree, out);
  out['--dl-focus-width'] = `${focus.width}px`;
  out['--dl-focus-offset'] = `${focus.offset}px`;
  out['--dl-focus-color'] = focus.color;
  out['--dl-font-sans'] = fontFamily.sans;
  for (const [name, s] of Object.entries(textStyles)) {
    out[`--dl-text-${name}-size`] = `${s.size}px`;
    out[`--dl-text-${name}-line`] = `${s.lineHeight}px`;
    out[`--dl-text-${name}-weight`] = String(s.weight);
    out[`--dl-text-${name}-tracking`] = `${s.tracking}em`;
  }
  return out;
}

/** Writes the variables onto :root once, before the first render. */
export function applyTheme(root: HTMLElement = document.documentElement) {
  for (const [k, v] of Object.entries(buildCssVars())) root.style.setProperty(k, v);
}
