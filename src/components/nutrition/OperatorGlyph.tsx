export type Operator = '×' | '÷' | '+' | '=' | '';
const spoken: Record<Exclude<Operator, ''>, string> = { '×': 'times', '÷': 'divided by', '+': 'plus', '=': 'equals' };

/** × ÷ + = in a fixed 16 px column so rows line up. */
export function OperatorGlyph({ op }: { op: Operator }) {
  if (!op) return <span className="dl-operator" aria-hidden="true" />;
  return <span className="dl-operator"><span aria-hidden="true">{op}</span><span className="dl-visually-hidden">{spoken[op]}</span></span>;
}
