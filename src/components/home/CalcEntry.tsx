import { useId, useState } from 'react';
import { IconButton } from '../primitives/IconButton';
import { iconProps, ScanBarcode, Search } from '../primitives/Icon';

interface CalcEntryProps {
  label: string;
  placeholder: string;
  onSubmit: (query: string) => void;
  onScan: () => void;
}

/** Entry card: quiet label, search field, dark scan button on the right. */
export function CalcEntry({ label, placeholder, onSubmit, onScan }: CalcEntryProps) {
  const id = useId();
  const [q, setQ] = useState('');
  return (
    <form className="dl-card dl-calc-entry" role="search" onSubmit={(e) => { e.preventDefault(); onSubmit(q.trim()); }}>
      <label htmlFor={id} className="dl-calc-entry__label">{label}</label>
      <div className="dl-calc-entry__row">
        <div className="dl-field__control dl-search__control dl-calc-entry__control">
          <Search {...iconProps(20)} />
          <input id={id} className="dl-field__input" type="search" placeholder={placeholder} value={q}
            onChange={(e) => setQ(e.target.value)} autoComplete="off" enterKeyHint="search" />
        </div>
        <IconButton icon={ScanBarcode} label="Scan barcode" variant="filled" className="dl-calc-entry__action" onClick={onScan} />
      </div>
    </form>
  );
}
