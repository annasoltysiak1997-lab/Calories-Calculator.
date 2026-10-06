import { useState, type ReactNode } from 'react';
import { DEMO_FOODS } from '../../data/foods.demo';
import { workingLine } from '../../domain/format';
import { dishTotals, portionByServings } from '../../domain/nutrition';
import { color, elevation, primitives, radius, space } from '../../theme/tokens';
import { textStyles, type TextVariant } from '../../theme/typography';
import { Wordmark } from '../../components/brand/Wordmark';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { ChipGroup, RemovableChip, Tag, ToggleChip } from '../../components/primitives/Chip';
import * as I from '../../components/primitives/Icon';
import { IconButton } from '../../components/primitives/IconButton';
import { SegmentedControl } from '../../components/primitives/SegmentedControl';
import { Text } from '../../components/primitives/Text';
import { TextField } from '../../components/primitives/TextField';
import { MacroBar } from '../../components/nutrition/MacroBar';
import { MacroTiles } from '../../components/nutrition/MacroTiles';
import { ResultRow } from '../../components/nutrition/ResultRow';
import { ScopeBadge } from '../../components/nutrition/ScopeBadge';
import { contrast } from './contrast';

const SOUP = dishTotals([
  { foodId: 'red-lentils-dry', grams: 300 },
  { foodId: 'carrots-raw', grams: 300 },
  { foodId: 'coconut-milk', grams: 240 },
  { foodId: 'olive-oil', grams: 15 },
], DEMO_FOODS);
const PORTION = portionByServings(SOUP.total, 4, 1);

function Section({ id, title, lead, children }: { id: string; title: string; lead: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="ds-section">
      <div className="ds-section__head">
        <Text as="h2" id={id} variant="title-md">{title}</Text>
        <Text as="p" variant="body" tone="secondary">{lead}</Text>
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, hex, on }: { name: string; hex: string; on?: string }) {
  return (
    <div className="ds-swatch">
      <div className="ds-swatch__chip" style={{ background: hex }}>
        {on ? <span style={{ color: on }} className="ds-swatch__aa">Aa {contrast(on, hex)}:1</span> : null}
      </div>
      <Text variant="meta">{name}</Text>
      <Text variant="caption" tone="secondary">{hex}</Text>
    </div>
  );
}

const semantic: [string, string, string?][] = [
  ['bg.canvas', color.bg.canvas, color.text.primary], ['bg.surface', color.bg.surface, color.text.secondary],
  ['bg.subtle', color.bg.subtle, color.text.primary], ['bg.inset', color.bg.inset, color.text.secondary],
  ['text.primary', color.text.primary, color.bg.surface], ['text.secondary', color.text.secondary, color.bg.surface],
  ['text.placeholder', color.text.placeholder, color.bg.surface], ['accent.default', color.accent.default, color.text.onAccent],
  ['accent.pressed', color.accent.pressed, color.text.onAccent], ['accent.subtle', color.accent.subtle, color.accent.default],
  ['danger.surface', color.danger.surface, color.danger.text], ['border.field', color.border.field],
];

export function TokenPreview() {
  const [tab, setTab] = useState<'food' | 'dish' | 'recipes'>('dish');
  const [unit, setUnit] = useState<'g' | 'pot' | 'tbsp'>('g');
  const [diets, setDiets] = useState<string[]>(['Vegan', 'Gluten-free']);
  const toggle = (d: string) => setDiets((x) => (x.includes(d) ? x.filter((y) => y !== d) : [...x, d]));

  return (
    <main className="ds">
      <header className="ds-hero">
        <a href="#/" className="dl-link">‹ Back to the app</a>
        <Wordmark size={28} />
        <Text as="h1" variant="title-xl">Bitewise design system</Text>
        <Text as="p" variant="body" tone="secondary">
          Tokens, type and component foundations for Bitewise. Every value on this page is read from
          <code> src/theme/tokens.ts</code>; nutrition numbers come from <code>src/domain</code> using demo data.
        </Text>
      </header>

      <Section id="brand" title="Brand" lead="The Bitewise wordmark is text only. There is no logo icon.">
        <div className="ds-row">
          <Wordmark size={22} />
        </div>
      </Section>

      <Section id="colour" title="Colour" lead="Components use semantic tokens. Ratios are WCAG contrast of the sample text on each colour.">
        <Text as="h3" variant="title-sm">Semantic</Text>
        <div className="ds-grid">{semantic.map(([n, h, on]) => <Swatch key={n} name={n} hex={h} on={on} />)}</div>
        <Text as="h3" variant="title-sm">Macros · fill, surface, text</Text>
        <div className="ds-grid">
          {(['protein', 'carbs', 'fat'] as const).flatMap((m) => [
            <Swatch key={`${m}f`} name={`${m}.fill`} hex={color.macro[m].fill} />,
            <Swatch key={`${m}s`} name={`${m}.surface`} hex={color.macro[m].surface} on={color.macro[m].text} />,
          ])}
        </div>
        <Text as="h3" variant="title-sm">Neutral primitives</Text>
        <div className="ds-grid ds-grid--tight">
          {Object.entries(primitives.neutral).map(([k, v]) => <Swatch key={k} name={`neutral.${k}`} hex={v} />)}
        </div>
      </Section>

      <Section id="type" title="Typography" lead="Plus Jakarta Sans, 12 styles. Numbers use tabular figures.">
        <div className="ds-type">
          {(Object.keys(textStyles) as TextVariant[]).map((v) => (
            <div key={v} className="ds-type__row">
              <Text variant="caption" tone="secondary">{v} · {textStyles[v].size}/{textStyles[v].lineHeight} · {textStyles[v].weight}</Text>
              <Text variant={v}>{v.startsWith('number') ? '1,773' : v === 'label' ? 'Vegan' : 'Lentil soup with smoked paprika'}</Text>
            </div>
          ))}
        </div>
      </Section>

      <Section id="layout" title="Space, radius, elevation" lead="4 px grid, five radii, two elevation levels.">
        <div className="ds-row ds-row--end">
          {Object.entries(space).map(([k, v]) => (
            <div key={k} className="ds-space"><span style={{ width: v, height: v }} /><Text variant="caption" tone="secondary">{v}</Text></div>
          ))}
        </div>
        <div className="ds-grid">
          {Object.entries(radius).filter(([k]) => k !== 'full').map(([k, v]) => (
            <div key={k} className="ds-radius" style={{ borderRadius: v }}><Text variant="meta">radius.{k}</Text><Text variant="caption" tone="secondary">{v}px</Text></div>
          ))}
          {(['e1', 'e2'] as const).map((e) => (
            <div key={e} className="ds-radius" style={{ boxShadow: elevation[e], border: 0 }}><Text variant="meta">elevation.{e}</Text></div>
          ))}
        </div>
      </Section>

      <Section id="icons" title="Icons" lead="Lucide outline icons at 20 px, 1.9 stroke. Operators are text, not icons.">
        <div className="ds-row ds-icons">
          {[I.Search, I.ScanBarcode, I.SlidersHorizontal, I.ChevronLeft, I.ChevronRight, I.X, I.Pencil, I.Undo2, I.Copy, I.Delete, I.Clock, I.Users, I.Flame, I.CookingPot, I.Soup, I.Scale, I.Info, I.Check, I.Plus, I.Minus, I.Heart]
            .map((Ico, i) => <Ico key={i} {...I.iconProps(24)} />)}
        </div>
      </Section>

      <Section id="buttons" title="Buttons" lead="Default, pressed, focused, disabled and loading. One primary action per area.">
        <div className="ds-grid ds-grid--wide">
          <Button>Add to Lentil soup</Button>
          <Button demoState="pressed">Pressed</Button>
          <Button demoState="focused">Focused</Button>
          <Button disabled>Add to Lentil soup</Button>
          <Button loading>Adding…</Button>
          <Button variant="primary" sub="150 g · 98 kcal">Add 150 g to Lentil soup</Button>
          <Button variant="dark" icon={I.Plus}>Add food</Button>
          <Button variant="secondary">Save as recent</Button>
          <Button variant="secondary" demoState="pressed">Pressed</Button>
          <Button variant="link">See all</Button>
        </div>
        <div className="ds-row">
          <IconButton icon={I.ScanBarcode} label="Scan barcode" variant="filled" />
          <IconButton icon={I.SlidersHorizontal} label="Filters" variant="filled" badge={2} />
          <IconButton icon={I.X} label="Close" />
          <IconButton icon={I.Heart} label="Save recipe" variant="plain" />
          <IconButton icon={I.X} label="Close" disabled />
        </div>
      </Section>

      <Section id="inputs" title="Fields and controls" lead="Search and quantity fields share one base. Errors use icon + text, never colour alone.">
        <div className="ds-stack">
          <TextField label="Search recipes" hideLabel icon={I.Search} placeholder="Recipes, dishes or ingredients" />
          <TextField label="Search food" hideLabel icon={I.Search} defaultValue="Skyr, natural" demoState="focused" />
          <TextField label="Amount (g)" inputMode="decimal" defaultValue="0" error="Enter an amount between 1 and 5,000 g." />
          <TextField label="Cooked weight" placeholder="Not weighed" disabled hint="Weigh the pot to use By weight." />
          <SegmentedControl label="Calculator" value={tab} onChange={setTab}
            options={[{ value: 'food', label: 'Food' }, { value: 'dish', label: 'Dish' }, { value: 'recipes', label: 'Recipes' }]} />
          <SegmentedControl label="Unit" size="sm" value={unit} onChange={setUnit}
            options={[{ value: 'g', label: 'g' }, { value: 'pot', label: 'pot' }, { value: 'tbsp', label: 'tbsp' }]} />
        </div>
      </Section>

      <Section id="chips" title="Chips and tags" lead="Chips wrap onto new lines. Include uses +, exclude uses − and strike-through in neutral ink.">
        <ChipGroup label="Diet">
          {['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free'].map((d) => (
            <ToggleChip key={d} selected={diets.includes(d)} onToggle={() => toggle(d)}>{d}</ToggleChip>
          ))}
        </ChipGroup>
        <ChipGroup label="Active filters">
          <RemovableChip>Vegan</RemovableChip>
          <RemovableChip>≤ 30 min</RemovableChip>
          <RemovableChip kind="include">Lentils</RemovableChip>
          <RemovableChip kind="exclude">Coconut milk</RemovableChip>
        </ChipGroup>
        <div className="ds-row"><Tag>Vegan</Tag><Tag>Gluten-free</Tag><Tag>Dairy-free</Tag></div>
      </Section>

      <Section id="nutrition" title="Nutrition" lead="Lentil soup from the domain module: whole dish, then my portion (¼ of the dish).">
        <Card>
          <div className="ds-stack">
            <ScopeBadge scope="whole-dish" />
            <ResultRow label="Whole dish" kcal={SOUP.total.kcal} delta="+133 kcal" />
            <MacroTiles nutrients={SOUP.total} highlight={{ macro: 'fat', note: 'was 53 g' }} />
            <MacroBar nutrients={SOUP.total} />
          </div>
        </Card>
        <Card tone="accent">
          <div className="ds-stack">
            <ScopeBadge scope="my-portion" />
            <ResultRow label="My portion" kcal={PORTION.nutrients.kcal} approximate={PORTION.approximate} note="¼ of the dish" />
            <MacroTiles nutrients={PORTION.nutrients} />
            <Text variant="caption" tone="secondary">{workingLine(SOUP.total.kcal, 4, 1)}</Text>
          </div>
        </Card>
        <div className="ds-row"><ScopeBadge scope="in-progress" /><ScopeBadge scope="your-copy" /><ScopeBadge scope="original" /></div>
        <Text as="p" variant="caption" tone="secondary">Demo data: calculated from typical per-100 g values, not verified against a label or lab.</Text>
      </Section>
    </main>
  );
}
