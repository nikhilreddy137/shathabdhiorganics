import React from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '../ui/drawer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Check } from 'lucide-react';

export const FilterSheet = ({ open, onClose, facets, selected, onToggle, onClearAll, resultCount }) => (
  <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
    <DrawerContent className="rounded-t-none border-t border-stone-200 h-[88vh]" data-testid="filter-sheet">
      <div className="mx-auto w-full max-w-md flex flex-col h-full min-h-0">
        <div className="px-5 pt-5 pb-3 border-b border-stone-100">
          <DrawerTitle className="font-display font-normal text-h3 text-stone-900">Filters</DrawerTitle>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <Accordion type="multiple" defaultValue={facets.slice(0, 2).map((f) => f.key)}>
            {facets.map((facet) => (
              <AccordionItem key={facet.key} value={facet.key}>
                <AccordionTrigger className="text-eyebrow uppercase text-stone-700 hover:no-underline py-4">
                  <span>
                    {facet.label}
                    {selected[facet.key]?.length > 0 && (
                      <span className="ml-2 text-amber-700 normal-case tracking-normal">({selected[facet.key].length})</span>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <div className="space-y-1">
                    {facet.options.map((opt) => {
                      const active = selected[facet.key]?.includes(opt.value);
                      const disabled = opt.count === 0 && !active;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={disabled}
                          onClick={() => onToggle(facet.key, opt.value)}
                          data-testid={`filter-option-${facet.key}-${opt.value.replace(/[^a-zA-Z0-9]+/g, '-')}`}
                          className={`w-full min-h-[44px] flex items-center gap-3 px-2 py-2.5 text-sm text-left transition-colors
                            ${disabled ? 'text-stone-300 cursor-not-allowed' : active ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'}`}
                        >
                          <span className={`w-[18px] h-[18px] border flex items-center justify-center flex-shrink-0 transition-colors
                            ${active ? 'bg-stone-900 border-stone-900' : disabled ? 'border-stone-200' : 'border-stone-400'}`}>
                            {active && <Check className="w-3 h-3 text-amber-300" />}
                          </span>
                          <span className="flex-1">{opt.value}</span>
                          <span className="text-xs text-stone-400 price">{opt.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-stone-100 bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={onClearAll}
            data-testid="filter-clear-all-btn"
            className="min-h-[48px] px-4 text-xs font-medium uppercase tracking-[0.06em] text-stone-600 hover:text-stone-900 transition-colors"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            data-testid="filter-show-results-btn"
            className="flex-1 min-h-[48px] bg-stone-900 text-white hover:bg-amber-400 hover:text-stone-900 text-xs font-medium uppercase tracking-[0.06em] transition-all price"
          >
            Show {resultCount} result{resultCount === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
);
