import type { LucideIcon, LucideProps } from 'lucide-react';
export {
  Search, ScanBarcode, SlidersHorizontal, ChevronLeft, ChevronRight, X, Pencil, Undo2, Copy, Delete,
  Clock, Users, Flame, CookingPot, Soup, Scale, Info, Check, Plus, Minus, Heart,
} from 'lucide-react';

export type IconComponent = LucideIcon;

/** Bitewise icon defaults: 20 px, 1.9 stroke, currentColor. */
export function iconProps(size: 16 | 20 | 24 = 20): LucideProps {
  return { size, strokeWidth: 1.9, 'aria-hidden': true, focusable: false };
}
