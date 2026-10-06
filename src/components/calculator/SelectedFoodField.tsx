import { iconProps, Search, X } from '../primitives/Icon';

interface SelectedFoodFieldProps {
  name: string;
  /** Secondary line, e.g. "Demo values". */
  meta: string;
  /** Back to the food search. */
  onChange: () => void;
}

/** The search field once a food is chosen: shows the food, tap to change it, × to clear. */
export function SelectedFoodField({ name, meta, onChange }: SelectedFoodFieldProps) {
  return (
    <div className="dl-field__control dl-search__control dl-selected-food">
      <Search {...iconProps(20)} />
      <button type="button" className="dl-selected-food__main" onClick={onChange} aria-label={`${name}, ${meta}. Change food`}>
        <span className="dl-selected-food__name">{name}</span>
        <span className="dl-selected-food__meta">{meta}</span>
      </button>
      <button type="button" className="dl-clear" aria-label="Clear food" onClick={onChange}><X size={14} strokeWidth={2.6} /></button>
    </div>
  );
}
