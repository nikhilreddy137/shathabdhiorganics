import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/motion/Primitives';
import { GRAINS, USE_CASES, TASTES, BEGINNER_LABELS } from '../data/grains';
import { buildGrainCatalog } from '../lib/grainCatalog';
import { productAPI } from '../services/api';
import { track } from '../lib/track';

const BeginnerDots = ({ rating }) => (
  <span className="inline-flex items-center gap-1" title={`Beginner level: ${BEGINNER_LABELS[rating]}`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={`w-1.5 h-1.5 rounded-full ${i <= rating ? 'bg-leaf' : 'bg-cream3'}`}></span>
    ))}
  </span>
);

export default function Millets() {
  const [catalog, setCatalog] = useState({});
  const [useCase, setUseCase] = useState(null);
  const [taste, setTaste] = useState(null);
  const [easyOnly, setEasyOnly] = useState(false);

  useEffect(() => {
    productAPI.getAll({ per_page: 200 }).then((d) => {
      const products = d.products || d;
      setCatalog(buildGrainCatalog(products));
    }).catch(() => {});
    track('passport_index_viewed');
  }, []);

  const grains = useMemo(() => {
    let list = [...GRAINS].sort((a, b) => a.sort_order - b.sort_order);
    if (useCase) list = list.filter((g) => g.best_for.includes(useCase));
    if (taste) list = list.filter((g) => g.taste.includes(taste));
    if (easyOnly) list = list.filter((g) => g.beginner_rating >= 4);
    return list;
  }, [useCase, taste, easyOnly]);

  const heroImg = (slug) => {
    const skus = catalog[slug] || [];
    const whole = skus.find((s) => s.format === 'whole') || skus[0];
    return whole?.product?.image;
  };
  const fromPrice = (slug) => {
    const skus = catalog[slug] || [];
    if (!skus.length) return null;
    return Math.min(...skus.map((s) => s.product.base_price || Infinity));
  };

  return (
    <div className="min-h-screen bg-cream" data-testid="millets-index-page">
      <Seo
        title="Grain Passports — Every Millet, Explained | Shathabdhi Organics"
        description="Taste, texture, soak time, cook time and best uses for all 10 heritage millets — foxtail, little, kodo, barnyard, browntop, proso, jowar, ragi and bajra."
        keywords={['millet types India', 'millet guide', 'how to cook millets', 'siridhanya millets list']}
        path="/millets"
      />

      <header className="max-w-7xl mx-auto px-4 pt-14 md:pt-20 pb-8">
        <Reveal>
          <p className="text-eyebrow uppercase text-jaggery mb-3">Grain Passports</p>
          <h1 className="font-display text-h1 text-charcoal max-w-3xl" data-testid="millets-title">
            Every grain, <em className="italic text-leaf">explained</em>
          </h1>
          <p className="text-body text-ink mt-4 measure">
            Same fields, same order, every grain — taste, texture, soak, cook time and what it&apos;s actually for. Compare without re-reading paragraphs.
          </p>
          <Link
            to="/find-your-millet"
            data-testid="millets-finder-link"
            className="mt-6 inline-flex items-center gap-2.5 min-h-[48px] rounded-full bg-gold text-charcoal hover:bg-[#d4ad57] font-bold text-xs tracking-[0.08em] uppercase px-7 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Not sure? Find your millet in 60 seconds
          </Link>
        </Reveal>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 pb-8 flex flex-wrap gap-2" data-testid="millets-filters">
        <button type="button" onClick={() => { setUseCase(null); setTaste(null); setEasyOnly(false); }}
          className={`text-xs rounded-full px-4 py-2 border transition-colors ${!useCase && !taste && !easyOnly ? 'bg-soil text-cream border-soil' : 'bg-white text-ink border-cream3 hover:border-soil'}`}
          data-testid="millets-filter-all">All grains</button>
        {USE_CASES.map((u) => (
          <button key={u.id} type="button" onClick={() => setUseCase(useCase === u.id ? null : u.id)}
            className={`text-xs rounded-full px-4 py-2 border transition-colors ${useCase === u.id ? 'bg-soil text-cream border-soil' : 'bg-white text-ink border-cream3 hover:border-soil'}`}
            data-testid={`millets-filter-${u.id}`}>{u.label}</button>
        ))}
        {TASTES.map((t) => (
          <button key={t} type="button" onClick={() => setTaste(taste === t ? null : t)}
            className={`text-xs rounded-full px-4 py-2 border capitalize transition-colors ${taste === t ? 'bg-leaf text-cream border-leaf' : 'bg-white text-ink border-cream3 hover:border-leaf'}`}
            data-testid={`millets-filter-taste-${t}`}>{t}</button>
        ))}
        <button type="button" onClick={() => setEasyOnly(!easyOnly)}
          className={`text-xs rounded-full px-4 py-2 border transition-colors ${easyOnly ? 'bg-gold text-charcoal border-gold' : 'bg-white text-ink border-cream3 hover:border-gold'}`}
          data-testid="millets-filter-easy">Beginner friendly</button>
      </div>

      {/* Passport cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="millets-grid">
        {grains.map((g, i) => {
          const img = heroImg(g.slug);
          const price = fromPrice(g.slug);
          return (
            <Reveal key={g.slug} delay={i * 0.05}>
              <Link
                to={`/millets/${g.slug}`}
                onClick={() => track('passport_viewed', { slug: g.slug, entry_point: 'index' })}
                className="group flex flex-col bg-white rounded-2xl p-5 h-full border border-transparent hover:border-cream2 hover:shadow-[0_20px_40px_-15px_rgba(62,42,30,0.14)] transition-shadow duration-300"
                data-testid={`passport-card-${g.slug}`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream2 flex-shrink-0">
                    {img && <img src={img} alt={g.name_en} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-leaf font-semibold">{BEGINNER_LABELS[g.beginner_rating]}</span>
                    <div className="mt-1"><BeginnerDots rating={g.beginner_rating} /></div>
                  </div>
                </div>
                <h2 className="font-display text-h3 text-charcoal group-hover:text-jaggery transition-colors">{g.name_en}</h2>
                <p className="text-sm text-ink mb-3">{g.name_local} · {g.name_hi}</p>
                <p className="text-xs text-charcoal capitalize mb-1">{g.taste.join(' · ')}</p>
                <p className="text-xs text-ink mb-1">Best for: {g.best_for.map((b) => USE_CASES.find((u) => u.id === b)?.label.split(' or ')[0]).join(', ')}</p>
                <p className="text-xs text-ink mb-4">
                  {g.soak_required ? `Soak ${g.soak_hours} hrs` : 'No soak'} · Cook {g.cook_time_minutes} min
                </p>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-cream2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.06em] text-leaf group-hover:gap-2.5 transition-all">
                    See passport <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  {price && Number.isFinite(price) && <span className="text-sm font-semibold text-soil price">from ₹{Math.round(price)}</span>}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
