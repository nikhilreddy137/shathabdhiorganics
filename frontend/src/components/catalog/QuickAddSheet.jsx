import React, { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTitle } from '../ui/drawer';
import { Img } from '../Img';

export const QuickAddSheet = ({ product, initialVariant, open, onClose, onAdd }) => {
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (open && product) {
      setVariant(initialVariant || product.sizes?.[0] || null);
      setQty(1);
    }
  }, [open, product, initialVariant]);

  if (!product) return null;

  const handleAdd = async () => {
    if (!variant) return;
    setAdding(true);
    try {
      await onAdd(product, variant, qty);
      onClose();
    } finally {
      setAdding(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="rounded-t-none border-t border-stone-200" data-testid="quick-add-sheet">
        <div className="mx-auto w-full max-w-md flex flex-col max-h-[82vh]">
          <div className="flex items-start gap-4 px-5 pt-5 pb-4 border-b border-stone-100">
            <Img src={product.image} alt={product.name} ratio="1/1" sizes="80px" className="w-20 flex-shrink-0" />
            <div className="min-w-0">
              <DrawerTitle className="font-display font-normal text-h3 text-stone-900 leading-snug">
                {product.name}
              </DrawerTitle>
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{product.description}</p>
            </div>
          </div>

          <div className="px-5 py-4 overflow-y-auto">
            <p className="text-eyebrow uppercase text-stone-500 mb-2.5">Choose size</p>
            <div className="space-y-2" data-testid="quick-add-variant-list">
              {(product.sizes || []).map((s) => {
                const active = variant?.size === s.size;
                return (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => setVariant(s)}
                    data-testid={`quick-add-variant-${s.size.replace(/[^a-zA-Z0-9]+/g, '-')}`}
                    className={`w-full flex items-center justify-between px-4 py-3.5 border text-sm transition-all
                      ${active ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-800 hover:border-stone-400'}`}
                  >
                    <span>{s.size === 'Default Title' ? 'Standard pack' : s.size}</span>
                    <span className={`price ${active ? 'text-amber-300' : 'text-stone-500'}`}>₹{Math.round(s.price)}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-eyebrow uppercase text-stone-500 mt-5 mb-2.5">Quantity</p>
            <div className="inline-flex items-center border border-stone-300">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-stone-50" aria-label="Decrease quantity" data-testid="quick-add-qty-decrease">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center price" data-testid="quick-add-qty">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} className="w-11 h-11 flex items-center justify-center hover:bg-stone-50" aria-label="Increase quantity" data-testid="quick-add-qty-increase">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-stone-100 bg-white">
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || !variant}
              data-testid="quick-add-confirm-btn"
              className="w-full h-13 py-4 bg-stone-900 text-white hover:bg-amber-400 hover:text-stone-900 text-xs font-medium uppercase tracking-[0.06em] transition-all disabled:opacity-60 price"
            >
              {adding ? 'Adding…' : `Add to cart · ₹${Math.round((variant?.price || 0) * qty)}`}
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
