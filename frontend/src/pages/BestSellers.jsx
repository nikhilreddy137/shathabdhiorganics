import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Instagram } from 'lucide-react';
import { productAPI, categoryAPI, testimonialAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { toast, Toaster } from '../components/ui/sonner';
import { logger } from '../utils/logger';
import { ProductCard, SkeletonCard } from '../components/catalog/ProductCard';
import { QuickAddSheet } from '../components/catalog/QuickAddSheet';
import { FilterSheet } from '../components/catalog/FilterSheet';
import { SortSheet, sortLabel } from '../components/catalog/SortSheet';
import { CategoryRail, slugify } from '../components/catalog/CategoryRail';
import { EditorialCard, EDITORIAL_CARDS } from '../components/catalog/EditorialCard';
import { Reveal } from '../components/motion/Primitives';

const INSTAGRAM_URL = 'https://www.instagram.com/shathabdhiorganics/';

const PATH_TO_CATEGORY = {
  millets: 'Millets',
  'millet-flours': 'Millet Flours',
  spices: 'Spices & Powders',
  'spices-and-powders': 'Spices & Powders',
  dals: 'Dals',
  'dals-and-pulses': 'Dals & Pulses',
  oils: 'Oils',
  cookies: 'Cookies',
  rices: 'Rices',
  'processed-products': 'Processed Products',
  'snacks-and-bars': 'Snacks & Bars',
  'sweets-and-treats': 'Sweets & Treats',
  'health-drinks': 'Health Drinks',
  'idli-and-upma-ravas': 'Idli & Upma Ravas',
  'fruits-and-vegetables': 'Fruits & Vegetables',
  'nuts-seeds-and-spices': 'Nuts, Seeds & Spices',
  pickles: 'Pickles',
  honey: 'Honey',
  ghee: 'Ghee',
  'jaggery-and-sweeteners': 'Jaggery & Sweeteners',
  'combo-packs': 'Combo Packs',
  'poultry-and-eggs': 'Poultry & Eggs',
};

const CATEGORY_INTRO = {
  Millets: 'Siridhanya and heritage millets, stone-milled in small batches by women farmer collectives.',
  Oils: 'Wood-churned, cold-pressed oils — unrefined and never heated above 40°C.',
  default: 'Heritage millets, hand-pounded spices and cold-pressed oils — grown without chemicals and packed by hand in Telangana.',
};

const BestSellers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const slug = location.pathname.split('/collections/')[1];
  const activeCategory = PATH_TO_CATEGORY[slug] || null;

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState({ product: null, variant: null, open: false });

  const { addToCart } = useCart();

  const selectedBenefits = useMemo(
    () => (searchParams.get('benefits') || '').split(',').filter(Boolean),
    [searchParams]
  );
  const sortBy = searchParams.get('sort') || 'featured';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData, testimonialsData] = await Promise.all([
          productAPI.getAll({ per_page: 200 }),
          categoryAPI.getAll(),
          testimonialAPI.getAll({ is_featured: true, limit: 4 }),
        ]);
        setAllProducts(productsData.products || []);
        setCategories(categoriesData);
        setTestimonials(testimonialsData);
      } catch (error) {
        logger.error('Error fetching catalog:', error);
        toast.error("Couldn't load the catalog.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: false });
  };

  const applyFilters = (products, { category = activeCategory, benefits = selectedBenefits } = {}) =>
    products.filter((p) => {
      if (category && p.category !== category) return false;
      if (benefits.length > 0 && !benefits.every((b) => (p.benefits || []).includes(b))) return false;
      return true;
    });

  const filtered = useMemo(() => {
    const list = applyFilters(allProducts);
    const sorted = [...list];
    if (sortBy === 'price-low') sorted.sort((a, b) => a.base_price - b.base_price);
    else if (sortBy === 'price-high') sorted.sort((a, b) => b.base_price - a.base_price);
    else if (sortBy === 'name-az') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'name-za') sorted.sort((a, b) => b.name.localeCompare(a.name));
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, activeCategory, selectedBenefits, sortBy]);

  const facets = useMemo(() => {
    const categoryOptions = categories.map((c) => ({
      value: c.name,
      count: applyFilters(allProducts, { category: c.name }).length,
    }));
    const benefitValues = [...new Set(allProducts.flatMap((p) => p.benefits || []))].sort();
    const benefitOptions = benefitValues.map((b) => ({
      value: b,
      count: applyFilters(allProducts, { benefits: [...new Set([...selectedBenefits, b])] }).length,
    }));
    return [
      { key: 'category', label: 'Category', options: categoryOptions },
      { key: 'benefits', label: 'Benefits', options: benefitOptions },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, categories, activeCategory, selectedBenefits]);

  const toggleFacet = (key, value) => {
    if (key === 'category') {
      if (activeCategory === value) navigate(`/collections/best-sellers?${searchParams.toString()}`);
      else navigate(`/collections/${slugify(value)}?${searchParams.toString()}`);
    } else {
      const next = selectedBenefits.includes(value)
        ? selectedBenefits.filter((b) => b !== value)
        : [...selectedBenefits, value];
      setParam('benefits', next.join(','));
    }
  };

  const clearAll = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('benefits');
    navigate(`/collections/best-sellers${next.toString() ? `?${next.toString()}` : ''}`);
  };

  const activeFilterCount = (activeCategory ? 1 : 0) + selectedBenefits.length;
  const hasFilters = activeFilterCount > 0;

  const handleAddSingle = async (product) => {
    try {
      await addToCart(product.id, product.sizes[0].size, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      logger.error('Error adding to cart:', error);
      toast.error('Could not add to cart — please try again.');
    }
  };

  const handleQuickAddSheet = async (product, variant, qty) => {
    try {
      await addToCart(product.id, variant.size, qty);
      toast.success(`${qty} × ${product.name} added to cart`);
    } catch (error) {
      logger.error('Error adding to cart:', error);
      toast.error('Could not add to cart — please try again.');
      throw error;
    }
  };

  const gridItems = useMemo(() => {
    const items = [];
    filtered.forEach((p, i) => {
      items.push({ type: 'product', product: p });
      if (!hasFilters && (i + 1) % 8 === 0) {
        const card = EDITORIAL_CARDS[((i + 1) / 8 - 1) % EDITORIAL_CARDS.length];
        items.push({ type: 'editorial', card, index: (i + 1) / 8 });
      }
    });
    return items;
  }, [filtered, hasFilters]);

  const intro = CATEGORY_INTRO[activeCategory] || CATEGORY_INTRO.default;

  return (
    <div className="min-h-screen bg-white" data-testid="best-sellers-page">
      <Toaster position="top-right" />

      {/* Collection header */}
      <header className="max-w-7xl mx-auto px-4 pt-12 md:pt-16 pb-8">
        <p className="text-eyebrow uppercase text-amber-700 mb-3">Shathabdhi Organics</p>
        <h1 className="font-display text-h1 text-stone-900" data-testid="collection-title">
          {activeCategory || 'Shop all'}
        </h1>
        <p className="text-body text-stone-500 mt-3 measure">{intro}</p>
      </header>

      {/* Category rail */}
      <div className="max-w-7xl mx-auto md:px-4 pb-6">
        <CategoryRail categories={categories} activeCategory={activeCategory} />
      </div>

      {/* Sticky filter/sort bar */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-y border-stone-200" data-testid="sticky-filter-bar">
        <div className="max-w-7xl mx-auto px-4 h-[52px] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            data-testid="open-filters-btn"
            className="inline-flex items-center gap-2 min-h-[44px] px-3 -ml-3 text-xs font-medium uppercase tracking-[0.06em] text-stone-900 hover:text-amber-800 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 bg-stone-900 text-amber-300 text-[11px] rounded-full flex items-center justify-center price" data-testid="filter-count-badge">
                {activeFilterCount}
              </span>
            )}
          </button>
          <p className="text-sm text-stone-400 price hidden sm:block" data-testid="product-count">
            {filtered.length} product{filtered.length === 1 ? '' : 's'}
          </p>
          <button
            type="button"
            onClick={() => setSortOpen(true)}
            data-testid="open-sort-btn"
            className="inline-flex items-center gap-2 min-h-[44px] px-3 -mr-3 text-xs font-medium uppercase tracking-[0.06em] text-stone-900 hover:text-amber-800 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">Sort:</span> {sortLabel(sortBy)}
          </button>
        </div>
        {/* Applied filter chips */}
        {hasFilters && (
          <div className="border-t border-stone-100">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar" data-testid="applied-filter-chips">
              {activeCategory && (
                <button
                  type="button"
                  onClick={() => navigate(`/collections/best-sellers?${searchParams.toString()}`)}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 transition-colors"
                  data-testid="chip-category"
                >
                  {activeCategory}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedBenefits.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleFacet('benefits', b)}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 transition-colors"
                  data-testid={`chip-benefit-${b.replace(/[^a-zA-Z0-9]+/g, '-')}`}
                >
                  {b}
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="flex-shrink-0 text-xs text-stone-500 underline underline-offset-2 hover:text-stone-900 px-2 py-1.5"
                data-testid="chips-clear-all"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-6" data-testid="skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24" data-testid="no-products">
            <h2 className="font-display text-h2 text-stone-900 mb-3">No products match these filters.</h2>
            <button
              type="button"
              onClick={clearAll}
              data-testid="empty-clear-filters-btn"
              className="mt-2 inline-flex min-h-[48px] items-center px-8 bg-stone-900 text-white hover:bg-amber-400 hover:text-stone-900 text-xs font-medium uppercase tracking-[0.06em] transition-all"
            >
              Clear all filters
            </button>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {['Millets', 'Oils', 'Spices & Powders', 'Rices'].map((c) => (
                <Link key={c} to={`/collections/${slugify(c)}`} className="text-sm text-stone-600 border border-stone-300 px-4 py-2.5 hover:border-stone-900 hover:text-stone-900 transition-colors">
                  {c}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-6" data-testid="product-grid">
            {gridItems.map((item) =>
              item.type === 'product' ? (
                <ProductCard
                  key={item.product.id}
                  product={item.product}
                  onAddSingle={handleAddSingle}
                  onQuickAdd={(product, variant) => setQuickAdd({ product, variant: variant || null, open: true })}
                />
              ) : (
                <EditorialCard key={`editorial-${item.index}`} card={item.card} index={item.index} />
              )
            )}
          </div>
        )}
      </div>

      {/* Reviews */}
      {testimonials.length > 0 && (
        <section className="bg-stone-50 border-t border-stone-200 py-16 md:py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <p className="text-eyebrow uppercase text-stone-500 mb-3">Reviews</p>
              <h2 className="font-display text-h2 text-stone-900 mb-10">What our customers are saying</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 0.08} className="bg-white p-6 flex flex-col">
                  <p className="text-sm text-stone-700 leading-relaxed font-display italic text-body-lg">"{t.text}"</p>
                  <p className="text-sm text-stone-900 mt-4">— {t.name}</p>
                  <p className="text-sm text-stone-400 mt-auto pt-4">on {t.product_name}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instagram CTA */}
      <section className="bg-stone-900 text-white py-16 px-4 text-center" data-testid="instagram-section">
        <p className="text-eyebrow uppercase text-amber-300 mb-3">Follow our journey</p>
        <h2 className="font-display text-h2 text-white mb-8">From our farms to your kitchen</h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="follow-instagram-btn"
          className="inline-flex items-center gap-3 min-h-[48px] bg-amber-400 text-stone-900 hover:bg-amber-300 hover:-translate-y-0.5 text-xs font-medium uppercase tracking-[0.06em] px-9 py-4 transition-all duration-300"
        >
          <Instagram className="w-4 h-4" />
          Follow @shathabdhiorganics
        </a>
      </section>

      {/* Sheets */}
      <QuickAddSheet
        product={quickAdd.product}
        initialVariant={quickAdd.variant}
        open={quickAdd.open}
        onClose={() => setQuickAdd((q) => ({ ...q, open: false }))}
        onAdd={handleQuickAddSheet}
      />
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        facets={facets}
        selected={{ category: activeCategory ? [activeCategory] : [], benefits: selectedBenefits }}
        onToggle={toggleFacet}
        onClearAll={clearAll}
        resultCount={filtered.length}
      />
      <SortSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        value={sortBy}
        onChange={(v) => setParam('sort', v === 'featured' ? '' : v)}
      />
    </div>
  );
};

export default BestSellers;
