const PROFILES = {
  Millets: { descriptor: 'Stone-milled heritage millet', triple: 'Nutty | Earthy | Everyday' },
  'Millet Flours': { descriptor: 'Fresh-ground millet flour', triple: 'Wholesome | Soft | Daily' },
  'Spices & Powders': { descriptor: 'Hand-pounded spice blend', triple: 'Warming | Whole-spice | Aromatic' },
  Dals: { descriptor: 'Unpolished farm dal', triple: 'Protein-rich | Homely | Slow-cooked' },
  'Dals & Pulses': { descriptor: 'Unpolished farm dal', triple: 'Protein-rich | Homely | Slow-cooked' },
  Oils: { descriptor: 'Wood-churned oil', triple: 'Cold-pressed | Unrefined | Pure' },
  Cookies: { descriptor: 'Millet cookie bake', triple: 'Crisp | Jaggery-sweet | Guilt-free' },
  Rices: { descriptor: 'Heritage grain rice', triple: 'Aromatic | Unpolished | Hearty' },
  'Processed Products': { descriptor: 'Small-batch pantry staple', triple: 'Handmade | Additive-free | Honest' },
  'Snacks & Bars': { descriptor: 'Wholegrain snack', triple: 'Crunchy | Jaggery-sweet | Anytime' },
  'Sweets & Treats': { descriptor: 'Traditional sweet', triple: 'Festive | Ghee-rich | Handmade' },
  'Health Drinks': { descriptor: 'Nourishing drink mix', triple: 'Malted | Energising | Daily' },
  'Idli & Upma Ravas': { descriptor: 'Coarse-ground rava', triple: 'Fluffy | Fermentable | Breakfast' },
  'Fruits & Vegetables': { descriptor: 'Farm-fresh produce', triple: 'Seasonal | Chemical-free | Fresh' },
  'Nuts, Seeds & Spices': { descriptor: 'Sun-dried and hand-sorted', triple: 'Crunchy | Whole | Nutrient-dense' },
  Pickles: { descriptor: 'Sun-cured pickle', triple: "Tangy | Fiery | Grandmother's way" },
  Honey: { descriptor: 'Raw forest honey', triple: 'Unfiltered | Floral | Single-origin' },
  Ghee: { descriptor: 'Bilona-churned ghee', triple: 'Grass-fed | Grainy | Golden' },
  'Jaggery & Sweeteners': { descriptor: 'Unrefined sweetener', triple: 'Mineral-rich | Slow-made | Deep' },
  'Combo Packs': { descriptor: 'Curated pantry set', triple: 'Value | Variety | Gift-ready' },
  'Poultry & Eggs': { descriptor: 'Free-range farm eggs', triple: 'Pasture-raised | Rich | Fresh' },
};

const DEFAULT_PROFILE = { descriptor: 'Direct from the farmer', triple: 'Organic | Honest | Telangana' };

export const getProfile = (product) => {
  const base = PROFILES[product.category] || DEFAULT_PROFILE;
  return {
    descriptor: base.descriptor,
    triple: product.profile && product.profile.includes('|') ? product.profile : base.triple,
  };
};
