import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, Leaf, Hand, Award } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/sonner';
import { Toaster } from '../components/ui/sonner';
import { logger } from '../utils/logger';
import { TruncatedText } from '../components/TruncatedText';
import { Img } from '../components/Img';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showStickyAtc, setShowStickyAtc] = useState(false);
  const atcRef = useRef(null);

  useEffect(() => {
    const el = atcRef.current;
    if (!el || !product) return undefined;
    const io = new IntersectionObserver(([entry]) => setShowStickyAtc(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [product]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const p = await productAPI.getById(id);
        if (!active) return;
        setProduct(p);
        setSelectedSize(p.sizes?.[0] || null);
        setQuantity(1);
        // related: same category
        const r = await productAPI.getAll({ category: p.category, per_page: 8 });
        if (!active) return;
        setRelated((r.products || []).filter((x) => x.id !== p.id).slice(0, 4));
      } catch (err) {
        logger.error('Failed to load product', err);
        toast.error('Product not found');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const handleAdd = async () => {
    if (!product || !selectedSize) return;
    try {
      setAdding(true);
      await addToCart(product.id, selectedSize.size, quantity);
      toast.success(`${quantity} × ${product.name} added to cart`);
    } catch (err) {
      logger.error('Failed to add to cart', err);
      toast.error('Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream" data-testid="product-detail-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-soil mx-auto"></div>
          <p className="mt-4 text-ink text-xs tracking-[0.3em] uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <p className="text-2xl font-serif text-charcoal mb-4">Product not found</p>
          <Link to="/collections/best-sellers" className="text-jaggery underline">
            Back to collection
          </Link>
        </div>
      </div>
    );
  }

  const total = (selectedSize?.price || product.base_price) * quantity;

  return (
    <div className="min-h-screen bg-cream" data-testid="product-detail-page">
      <Toaster position="top-right" />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <button
          onClick={() => navigate(-1)}
          data-testid="product-back-btn"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-ink hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Image */}
          <div className="lg:col-span-7" data-testid="product-detail-image">
            <div className="relative lg:sticky lg:top-24">
              <Img
                src={product.image}
                alt={`${product.name} — organic product from Shathabdhi farms`}
                ratio="1/1"
                sizes="(min-width: 1024px) 58vw, 100vw"
                priority
                className="w-full rounded-2xl"
              />
              <div className="absolute top-5 left-5 flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-cream bg-charcoal/80 backdrop-blur-sm rounded-full px-3.5 py-1.5 w-fit">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="text-[10px] tracking-[0.3em] uppercase text-charcoal bg-gold rounded-full px-3.5 py-1.5 w-fit font-semibold">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-5">
            <p className="text-[10px] tracking-[0.4em] uppercase text-jaggery font-semibold mb-3" data-testid="product-detail-eyebrow">
              {product.type} · {product.origin}
            </p>
            <h1
              className="font-serif text-charcoal mb-3 leading-[1.05]"
              style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}
              data-testid="product-detail-title"
            >
              {product.name}
            </h1>
            <TruncatedText
              text={product.description}
              maxLength={220}
              className="text-charcoal leading-relaxed mb-2 text-base md:text-lg"
              testId="product-detail-description"
            />
            <p className="text-sm italic text-ink mb-7">{product.profile}</p>

            <div className="w-12 h-px bg-gold mb-7"></div>

            {/* Price */}
            <div className="mb-7" data-testid="product-detail-price">
              <p className="text-[10px] tracking-[0.3em] uppercase text-ink mb-1">Today&apos;s Price</p>
              <p className="text-3xl md:text-4xl font-serif text-soil">
                ₹{(selectedSize?.price || product.base_price).toFixed(0)}
                <span className="text-sm text-ink font-sans ml-3">/ {selectedSize?.size}</span>
              </p>
            </div>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-7" data-testid="product-size-selector">
                <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal font-semibold mb-3">
                  Choose Size · {product.sizes.length} option{product.sizes.length > 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => {
                    const active = selectedSize?.size === s.size;
                    return (
                      <button
                        key={s.size}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        data-testid={`size-option-${s.size.replace(/[^a-zA-Z0-9]+/g, '-')}`}
                        className={`group inline-flex items-center gap-2 px-5 py-3 border rounded-full text-sm transition-colors duration-200
                          ${active
                            ? 'border-soil bg-soil text-cream shadow-sm'
                            : 'border-cream3 bg-white text-charcoal hover:border-gold hover:bg-cream2'}`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                        <span className="font-medium">{s.size}</span>
                        <span className={`text-xs ${active ? 'text-gold' : 'text-ink'}`}>₹{s.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-7" data-testid="product-quantity">
              <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal font-semibold mb-3">Quantity</p>
              <div className="inline-flex items-center border border-cream3 rounded-full bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  data-testid="qty-decrease"
                  className="w-11 h-11 flex items-center justify-center hover:bg-cream2 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-charcoal font-medium" data-testid="qty-value">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  data-testid="qty-increase"
                  className="w-11 h-11 flex items-center justify-center hover:bg-cream2 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex items-center gap-3 mb-3" ref={atcRef}>
              <Button
                onClick={handleAdd}
                disabled={adding || !selectedSize}
                data-testid="add-to-cart-btn"
                className="flex-1 bg-soil hover:bg-charcoal active:scale-[0.98] text-cream font-medium text-xs tracking-[0.06em] uppercase py-7 rounded-full transition-colors duration-300 disabled:opacity-60 price"
              >
                <ShoppingBag className="w-4 h-4 mr-3" />
                {adding ? 'Adding…' : `Add · ₹${total.toFixed(0)}`}
              </Button>
            </div>
            <p className="text-[11px] text-ink tracking-wider mb-8">
              Free shipping on orders ₹500+ · Hand-packed · Pan-India delivery
            </p>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="border-t border-cream3 pt-7 mb-7" data-testid="product-benefits">
                <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal font-semibold mb-4">Health Benefits</p>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 text-xs text-leaf bg-cream2 border border-cream3 rounded-full px-3.5 py-1.5"
                    >
                      <Leaf className="w-3 h-3" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Promise strip */}
            <div className="border-t border-cream3 pt-7 space-y-4">
              {[
                { icon: Hand, label: 'Hand-Picked', body: 'Sorted and packed by women farmers in Telangana' },
                { icon: Leaf, label: '100% Organic', body: 'Zero chemicals, GMOs or hidden additives' },
                { icon: Award, label: 'Heritage Source', body: 'Sourced from sustainable smallholder farms' },
              ].map((p) => (
                <div key={p.label} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 bg-soil rounded-full flex items-center justify-center">
                    <p.icon className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-charcoal tracking-[0.15em] uppercase">{p.label}</p>
                    <p className="text-sm text-ink font-light">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile add-to-cart */}
      <div
        data-testid="sticky-mobile-atc"
        aria-hidden={!showStickyAtc}
        className={`md:hidden fixed left-0 right-0 bottom-0 z-40 bg-cream border-t border-cream3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300
          ${showStickyAtc ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-sm text-charcoal truncate">{product.name}</p>
            <p className="text-sm text-ink price">₹{total.toFixed(0)}{selectedSize && selectedSize.size !== 'Default Title' ? ` · ${selectedSize.size}` : ''}</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding || !selectedSize}
            data-testid="sticky-atc-btn"
            className="ml-auto flex-shrink-0 min-h-[48px] px-7 rounded-full bg-soil text-cream hover:bg-charcoal text-xs font-medium uppercase tracking-[0.06em] transition-colors disabled:opacity-60"
          >
            {adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="bg-cream2 border-t border-cream3 py-16 md:py-20 px-4" data-testid="product-related">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-jaggery mb-3 font-semibold">More From {product.category}</p>
                <h2 className="text-3xl md:text-4xl font-serif text-charcoal">You may also love</h2>
              </div>
              <Link
                to={`/collections/best-sellers`}
                className="hidden sm:inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-charcoal hover:text-jaggery transition-colors"
              >
                Shop All
                <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-transparent hover:border-cream2 hover:shadow-[0_20px_40px_-15px_rgba(62,42,30,0.14)] hover:-translate-y-1 transition-all duration-300"
                  data-testid={`related-product-${p.id}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-cream2">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] tracking-[0.25em] uppercase text-jaggery mb-1.5">{p.category}</p>
                    <h3 className="font-serif text-lg text-charcoal mb-1 leading-tight group-hover:text-jaggery transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-ink line-clamp-1">{p.description}</p>
                    <p className="text-sm font-semibold text-soil mt-2">From ₹{p.base_price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
