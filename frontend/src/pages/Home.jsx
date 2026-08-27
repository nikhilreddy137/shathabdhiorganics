import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { productAPI, categoryAPI, testimonialAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { toast, Toaster } from '../components/ui/sonner';
import { logger } from '../utils/logger';
import { Img } from '../components/Img';
import { ProductCard, SkeletonCard } from '../components/catalog/ProductCard';
import { QuickAddSheet } from '../components/catalog/QuickAddSheet';
import { slugify } from '../components/catalog/CategoryRail';
import { Reveal, SplitLines, Marquee } from '../components/motion/Primitives';
import { TestimonialStage } from '../components/TestimonialStage';

const MARQUEE_ITEMS = [
  'Heritage millets',
  'Cold-pressed oils',
  'Hand-pounded spices',
  'Raw forest honey',
  'Bilona ghee',
  'Unpolished dals',
  'Sun-cured pickles',
];

const CHAPTERS = [
  {
    num: '01',
    title: 'Living soil',
    body: 'No synthetic pesticides, herbicides or GMO seeds — ever. Our fields in Telangana are farmed the way they were a century ago: compost, crop rotation and patience. What touches your plate touches your DNA.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80',
    alt: 'Lush green millet crop growing in chemical-free living soil',
    eyebrow: 'Certified organic',
  },
  {
    num: '02',
    title: 'Heirloom seed',
    body: 'Siridhanya millets and heritage grains carry up to 60% more iron, zinc and magnesium than industrial crops. Naturally gluten-free, low on the glycemic index and rich in fibre — grains your grandmother would recognise.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80',
    alt: 'Close-up of unpolished heritage grains',
    eyebrow: 'Up to 60% more nutrients',
  },
  {
    num: '03',
    title: 'Her hands',
    body: 'Every kilo is grown, sorted and hand-packed by a collective of 2,400+ women farmers — and pays them directly. No middlemen, no cold storage, no shortcuts between her field and your kitchen.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80',
    alt: 'A farmer\'s hands cradling ripened grain in the field',
    eyebrow: '2,400+ women farmers',
  },
];

const FEATURED_CHIPS = ['All', 'Millets', 'Spices & Powders', 'Rices', 'Oils', 'Cookies', 'Snacks & Bars', 'Health Drinks'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChip, setActiveChip] = useState('All');
  const [quickAdd, setQuickAdd] = useState({ product: null, variant: null, open: false });

  const { addToCart } = useCart();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData, testimonialsData] = await Promise.all([
          productAPI.getAll({ per_page: 200 }),
          categoryAPI.getAll(),
          testimonialAPI.getAll({ is_featured: true, limit: 4 }),
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
    })();
  }, []);

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

  const featured = useMemo(() => {
    const matching = activeChip === 'All' ? products : products.filter((p) => p.category === activeChip);
    return matching.slice(0, 8);
  }, [products, activeChip]);

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />

      {/* ---------- Kinetic hero ---------- */}
      <section ref={heroRef} className="relative min-h-[92svh] bg-stone-900 overflow-hidden flex items-end" data-testid="hero-carousel">
        <motion.div style={{ y: videoY }} className="absolute inset-0 will-change-transform">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover hero-zoom"
            data-testid="hero-video"
          >
            <source src="https://assets.mixkit.co/videos/48769/48769-720.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(18,13,8,0.94) 0%, rgba(24,16,8,0.45) 45%, rgba(30,20,8,0.25) 100%), radial-gradient(ellipse at 70% 30%, rgba(251,191,36,0.10) 0%, transparent 55%)',
          }}
        ></div>
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 220px 60px rgba(10,7,4,0.55)' }}></div>
        <div className="absolute inset-0 grain opacity-[0.08] mix-blend-overlay pointer-events-none"></div>

        <motion.div style={{ opacity: contentOpacity }} className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-14 md:pb-20 pt-40">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-eyebrow uppercase text-amber-300 mb-5 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-amber-400 inline-block"></span>
            Direct from the farmer · Telangana
          </motion.p>

          <h1 className="font-display text-white mb-6" style={{ fontSize: 'clamp(3rem, 1.5rem + 7vw, 7rem)', lineHeight: 1.02, letterSpacing: '-0.02em' }} data-testid="hero-title">
            <SplitLines
              lines={['A century of soil,']}
              delay={0.2}
            />
            <span className="block overflow-hidden">
              <motion.span
                className="block italic text-amber-300"
                initial={{ y: '112%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.33, ease: [0.22, 1, 0.36, 1] }}
              >
                in every grain
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
          >
            <p className="text-body-lg text-stone-200 font-light measure max-w-xl">
              Shathabdhi means a hundred years — the way our grain was always grown. Heritage millets, hand-pounded spices and cold-pressed oils from 2,400+ women farmers in Telangana. Zero chemicals, ever.
            </p>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                to="/collections/millets"
                data-testid="hero-shop-millets-btn"
                className="group inline-flex items-center justify-center gap-3 min-h-[52px] bg-amber-400 text-stone-900 hover:bg-amber-300 hover:-translate-y-0.5 active:scale-[0.98] font-medium text-xs tracking-[0.06em] uppercase px-9 transition-all duration-300"
              >
                Shop millets
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                data-testid="hero-our-story-btn"
                className="inline-flex items-center justify-center min-h-[52px] border border-white/60 text-white hover:bg-white hover:text-stone-900 hover:-translate-y-0.5 active:scale-[0.98] font-medium text-xs tracking-[0.06em] uppercase px-9 backdrop-blur-sm transition-all duration-300"
              >
                Our story
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------- Editorial marquee ---------- */}
      <div className="bg-white border-b border-stone-200 py-6 md:py-8 text-stone-900" data-testid="editorial-marquee">
        <Marquee items={MARQUEE_ITEMS} />
      </div>

      {/* ---------- Featured selections ---------- */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-10">
            <p className="text-eyebrow uppercase text-amber-700 mb-3">Shop the whole pantry</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="font-display text-h1 text-stone-900">Featured selections</h2>
              <Link
                to="/collections/best-sellers"
                data-testid="shop-all-bestsellers-btn"
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.06em] text-stone-900 hover:text-amber-800 hover:gap-3.5 transition-all min-h-[44px]"
              >
                Shop the full collection
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>

          <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap" data-testid="featured-category-chips">
            {FEATURED_CHIPS.map((c) => {
              const isActive = activeChip === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveChip(c)}
                  data-testid={`featured-chip-${c.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`}
                  className={`flex-shrink-0 min-h-[44px] rounded-full border px-5 text-sm transition-all duration-300
                    ${isActive
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900 hover:text-stone-900'}`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-16 text-stone-500" data-testid="featured-empty">
              No products in this collection yet — try another filter.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-6" data-testid="featured-grid">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddSingle={handleAddSingle}
                  onQuickAdd={(p, variant) => setQuickAdd({ product: p, variant: variant || null, open: true })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Numbered manifesto chapters ---------- */}
      <section className="bg-stone-900 text-white py-20 md:py-32 px-4" data-testid="manifesto-section">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 md:mb-24">
            <p className="text-eyebrow uppercase text-amber-300 mb-3">Why we exist</p>
            <h2 className="font-display text-h1 text-white max-w-3xl">
              Modern food is engineered for shelf-life. <em className="italic text-amber-300">Ours is grown for life.</em>
            </h2>
          </Reveal>

          <div className="space-y-20 md:space-y-28">
            {CHAPTERS.map((ch, i) => (
              <div
                key={ch.num}
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${i % 2 === 1 ? '' : ''}`}
                data-testid={`manifesto-chapter-${ch.num}`}
              >
                <Reveal className={`md:col-span-5 ${i % 2 === 1 ? 'md:order-2 md:col-start-8' : ''}`}>
                  <Img
                    src={ch.image}
                    alt={ch.alt}
                    ratio="3/2"
                    sizes="(min-width: 768px) 42vw, 100vw"
                    className="w-full"
                  />
                </Reveal>
                <Reveal delay={0.12} className={`md:col-span-6 ${i % 2 === 1 ? 'md:order-1 md:col-start-1' : 'md:col-start-7'}`}>
                  <p className="font-display italic text-hero text-stone-700 leading-none select-none" aria-hidden="true">{ch.num}</p>
                  <p className="text-eyebrow uppercase text-amber-300 mt-4 mb-2">{ch.eyebrow}</p>
                  <h3 className="font-display text-h2 text-white mb-4">{ch.title}</h3>
                  <p className="text-body text-stone-300 font-light measure">{ch.body}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Category gallery ---------- */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-10">
            <p className="text-eyebrow uppercase text-stone-500 mb-3">Shop by category</p>
            <h2 className="font-display text-h1 text-stone-900">Explore the collection</h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-stone-200" data-testid="category-gallery">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/collections/${slugify(cat.name)}`}
                className="group relative bg-white overflow-hidden"
                data-testid={`category-tile-${slugify(cat.name)}`}
              >
                <Img
                  src={cat.image}
                  alt={`${cat.name} — organic ${cat.name.toLowerCase()} from Shathabdhi farms`}
                  ratio="3/4"
                  sizes="(min-width: 1024px) 17vw, (min-width: 768px) 33vw, 50vw"
                  imgClassName="group-hover:scale-[1.05] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/10 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium leading-tight">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Reviews ---------- */}
      {testimonials.length > 0 && <TestimonialStage testimonials={testimonials} />}

      <QuickAddSheet
        product={quickAdd.product}
        initialVariant={quickAdd.variant}
        open={quickAdd.open}
        onClose={() => setQuickAdd((q) => ({ ...q, open: false }))}
        onAdd={handleQuickAddSheet}
      />
    </div>
  );
};

export default Home;
