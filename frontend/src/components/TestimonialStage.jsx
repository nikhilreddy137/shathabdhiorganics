import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from './motion/Primitives';

export const TestimonialStage = ({ testimonials }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = testimonials[index];

  useEffect(() => {
    if (paused || testimonials.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, [paused, testimonials.length, index]);

  if (!t) return null;

  return (
    <section
      className="relative bg-[#faf7f0] border-t border-stone-200 py-20 md:py-32 px-4 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-testid="testimonial-stage"
    >
      <span
        aria-hidden="true"
        className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 font-display text-amber-200/70 select-none pointer-events-none leading-none"
        style={{ fontSize: 'clamp(14rem, 30vw, 26rem)' }}
      >
        &ldquo;
      </span>
      <div className="absolute inset-0 grain opacity-[0.05] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto">
        <Reveal className="flex items-center justify-between mb-12 md:mb-16">
          <div>
            <p className="text-eyebrow uppercase text-amber-700 mb-2">Reviews</p>
            <h2 className="font-display text-h2 text-stone-900">What our customers are saying</h2>
          </div>
          <p className="hidden md:block font-display italic text-h3 text-stone-400 price" data-testid="testimonial-index">
            {String(index + 1).padStart(2, '0')} — {String(testimonials.length).padStart(2, '0')}
          </p>
        </Reveal>

        <div className="min-h-[260px] md:min-h-[240px] flex items-start">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
              data-testid="testimonial-active-quote"
            >
              <div className="flex gap-1 mb-6" aria-label="5 star rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="font-display italic text-stone-900 measure" style={{ fontSize: 'clamp(1.5rem, 1rem + 2.4vw, 2.75rem)', lineHeight: 1.25 }}>
                {t.text}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span className="w-11 h-11 rounded-full bg-stone-900 text-amber-300 font-display italic text-lg flex items-center justify-center flex-shrink-0">
                  {t.name?.[0]}
                </span>
                <div>
                  <p className="text-sm text-stone-900 font-medium">{t.name}</p>
                  <p className="text-sm text-stone-500">on {t.product_name}</p>
                </div>
              </div>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center gap-3" data-testid="testimonial-controls">
          {testimonials.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show review ${i + 1}`}
              data-testid={`testimonial-dot-${i}`}
              className="relative h-11 flex items-center group"
            >
              <span className={`block h-[3px] transition-all duration-500 overflow-hidden ${i === index ? 'w-14 bg-stone-300' : 'w-7 bg-stone-300 group-hover:bg-stone-400'}`}>
                {i === index && (
                  <motion.span
                    key={`bar-${index}-${paused}`}
                    className="block h-full bg-amber-600"
                    initial={{ width: '0%' }}
                    animate={{ width: paused ? '0%' : '100%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
