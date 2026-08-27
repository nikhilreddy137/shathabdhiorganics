import React from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '../ui/drawer';

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price, low to high' },
  { value: 'price-high', label: 'Price, high to low' },
  { value: 'name-az', label: 'Alphabetically, A–Z' },
  { value: 'name-za', label: 'Alphabetically, Z–A' },
];

export const sortLabel = (value) => SORT_OPTIONS.find((o) => o.value === value)?.label || 'Featured';

export const SortSheet = ({ open, onClose, value, onChange }) => (
  <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
    <DrawerContent className="rounded-t-none border-t border-stone-200" data-testid="sort-sheet">
      <div className="mx-auto w-full max-w-md pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="px-5 pt-5 pb-3 border-b border-stone-100">
          <DrawerTitle className="font-display font-normal text-h3 text-stone-900">Sort by</DrawerTitle>
        </div>
        <div className="px-5 py-3">
          {SORT_OPTIONS.map((opt) => {
            const active = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); onClose(); }}
                data-testid={`sort-option-${opt.value}`}
                className={`w-full min-h-[48px] flex items-center gap-3 px-2 text-sm text-left transition-colors
                  ${active ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'}`}
              >
                <span className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-shrink-0
                  ${active ? 'border-stone-900' : 'border-stone-400'}`}>
                  {active && <span className="w-2.5 h-2.5 rounded-full bg-stone-900"></span>}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </DrawerContent>
  </Drawer>
);
