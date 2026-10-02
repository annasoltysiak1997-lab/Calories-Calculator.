import type { FocusEvent, Ref } from 'react';
import type { AmountKey } from '../../domain/amountInput';
import { Delete, iconProps } from '../primitives/Icon';
import { SegmentedControl } from '../primitives/SegmentedControl';

interface KeypadProps {
  /** e.g. "Amount of skyr" */
  label: string;
  units: { value: string; label: string }[];
  unit: string;
  onUnitChange: (unit: string) => void;
  onKey: (key: AmountKey) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
  panelRef?: Ref<HTMLDivElement>;
}

const ROWS: AmountKey[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'];

/**
 * On-screen number pad pinned to the bottom while an amount is being entered.
 * Pressing a key keeps focus in the amount field, so the caret stays visible.
 */
export function Keypad({ label, units, unit, onUnitChange, onKey, onBlur, panelRef }: KeypadProps) {
  const keepFocus = (e: { preventDefault: () => void }) => e.preventDefault();
  return (
    <div ref={panelRef} className="dl-keypad" role="group" aria-label={label} onPointerDown={keepFocus} onMouseDown={keepFocus} onBlur={onBlur}>
      <div className="dl-keypad__head">
        <span className="dl-keypad__label" aria-hidden="true">{label}</span>
        {units.length > 1 ? (
          <SegmentedControl size="sm" label="Unit" value={unit} onChange={onUnitChange}
            options={units} />
        ) : null}
      </div>
      <div className="dl-keypad__keys">
        {ROWS.map((k) => (
          <button key={k} type="button" className={`dl-keypad__key ${k === '.' || k === 'back' ? 'dl-keypad__key--plain' : ''}`}
            aria-label={k === 'back' ? 'Delete' : k === '.' ? 'Decimal point' : undefined} onClick={() => onKey(k)}>
            {k === 'back' ? <Delete {...iconProps(24)} /> : k}
          </button>
        ))}
      </div>
    </div>
  );
}
