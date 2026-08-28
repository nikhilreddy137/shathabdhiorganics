import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Img } from '../components/Img';
import { Reveal } from '../components/motion/Primitives';
import { BLOG_POSTS } from '../data/blogPosts';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Blog() {
  const [featured, ...rest] = BLOG_POSTS;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The Shathabdhi Journal',
    description: 'Evidence-based articles on millets, diabetes, glycemic index, organic food and cold-pressed oils.',
    blogPost: BLOG_POSTS.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.metaDescription,
      datePublished: p.date,
      author: { '@type': 'Organization', name: p.author },
      image: p.image,
    })),
  };

  return (
    <div className="min-h-screen bg-cream" data-testid="blog-page">
      <Seo
        title="The Shathabdhi Journal — Millets, Diabetes & Organic Living Blog"
        description="Doctor-style articles on millets for diabetes, glycemic index of Indian grains, why organic food matters and cold-pressed oils. Evidence-based, practical, Indian."
        keywords={['millets blog', 'diabetes diet blog India', 'organic food blog', 'glycemic index articles', 'healthy eating blog']}
        path="/blog"
        jsonLd={[jsonLd]}
      />

      <header className="max-w-7xl mx-auto px-4 pt-14 md:pt-20 pb-10">
        <Reveal>
          <p className="text-eyebrow uppercase text-jaggery mb-3">The Journal</p>
          <h1 className="font-display text-h1 text-charcoal max-w-3xl" data-testid="blog-title">
            Field notes on food that <em className="italic text-leaf">heals</em>
          </h1>
          <p className="text-body text-ink mt-4 measure">
            Millets and blood sugar, organic soil and your gut, oils and what refining destroys — written the way a doctor would explain it, from a farm that grows the evidence.
          </p>
        </Reveal>
      </header>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <Reveal>
          <Link
            to={`/blog/${featured.slug}`}
            className="group grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(62,42,30,0.14)] transition-shadow duration-300"
            data-testid={`blog-card-${featured.slug}`}
          >
            <Img
              src={featured.image}
              alt={featured.imageAlt}
              className="min-h-[240px] h-full"
              sizes="(min-width: 768px) 50vw, 100vw"
              imgClassName="group-hover:scale-[1.04] transition-transform duration-700"
            />
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="text-eyebrow uppercase text-jaggery mb-3">{featured.category}</p>
              <h2 className="font-display text-h2 text-charcoal group-hover:text-jaggery transition-colors mb-3">
                {featured.title}
              </h2>
              <p className="text-sm text-ink leading-relaxed mb-5">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-ink">
                <span>{formatDate(featured.date)}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.06em] text-leaf group-hover:gap-3.5 transition-all">
                Read the article
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20 md:pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" data-testid="blog-grid">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden h-full hover:shadow-[0_20px_40px_-15px_rgba(62,42,30,0.14)] transition-shadow duration-300"
                data-testid={`blog-card-${post.slug}`}
              >
                <Img
                  src={post.image}
                  alt={post.imageAlt}
                  ratio="16/10"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  imgClassName="group-hover:scale-[1.04] transition-transform duration-700"
                />
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-eyebrow uppercase text-jaggery mb-2">{post.category}</p>
                  <h3 className="font-display text-h3 text-charcoal group-hover:text-jaggery transition-colors mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-ink leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                  <div className="mt-auto flex items-center gap-4 text-xs text-ink">
                    <span>{formatDate(post.date)}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
