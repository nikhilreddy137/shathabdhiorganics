import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Seo } from '../components/Seo';
import { HealthJournal } from '../components/HealthJournal';
import { Reveal } from '../components/motion/Primitives';
import { HEALTH_DISCLAIMER } from '../data/healthJournal';

const GI_ROWS = [
  { grain: 'White polished rice', gi: '~73', band: 'High', note: 'Fibre stripped with the bran' },
  { grain: 'Whole wheat atta', gi: '~62', band: 'Medium', note: 'Better, still spikes' },
  { grain: 'Foxtail millet', gi: '~50–52', band: 'Low', note: 'Iron & B-vitamin rich' },
  { grain: 'Little millet', gi: '~52–54', band: 'Low', note: 'Antioxidant dense' },
  { grain: 'Kodo millet', gi: '~49–52', band: 'Low', note: 'Traditional choice for sugar patients' },
  { grain: 'Barnyard millet', gi: '~41–50', band: 'Low', note: 'Highest fibre of Indian grains' },
];

const FAQS = [
  { q: 'Why do millets not spike insulin like rice?', a: 'Unpolished millets keep their bran, which is dense with soluble fibre and resistant starch. This physically slows glucose absorption in the small intestine, so blood sugar rises as a gentle slope instead of a spike — and insulin demand stays low.' },
  { q: 'How fast will a diabetic see results from switching to millets?', a: 'Most people notice steadier energy and fewer cravings within 2–3 weeks. Measurable improvements in fasting glucose and HbA1c typically show over 8–12 weeks of consistent daily low-GI meals.' },
  { q: 'Is organic food actually healthier or just cleaner?', a: 'Both. Organic removes systemic pesticide exposure that washing cannot, and organically grown produce trends higher in polyphenols, antioxidants and minerals like iron, zinc and magnesium.' },
  { q: 'Can eating millets replace diabetes medication?', a: 'No — but an effective low-GI diet can improve readings enough that your physician may adjust dosages. Always monitor closely and make medication decisions with your doctor.' },
  { q: 'Which single change has the biggest health impact?', a: 'Upgrading your daily staples — grain, cooking oil and sweetener. Dose × duration is what matters biologically, and staples are eaten in kilograms per month.' },
  { q: 'Are cold-pressed oils safe for everyday Indian cooking?', a: 'Yes. Wood-churned groundnut and sesame oils are traditional Indian cooking oils, handle sautéing and tempering well, and retain the vitamin E and antioxidants refining destroys.' },
];

export default function Health() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-cream" data-testid="health-page">
      <Seo
        title="Why Eat Organic & Millets? The Health Journal | Shathabdhi Organics"
        description="Doctor-style guidance on why organic food and low-GI millets keep blood sugar steady, prevent insulin spikes and change diabetic lives — with GI charts and FAQs."
        keywords={['why eat organic', 'millets for diabetes', 'insulin spikes prevention', 'low GI grains', 'healthy eating India']}
        path="/health"
        jsonLd={[faqJsonLd]}
      />

      {/* Hero */}
      <section className="bg-charcoal text-cream py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="text-eyebrow uppercase text-gold mb-4">The Health Journal</p>
            <h1 className="font-display text-cream max-w-4xl mb-6" style={{ fontSize: 'clamp(2.5rem, 1.5rem + 4.5vw, 5rem)', lineHeight: 1.05 }} data-testid="health-hero-title">
              Your plate is the most powerful <em className="italic text-gold">prescription</em> you own
            </h1>
            <p className="text-body-lg text-cream/75 font-light measure max-w-2xl">
              Why organic matters, how millets keep insulin steady, and what actually changes in a diabetic body when the daily staples change. Written the way a doctor would explain it.
            </p>
          </Reveal>
        </div>
      </section>

      <HealthJournal />

      {/* GI table */}
      <section className="bg-cream2/60 py-16 md:py-24 px-4" data-testid="gi-table-section">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-10">
            <p className="text-eyebrow uppercase text-jaggery mb-3">The numbers</p>
            <h2 className="font-display text-h1 text-charcoal">Glycemic index, grain by grain</h2>
            <p className="text-body text-ink mt-3 measure">Below 55 is low. The lower the number, the gentler the glucose curve — and the lower the insulin demand.</p>
          </Reveal>
          <Reveal className="bg-white rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(62,42,30,0.1)]">
            <table className="w-full text-left" data-testid="gi-table">
              <thead>
                <tr className="bg-soil text-cream">
                  <th className="px-5 py-4 text-eyebrow uppercase font-medium">Grain</th>
                  <th className="px-5 py-4 text-eyebrow uppercase font-medium">GI</th>
                  <th className="px-5 py-4 text-eyebrow uppercase font-medium hidden sm:table-cell">Band</th>
                  <th className="px-5 py-4 text-eyebrow uppercase font-medium hidden md:table-cell">Note</th>
                </tr>
              </thead>
              <tbody>
                {GI_ROWS.map((r) => (
                  <tr key={r.grain} className="border-t border-cream2">
                    <td className="px-5 py-4 text-sm text-charcoal font-medium">{r.grain}</td>
                    <td className="px-5 py-4 text-sm price text-soil font-semibold">{r.gi}</td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`text-xs rounded-full px-3 py-1 ${r.band === 'Low' ? 'bg-leaf/10 text-leaf' : r.band === 'Medium' ? 'bg-gold/15 text-jaggery' : 'bg-jaggery/10 text-jaggery'}`}>
                        {r.band}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-ink hidden md:table-cell">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-4" data-testid="health-faq-section">
        <div className="max-w-3xl mx-auto">
          <Reveal className="mb-8">
            <p className="text-eyebrow uppercase text-jaggery mb-3">Common questions</p>
            <h2 className="font-display text-h1 text-charcoal">Asked in every consultation</h2>
          </Reveal>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-medium text-charcoal hover:text-jaggery hover:no-underline" data-testid={`health-faq-${i}`}>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-ink leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-xs text-ink leading-relaxed mt-8 border-t border-cream3 pt-4">{HEALTH_DISCLAIMER}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-leaf text-cream py-16 px-4 text-center" data-testid="health-cta-section">
        <p className="text-eyebrow uppercase text-gold mb-3">Start today</p>
        <h2 className="font-display text-h2 text-cream mb-8">One low-GI staple, eaten daily, changes everything</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/collections/millets"
            data-testid="health-shop-millets-btn"
            className="inline-flex items-center gap-3 min-h-[48px] rounded-full bg-gold text-charcoal hover:bg-[#d4ad57] hover:-translate-y-0.5 text-xs font-semibold uppercase tracking-[0.06em] px-9 py-4 transition-all duration-300"
          >
            Shop siridhanya millets
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/blog"
            data-testid="health-read-blog-btn"
            className="inline-flex items-center gap-3 min-h-[48px] rounded-full border border-cream/50 text-cream hover:bg-cream hover:text-leaf text-xs font-medium uppercase tracking-[0.06em] px-9 py-4 transition-all duration-300"
          >
            Read the blog
          </Link>
        </div>
      </section>
    </div>
  );
}
