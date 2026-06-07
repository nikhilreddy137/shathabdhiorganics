import React, { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI, testimonialAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from '../components/ui/sonner';
import { Toaster } from '../components/ui/sonner';
import { logger } from '../utils/logger';

const HERO_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80',
    alt: 'Golden fields at sunset',
  },
  {
    src: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=80',
    alt: 'Lush green millet crop',
  },
  {
    src: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=2000&q=80',
    alt: 'Cows grazing in a misty pasture',
  },
  {
    src: 'https://images.pexels.com/photos/2589457/pexels-photo-2589457.jpeg?auto=compress&cs=tinysrgb&w=2000',
    alt: 'Sunset over a rural rice paddy field',
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const { addToCart } = useCart();

  const [activeChip, setActiveChip] = useState('All');

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, testimonialsData] = await Promise.all([
        productAPI.getAll({ per_page: 100 }),
        categoryAPI.getAll(),
        testimonialAPI.getAll({ is_featured: true, limit: 4 })
      ]);
      
      setProducts(productsData.products || []);
      setCategories(categoriesData);
      setTestimonials(testimonialsData);
    } catch (error) {
      logger.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddToCart = async (product) => {
    try {
      const defaultSize = product.sizes[0];
      await addToCart(product.id, defaultSize.size, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      logger.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const ProductCard = ({ product }) => (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-none bg-white" data-testid={`product-card-${product.id}`}>
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-white" data-testid={`product-image-${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gray-900 text-white font-normal text-[10px] uppercase tracking-wider rounded-none px-3 py-1">
              {product.badge}
            </Badge>
          </div>
        )}
      </Link>
      <CardContent className="p-6 space-y-3">
        <div>
          <Link to={`/product/${product.id}`} className="block hover:text-amber-700 transition-colors" data-testid={`product-link-${product.id}`}>
            <h3 className="font-normal text-lg text-gray-900 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{product.name}</h3>
          </Link>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{product.description}</p>
        </div>
        <p className="text-sm text-gray-600">{product.profile}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500">from</span>
          <span className="text-lg font-light text-gray-900">₹{product.base_price}</span>
        </div>
        <Button
          onClick={() => handleAddToCart(product)}
          data-testid={`add-to-cart-home-${product.id}`}
          className="w-full bg-transparent border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-normal text-xs uppercase tracking-wider transition-all rounded-none py-5"
        >
          ADD TO CART
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      {/* Hero Banner */}
      <div className="relative h-[560px] sm:h-[640px] md:h-[720px] bg-stone-100 overflow-hidden" data-testid="hero-carousel">
        {HERO_SLIDES.map((slide, idx) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1800ms] ease-in-out ${
              idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(28,25,23,0.92) 0%, rgba(28,25,23,0.78) 35%, rgba(28,25,23,0.55) 65%, rgba(28,25,23,0.30) 100%)',
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <p className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-stone-200 mb-4 md:mb-6">Shathabdhi Organics</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light mb-5 md:mb-6 leading-[1.05]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Nourishing Bodies,<br />
              <em className="italic font-light">Transforming Lives</em>
            </h1>
            <div className="w-12 md:w-16 h-px bg-white/70 mb-6 md:mb-7"></div>
            <p className="text-sm md:text-lg text-stone-100 font-light leading-relaxed mb-7 md:mb-10 max-w-xl">
              Heritage millets, hand-blended spices and cold-pressed oils — sourced directly from sustainable farms in Telangana, packed with the wisdom of our ancestors.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link to="/collections/millets">
                <Button size="lg" className="bg-white text-stone-900 hover:bg-stone-100 font-medium text-[11px] md:text-xs px-7 md:px-10 py-5 md:py-6 rounded-none uppercase tracking-[0.25em]" data-testid="hero-shop-millets-btn">
                  Shop Millets
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="bg-transparent border border-white text-white hover:bg-white hover:text-stone-900 font-medium text-[11px] md:text-xs px-7 md:px-10 py-5 md:py-6 rounded-none uppercase tracking-[0.25em]" data-testid="hero-our-story-btn">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3" data-testid="hero-indicators">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              data-testid={`hero-indicator-${idx}`}
              className={`h-[2px] transition-all duration-500 ${
                idx === activeSlide ? 'w-12 bg-white' : 'w-6 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] text-stone-600 uppercase tracking-[0.3em] mb-4">WELCOME TO SHATHABDHI ORGANICS</p>
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Purveyors of Direct-Trade, Organic Millets
          </h2>
          <p className="text-xl md:text-2xl text-stone-600 italic font-light max-w-2xl mx-auto" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            From off the beaten path — straight from Telangana's farms to your table.
          </p>
        </div>
      </div>

      {/* Tagline / Mission Strip — Women-Led Manifesto */}
      <div className="relative bg-stone-900 text-white py-16 md:py-24 px-4 overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #d4a574 0%, transparent 50%), radial-gradient(circle at 80% 70%, #8b5a3c 0%, transparent 50%)'
        }}></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-14 items-start">
            {/* Left: Eyebrow + Headline */}
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <span className="h-[2px] w-10 bg-amber-400"></span>
                <p className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-amber-300 font-semibold" data-testid="mission-eyebrow">
                  Women-Led · Farmer-Owned
                </p>
              </div>
              <h2 className="text-white font-bold leading-[0.95] mb-6 md:mb-8 tracking-tight" style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif', fontSize: 'clamp(2rem, 5.5vw, 5rem)', fontWeight: 700 }} data-testid="mission-headline">
                Backed by the hands<br />
                that <em className="italic text-amber-300 font-bold">feed nations.</em>
              </h2>
              <p className="text-base md:text-xl text-stone-100 font-normal leading-relaxed max-w-xl" data-testid="mission-tagline">
                Shathabdhi is built by <strong className="text-white font-semibold">women entrepreneurs &amp; smallholder farmers</strong> in Telangana — reviving ancient millets, paying fair wages, and putting soil, dignity and tradition before profit.
              </p>
            </div>

            {/* Right: Impact Stats */}
            <div className="md:col-span-5 md:pl-8 md:border-l md:border-stone-700">
              <div className="grid grid-cols-2 gap-y-8 md:gap-y-10 gap-x-6">
                <div data-testid="stat-women-farmers">
                  <p className="text-4xl sm:text-5xl md:text-6xl text-amber-300 font-bold leading-none mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    2,400<span className="text-xl md:text-2xl align-top">+</span>
                  </p>
                  <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-stone-300 font-medium">Women Farmers Empowered</p>
                </div>
                <div data-testid="stat-villages">
                  <p className="text-4xl sm:text-5xl md:text-6xl text-amber-300 font-bold leading-none mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    87
                  </p>
                  <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-stone-300 font-medium">Telangana Villages</p>
                </div>
                <div data-testid="stat-acres">
                  <p className="text-4xl sm:text-5xl md:text-6xl text-amber-300 font-bold leading-none mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    11K<span className="text-xl md:text-2xl align-top">+</span>
                  </p>
                  <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-stone-300 font-medium">Acres of Organic Soil</p>
                </div>
                <div data-testid="stat-zero-chemicals">
                  <p className="text-4xl sm:text-5xl md:text-6xl text-amber-300 font-bold leading-none mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    0
                  </p>
                  <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-stone-300 font-medium">Chemicals. Ever.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Sri Bhanu Spotlight + Instagram Reel */}
          <div className="mt-14 md:mt-20 pt-10 md:pt-14 border-t border-stone-700 grid md:grid-cols-12 gap-8 md:gap-14 items-center">
            {/* Left: Instagram Reel */}
            <div className="md:col-span-5" data-testid="sri-bhanu-reel">
              <div className="relative bg-black rounded-sm overflow-hidden border border-stone-700/60 shadow-2xl shadow-black/40 mx-auto md:mx-0" style={{ maxWidth: '420px' }}>
                <div className="relative w-full" style={{ paddingBottom: '125%' }}>
                  <iframe
                    src="https://www.instagram.com/p/DOYnn2Xj_9l/embed/?utm_source=ig_embed&amp;utm_campaign=loading"
                    title="Sri Bhanu — Shathabdhi Organics Reel"
                    allow="encrypted-media; clipboard-write; picture-in-picture; web-share"
                    allowFullScreen
                    scrolling="no"
                    frameBorder="0"
                    className="absolute inset-0 w-full h-full"
                    data-testid="sri-bhanu-iframe"
                  />
                </div>
              </div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mt-4 text-center md:text-left">@shathabdhi.organics · Reel</p>
            </div>

            {/* Right: Bold statement */}
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-4 md:mb-5">
                <span className="h-[2px] w-10 bg-amber-400"></span>
                <p className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-amber-300 font-semibold" data-testid="sri-bhanu-eyebrow">
                  Meet Sri Bhanu
                </p>
              </div>
              <h3
                className="text-white font-bold leading-[0.98] mb-6 md:mb-7 tracking-tight"
                style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif', fontSize: 'clamp(1.75rem, 4.2vw, 3.75rem)', fontWeight: 700 }}
                data-testid="sri-bhanu-headline"
              >
                She didn't ask the world<br />
                for a seat.<br />
                <em className="italic text-amber-300">She built her own table.</em>
              </h3>
              <p className="text-base md:text-xl text-stone-100 font-normal leading-relaxed mb-4 md:mb-5" data-testid="sri-bhanu-body">
                When the world told her women belong indoors, <strong className="text-white font-semibold">Sri Bhanu walked straight into the field.</strong> She turned forgotten heirloom seeds into income for <strong className="text-amber-300 font-semibold">2,400+ women</strong>, restored <strong className="text-amber-300 font-semibold">11,000 acres</strong> to organic life, and handed dignity back to grandmothers who have fed dynasties.
              </p>
              <p className="text-base md:text-xl text-stone-100 font-normal leading-relaxed mb-6 md:mb-8">
                Every kilo we ship is a quiet rebellion — proof that when <span className="text-amber-300 font-semibold">women own the soil</span>, they rewrite who eats, who earns, and <em className="italic">who decides.</em>
              </p>
              <p className="text-lg md:text-2xl text-stone-100 font-light leading-snug mb-8 md:mb-10 italic border-l-2 border-amber-400 pl-5 md:pl-6" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                "We aren't growing grain. We're growing power — one sister, one seed, one season at a time."
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.instagram.com/p/DOYnn2Xj_9l/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-amber-400 text-stone-900 hover:bg-amber-300 transition-colors text-xs tracking-[0.25em] uppercase font-semibold px-7 md:px-8 py-4"
                  data-testid="sri-bhanu-watch-cta"
                >
                  Watch Her Story
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Selections — show ALL products with reactive category chips */}
      <div className="py-20 px-4 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-amber-700 mb-3">Shop The Whole Pantry</p>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Featured Selections
            </h2>
            <div className="w-12 h-px bg-amber-400 mx-auto mt-6 mb-6"></div>
            <p className="text-sm md:text-base text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
              Every grain, oil and spice we make — filter by category or browse the entire collection below.
            </p>
          </div>

          {/* Reactive category chips */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14 px-2" data-testid="featured-category-chips">
            {['All', 'Millets', 'Spices & Powders', 'Rices', 'Oils', 'Dals', 'Cookies', 'Snacks & Bars', 'Sweets & Treats', 'Health Drinks', 'Processed Products'].map((c) => {
              const isActive = activeChip === c;
              const count = c === 'All'
                ? products.length
                : products.filter((p) => p.category === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveChip(c)}
                  data-testid={`featured-chip-${c.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`}
                  className={`group inline-flex items-center gap-1.5 md:gap-2 rounded-full border px-3.5 md:px-5 py-1.5 md:py-2 text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-medium transition-all duration-300 ease-out
                    ${isActive
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md -translate-y-0.5'
                      : 'bg-white text-stone-800 border-stone-300 hover:border-amber-400 hover:text-stone-900 hover:bg-amber-50 hover:-translate-y-0.5'}`}
                >
                  <span>{c}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full transition-colors ${isActive ? 'bg-amber-400 text-stone-900' : 'bg-stone-100 text-stone-600 group-hover:bg-amber-200 group-hover:text-stone-900'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Products grid — show up to 10 products in the active filter */}
          {(() => {
            const matching = activeChip === 'All' ? products : products.filter((p) => p.category === activeChip);
            const visible = matching.slice(0, 10);
            if (!loading && matching.length === 0) {
              return (
                <div className="text-center py-20 text-stone-500" data-testid="featured-empty">
                  No products in this collection yet — try another filter.
                </div>
              );
            }
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="featured-grid">
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            );
          })()}

          <div className="text-center mt-12">
            <Link to="/collections/best-sellers">
              <Button className="bg-stone-900 text-white hover:bg-amber-500 hover:text-stone-900 active:scale-[0.98] font-semibold text-xs uppercase tracking-[0.25em] px-12 py-6 rounded-none transition-all duration-300" data-testid="shop-all-bestsellers-btn">
                Shop the Full Collection <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Begin Your Journey Section */}
      <div className="py-20 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-600 mb-3">Our Promise</p>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Begin Your Journey with Shathabdhi
            </h2>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="aspect-[4/5] overflow-hidden mb-6 bg-white">
                <img
                  src="https://cdn.shopify.com/s/files/1/0657/0832/6964/files/Foxtail_Millet_1.jpg?v=1724434250"
                  alt="Certified Organic Millets"
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-[10px] text-stone-600 uppercase tracking-[0.3em] mb-3">Certified Organic</p>
              <h3 className="text-xl text-stone-900 mb-3 font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>100% Pure, 0% Chemicals</h3>
              <p className="text-sm text-stone-700 leading-relaxed font-light">
                Our millets and spices are healthier for the planet — and for the people who grow, craft and enjoy them. Over 95% certified organic.
              </p>
            </div>

            <div className="text-center">
              <div className="aspect-[4/5] overflow-hidden mb-6 bg-white">
                <img
                  src="https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_57e6957c-15a3-4ec5-b3ed-a54f30814344.webp?v=1722857652"
                  alt="Direct Trade Cold Pressed Oils"
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-[10px] text-stone-600 uppercase tracking-[0.3em] mb-3">Direct Trade</p>
              <h3 className="text-xl text-stone-900 mb-3 font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>From Farm to Family</h3>
              <p className="text-sm text-stone-700 leading-relaxed font-light">
                Ethically sourced from artisan women farmers in Telangana. Our deep relationships are the foundation of every grain, bottle and pouch.
              </p>
            </div>

            <div className="text-center">
              <div className="aspect-[4/5] overflow-hidden mb-6 bg-white">
                <img
                  src="https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_15e8b739-81fa-4831-96c8-ad3368bdbc6a.webp?v=1722854573"
                  alt="Hand-blended spices"
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-[10px] text-stone-600 uppercase tracking-[0.3em] mb-3">Beautiful Ingredients</p>
              <h3 className="text-xl text-stone-900 mb-3 font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Ayurvedic Heritage</h3>
              <p className="text-sm text-stone-700 leading-relaxed font-light">
                Inspired by ancient Ayurvedic traditions and modern culinary innovation — pure, wholesome ingredients that respect both tradition and taste.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Gallery */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-600 mb-3">Shop by Category</p>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Explore the Collection</h2>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-stone-200">
            {categories.map((cat) => {
              const slug = cat.name.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
              return (
                <Link
                  key={cat.id}
                  to={`/collections/${slug}`}
                  className="group relative aspect-square overflow-hidden bg-white"
                >
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                    <p className="text-white text-[10px] tracking-[0.25em] uppercase font-medium">{cat.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-20 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Reviews</h2>
            <p className="text-lg text-gray-600 font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>What Our Customers Are Saying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(testimonial => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow border border-gray-200 rounded-none">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={`star-${testimonial.id}-${i}`} className="w-3 h-3 fill-gray-900 text-gray-900" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">"{testimonial.text}"</p>
                  <p className="text-xs text-gray-900 font-normal">—{testimonial.name}</p>
                  <div className="pt-4 border-t border-gray-200">
                    <img
                      src={testimonial.product_image}
                      alt={testimonial.product_name}
                      className="w-16 h-16 object-cover mb-2"
                    />
                    <p className="text-xs text-gray-600">{testimonial.product_name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;