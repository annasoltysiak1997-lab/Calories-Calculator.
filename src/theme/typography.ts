/** Bitewise type scale — Plus Jakarta Sans, 12 styles. Sizes and line heights in px. */
export const fontFamily = {
  sans: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

export interface TextStyle {
  size: number;
  lineHeight: number;
  weight: 500 | 600 | 700 | 800;
  /** letter-spacing in em */
  tracking: number;
  numeric?: boolean;
  uppercase?: boolean;
}

export const textStyles = {
  'number-xl': { size: 60, lineHeight: 60, weight: 500, tracking: -0.045, numeric: true },
  'number-lg': { size: 52, lineHeight: 52, weight: 500, tracking: -0.045, numeric: true },
  'number-md': { size: 40, lineHeight: 40, weight: 500, tracking: -0.04, numeric: true },
  'title-xl': { size: 34, lineHeight: 38, weight: 500, tracking: -0.035 },
  'title-lg': { size: 26, lineHeight: 30, weight: 500, tracking: -0.03 },
  'title-md': { size: 22, lineHeight: 28, weight: 500, tracking: -0.025 },
  'title-sm': { size: 17, lineHeight: 22, weight: 500, tracking: -0.01 },
  body: { size: 16, lineHeight: 23, weight: 500, tracking: 0 },
  'body-strong': { size: 16, lineHeight: 23, weight: 500, tracking: 0 },
  meta: { size: 14, lineHeight: 20, weight: 500, tracking: 0 },
  caption: { size: 13, lineHeight: 18, weight: 500, tracking: 0 },
  label: { size: 12, lineHeight: 16, weight: 500, tracking: 0.02 },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textStyles;
