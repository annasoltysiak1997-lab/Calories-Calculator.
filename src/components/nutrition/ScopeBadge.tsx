import { CookingPot, Copy, Info, iconProps, Soup } from '../primitives/Icon';

export type Scope = 'whole-dish' | 'my-portion' | 'in-progress' | 'your-copy' | 'original';
const CONFIG: Record<Scope, { label: string; accent: boolean; icon: typeof Soup }> = {
  'whole-dish': { label: 'Whole dish', accent: false, icon: CookingPot },
  'my-portion': { label: 'My portion', accent: true, icon: Soup },
  'in-progress': { label: 'In progress', accent: true, icon: CookingPot },
  'your-copy': { label: 'Your copy', accent: true, icon: Copy },
  original: { label: 'Original · read-only', accent: false, icon: Info },
};

/** Tells people which level of nutrition they are looking at. */
export function ScopeBadge({ scope }: { scope: Scope }) {
  const { label, accent, icon: Icon } = CONFIG[scope];
  return <span className={`dl-scope ${accent ? 'dl-scope--accent' : ''}`}><Icon {...iconProps(16)} />{label}</span>;
}
