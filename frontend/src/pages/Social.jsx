import React from 'react';
import { Instagram, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const INSTAGRAM_URL = 'https://www.instagram.com/shathabdhiorganics/';

/**
 * Instagram-style social feed page.
 * Renders a grid that mirrors the brand's actual @shathabdhiorganics
 * reel/post catalogue. Each tile opens Instagram in a new tab.
 */
const reels = [
  {
    id: 'less-processed',
    headline: 'Less Processed. More Wholesome.',
    subline: 'Because real nutrition does not need polishing.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_f057302b-5749-4adb-97f5-1657a67c6615.webp?v=1722854411',
    tag: 'Urad Dal',
    isReel: false,
  },
  {
    id: 'rice-body',
    headline: 'The Kind of Rice Your Body Appreciates.',
    subline: 'Antioxidants · Iron-rich · Unpolished.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/brown_rice.webp?v=1723008830',
    tag: 'Brown Rice',
    isReel: false,
  },
  {
    id: 'switch-to-millet',
    headline: 'Still Eating The Same Wheat Rotis?',
    subline: 'Switch to Pearl Millet — your gut will thank you.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/Pearl_Millet.webp?v=1723008749',
    tag: 'Pearl Millet',
    isReel: true,
  },
  {
    id: 'nani-secret',
    headline: "Your Nani's Summer Secret.",
    subline: 'Introducing Amla Pickle — sour, spicy, soul food.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_15e8b739-81fa-4831-96c8-ad3368bdbc6a.webp?v=1722854573',
    tag: 'Amla Pickle',
    isReel: false,
  },
  {
    id: 'farm-life',
    headline: 'From Our Farms in Telangana',
    subline: 'Where every sunrise begins with healthy soil.',
    productImg: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80',
    tag: 'Farm Diaries',
    isReel: true,
  },
  {
    id: 'morning-coffee',
    headline: 'Your Morning Coffee Called…',
    subline: "It's getting replaced — meet Millet Mix.",
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_8c643f4b-fff8-4d71-afce-f9e60f6fa0b3.webp?v=1722859357',
    tag: 'Millet Mix',
    isReel: false,
  },
  {
    id: 'protein-pickle',
    headline: 'Pickle With Protein.',
    subline: 'Introducing the new Chicken Pickle.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/jeera.jpg?v=1724433004',
    tag: 'Chicken Pickle',
    isReel: false,
  },
  {
    id: 'blue-tea',
    headline: 'Sip Caffeine Free Blue Tea.',
    subline: 'Butterfly Pea Flower — soften stress, strengthen calm.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_444cecaa-12a9-48bb-8701-0c29af4072de.png?v=1722854051',
    tag: 'Butterfly Pea Tea',
    isReel: true,
  },
  {
    id: 'foxtail-fresh',
    headline: 'Foxtail Millet — Fresh From The Field.',
    subline: 'Korralu, the way your grandmother bought it.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/Foxtail_Millet_1.jpg?v=1724434250',
    tag: 'Foxtail Millet',
    isReel: false,
  },
  {
    id: 'cookies-love',
    headline: 'Cookies, Reinvented.',
    subline: 'Jowar baked goodness — no maida, no compromise.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/Jowar-Millet-Cookies-768x768.webp?v=1721349636',
    tag: 'Jowar Cookies',
    isReel: true,
  },
  {
    id: 'cold-pressed',
    headline: 'Cold-Pressed. Wood-Pressed. Honest.',
    subline: 'The way oils were always meant to be.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_57e6957c-15a3-4ec5-b3ed-a54f30814344.webp?v=1722857652',
    tag: 'Sunflower Oil',
    isReel: false,
  },
  {
    id: 'choco-chip',
    headline: 'Healthy Just Got Indulgent.',
    subline: 'Jowar Choco Chip — guilt-free chocolate bliss.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/Jowar-Millet-Choco-Chip-768x768.webp?v=1721350116',
    tag: 'Choco Chip Cookies',
    isReel: true,
  },
];

const Social = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="social-page">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[460px] bg-stone-100 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=2000&q=80"
          alt="Shathabdhi Organics farm"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/70"></div>
        <div className="relative h-full flex items-center justify-center px-4">
          <div className="text-center text-white max-w-3xl">
            <p className="text-[11px] tracking-[0.4em] uppercase text-stone-200 mb-6">@shathabdhiorganics</p>
            <h1 className="text-white text-5xl md:text-7xl font-light leading-[1.05] mb-7" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Follow Our Journey on <em className="italic">Instagram</em>
            </h1>
            <div className="w-14 h-px bg-white/70 mx-auto mb-7"></div>
            <p className="text-base md:text-lg text-stone-100 font-light leading-relaxed max-w-2xl mx-auto mb-10">
              Reels from the fields. Stories from the kitchen. Honest food, real farmers and ancient grains —
              all the moments that shape Shathabdhi.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="social-hero-follow-btn"
              className="inline-flex items-center gap-3 bg-white text-stone-900 hover:bg-stone-100 font-medium text-xs tracking-[0.25em] uppercase px-10 py-5 transition-all"
            >
              <Instagram className="w-4 h-4" /> Follow @shathabdhiorganics
            </a>
          </div>
        </div>
      </div>

      {/* Eyebrow */}
      <div className="py-14 px-4 text-center bg-white border-b border-stone-200">
        <p className="text-[11px] tracking-[0.3em] uppercase text-stone-600 mb-3">Latest Posts &amp; Reels</p>
        <h2 className="text-3xl md:text-4xl font-light text-stone-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Straight from our Instagram
        </h2>
        <div className="w-12 h-px bg-stone-400 mx-auto mt-6"></div>
      </div>

      {/* Reels Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {reels.map((reel) => (
            <a
              key={reel.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`social-tile-${reel.id}`}
              className="group relative aspect-[9/16] overflow-hidden bg-stone-100 block"
            >
              <img
                src={reel.productImg}
                alt={reel.tag}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Tinted overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/80"></div>

              {/* Top — reel icon */}
              {reel.isReel && (
                <div className="absolute top-3 right-3 bg-white/95 rounded-sm p-1.5">
                  <Play className="w-3.5 h-3.5 text-stone-900" fill="currentColor" />
                </div>
              )}

              {/* Headline overlay (Instagram-style) */}
              <div className="absolute top-5 left-5 right-5">
                <p className="text-white text-sm md:text-base font-bold uppercase leading-tight drop-shadow-lg">
                  {reel.headline}
                </p>
                <p className="text-white/90 text-[11px] md:text-xs mt-1.5 drop-shadow-lg leading-snug">
                  {reel.subline}
                </p>
              </div>

              {/* Bottom — product tag */}
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-stone-200 mb-1">Featured</p>
                <p className="text-white font-serif text-lg leading-tight">{reel.tag}</p>
              </div>

              {/* Hover play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-stone-900/30 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-stone-900" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="social-footer-follow-btn"
            className="inline-flex items-center gap-3 bg-stone-900 text-white hover:bg-black font-medium text-xs tracking-[0.25em] uppercase px-10 py-5 transition-all"
          >
            <Instagram className="w-4 h-4" /> Watch All Reels on Instagram
            <ArrowRight className="w-3 h-3" />
          </a>
          <p className="text-xs text-stone-600 mt-5 tracking-wider">
            @shathabdhiorganics · Telangana, India
          </p>
        </div>
      </div>

      {/* Bottom Stripe */}
      <div className="bg-stone-50 py-16 px-4 border-t border-stone-200">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-light text-stone-900 mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Tag us in your stories
          </h3>
          <p className="text-stone-700 font-light leading-relaxed mb-8">
            Share your Shathabdhi moments — meals, recipes, mornings made wholesome — with{' '}
            <span className="font-medium">#ShathabdhiOrganics</span> and get featured on our page.
          </p>
          <Link
            to="/collections/best-sellers"
            className="inline-block text-xs tracking-[0.25em] uppercase text-stone-900 border-b border-stone-900 pb-1 hover:opacity-70 transition-opacity"
          >
            Shop the products you see →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Social;
