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
import { HealthJournal } from '../components/HealthJournal';
import { StoreVisit } from '../components/StoreVisit';
import { Seo } from '../components/Seo';

const HERO_VIDEOS = [
  // First video stays the current one, per request.
  'https://assets.mixkit.co/videos/48769/48769-720.mp4', // hands cradling heritage grain
  'https://assets.mixkit.co/videos/2122/2122-1080.mp4', // crop fields at sunrise (Full HD)
  'https://assets.mixkit.co/videos/520/520-1080.mp4', // sunlight through tall forest trees (Full HD)
];

const MARQUEE_ITEMS = [  'Heritage millets',
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
    image: 'https://images.unsplash.com/photo-1599320092708-8a9dde49fc2c?auto=format&fit=crop&q=80',
    alt: 'A farmer\'s hands holding rich chemical-free living soil',
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

// Lead the curated grid with the most iconic categories first.
const CATEGORY_PRIORITY = [
  'Millets', 'Oils', 'Ghee', 'Honey', 'Cookies', 'Snacks & Bars',
  'Rices', 'Spices & Powders', 'Sweets & Treats', 'Health Drinks',
];

// Only surface products shot with real branded studio photography — the generic
// WhatsApp catalog snapshots (wa_catalog_*, many are "Waiting_for_image") look
// off-brand and are hidden from the home page to keep an iconic, premium feel.
const hasStudioPhoto = (p) => {
  const img = (p.image || '').toLowerCase();
  if (!img) return false;
  if (img.includes('wa_catalog')) return false;
  if (img.includes('waiting_for')) return false;
  return true;
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChip, setActiveChip] = useState('All');
  const [activeVideo, setActiveVideo] = useState(0);
  const [quickAdd, setQuickAdd] = useState({ product: null, variant: null, open: false });

  const { addToCart } = useCart();

  useEffect(() => {
    const id = setInterval(() => {
      setActiveVideo((i) => (i + 1) % HERO_VIDEOS.length);
    }, 6500);
    return () => clearInterval(id);
  }, []);

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
    const studio = products.filter(hasStudioPhoto);

    if (activeChip !== 'All') {
      return studio.filter((p) => p.category === activeChip).slice(0, 8);
    }

    // Curate an iconic, diverse set: round-robin one standout per category,
    // leading with the hero categories, until we have 8.
    const byCat = {};
    studio.forEach((p) => {
      (byCat[p.category] = byCat[p.category] || []).push(p);
    });
    const cats = Object.keys(byCat).sort((a, b) => {
      const ai = CATEGORY_PRIORITY.indexOf(a);
      const bi = CATEGORY_PRIORITY.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    const picked = [];
    let idx = 0;
    while (picked.length < 8 && cats.some((c) => byCat[c].length)) {
      const c = cats[idx % cats.length];
      if (byCat[c].length) picked.push(byCat[c].shift());
      idx++;
    }
    return picked;
  }, [products, activeChip]);

  return (
    <div className="min-h-screen bg-cream">
      <Seo
        title="Shathabdhi Organics — Organic Millets, Cold-Pressed Oils & Spices from Telangana"
        description="Unpolished siridhanya millets, wood-churned cold-pressed oils and hand-pounded spices grown chemical-free by 2,400+ women farmers in Telangana. Low-GI staples for steady blood sugar."
        keywords={['organic millets India', 'siridhanya millets', 'millets for diabetes', 'cold pressed oils', 'organic food Telangana']}
        path="/"
      />
      <Toaster position="top-right" />

      {/* ---------- Kinetic hero ---------- */}
      <section ref={heroRef} className="relative min-h-[92svh] bg-charcoal overflow-hidden flex items-end" data-testid="hero-carousel">
        <motion.div style={{ y: videoY }} className="absolute inset-0 will-change-transform">
          {HERO_VIDEOS.map((src, i) => (
            <video
              key={src}
              autoPlay
              muted
              loop
              playsInline
              preload={i === 0 ? 'auto' : 'metadata'}
              poster="/hero-poster.jpg"
              className={`absolute inset-0 w-full h-full object-cover hero-zoom transition-opacity duration-[1200ms] ease-in-out ${i === activeVideo ? 'opacity-100' : 'opacity-0'}`}
              data-testid={i === 0 ? 'hero-video' : `hero-video-${i}`}
            >
              <source src={src} type="video/mp4" />
            </video>
          ))}
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

        <div className="absolute z-20 top-24 right-4 md:top-28 md:right-8 flex items-center gap-2" data-testid="hero-video-dots">
          {HERO_VIDEOS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveVideo(i)}
              aria-label={`Show hero video ${i + 1}`}
              data-testid={`hero-video-dot-${i}`}
              className={`h-1.5 rounded-full transition-all duration-500 hover:bg-gold ${i === activeVideo ? 'w-9 bg-gold' : 'w-3.5 bg-white/45'}`}
            />
          ))}
        </div>

        <motion.div style={{ opacity: contentOpacity }} className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-14 md:pb-20 pt-40">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-eyebrow uppercase text-gold mb-5 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gold inline-block"></span>
            Direct from the farmer · Telangana
          </motion.p>

          <h1 className="font-display text-white mb-6" style={{ fontSize: 'clamp(3rem, 1.5rem + 7vw, 7rem)', lineHeight: 1.02, letterSpacing: '-0.02em' }} data-testid="hero-title">
            <SplitLines
              lines={['A century of soil,']}
              delay={0.2}
            />
            <span className="block overflow-hidden">
              <motion.span
                className="block italic text-gold"
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
            <p className="text-body-lg text-cream/85 font-light measure max-w-xl">
              Shathabdhi means a hundred years — the way our grain was always grown. Heritage millets, hand-pounded spices and cold-pressed oils from 2,400+ women farmers in Telangana. Zero chemicals, ever.
            </p>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                to="/collections/millets"
                data-testid="hero-shop-millets-btn"
                className="group inline-flex items-center justify-center gap-3 min-h-[52px] rounded-full bg-gold text-charcoal hover:bg-[#d4ad57] hover:-translate-y-0.5 active:scale-[0.98] font-semibold text-xs tracking-[0.06em] uppercase px-9 transition-all duration-300"
              >
                Shop millets
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                data-testid="hero-our-story-btn"
                className="inline-flex items-center justify-center min-h-[52px] rounded-full border border-white/60 text-white hover:bg-cream hover:text-charcoal hover:-translate-y-0.5 active:scale-[0.98] font-medium text-xs tracking-[0.06em] uppercase px-9 backdrop-blur-sm transition-all duration-300"
              >
                Our story
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------- Editorial marquee ---------- */}
      <div className="bg-leaf text-cream py-6 md:py-8" data-testid="editorial-marquee">
        <Marquee items={MARQUEE_ITEMS} />
      </div>

      {/* ---------- Trust stats strip ---------- */}
      <section className="bg-cream border-b border-cream3 px-4 py-12 md:py-16" data-testid="trust-stats-strip">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {[
            { value: '20,000+', label: 'Families served', sub: 'across India, and counting' },
            { value: '700+', label: 'Retail stores', sub: 'stock our staples B2B' },
            { value: '2,400+', label: 'Women farmers', sub: 'growing chemical-free in Telangana' },
            { value: 'Manikonda', label: 'Flagship store', sub: 'visit us in Hyderabad' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className={`text-center ${i > 0 ? 'lg:border-l lg:border-cream3' : ''}`}>
              <p className="font-display italic text-soil leading-none" style={{ fontSize: 'clamp(2rem, 1.4rem + 2.6vw, 3.5rem)' }} data-testid={`trust-stat-${i}`}>
                {s.value}
              </p>
              <p className="text-eyebrow uppercase text-jaggery mt-3">{s.label}</p>
              <p className="text-sm text-ink mt-1">{s.sub}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Featured selections ---------- */}
      <section className="py-16 md:py-24 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-10">
            <p className="text-eyebrow uppercase text-jaggery mb-3">Shop the whole pantry</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="font-display text-h1 text-charcoal">Featured selections</h2>
              <Link
                to={activeChip !== 'All' ? `/collections/${slugify(activeChip)}` : '/collections/best-sellers'}
                data-testid="shop-all-bestsellers-btn"
                className="inline-flex items-center justify-center gap-2.5 min-h-[50px] rounded-full bg-soil text-cream hover:bg-jaggery hover:gap-4 active:scale-[0.98] font-bold text-xs tracking-[0.08em] uppercase px-8 transition-all duration-300 self-start"
              >
                Shop the full collection
                <ArrowRight className="w-4 h-4" />
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
                      ? 'bg-soil text-cream border-soil'
                      : 'bg-white text-ink border-cream3 hover:border-soil hover:text-charcoal'}`}
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

      {/* ---------- Health Journal ---------- */}
      <HealthJournal compact />

      {/* ---------- Numbered manifesto chapters ---------- */}
      <section className="bg-charcoal text-cream py-20 md:py-32 px-4" data-testid="manifesto-section">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 md:mb-24">
            <p className="text-eyebrow uppercase text-gold mb-3">Why we exist</p>
            <h2 className="font-display text-h1 text-cream max-w-3xl">
              Modern food is engineered for shelf-life. <em className="italic text-gold">Ours is grown for life.</em>
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
                    className="w-full rounded-2xl overflow-hidden"
                  />
                </Reveal>
                <Reveal delay={0.12} className={`md:col-span-6 ${i % 2 === 1 ? 'md:order-1 md:col-start-1' : 'md:col-start-7'}`}>
                  <p className="font-display italic text-hero text-[#4a443c] leading-none select-none" aria-hidden="true">{ch.num}</p>
                  <p className="text-eyebrow uppercase text-gold mt-4 mb-2">{ch.eyebrow}</p>
                  <h3 className="font-display text-h2 text-cream mb-4">{ch.title}</h3>
                  <p className="text-body text-cream/65 font-light measure">{ch.body}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Category gallery ---------- */}
      <section className="py-16 md:py-24 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-10">
            <p className="text-eyebrow uppercase text-ink mb-3">Shop by category</p>
            <h2 className="font-display text-h1 text-charcoal">Explore the collection</h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4" data-testid="category-gallery">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/collections/${slugify(cat.name)}`}
                className="group relative bg-white rounded-2xl overflow-hidden"
                data-testid={`category-tile-${slugify(cat.name)}`}
              >
                <Img
                  src={cat.image}
                  alt={`${cat.name} — organic ${cat.name.toLowerCase()} from Shathabdhi farms`}
                  ratio="3/4"
                  sizes="(min-width: 1024px) 17vw, (min-width: 768px) 33vw, 50vw"
                  imgClassName="group-hover:scale-[1.05] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent pointer-events-none"></div>
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

      {/* ---------- Manikonda store ---------- */}
      <StoreVisit />

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
