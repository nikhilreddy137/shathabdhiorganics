import { GRAINS, BUNDLES } from '../data/grains';
import { RECIPES } from '../data/recipes';

export const inferFormat = (name) => {
  const n = name.toLowerCase();
  if (/flour/.test(n)) return 'flour';
  if (/rava|vermicelli|pasta/.test(n)) return 'rava';
  if (/mix |mix$|combo|soup/.test(n)) return 'mix';
  if (/cookie|crisp|chudwa|chikki|laddu|muffin|choco|flakes/.test(n)) return 'ready_to_eat';
  return 'whole';
};

export const inferPrepBand = (name, format) => {
  const n = name.toLowerCase();
  if (format === 'ready_to_eat') return 'quick';
  if (/upma|flakes|soup|mix/.test(n)) return 'quick';
  if (format === 'rava') return 'quick';
  if (format === 'flour') return 'medium';
  return 'slow';
};

export const inferUseCases = (name, format) => {
  const n = name.toLowerCase();
  if (/idli|dosa/.test(n)) return ['dosa'];
  if (/upma/.test(n)) return ['porridge', 'rice_replacement'];
  if (/cookie|muffin|choco/.test(n)) return ['baking', 'snack'];
  if (/crisp|chudwa|chikki|flakes/.test(n)) return ['snack'];
  if (/vermicelli|pasta/.test(n)) return ['snack', 'rice_replacement'];
  if (/soup|mix/.test(n)) return ['porridge'];
  if (format === 'flour') return ['roti', 'dosa', 'baking'];
  return ['rice_replacement', 'porridge'];
};

const grainForProduct = (product) => GRAINS.find((g) => g.match.test(product.name));

// Tag every catalogue product against the grain layer.
export const buildGrainCatalog = (products) => {
  const byGrain = Object.fromEntries(GRAINS.map((g) => [g.slug, []]));
  products.forEach((p) => {
    const grain = grainForProduct(p);
    if (!grain) return;
    const format = inferFormat(p.name);
    byGrain[grain.slug].push({
      product: p,
      grain,
      format,
      prep_band: inferPrepBand(p.name, format),
      use_cases: inferUseCases(p.name, format),
      is_trial_size: (p.base_price || 0) <= 60,
      is_giftable: /combo|box|assorted/i.test(p.name),
    });
  });
  return byGrain;
};

const ADJACENT = { quick: ['medium'], medium: ['quick', 'slow'], slow: ['medium'] };

const scoreSku = (sku, a) => {
  let s = 0;
  const { grain } = sku;
  if (sku.use_cases.includes(a.use)) s += 40;
  if (grain.best_for.includes(a.use)) s += 15;
  if (grain.not_ideal_for.includes(a.use)) s -= 50;
  if (a.time) {
    if (sku.prep_band === a.time) s += 25;
    else if (ADJACENT[a.time]?.includes(sku.prep_band)) s += 10;
  }
  if (a.taste && grain.taste.includes(a.taste)) s += 20;
  if (a.formats?.length && a.formats.includes(sku.format)) s += 15;
  if (a.audience === 'first_time' || a.audience === 'children') s += grain.beginner_rating * 6;
  if (a.audience === 'first_time' && sku.is_trial_size) s += 12;
  if (a.audience === 'gifting' && sku.is_giftable) s += 20;
  s += Math.max(0, 10 - grain.sort_order);
  return s;
};

const runScoring = (skus, a) => {
  let pool = skus;
  if (a.formats?.length) pool = pool.filter((s) => a.formats.includes(s.format));
  if (a.use === 'baking') pool = pool.filter((s) => s.use_cases.includes('baking'));
  const scored = pool
    .map((sku) => ({ ...sku, score: scoreSku(sku, a) }))
    .sort((x, y) => y.score - x.score
      || y.grain.beginner_rating - x.grain.beginner_rating
      || x.grain.sort_order - y.grain.sort_order
      || x.product.name.localeCompare(y.product.name));
  const seen = new Set();
  const out = [];
  for (const s of scored) {
    if (seen.has(s.grain.slug)) continue;
    seen.add(s.grain.slug);
    out.push(s);
    if (out.length === 3) break;
  }
  return out;
};

export const scoreFinder = (answers, products) => {
  const catalog = buildGrainCatalog(products);
  const allSkus = Object.values(catalog).flat();
  const a = answers;
  let note = null;

  let results = runScoring(allSkus, a);
  if (!results.length && a.taste) {
    results = runScoring(allSkus, { ...a, taste: null });
  }
  if (!results.length && a.formats?.length) {
    results = runScoring(allSkus, { ...a, formats: [] });
    if (results.length) note = 'Closest match — your preferred format is limited right now.';
  }

  if (a.audience === 'first_time') {
    results = results.slice(0, 2).sort((x, y) => (y.is_trial_size ? 1 : 0) - (x.is_trial_size ? 1 : 0));
  }

  // Attach one recipe
  let recipe = null;
  if (results.length) {
    const winner = results[0];
    let candidates = RECIPES.filter((r) => r.grain_slugs.includes(winner.grain.slug) && r.use_case === a.use);
    if (!candidates.length) candidates = RECIPES.filter((r) => r.grain_slugs.includes(winner.grain.slug));
    if (a.audience === 'children') {
      const kid = candidates.filter((r) => r.is_kid_friendly);
      if (kid.length) candidates = kid;
    }
    recipe = candidates[0] || null;
  }

  // Attach one bundle (real SKU)
  const bundleDef = BUNDLES.find((b) => a.audience && b.audience.includes(a.audience)) || BUNDLES[0];
  const bundleProduct = products.find((p) => bundleDef.match.test(p.name)) || null;

  let empty = false;
  if (!results.length) {
    empty = true;
    note = "Nothing matched exactly. Here's where most people start.";
  }
  if (a.use === 'baking' && a.time === 'quick' && results.length) {
    note = "Baking usually needs a little more time. Here's the quickest option we have.";
  }

  return { results, recipe, bundle: bundleProduct ? { ...bundleDef, product: bundleProduct } : null, note, empty };
};

export const buildReason = (winner, a) => {
  const bits = [];
  if (winner.grain.taste.length) bits.push(`${winner.grain.taste.join(', ')} taste`);
  const useLabel = { dosa: 'works in a dosa or idli batter', roti: 'made for rotis', porridge: 'turns into a gentle porridge', baking: 'bakes beautifully', snack: 'snacks well', rice_replacement: 'cooks and serves like rice' }[a.use];
  if (useLabel) bits.push(useLabel);
  if (winner.prep_band === 'quick') bits.push('ready in under 15 minutes');
  else if (winner.prep_band === 'medium') bits.push('on the table in under 30 minutes');
  return bits.join(' · ').replace(/^\w/, (c) => c.toUpperCase());
};

// Answer code <-> URL. Encodes answers, not product IDs, so links stay valid.
export const encodeAnswers = (a) =>
  [a.use || '', a.time || '', a.audience || '', a.taste || '', (a.formats || []).join('+')].join('.');

export const decodeAnswers = (code) => {
  const [use, time, audience, taste, formats] = (code || '').split('.');
  return {
    use: use || null,
    time: time || null,
    audience: audience || null,
    taste: taste || null,
    formats: formats ? formats.split('+').filter(Boolean) : [],
  };
};
