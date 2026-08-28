const IMG = {
  grains: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200',
  soil: 'https://images.unsplash.com/photo-1599320092708-8a9dde49fc2c?auto=format&fit=crop&q=80&w=1200',
  hands: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
  field: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1200',
  oil: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/sunflower_cp_oil.jpg?v=1787778755',
  crop: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1200',
};

export const BLOG_POSTS = [
  {
    slug: 'millets-for-diabetes-low-gi-guide',
    title: 'Millets for Diabetes: The Complete Low-GI Guide',
    metaTitle: 'Millets for Diabetes: Low-GI Guide to Blood Sugar Control | Shathabdhi Organics',
    metaDescription: 'How siridhanya millets keep blood sugar steady — glycemic index of foxtail, little, kodo, barnyard & browntop millet vs rice, with a doctor-style meal plan for diabetics.',
    keywords: ['millets for diabetes', 'low GI grains India', 'siridhanya millets blood sugar', 'foxtail millet glycemic index', 'diabetic diet millets'],
    excerpt: 'Polished rice spikes glucose to ~73 GI. Unpolished millets sit near 50. Here is what that difference does to a diabetic body — and how to make the switch.',
    image: IMG.grains,
    imageAlt: 'Unpolished heritage millets — low glycemic index grains for diabetics',
    date: '2026-06-02',
    readTime: '8 min read',
    category: 'Diabetes & Blood Sugar',
    author: 'Shathabdhi Health Desk',
    sections: [
      {
        h2: 'Why blood sugar spikes are the real enemy',
        paras: [
          'Every carbohydrate ends up as glucose — the question is how fast. Polished white rice digests almost instantly: blood glucose surges within 30 minutes, the pancreas responds with a flood of insulin, and two hours later the reactive crash produces hunger, fatigue and cravings. Repeated thousands of times a year, this spike-crash cycle exhausts pancreatic beta cells and drives insulin resistance — the engine of type 2 diabetes.',
          'The clinical goal is a flatter curve: glucose that rises gently, peaks lower, and settles slowly. That is exactly what low-glycemic-index (GI) grains deliver.',
        ],
      },
      {
        h2: 'The glycemic index of Indian staples, compared',
        paras: ['Glycemic index measures how fast 50g of carbohydrate from a food raises blood glucose relative to pure glucose (GI 100). The Indian staple lineup looks like this:'],
        list: [
          'White polished rice — GI ~73 (high)',
          'Whole wheat roti — GI ~62 (medium)',
          'Foxtail millet (korralu) — GI ~50–52 (low)',
          'Little millet (samalu) — GI ~52–54 (low)',
          'Kodo millet (arikelu) — GI ~49–52 (low)',
          'Barnyard millet (odalu) — GI ~41–50 (low, highest fibre)',
          'Browntop millet (andu korralu) — GI ~50 (low)',
        ],
      },
      {
        h2: 'How millets flatten the curve — the mechanism',
        paras: [
          'Unpolished millets keep their bran and germ intact. The bran is dense with soluble fibre and resistant starch, which form a gel in the small intestine and physically slow glucose absorption. In continuous-glucose-monitor comparisons, a millet meal typically peaks 30–40% lower than an equivalent rice meal and returns to baseline without a crash.',
          'Lower peaks mean lower insulin demand. Over 8–12 weeks of daily low-GI meals, most people see fasting glucose trend down and HbA1c improve — the same direction of change that diabetes medication targets, achieved at the plate.',
        ],
      },
      {
        h2: 'A practical one-week transition plan',
        paras: ['Do not overhaul everything on day one — swap staples gradually so your gut fibre tolerance adapts:'],
        list: [
          'Days 1–2: replace lunch rice with foxtail millet, cooked 1:2.5 with water',
          'Days 3–4: switch breakfast to millet idli or upma using millet rava',
          'Days 5–6: add little millet khichdi or kodo millet pulao at dinner',
          'Day 7: one full millet day — track your energy through the afternoon',
          'Drink more water: millet fibre absorbs it, and hydration keeps digestion smooth',
        ],
      },
      {
        h2: 'A note for anyone on diabetic medication',
        paras: [
          'Dietary change this effective can shift your readings. Monitor glucose closely during the first weeks and involve your physician — medication doses sometimes need adjusting downward as the diet does more of the work. That is a good problem, but manage it with your doctor, not alone.',
        ],
      },
    ],
    faqs: [
      { q: 'Which millet is best for diabetes?', a: 'Barnyard and kodo millet have the lowest glycemic index (~41–52) and the highest fibre. Foxtail millet is the easiest to start with because it cooks and tastes closest to rice.' },
      { q: 'Can diabetics eat millets every day?', a: 'Yes — daily unpolished millet meals are exactly how the low-GI benefit compounds. Rotate 2–3 varieties across the week for a broader micronutrient profile.' },
      { q: 'Do millets reduce HbA1c?', a: 'Clinical reviews show low-GI whole-grain diets can reduce HbA1c meaningfully over 8–12 weeks. Individual results vary; consistency of the daily staple matters most.' },
      { q: 'Is millet better than brown rice for blood sugar?', a: 'Generally yes — most siridhanya millets have both a lower GI and more fibre per serving than brown rice.' },
    ],
    cta: { label: 'Shop unpolished siridhanya millets', to: '/collections/millets' },
  },
  {
    slug: 'why-organic-food-matters',
    title: 'Why Organic? What Pesticide-Free Food Actually Does to Your Body',
    metaTitle: 'Why Eat Organic Food? Health Benefits Backed by Science | Shathabdhi Organics',
    metaDescription: 'Pesticide residues, endocrine disruption and nutrient density — the real, evidence-based case for eating certified organic food in India.',
    keywords: ['why eat organic', 'organic food benefits India', 'pesticide residues health effects', 'organic vs conventional food', 'chemical free food'],
    excerpt: 'Washing removes surface residue. It does nothing for pesticides absorbed inside the grain. The only reliable filter is how the food was grown.',
    image: IMG.soil,
    imageAlt: 'Hands holding chemical-free living soil on an organic farm',
    date: '2026-05-28',
    readTime: '7 min read',
    category: 'Organic Living',
    author: 'Shathabdhi Health Desk',
    sections: [
      {
        h2: 'The chemical burden nobody counts',
        paras: [
          'Organophosphate pesticides are designed to disrupt insect nervous systems. In humans, chronic low-dose exposure — the kind that comes from eating conventionally grown staples every day for decades — is associated with endocrine disruption, gut-microbiome damage and oxidative stress on the liver.',
          'The critical detail: many modern pesticides are systemic. They are absorbed into the plant tissue itself. No amount of washing, soaking or peeling removes them, because they are not on the food — they are in it.',
        ],
      },
      {
        h2: 'What changes when the field goes organic',
        paras: ['Certified organic farming eliminates synthetic pesticides, herbicides and GMO seed at the source. The downstream effects show up in the food:'],
        list: [
          'Zero synthetic residue load — the exposure simply never happens',
          'Higher polyphenol and antioxidant content (plants grown without chemical protection produce more of their own defence compounds)',
          'Better mineral density — living soil rich in microbes makes iron, zinc and magnesium more available to the crop',
          'No antibiotic or hormone traces in animal-origin foods',
        ],
      },
      {
        h2: 'Where organic matters most: your daily staples',
        paras: [
          'You do not eat exotic berries in kilograms. You eat grain, oil, dal and spices in kilograms. Dose × duration is what determines biological impact, so the highest-leverage organic upgrades are the foods you consume every single day. Switching your rice, millets, cooking oil and turmeric to certified organic removes more chemical exposure than switching everything else combined.',
          'This is the logic behind how we farm at Shathabdhi: 2,400+ women farmers in Telangana growing staples the way they were grown a century ago — compost, crop rotation and patience. No shortcuts between her field and your kitchen.',
        ],
      },
    ],
    faqs: [
      { q: 'Does washing food remove pesticides?', a: 'Washing removes some surface residue but cannot remove systemic pesticides absorbed into the plant tissue. Only organically grown food avoids them entirely.' },
      { q: 'Is organic food really more nutritious?', a: 'Meta-analyses show organically grown produce trends higher in polyphenols, antioxidants and several minerals, though the biggest proven benefit is the absence of synthetic residues.' },
      { q: 'Which foods should I buy organic first?', a: 'Your daily staples — grains, cooking oils, dals and spices. They dominate your total intake, so switching them removes the most exposure per rupee.' },
    ],
    cta: { label: 'Shop the organic pantry', to: '/collections/best-sellers' },
  },
  {
    slug: 'glycemic-index-indian-grains',
    title: 'Glycemic Index of Indian Grains: Rice vs Wheat vs Millets',
    metaTitle: 'Glycemic Index Chart: Rice vs Wheat vs Millets | Shathabdhi Organics',
    metaDescription: 'A complete GI comparison of Indian grains — white rice, brown rice, wheat, and all five siridhanya millets — and what the numbers mean for your energy and insulin.',
    keywords: ['glycemic index Indian grains', 'rice vs millet GI', 'low GI foods India', 'glycemic index chart', 'foxtail millet vs rice'],
    excerpt: 'GI 73 vs GI 50 sounds academic — until you see what it does to your afternoon energy, your cravings and your insulin. The full chart, explained.',
    image: IMG.field,
    imageAlt: 'Golden millet field at harvest — comparing glycemic index of Indian grains',
    date: '2026-05-20',
    readTime: '6 min read',
    category: 'Nutrition Science',
    author: 'Shathabdhi Health Desk',
    sections: [
      {
        h2: 'Reading the chart: what GI actually measures',
        paras: [
          'Glycemic index ranks how fast a food raises blood glucose against pure glucose (GI 100). Below 55 is low, 56–69 medium, 70+ high. But GI alone is not the full story — fibre, protein and fat in the same meal all slow absorption. That is why the same grain, eaten as part of a complete meal with dal and vegetables, produces a gentler curve than eaten alone.',
        ],
      },
      {
        h2: 'The Indian grain lineup',
        paras: ['Ranked from fastest-spiking to steadiest:'],
        list: [
          'White polished rice — GI ~73 · fibre stripped away with the bran',
          'Refined wheat (maida) — GI ~71 · behaves like sugar',
          'Whole wheat atta — GI ~62 · better, still medium',
          'Brown rice — GI ~55–68 · varies by variety and cooking',
          'Foxtail millet — GI ~50–52 · rich in iron and B vitamins',
          'Little millet — GI ~52–54 · highest fat-soluble antioxidant content',
          'Kodo millet — GI ~49–52 · traditional prescription for sugar patients',
          'Barnyard millet — GI ~41–50 · highest fibre of all Indian grains',
        ],
      },
      {
        h2: 'Three rules that matter more than any single number',
        paras: [],
        list: [
          'Unpolished beats polished, always — the bran is where the fibre lives',
          'Cool your grain slightly before eating: resistant starch increases as cooked grain cools, lowering the effective GI',
          'Never eat a grain naked — pairing with dal, vegetables or ghee flattens the curve further',
        ],
      },
    ],
    faqs: [
      { q: 'What is the lowest GI grain in India?', a: 'Barnyard millet (odalu), with a GI as low as ~41 and the highest fibre content of Indian grains.' },
      { q: 'Does cooking method change GI?', a: 'Yes. Overcooking raises GI; cooking grains al dente and letting them cool slightly increases resistant starch and lowers the glucose response.' },
      { q: 'Is brown rice low GI?', a: 'Brown rice is medium GI (~55–68) depending on variety. Most millets are meaningfully lower and higher in fibre.' },
    ],
    cta: { label: 'Shop low-GI millets & rices', to: '/collections/millets' },
  },
  {
    slug: 'cold-pressed-oils-vs-refined',
    title: 'Cold-Pressed vs Refined Oils: What the Heat Destroys',
    metaTitle: 'Cold-Pressed vs Refined Oil: Which Is Healthier? | Shathabdhi Organics',
    metaDescription: 'Refined oils are extracted with heat and solvents that destroy vitamin E and antioxidants. What wood-churned cold-pressed oils keep intact — and why it matters.',
    keywords: ['cold pressed oil benefits', 'refined vs cold pressed oil', 'wood churned oil', 'ghani oil benefits', 'healthy cooking oil India'],
    excerpt: 'Refining strips an oil of everything that made the seed worth pressing — then deodorises it to hide the damage. Here is what the slow way preserves.',
    image: IMG.oil,
    imageAlt: 'Wood-churned cold-pressed sunflower oil beside raw seeds',
    date: '2026-05-12',
    readTime: '6 min read',
    category: 'Ingredients',
    author: 'Shathabdhi Health Desk',
    sections: [
      {
        h2: 'What refining actually does to an oil',
        paras: [
          'Industrial refining extracts oil with hexane solvent and heat above 200°C, then bleaches and deodorises the result. The process is efficient — and destructive. Vitamin E, natural antioxidants, phospholipids and the delicate aroma compounds are damaged or removed. What remains is a neutral, shelf-stable fat stripped of nearly everything bioactive.',
          'Worse, high-heat processing of polyunsaturated oils can generate trans-fat traces and oxidised lipid compounds — precisely the molecules implicated in vascular inflammation.',
        ],
      },
      {
        h2: 'The cold-pressed difference',
        paras: ['Wood-churned (ghani) pressing works below 40°C. Nothing added, nothing removed. The oil keeps:'],
        list: [
          'Natural vitamin E — the antioxidant that protects both the oil and your cells',
          'Polyphenols and plant sterols that support healthy cholesterol balance',
          'Original fatty-acid structure, undamaged by heat',
          'The seed\'s natural flavour — you cook with less because it tastes of something',
        ],
      },
      {
        h2: 'How to use cold-pressed oils well',
        paras: [
          'Match the oil to the job. Groundnut and sesame oils handle Indian sautéing and tempering beautifully. Use them fresh — cold-pressed oils are living foods, best consumed within months, stored away from light. If your oil has no aroma at all, ask what was done to it.',
        ],
      },
    ],
    faqs: [
      { q: 'Is cold-pressed oil good for the heart?', a: 'Cold-pressed oils retain vitamin E, polyphenols and plant sterols associated with healthy cholesterol balance — compounds that refining largely destroys.' },
      { q: 'Can you cook Indian food in cold-pressed oil?', a: 'Yes. Cold-pressed groundnut and sesame oils are traditional Indian cooking oils and handle sautéing and tempering well.' },
      { q: 'Why does refined oil have no smell?', a: 'Because it is deliberately deodorised after high-heat solvent extraction. The neutrality is a marker of processing, not purity.' },
    ],
    cta: { label: 'Shop wood-churned cold-pressed oils', to: '/collections/oils' },
  },
  {
    slug: 'how-to-switch-to-millets-30-days',
    title: 'The 30-Day Millet Switch: A Week-by-Week Plan',
    metaTitle: '30-Day Millet Diet Plan: How to Switch from Rice | Shathabdhi Organics',
    metaDescription: 'A gentle, week-by-week plan to move your family from polished rice to siridhanya millets — with cooking ratios, recipes and what changes to expect.',
    keywords: ['millet diet plan', 'how to switch to millets', 'millet recipes for beginners', 'replace rice with millets', '30 day millet challenge'],
    excerpt: 'Going all-in on day one is how millet switches fail. This is the gradual plan that sticks — and what your body will report by week four.',
    image: IMG.hands,
    imageAlt: 'Farmer hands cradling ripened grain — starting the 30-day millet switch',
    date: '2026-05-05',
    readTime: '7 min read',
    category: 'How-To Guides',
    author: 'Shathabdhi Health Desk',
    sections: [
      {
        h2: 'Week 1 — one meal, one millet',
        paras: [
          'Start with foxtail millet at lunch only. It is the friendliest gateway: cooks like rice (1 cup millet : 2.5 cups water, 15 minutes), tastes mild and slightly nutty. Keep breakfast and dinner unchanged. Your gut needs time to adapt to the fibre jump — this slow start prevents the bloating that derails most attempts.',
        ],
      },
      {
        h2: 'Week 2 — breakfast joins',
        paras: ['Swap breakfast to millet idli, dosa or upma using millet rava. Two practical notes:'],
        list: [
          'Soak millets 6–8 hours before cooking — it improves both texture and mineral absorption',
          'Millet idli batter ferments slightly faster than rice batter; watch it at hour 8',
          'Drink noticeably more water this week — fibre absorbs it',
        ],
      },
      {
        h2: 'Week 3 — rotate varieties',
        paras: [
          'Introduce little millet khichdi and kodo millet pulao at dinner. Rotating 2–3 varieties matters: each millet carries a different micronutrient signature (foxtail is iron-rich, barnyard is fibre-dense, kodo is the traditional choice for sugar patients). Rotation gives you the full spectrum.',
        ],
      },
      {
        h2: 'Week 4 — full switch, and what to expect',
        paras: [
          'By now millets anchor all three meals, with rice as the occasional guest instead of the daily default. What most people report at this point: the 4 pm energy slump has vanished, late-evening sugar cravings have faded, digestion feels lighter, and anyone tracking glucose sees flatter post-meal curves and improving fasting numbers.',
          'If you are on diabetic medication, involve your physician through this month — readings often improve enough that dosages need reviewing.',
        ],
      },
    ],
    faqs: [
      { q: 'Which millet should a beginner start with?', a: 'Foxtail millet. It cooks like rice, tastes mild, and is the easiest texture transition for a rice-eating household.' },
      { q: 'Do millets cause bloating?', a: 'A sudden fibre jump can. Start with one meal a day, soak millets before cooking, and increase water intake — the adaptation takes about a week.' },
      { q: 'Can children eat millets daily?', a: 'Yes — millets are traditional first foods in Telangana. Their iron, calcium and fibre content supports growing bodies well.' },
    ],
    cta: { label: 'Start with foxtail millet', to: '/collections/millets' },
  },
  {
    slug: 'siridhanya-millets-guide',
    title: 'The 5 Siridhanya Millets, Explained: Foxtail to Browntop',
    metaTitle: 'Siridhanya Millets Guide: 5 Positive Millets & Benefits | Shathabdhi Organics',
    metaDescription: 'Foxtail, little, kodo, barnyard and browntop — what makes the five siridhanya (positive) millets different, their nutrition profiles, and how to cook each one.',
    keywords: ['siridhanya millets', 'positive millets benefits', 'foxtail millet benefits', 'kodo millet benefits', 'barnyard millet nutrition'],
    excerpt: 'Five grains your grandmother would recognise, each with a distinct nutritional signature. The complete field guide to positive millets.',
    image: IMG.crop,
    imageAlt: 'Siridhanya millet crop growing in chemical-free soil in Telangana',
    date: '2026-04-26',
    readTime: '8 min read',
    category: 'Ingredients',
    author: 'Shathabdhi Health Desk',
    sections: [
      {
        h2: 'What makes a millet "siridhanya"',
        paras: [
          'Siridhanya — literally "wealth grains" — are the five millets with an exceptional fibre-to-carbohydrate ratio (roughly 1:6 to 1:10, versus 1:30+ for rice). That ratio is why they digest slowly, feed gut bacteria generously, and hold blood sugar steady. All five grow on marginal land with little water and no chemical support, which is why they thrived in Telangana for centuries before industrial agriculture displaced them.',
        ],
      },
      {
        h2: 'The five, one by one',
        paras: [],
        list: [
          'Foxtail (korralu) — the gateway millet. Iron and B-vitamin rich, mild nutty taste, cooks like rice. Best for: daily lunch, pulao, upma.',
          'Little (samalu) — small grain, big antioxidants. Highest fat-soluble antioxidant content. Best for: khichdi, curd-millet, payasam.',
          'Kodo (arikelu) — the traditional prescription for sugar patients. GI ~49–52, gentle on digestion. Best for: idli, dosa, plain steamed.',
          'Barnyard (odalu) — the fibre champion, GI as low as ~41. Fastest cooking of the five. Best for: fasting meals, porridge, quick khichdi.',
          'Browntop (andu korralu) — the rarest, nearly lost to cultivation. Exceptional fibre, grown by very few farmer collectives. Best for: rotis, steamed grain bowls.',
        ],
      },
      {
        h2: 'Why unpolished matters more than which variety',
        paras: [
          'A polished millet is barely better than polished rice — the bran that holds the fibre, minerals and B vitamins is exactly what polishing removes. Every benefit in this guide assumes unpolished, hand-processed grain. Check for it explicitly; the market is full of polished millets sold on the strength of the name alone.',
          'All five siridhanya millets at Shathabdhi are grown chemical-free and hand-processed by women farmer collectives, so the grain arrives the way the field grew it.',
        ],
      },
    ],
    faqs: [
      { q: 'What are the 5 siridhanya millets?', a: 'Foxtail (korralu), little (samalu), kodo (arikelu), barnyard (odalu) and browntop (andu korralu) — the five "positive" millets with exceptional fibre-to-carbohydrate ratios.' },
      { q: 'Are siridhanya millets gluten-free?', a: 'Yes, all five siridhanya millets are naturally gluten-free and suitable for celiac and gluten-sensitive diets.' },
      { q: 'How do I know if a millet is unpolished?', a: 'Unpolished millet grains look matte and slightly varied in colour, not uniformly shiny white. The label should state unpolished or hand-processed explicitly.' },
    ],
    cta: { label: 'Shop all five siridhanya millets', to: '/collections/millets' },
  },
];

export const getPostBySlug = (slug) => BLOG_POSTS.find((p) => p.slug === slug);
