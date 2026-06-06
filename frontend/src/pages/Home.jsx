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
        productAPI.getAll({ per_page: 8 }),
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
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-none bg-white">
      <div className="relative aspect-square overflow-hidden bg-white">
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
      </div>
      <CardContent className="p-6 space-y-3">
        <div>
          <h3 className="font-normal text-lg text-gray-900 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{product.name}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{product.description}</p>
        </div>
        <p className="text-sm text-gray-600">{product.profile}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500">from</span>
          <span className="text-lg font-light text-gray-900">₹{product.base_price}</span>
        </div>
        <Button
          onClick={() => handleAddToCart(product)}
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
      <div className="relative h-[640px] md:h-[720px] bg-stone-100 overflow-hidden" data-testid="hero-carousel">
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
            <p className="text-[11px] tracking-[0.4em] uppercase text-stone-200 mb-6">Shathabdhi Organics</p>
            <h1 className="text-5xl md:text-7xl font-light mb-6 leading-[1.05]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Nourishing Bodies,<br />
              <em className="italic font-light">Transforming Lives</em>
            </h1>
            <div className="w-16 h-px bg-white/70 mb-7"></div>
            <p className="text-base md:text-lg text-stone-100 font-light leading-relaxed mb-10 max-w-xl">
              Heritage millets, hand-blended spices and cold-pressed oils — sourced directly from sustainable farms in Telangana, packed with the wisdom of our ancestors.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/collections/millets">
                <Button size="lg" className="bg-white text-stone-900 hover:bg-stone-100 font-medium text-xs px-10 py-6 rounded-none uppercase tracking-[0.25em]" data-testid="hero-shop-millets-btn">
                  Shop Millets
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="bg-transparent border border-white text-white hover:bg-white hover:text-stone-900 font-medium text-xs px-10 py-6 rounded-none uppercase tracking-[0.25em]" data-testid="hero-our-story-btn">
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
      <div className="relative bg-stone-900 text-white py-24 px-4 overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #d4a574 0%, transparent 50%), radial-gradient(circle at 80% 70%, #8b5a3c 0%, transparent 50%)'
        }}></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-start">
            {/* Left: Eyebrow + Headline */}
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[2px] w-10 bg-amber-400"></span>
                <p className="text-[11px] tracking-[0.4em] uppercase text-amber-300 font-semibold" data-testid="mission-eyebrow">
                  Women-Led · Farmer-Owned
                </p>
              </div>
              <h2 className="text-white font-bold leading-[0.95] mb-8 tracking-tight" style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif', fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', fontWeight: 700 }} data-testid="mission-headline">
                Backed by the hands<br />
                that <em className="italic text-amber-300 font-bold">feed nations.</em>
              </h2>
              <p className="text-lg md:text-xl text-stone-100 font-normal leading-relaxed max-w-xl" data-testid="mission-tagline">
                Shathabdhi is built by <strong className="text-white font-semibold">women entrepreneurs &amp; smallholder farmers</strong> in Telangana — reviving ancient millets, paying fair wages, and putting soil, dignity and tradition before profit.
              </p>
            </div>

            {/* Right: Impact Stats */}
            <div className="md:col-span-5 md:pl-8 md:border-l md:border-stone-700">
              <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                <div data-testid="stat-women-farmers">
                  <p className="text-5xl md:text-6xl text-amber-300 font-bold leading-none mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    2,400<span className="text-2xl align-top">+</span>
                  </p>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-stone-300 font-medium">Women Farmers Empowered</p>
                </div>
                <div data-testid="stat-villages">
                  <p className="text-5xl md:text-6xl text-amber-300 font-bold leading-none mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    87
                  </p>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-stone-300 font-medium">Telangana Villages</p>
                </div>
                <div data-testid="stat-acres">
                  <p className="text-5xl md:text-6xl text-amber-300 font-bold leading-none mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    11K<span className="text-2xl align-top">+</span>
                  </p>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-stone-300 font-medium">Acres of Organic Soil</p>
                </div>
                <div data-testid="stat-zero-chemicals">
                  <p className="text-5xl md:text-6xl text-amber-300 font-bold leading-none mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    0
                  </p>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-stone-300 font-medium">Chemicals. Ever.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="mt-16 pt-10 border-t border-stone-700 max-w-4xl">
            <p className="text-2xl md:text-3xl font-light italic text-stone-100 leading-snug mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }} data-testid="mission-quote">
              "When a woman owns the seed, she owns the future of her village."
            </p>
            <p className="text-xs tracking-[0.25em] uppercase text-amber-300 font-semibold">— Lakshmi Reddy, Founder &amp; Farmer</p>
          </div>
        </div>
      </div>

      {/* Featured Selections */}
      <div className="py-20 px-4 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-600 mb-3">Shop By Collection</p>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Featured Selections</h2>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-6"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {[
              { label: 'Best Sellers', path: '/collections/best-sellers' },
              { label: 'Millets', path: '/collections/millets' },
              { label: 'Spices & Powders', path: '/collections/spices-and-powders' },
              { label: 'Rices', path: '/collections/rices' },
              { label: 'Oils', path: '/collections/oils' },
              { label: 'Cookies', path: '/collections/cookies' },
            ].map((c) => (
              <Link
                key={c.label}
                to={c.path}
                className="rounded-full border border-stone-300 px-6 py-2 text-[11px] uppercase tracking-[0.2em] text-stone-800 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
              >
                {c.label}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/collections/best-sellers">
              <Button className="bg-stone-900 text-white hover:bg-black font-medium text-xs uppercase tracking-[0.25em] px-12 py-6 rounded-none">
                Shop All Best Sellers <ArrowRight className="w-3 h-3 ml-2" />
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