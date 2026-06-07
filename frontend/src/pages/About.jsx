import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sprout, Hand, Leaf, Heart, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="about-page">
      {/* ============ EDITORIAL HERO ============ */}
      <div className="relative h-[72vh] min-h-[520px] md:min-h-[640px] bg-stone-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80"
          alt="Heritage millet fields at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(28,25,23,0.92) 0%, rgba(28,25,23,0.75) 45%, rgba(28,25,23,0.45) 100%)',
          }}
        ></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="max-w-3xl text-white">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[2px] w-10 bg-amber-400"></span>
              <p className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-amber-300 font-semibold" data-testid="about-eyebrow">
                Est. 2012 · Telangana, India
              </p>
            </div>
            <h1
              className="text-white font-bold leading-[0.95] mb-7 md:mb-8"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
              data-testid="about-headline"
            >
              A century of grain.<br />
              A revolution<br />
              <em className="italic text-amber-300">of women.</em>
            </h1>
            <div className="w-16 h-px bg-amber-400 mb-6 md:mb-7"></div>
            <p className="text-base md:text-xl text-stone-100 leading-relaxed font-light max-w-2xl">
              Shathabdhi means <em>{"\u201Ca hundred years.\u201D"}</em> It is a quiet promise — that what our grandmothers grew, ground and served us with reverence will not vanish in our generation. We are the women who refused to let it.
            </p>
          </div>
        </div>
      </div>

      {/* ============ STATS STRIP ============ */}
      <div className="bg-stone-900 text-white border-t border-stone-800" data-testid="about-stats">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 text-center md:text-left">
          {[
            { num: '14', label: 'Years In Service' },
            { num: '2,400+', label: 'Women Farmers' },
            { num: '87', label: 'Villages' },
            { num: '11K+', label: 'Organic Acres' },
          ].map((s) => (
            <div key={s.label} className="md:border-l md:first:border-l-0 md:border-stone-700 md:pl-6">
              <p className="text-4xl sm:text-5xl md:text-6xl text-amber-300 font-bold leading-none mb-3" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                {s.num}
              </p>
              <p className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-stone-300 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ OPENING MANIFESTO ============ */}
      <div className="py-20 md:py-28 px-4 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-700 mb-6 font-semibold">Our Manifesto</p>
          <p
            className="text-2xl sm:text-3xl md:text-4xl font-light text-stone-900 italic leading-snug mb-8"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
            data-testid="about-manifesto"
          >
            {"\u201CWe did not start a brand. We started a quiet rebellion \u2014 against forgotten grains, against poisoned soil, against the idea that women belong indoors. "}<span className="not-italic font-medium text-amber-700">Every packet is a small act of remembering.</span>{"\u201D"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-10 bg-amber-400"></span>
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-600 font-semibold">Sri Bhanu · Founder</p>
            <span className="h-[1px] w-10 bg-amber-400"></span>
          </div>
        </div>
      </div>

      {/* ============ FOUNDER STORY — 2 column ============ */}
      <div className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <div className="relative" data-testid="founder-portrait">
                <img
                  src="https://customer-assets.emergentagent.com/job_ancient-grains-shop/artifacts/atpfm9c4_Screenshot%202026-06-05%20at%2018.44.27.png"
                  alt="Sri Bhanu — Founder"
                  className="w-full h-auto shadow-2xl shadow-stone-900/20"
                />
                <div className="absolute -bottom-5 -right-5 bg-amber-400 text-stone-900 py-3 px-5 shadow-lg hidden sm:block">
                  <p className="text-[10px] tracking-[0.3em] uppercase font-bold">Founder</p>
                  <p className="text-lg font-serif">Sri Bhanu</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="text-[11px] tracking-[0.4em] uppercase text-amber-700 mb-4 font-semibold">The Beginning</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-stone-900 mb-8 leading-[1.05]">
                When health<br />
                became a <em className="italic text-amber-700">mission.</em>
              </h2>
              <div className="w-12 h-px bg-amber-400 mb-8"></div>

              <div className="space-y-6 text-stone-700 text-base md:text-lg leading-relaxed font-light">
                <p>
                  Growing up in rural Telangana, I watched two worlds collide. The ancient grains my grandmother cherished — millets that had sustained generations — were being abandoned. Meanwhile, diabetes, obesity and lifestyle diseases were spreading like wildfire through our villages.
                </p>
                <p>
                  Then my mother was diagnosed. The doctor handed her a diet chart full of imported quinoa and oats. I looked at her and thought, <em className="text-stone-900">{"\u201CWe have better. We have millets. Why are we looking elsewhere?\u201D"}</em>
                </p>
                <p>
                  That single thought changed everything.
                </p>
                <p>
                  I started walking from village to village, sitting cross-legged with women farmers who knew the soil better than any agronomist. They had the knowledge. They had the seeds. What they did not have was a market — or a voice.
                </p>

                <blockquote className="text-xl md:text-2xl italic text-stone-900 border-l-4 border-amber-400 pl-6 my-10 leading-snug" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  {"\u201CWhat if I could bring back the foods that healed us for centuries \u2014 and pay the women who grow them with the dignity they deserve?\u201D"}
                </blockquote>

                <p>
                  Today, that question is an answer. <strong className="text-stone-900 font-semibold">2,400 women across 87 villages</strong> grow, harvest, mill, blend and pack everything you find on this site. Every kilo is a quiet revolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ VALUES / PROMISE GRID ============ */}
      <div className="py-20 md:py-28 px-4 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-amber-700 mb-5 font-semibold">What We Stand For</p>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-5 leading-[1.05]">
              Five non-negotiables.<br />
              <em className="italic text-amber-700">Forever.</em>
            </h2>
            <div className="w-12 h-px bg-amber-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5" data-testid="about-values">
            {[
              { icon: Sprout, title: 'Zero Chemicals', body: 'No synthetic pesticide, herbicide, fungicide or GMO seed has ever touched our soil. Audited annually.' },
              { icon: Hand, title: 'Fair Wages', body: 'Every woman farmer is paid 30–40% above MSP, directly to her own account. No middlemen.' },
              { icon: Leaf, title: 'Live Soil', body: 'Crop rotation, vermicompost and indigenous seeds. We measure our health by the worms underground.' },
              { icon: Shield, title: 'Hand-Inspected', body: 'Every grain, oil and spice is hand-cleaned and stone-milled in small batches. Never bulk processed.' },
              { icon: Heart, title: 'Honest Labels', body: 'What is on the front is exactly what is inside. No hidden additives, preservatives or so-called natural flavours.' },
            ].map((v) => (
              <div
                key={v.title}
                className="group bg-white border border-stone-200 p-6 md:p-7 hover:border-amber-400 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                data-testid={`value-${v.title.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div className="w-11 h-11 bg-stone-900 group-hover:bg-amber-500 rounded-full flex items-center justify-center mb-5 transition-colors duration-300">
                  <v.icon className="w-4 h-4 text-white group-hover:text-stone-900 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-stone-900 mb-3 leading-snug">{v.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ WHY MILLETS — Editorial split ============ */}
      <div className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-amber-700 mb-5 font-semibold">Why Millets, Why Now</p>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-[1.05]">
              Nature already<br />
              <em className="italic text-amber-700">solved this.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="group overflow-hidden bg-stone-100" data-testid="why-mother">
              <div className="relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1710149468014-3d0eb40caaeb?auto=format&fit=crop&w=1200&q=80"
                  alt="Hands holding millet"
                  className="w-full h-[420px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-7 md:p-9 bg-white">
                <p className="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-3 font-semibold">A Mother&apos;s Choice</p>
                <h3 className="text-2xl md:text-3xl font-serif text-stone-900 mb-4 leading-tight">
                  Every meal is a vote for tomorrow.
                </h3>
                <p className="text-stone-700 leading-relaxed font-light text-sm md:text-base">
                  Millets help stabilise blood sugar, strengthen bones, regulate hormones and feed your gut without the spikes refined grains cause. The same food that kept our great-grandmothers strong is exactly what your children need now.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden bg-stone-100" data-testid="why-nature">
              <div className="relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/16977456/pexels-photo-16977456.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Pearl millet field"
                  className="w-full h-[420px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-7 md:p-9 bg-white">
                <p className="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-3 font-semibold">Nature&apos;s Perfect Food</p>
                <h3 className="text-2xl md:text-3xl font-serif text-stone-900 mb-4 leading-tight">
                  Low GI. High fibre. Gluten-free. Climate-resilient.
                </h3>
                <p className="text-stone-700 leading-relaxed font-light text-sm md:text-base">
                  Millets grow on a fraction of the water rice and wheat demand. They thrive in drought. They restore soil. They were the answer 5,000 years ago — and they are still the answer when the planet is asking us to choose more carefully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ WOMEN SUPPORTING WOMEN ============ */}
      <div className="relative py-20 md:py-28 px-4 bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 25% 30%, #d4a574 0%, transparent 55%), radial-gradient(circle at 75% 70%, #8b5a3c 0%, transparent 55%)'
        }}></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <img
                src="https://images.pexels.com/photos/20327922/pexels-photo-20327922.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=940"
                alt="Women farmers at work"
                className="w-full h-[440px] md:h-[600px] object-cover shadow-2xl shadow-black/40"
              />
            </div>
            <div className="lg:col-span-6">
              <p className="text-[11px] tracking-[0.4em] uppercase text-amber-300 mb-5 font-semibold">Women Lifting Women</p>
              <h2 className="text-white font-serif font-bold leading-[1] mb-7" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)' }}>
                When she plants, an entire <em className="italic text-amber-300">village rises.</em>
              </h2>
              <div className="w-12 h-px bg-amber-400 mb-7"></div>
              <div className="space-y-5 text-stone-100 text-base md:text-lg leading-relaxed font-light">
                <p>
                  Seventy percent of our supply chain is powered by women. Women who plant. Women who harvest. Women who mill, blend, weigh, and package. <strong className="text-white font-semibold">Their names are on the bag.</strong>
                </p>
                <p>
                  When you buy a packet from us, you are not buying a commodity. You are sending a daughter to school. You are letting a grandmother retire with dignity. You are paying a young woman the wage her work has always deserved.
                </p>
                <p className="text-xl md:text-2xl italic text-amber-300 font-light pt-3" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  This is the quiet economics of every kilo we ship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ A DAY AT SHATHABDHI — Gallery ============ */}
      <div className="py-20 md:py-24 px-4 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <p className="text-[11px] tracking-[0.4em] uppercase text-amber-700 mb-4 font-semibold">A Day at Shathabdhi</p>
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-5 leading-[1.05]">
              From soil to <em className="italic text-amber-700">your shelf.</em>
            </h2>
            <div className="w-12 h-px bg-amber-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4" data-testid="about-gallery">
            {[
              { src: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80', alt: 'Golden millet field', label: 'Harvest' },
              { src: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/Foxtail_Millet_1.jpg?v=1724434250', alt: 'Foxtail Millet', label: 'Sort & Mill' },
              { src: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80', alt: 'Hand-blended spices', label: 'Spices' },
              { src: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_15e8b739-81fa-4831-96c8-ad3368bdbc6a.webp?v=1722854573', alt: 'Turmeric powder', label: 'Stone Ground' },
              { src: 'https://images.pexels.com/photos/20327922/pexels-photo-20327922.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', alt: 'Women farmers', label: 'Hand-Sorted' },
              { src: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_57e6957c-15a3-4ec5-b3ed-a54f30814344.webp?v=1722857652', alt: 'Cold-pressed oil', label: 'Cold-Pressed' },
              { src: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/Jowar-Millet-Cookies-768x768.webp?v=1721349636', alt: 'Hand baked cookies', label: 'Small Batch' },
              { src: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/basmathi_rice.jpg?v=1724496761', alt: 'Aged Basmati rice', label: 'Heritage Rice' },
            ].map((img) => (
              <div key={img.src} className="group relative aspect-[3/4] overflow-hidden bg-stone-100">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <p className="absolute bottom-4 left-4 right-4 text-[10px] tracking-[0.3em] uppercase text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                  {img.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ PROMISE ============ */}
      <div className="py-20 md:py-28 px-4 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-400 mb-7 shadow-lg shadow-amber-400/30">
            <Heart className="w-5 h-5 md:w-6 md:h-6 text-stone-900" fill="currentColor" />
          </div>
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-700 mb-5 font-semibold">Our Promise To You</p>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-8 leading-[1.05]">
            From my family,<br />
            <em className="italic text-amber-700">to yours.</em>
          </h2>
          <div className="w-12 h-px bg-amber-400 mx-auto mb-9"></div>
          <div className="space-y-6 text-stone-700 text-base md:text-lg leading-relaxed font-light max-w-3xl mx-auto">
            <p>
              Every grain that reaches your home has been touched by women who treat food as medicine and soil as sacred. <strong className="text-stone-900 font-semibold">If it does not taste like something your grandmother would have served — send it back.</strong>
            </p>
            <p className="text-2xl md:text-3xl text-stone-900 font-light pt-4 italic" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              We sell hope. Health. Heritage. — and the future of every daughter learning how to feed her family.
            </p>
          </div>
        </div>
      </div>

      {/* ============ FINAL CTA ============ */}
      <div className="bg-stone-900 py-20 md:py-28 px-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #d4a574 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8b5a3c 0%, transparent 50%)'
        }}></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-300 mb-5 font-semibold">Join Us</p>
          <h2 className="text-white font-serif font-bold leading-[1] mb-7" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
            Eat the food that<br />
            <em className="italic text-amber-300">remembers you.</em>
          </h2>
          <p className="text-base md:text-xl leading-relaxed font-light text-stone-200 mb-10 max-w-2xl mx-auto">
            Every purchase is a vote for better health, sustainable farming and women&apos;s livelihoods. Start with a single packet — your body will know the difference within a week.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/collections/best-sellers"
              data-testid="about-shop-cta"
              className="inline-flex items-center gap-3 bg-amber-400 text-stone-900 hover:bg-amber-300 hover:-translate-y-0.5 font-semibold text-xs tracking-[0.3em] uppercase px-10 py-5 transition-all duration-300"
            >
              Explore The Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              data-testid="about-contact-cta"
              className="inline-flex items-center gap-3 border border-stone-500 text-white hover:bg-white hover:text-stone-900 hover:-translate-y-0.5 font-semibold text-xs tracking-[0.3em] uppercase px-10 py-5 transition-all duration-300"
            >
              Talk To Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
