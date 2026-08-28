import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus } from 'lucide-react';
import { Img } from '../Img';
import { getProfile } from '../../lib/profiles';

const GRID_SIZES = '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw';

export const ProductCard = ({ product, onQuickAdd, onAddSingle }) => {
  const [added, setAdded] = useState(false);
  const { descriptor, triple } = getProfile(product);
  const realVariants = (product.sizes || []).filter((s) => s.size !== 'Default Title');
  const isMulti = realVariants.length > 1;

  const handleQuickAdd = async () => {
    if (isMulti) {
      onQuickAdd(product);
      return;
    }
    await onAddSingle(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group bg-white rounded-2xl p-3 border border-transparent hover:border-cream2 hover:shadow-[0_20px_40px_-15px_rgba(62,42,30,0.14)] transition-shadow duration-300 flex flex-col" data-testid={`product-card-${product.id}`}>
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block" data-testid={`product-image-${product.id}`}>
          <Img
            src={product.image}
            alt={`${product.name} — ${descriptor.toLowerCase()} from Shathabdhi Organics`}
            ratio="1/1"
            sizes={GRID_SIZES}
            className="rounded-xl"
            imgClassName="group-hover:scale-[1.04] transition-transform duration-700"
          />
        </Link>
        {product.badge && (
          <span className="absolute top-3 left-3 text-eyebrow uppercase bg-cream/95 text-charcoal px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          onClick={handleQuickAdd}
          data-testid={`add-to-cart-${product.id}`}
          aria-label={`Quick add ${product.name}`}
          className={`absolute bottom-3 right-3 h-11 min-w-[44px] px-4 inline-flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.06em] rounded-full transition-colors duration-300 shadow-md active:scale-95
            ${added ? 'bg-leaf text-cream' : 'bg-jaggery text-white hover:bg-[#94461E]'}`}
        >
          {added ? <Check className="w-4 h-4" /> : <Plus className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{added ? 'Added' : 'Quick add'}</span>
        </button>
      </div>

      <div className="pt-4 pb-6 px-1 flex-1 flex flex-col min-h-[128px]">
        {isMulti && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {realVariants.slice(0, 2).map((v) => (
              <button
                key={v.size}
                type="button"
                onClick={() => onQuickAdd(product, v)}
                className="text-xs text-ink border border-cream3 rounded-full px-2.5 py-1 hover:border-soil hover:text-charcoal transition-colors price"
                data-testid={`variant-chip-${product.id}-${v.size.replace(/[^a-zA-Z0-9]+/g, '-')}`}
              >
                {v.size} ₹{Math.round(v.price)}
              </button>
            ))}
            {realVariants.length > 2 && (
              <button
                type="button"
                onClick={() => onQuickAdd(product)}
                className="text-xs text-ink px-1.5 py-1 underline underline-offset-2 hover:text-charcoal"
              >
                +{realVariants.length - 2}
              </button>
            )}
          </div>
        )}
        <Link to={`/product/${product.id}`} data-testid={`product-link-${product.id}`}>
          <h3 className="font-display text-h3 text-charcoal leading-snug line-clamp-2 group-hover:text-jaggery transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-ink line-clamp-1 mt-1">{descriptor}</p>
        <p className="text-sm text-ink/70 line-clamp-1 mt-0.5">{triple}</p>
        <p className="text-sm font-semibold text-soil mt-auto pt-2.5 price" data-testid={`product-price-${product.id}`}>
          {isMulti && <span className="text-ink font-normal">from </span>}₹{Math.round(product.base_price)}
        </p>
      </div>
    </article>
  );
};

export const SkeletonCard = () => (
  <div className="flex flex-col" aria-hidden="true">
    <div className="skeleton aspect-square rounded-xl"></div>
    <div className="pt-4 pb-6 px-1 space-y-2">
      <div className="skeleton h-5 w-4/5"></div>
      <div className="skeleton h-3.5 w-3/5"></div>
      <div className="skeleton h-3.5 w-2/5"></div>
      <div className="skeleton h-4 w-1/4 mt-2"></div>
    </div>
  </div>
);
