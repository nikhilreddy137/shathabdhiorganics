import React from 'react';
import { Instagram, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const INSTAGRAM_URL = 'https://www.instagram.com/shathabdhiorganics/';

// Real reels from @shathabdhiorganics (embedded live from Instagram)
const REEL_EMBEDS = [
  { code: 'DOGmQs3D29W', label: 'Manikonda store opening' },
  { code: 'DbVGf1wPp1Y', label: 'Latest from the feed' },
  { code: 'DbIuSv8BHO9', label: 'Latest from the feed' },
];

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
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_80c9abdf-211b-4e45-a7b8-bfb0ca7b4620.webp?v=1787405592',
    tag: 'Urad Dal',
    isReel: false,
  },
  {
    id: 'rice-body',
    headline: 'The Kind of Rice Your Body Appreciates.',
    subline: 'Antioxidants · Iron-rich · Unpolished.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/brown_rice_3854737e-b9e9-4d10-9d16-d41fa268e397.webp?v=1787405544',
    tag: 'Brown Rice',
    isReel: false,
  },
  {
    id: 'switch-to-millet',
    headline: 'Still Eating The Same Wheat Rotis?',
    subline: 'Switch to Pearl Millet — your gut will thank you.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/Pearl_Millet_0f35197e-b737-4e39-b9c2-5b5c3bf4fec5.webp?v=1787405584',
    tag: 'Pearl Millet',
    isReel: true,
  },
  {
    id: 'nani-secret',
    headline: "Your Nani's Summer Secret.",
    subline: 'Introducing Amla Pickle — sour, spicy, soul food.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_ac79970c-0869-49c8-8b9d-9f5734ad63c3.webp?v=1787405590',
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
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/wa_catalog_173_Waiting_for_network.jpg?v=1787772902',
    tag: 'Butterfly Pea Tea',
    isReel: true,
  },
  {
    id: 'foxtail-fresh',
    headline: 'Foxtail Millet — Fresh From The Field.',
    subline: 'Korralu, the way your grandmother bought it.',
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_1b009359-70b1-414a-891d-f8cd85f57c94.webp?v=1787405595',
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
    productImg: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/sunflower_cp_oil.jpg?v=1787778755',
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
            <h1 className="text-white text-5xl md:text-7xl font-light leading-[1.05] mb-7" style={{ fontFamily: 'Instrument Serif, serif' }}>
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

      {/* Real Instagram reels — live embeds */}
      <div className="bg-cream2/60 border-b border-cream3 py-16 md:py-20 px-4" data-testid="social-reels-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-eyebrow uppercase text-jaggery mb-3">Watch now</p>
            <h2 className="font-display text-h2 text-charcoal">Our latest reels, live from Instagram</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {REEL_EMBEDS.map((reel) => (
              <div
                key={reel.code}
                className="rounded-2xl overflow-hidden bg-white shadow-[0_20px_40px_-15px_rgba(62,42,30,0.14)]"
                data-testid={`social-reel-embed-${reel.code}`}
              >
                <iframe
                  src={`https://www.instagram.com/p/${reel.code}/embed/`}
                  title={`Shathabdhi Organics reel — ${reel.label}`}
                  className="w-full border-0"
                  style={{ height: 'min(560px, 75vh)' }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eyebrow */}
      <div className="py-14 px-4 text-center bg-white border-b border-stone-200">
        <p className="text-[11px] tracking-[0.3em] uppercase text-stone-600 mb-3">Latest Posts &amp; Reels</p>
        <h2 className="text-3xl md:text-4xl font-light text-stone-900" style={{ fontFamily: 'Instrument Serif, serif' }}>
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
          <h3 className="text-3xl font-light text-stone-900 mb-5" style={{ fontFamily: 'Instrument Serif, serif' }}>
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
