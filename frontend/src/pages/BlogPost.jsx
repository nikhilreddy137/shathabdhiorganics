import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Leaf } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Seo } from '../components/Seo';
import { Img } from '../components/Img';
import { Reveal } from '../components/motion/Primitives';
import { BLOG_POSTS, getPostBySlug } from '../data/blogPosts';
import { HEALTH_DISCLAIMER } from '../data/healthJournal';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center" data-testid="blog-post-not-found">
        <div className="text-center">
          <p className="font-display text-h2 text-charcoal mb-4">Article not found</p>
          <Link to="/blog" className="text-jaggery underline">Back to the Journal</Link>
        </div>
      </div>
    );
  }

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author, url: 'https://shathabdhiorganics.com' },
    publisher: { '@type': 'Organization', name: 'Shathabdhi Organics' },
    keywords: post.keywords.join(', '),
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const origin = window.location.origin;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${origin}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${origin}/blog/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-cream" data-testid="blog-post-page">
      <Seo
        title={post.metaTitle}
        description={post.metaDescription}
        keywords={post.keywords}
        path={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.image}
        jsonLd={[articleJsonLd, faqJsonLd, breadcrumbJsonLd]}
      />

      <article className="max-w-3xl mx-auto px-4 pt-10 md:pt-14 pb-16">
        <Link
          to="/blog"
          data-testid="blog-post-back"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-ink hover:text-charcoal transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          The Journal
        </Link>

        <Reveal>
          <p className="text-eyebrow uppercase text-jaggery mb-3">{post.category}</p>
          <h1 className="font-display text-charcoal mb-5" style={{ fontSize: 'clamp(2rem, 1.4rem + 3vw, 3.5rem)', lineHeight: 1.1 }} data-testid="blog-post-title">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-ink mb-8">
            <span className="inline-flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-leaf" />{post.author}</span>
            <span>{formatDate(post.date)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
          </div>
          <Img src={post.image} alt={post.imageAlt} ratio="16/9" sizes="(min-width: 768px) 720px, 100vw" priority className="rounded-2xl mb-10" />
        </Reveal>

        <div className="space-y-10">
          {post.sections.map((s, i) => (
            <Reveal key={i}>
              <h2 className="font-display text-h2 text-charcoal mb-4">{s.h2}</h2>
              {s.paras.map((p, j) => (
                <p key={j} className="text-body text-charcoal/90 leading-relaxed mb-4">{p}</p>
              ))}
              {s.list && (
                <ul className="space-y-2.5 mt-2">
                  {s.list.map((li) => (
                    <li key={li} className="flex items-start gap-3 text-body text-charcoal/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2.5 flex-shrink-0"></span>
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal className="mt-12 bg-soil text-cream rounded-2xl p-8 md:p-10">
          <p className="text-eyebrow uppercase text-gold mb-2">From our farms</p>
          <h3 className="font-display text-h3 text-cream mb-5">Grown chemical-free by 2,400+ women farmers in Telangana</h3>
          <Link
            to={post.cta.to}
            data-testid="blog-post-cta"
            className="inline-flex items-center gap-3 min-h-[48px] rounded-full bg-gold text-charcoal hover:bg-[#d4ad57] text-xs font-semibold uppercase tracking-[0.06em] px-8 py-3.5 transition-all duration-300"
          >
            {post.cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        {/* FAQ */}
        <section className="mt-14" data-testid="blog-post-faq">
          <h2 className="font-display text-h2 text-charcoal mb-6">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {post.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-medium text-charcoal hover:text-jaggery hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-ink leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <p className="text-xs text-ink leading-relaxed mt-10 border-t border-cream3 pt-4">{HEALTH_DISCLAIMER}</p>
      </article>

      {/* Related */}
      <section className="bg-cream2/60 border-t border-cream3 py-16 px-4" data-testid="blog-related">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-h2 text-charcoal mb-8">Keep reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(62,42,30,0.14)] transition-shadow duration-300"
                data-testid={`related-post-${p.slug}`}
              >
                <Img src={p.image} alt={p.imageAlt} ratio="16/10" sizes="(min-width: 1024px) 33vw, 100vw" imgClassName="group-hover:scale-[1.04] transition-transform duration-700" />
                <div className="p-6">
                  <p className="text-eyebrow uppercase text-jaggery mb-2">{p.category}</p>
                  <h3 className="font-display text-h3 text-charcoal group-hover:text-jaggery transition-colors leading-snug">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
