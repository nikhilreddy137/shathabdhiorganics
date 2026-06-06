import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, Instagram } from 'lucide-react';
import { productAPI, categoryAPI, testimonialAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import { toast } from '../components/ui/sonner';
import { Toaster } from '../components/ui/sonner';
import { logger } from '../utils/logger';

const INSTAGRAM_URL = 'https://www.instagram.com/shathabdhiorganics/';

// Map URL slugs → exact category names in DB
const PATH_TO_CATEGORY = {
  millets: 'Millets',
  spices: 'Spices & Powders',
  'spices-and-powders': 'Spices & Powders',
  dals: 'Dals',
  oils: 'Oils',
  cookies: 'Cookies',
  rices: 'Rices',
  'processed-products': 'Processed Products',
};

const BestSellers = () => {
  const location = useLocation();
  const initialCategory = (() => {
    const slug = location.pathname.split('/collections/')[1];
    return PATH_TO_CATEGORY[slug] || null;
  })();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState({
    category: initialCategory ? [initialCategory] : [],
    type: [],
    benefits: [],
  });
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { addToCart } = useCart();

  const filterOptions = {
    category: ['Millets', 'Spices & Powders', 'Rices', 'Oils', 'Processed Products', 'Dals', 'Cookies'],
    type: ['Whole', 'Flour/Atta', 'Powder', 'Cold Pressed', 'Ready-to-Cook', 'Ready-to-Eat'],
    benefits: ['Low GI', 'High Fibre', 'Gluten-Free', 'Diabetic Friendly', 'Iron Rich', 'Protein Rich', 'Calcium Rich', 'Heart Healthy'],
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to route changes (e.g. clicking Header link to a different category)
  useEffect(() => {
    const slug = location.pathname.split('/collections/')[1];
    const newCat = PATH_TO_CATEGORY[slug] || null;
    setSelectedFilters((prev) => ({
      ...prev,
      category: newCat ? [newCat] : [],
    }));
  }, [location.pathname]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, testimonialsData] = await Promise.all([
        categoryAPI.getAll(),
        testimonialAPI.getAll({ is_featured: true, limit: 4 }),
      ]);
      setCategories(categoriesData);
      setTestimonials(testimonialsData);
      await fetchProducts();
    } catch (error) {
      logger.error('Error fetching data:', error);
      toast.error('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = { sort_by: sortBy, per_page: 100 };
      if (selectedFilters.category.length > 0) params.category = selectedFilters.category[0];
      if (selectedFilters.type.length > 0) params.type = selectedFilters.type[0];
      if (selectedFilters.benefits.length > 0) params.benefits = selectedFilters.benefits.join(',');

      const response = await productAPI.getAll(params);
      setProducts(response.products || []);
    } catch (error) {
      logger.error('Error fetching products:', error);
      toast.error('Failed to load products. Please try again.');
    }
  };

  const toggleFilter = (filterType, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterType];
      const isSelected = currentValues.includes(value);
      let newValues;
      if (isSelected) {
        newValues = currentValues.filter((item) => item !== value);
      } else if (filterType === 'category' || filterType === 'type') {
        newValues = [value];
      } else {
        newValues = [...currentValues, value];
      }
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({ category: [], type: [], benefits: [] });
  };

  const handleAddToCart = async (product) => {
    try {
      const defaultSize = product.sizes[0];
      await addToCart(product.id, defaultSize.size, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      logger.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  const activeFilterCount = Object.values(selectedFilters).reduce((acc, arr) => acc + arr.length, 0);

  const FilterGroup = ({ title, options, filterKey }) => {
    const selectedCount = selectedFilters[filterKey].length;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-2 mb-1">
          <h4 className="text-[11px] font-semibold text-stone-900 uppercase tracking-[0.22em]">{title}</h4>
          {selectedCount > 0 && (
            <span className="text-[10px] font-semibold tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full transition-all duration-200 animate-in fade-in zoom-in" data-testid={`filter-count-${filterKey}`}>
              {selectedCount}
            </span>
          )}
        </div>
        {options.map((opt) => {
          const isActive = selectedFilters[filterKey].includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleFilter(filterKey, opt)}
              data-testid={`filter-${filterKey}-${opt}`}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-all duration-200 ease-out
                ${isActive
                  ? 'bg-stone-900 text-white shadow-sm translate-x-1'
                  : 'bg-transparent text-stone-700 hover:bg-amber-50 hover:text-stone-900 hover:translate-x-1'}`}
            >
              <span className={`flex items-center justify-center w-4 h-4 border transition-all duration-200
                ${isActive ? 'bg-amber-400 border-amber-400' : 'border-stone-400 group-hover:border-stone-700'}`}>
                {isActive && (
                  <svg className="w-3 h-3 text-stone-900" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="flex-1 leading-tight">{opt}</span>
              {isActive && (
                <span className="text-[10px] tracking-widest uppercase text-amber-300">On</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-8" data-testid="filter-sidebar">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-700" />
          <h3 className="text-xs tracking-[0.25em] uppercase font-semibold text-stone-900">Filters</h3>
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-[10px] tracking-[0.2em] uppercase text-amber-700 hover:text-amber-900 hover:bg-amber-50 px-2 transition-all"
            data-testid="clear-filters-btn"
          >
            Clear · {activeFilterCount}
          </Button>
        )}
      </div>

      <FilterGroup title="Category" options={filterOptions.category} filterKey="category" />
      <FilterGroup title="Type" options={filterOptions.type} filterKey="type" />
      <FilterGroup title="Benefits" options={filterOptions.benefits} filterKey="benefits" />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-stone-800 mx-auto"></div>
          <p className="mt-4 text-stone-700">Loading products...</p>
        </div>
      </div>
    );
  }

  // initials for the text-only product card monogram
  const getInitials = (name) => {
    const parts = name.replace(/[()]/g, '').split(/[\s-]+/).filter(Boolean);
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  };

  return (
    <div className="min-h-screen bg-white" data-testid="best-sellers-page">
      <Toaster position="top-right" />

      {/* Hero Section — Why Switch to Organic */}
      <div className="bg-stone-50 py-24 px-4 border-b border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-xs tracking-[0.4em] uppercase text-amber-700 mb-6">Why Switch to Organic</p>
            <h1 className="text-5xl md:text-6xl font-serif text-stone-900 mb-6 tracking-tight leading-[1.05]">
              Your body knows<br />
              the <em className="italic text-amber-700">difference.</em>
            </h1>
            <div className="w-14 h-px bg-amber-400 mx-auto mb-7"></div>
            <p className="text-base md:text-lg text-stone-700 leading-relaxed font-light">
              Modern food is engineered for shelf-life. <strong className="text-stone-900 font-semibold">Organic food is grown for life.</strong> Every grain, oil and spice in this collection is a small switch — and small switches compound into a longer, brighter, more rooted life.
            </p>
          </div>

          {/* 4 Reasons grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto" data-testid="why-organic-grid">
            {[
              {
                num: '01',
                title: 'No Hidden Poisons',
                body: 'Zero synthetic pesticides, herbicides or GMO seeds — ever. What touches your plate touches your DNA.',
              },
              {
                num: '02',
                title: 'Up To 60% More Nutrients',
                body: 'Heirloom grains grown in living soil pack far more iron, zinc, magnesium and antioxidants than industrial crops.',
              },
              {
                num: '03',
                title: 'Healed Gut, Balanced Hormones',
                body: 'No glyphosate residue, no microplastic flour — just whole foods your microbiome and endocrine system actually recognise.',
              },
              {
                num: '04',
                title: 'Fair To Farmers & Earth',
                body: 'Every kilo pays a woman farmer directly and regenerates soil, water tables and biodiversity in Telangana.',
              },
            ].map((r) => (
              <div
                key={r.num}
                className="group bg-white border border-stone-200 p-7 hover:border-amber-400 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                data-testid={`why-organic-${r.num}`}
              >
                <p className="text-3xl font-serif text-amber-700 mb-4 leading-none group-hover:text-amber-600 transition-colors">{r.num}</p>
                <h3 className="text-base font-semibold text-stone-900 mb-3 leading-snug">{r.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">{r.body}</p>
              </div>
            ))}
          </div>

          {/* Soft divider into the catalogue */}
          <div className="text-center mt-16">
            <p className="text-[11px] tracking-[0.35em] uppercase text-stone-600 mb-3">Start the Switch Below</p>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900">Best Sellers</h2>
          </div>
        </div>
      </div>

      {/* (Horizontal Category Bar removed — filters live in the reactive sidebar) */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-4">
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden rounded-none border-stone-900 text-stone-900" data-testid="mobile-filters-btn">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
                <p className="text-xs tracking-[0.2em] uppercase text-stone-700" data-testid="product-count">
                  {products.length} {products.length === 1 ? 'Product' : 'Products'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs tracking-[0.15em] uppercase text-stone-700 hidden sm:inline">Sort</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] rounded-none border-stone-300 text-stone-900" data-testid="sort-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name-az">Name: A–Z</SelectItem>
                    <SelectItem value="name-za">Name: Z–A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Grid — Editorial Cards with Imagery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200" data-testid="product-grid">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group bg-white border-0 ring-0 rounded-none shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col"
                  data-testid={`product-card-${product.id}`}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-7xl text-stone-300 select-none">
                          {getInitials(product.name).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                      <span className="text-[10px] tracking-[0.25em] uppercase text-white bg-stone-900/70 backdrop-blur-sm px-2.5 py-1">
                        {product.category}
                      </span>
                      {product.badge && (
                        <span className="text-[9px] tracking-[0.2em] uppercase text-stone-900 bg-white px-2.5 py-1">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <CardContent className="p-7 text-center flex-1 flex flex-col">
                    <h3 className="font-serif text-2xl text-stone-900 mb-2 leading-tight tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-stone-700 leading-relaxed mb-2">{product.description}</p>
                    <p className="text-xs italic text-stone-600 mb-5">{product.profile}</p>

                    <div className="border-t border-stone-200 pt-4 mt-auto">
                      <div className="flex items-baseline justify-center gap-2 mb-4">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-stone-600">From</span>
                        <span className="text-lg font-medium text-stone-900">₹{product.base_price}</span>
                        <span className="text-xs text-stone-500">· {product.sizes.length} sizes</span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        data-testid={`add-to-cart-${product.id}`}
                        className="w-full bg-stone-900 hover:bg-amber-500 hover:text-stone-900 active:scale-[0.98] text-white font-semibold text-xs tracking-[0.25em] uppercase py-6 rounded-none border-0 transition-all duration-300"
                      >
                        Quick Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-20" data-testid="no-products">
                <p className="text-stone-800 text-lg">No products found matching your filters.</p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="mt-6 rounded-none border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Promotional Banner — Power of Siridhanya Millets */}
      <div className="relative my-20 overflow-hidden">
        <div className="relative h-[520px] md:h-[600px] w-full">
          <img
            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Siridhanya millet field"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/70"></div>
          <div className="relative h-full flex items-center justify-center px-4">
            <div className="max-w-2xl text-center text-white">
              <p className="text-[11px] tracking-[0.4em] uppercase mb-6 text-stone-200">Ancient Grains · Modern Wellness</p>
              <h2 className="text-white text-5xl md:text-6xl font-serif font-light mb-7 leading-tight tracking-tight">
                The Power of <em className="italic font-light">Siridhanya</em> Millets
              </h2>
              <div className="w-12 h-px bg-white/60 mx-auto mb-7"></div>
              <p className="text-base md:text-lg leading-relaxed mb-10 text-stone-100 font-light max-w-xl mx-auto">
                In every handful of our heritage millets lies nature's perfect balance — sustained energy, deep nourishment,
                and a quiet return to the wisdom of the soil.
              </p>
              <Button
                onClick={() => setSelectedFilters((p) => ({ ...p, category: ['Millets'] }))}
                size="lg"
                className="bg-transparent hover:bg-white text-white hover:text-stone-900 border border-white font-medium text-xs tracking-[0.25em] uppercase px-10 py-6 rounded-none transition-all duration-300"
                data-testid="shop-millets-banner-btn"
              >
                Shop Millets
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-600 mb-3">Reviews</p>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight">What Our Customers Are Saying</h2>
          <div className="w-12 h-px bg-stone-400 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-md transition-shadow border-0 ring-1 ring-stone-200 rounded-none bg-white">
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-stone-800 italic leading-relaxed">"{testimonial.text}"</p>
                <p className="text-sm font-medium text-stone-900">— {testimonial.name}</p>
                <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
                  {testimonial.product_image && (
                    <img
                      src={testimonial.product_image}
                      alt={testimonial.product_name}
                      className="w-14 h-14 object-cover flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="text-[10px] font-medium text-stone-700 tracking-[0.2em] uppercase">on</p>
                    <p className="text-sm font-serif text-stone-900 mt-0.5 leading-tight">{testimonial.product_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Instagram / Videos Section */}
      <div className="bg-stone-900 text-white py-24 px-4" data-testid="instagram-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] tracking-[0.4em] uppercase text-amber-300 mb-4">Follow Our Journey</p>
            <h2 className="text-white text-4xl md:text-5xl font-serif tracking-tight mb-5">From Our Farms to Your Kitchen</h2>
            <div className="w-12 h-px bg-amber-400 mx-auto mb-6"></div>
            <p className="text-stone-300 max-w-xl mx-auto font-light leading-relaxed">
              Watch how we sow, harvest and hand-pack each Siridhanya millet — live from the fields of Telangana.
            </p>
          </div>

          {/* Auto-playing video reels */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              {
                title: 'Harvest Season',
                video: 'https://videos.pexels.com/video-files/2495944/2495944-uhd_2560_1440_24fps.mp4',
                poster: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Hand-Sorted',
                video: 'https://videos.pexels.com/video-files/3015527/3015527-hd_1920_1080_24fps.mp4',
                poster: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Cold Pressing',
                video: 'https://videos.pexels.com/video-files/4253384/4253384-uhd_2560_1440_25fps.mp4',
                poster: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Spice Markets',
                video: 'https://videos.pexels.com/video-files/3296279/3296279-uhd_2560_1440_25fps.mp4',
                poster: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=600&q=80',
              },
            ].map((reel) => (
              <a
                key={reel.title}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`reel-${reel.title.replace(/\s+/g, '-').toLowerCase()}`}
                className="group relative aspect-[9/16] overflow-hidden bg-stone-800 block rounded-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                <video
                  src={reel.video}
                  poster={reel.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/10 to-stone-900/30 group-hover:from-stone-900/75 transition-colors duration-300"></div>
                {/* Play badge */}
                <div className="absolute top-3 right-3 w-7 h-7 bg-white/95 rounded-full flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-stone-900 ml-0.5"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-amber-300 mb-1">Reel · Live</p>
                  <p className="text-white font-serif text-lg leading-tight drop-shadow-lg">{reel.title}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="follow-instagram-btn"
              className="inline-flex items-center gap-3 bg-amber-400 text-stone-900 hover:bg-amber-300 hover:-translate-y-0.5 font-semibold text-xs tracking-[0.25em] uppercase px-10 py-5 transition-all duration-300"
            >
              <Instagram className="w-4 h-4" />
              Follow @shathabdhiorganics
            </a>
          </div>
        </div>
      </div>

      {/* Educational Section */}
      <div className="bg-stone-50 py-20 px-4 border-t border-stone-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-600 mb-3">Our Promise</p>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight">
              Why Choose Shathabdhi Organics
            </h2>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-6"></div>
          </div>
          <div className="max-w-none text-stone-800 space-y-5 text-base leading-relaxed text-center">
            <p>
              At Shathabdhi Organics, we bring you the finest quality organic millets, spices, oils, rices, dals, and
              processed foods sourced directly from sustainable farms in Telangana. Our products are 100% organic,
              pesticide-free, and packed with the nutrition your family deserves.
            </p>
            <p>
              Ancient grains like millets have been a staple in Indian cuisine for thousands of years. They are
              naturally gluten-free, low on the glycemic index, and rich in fibre — making them perfect for modern
              healthy lifestyles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
