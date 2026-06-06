import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

/**
 * Mobile-only sticky bottom action bar.
 * - Appears after scrolling past the first viewport (so it doesn't overlap hero CTAs)
 * - Hidden on contact page (already has clear CTAs)
 * - Primary action: Shop Now (amber)
 * - Secondary: WhatsApp tap (icon only)
 * - Live cart pill that goes to /collections/best-sellers + opens cart
 */
const MobileStickyBar = () => {
  const [visible, setVisible] = useState(false);
  const { cartItemCount } = useCart();
  const location = useLocation();

  // Hide on contact (form already prominent)
  const hideOnPaths = ['/contact'];
  const shouldHide = hideOnPaths.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.55);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (shouldHide) return null;

  return (
    <div
      data-testid="mobile-sticky-bar"
      aria-hidden={!visible}
      className={`md:hidden fixed left-0 right-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3
        transition-all duration-500 ease-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
    >
      <div className="mx-auto max-w-md bg-stone-900/95 backdrop-blur-md text-white rounded-full shadow-2xl shadow-black/30 flex items-center gap-2 p-1.5 ring-1 ring-white/10">
        {/* WhatsApp */}
        <a
          href="https://wa.me/916301851597?text=Hi%20Shathabdhi%20Organics!%20I%27d%20like%20to%20know%20more%20about%20your%20products."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp us"
          data-testid="mobile-sticky-whatsapp"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-stone-800 hover:bg-stone-700 active:scale-95 transition-all flex-shrink-0"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
        </a>

        {/* Primary CTA — Shop Now */}
        <Link
          to="/collections/best-sellers"
          data-testid="mobile-sticky-shop-now"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-stone-900 font-semibold text-[11px] tracking-[0.3em] uppercase px-4 py-3 rounded-full transition-all"
        >
          Shop Now
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* Cart pill */}
        <Link
          to="/collections/best-sellers"
          aria-label="View cart"
          data-testid="mobile-sticky-cart"
          className="relative flex items-center justify-center w-11 h-11 rounded-full bg-stone-800 hover:bg-stone-700 active:scale-95 transition-all flex-shrink-0"
        >
          <ShoppingBag className="w-4 h-4 text-amber-300" />
          {cartItemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-amber-400 text-stone-900 text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default MobileStickyBar;
