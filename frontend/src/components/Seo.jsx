import { useEffect } from 'react';

const upsertMeta = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const Seo = ({ title, description, keywords, path = '/', ogType = 'website', ogImage, jsonLd }) => {
  useEffect(() => {
    const url = `${window.location.origin}${path}`;
    document.title = title;
    upsertMeta('name', 'description', description);
    if (keywords?.length) upsertMeta('name', 'keywords', keywords.join(', '));
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:site_name', 'Shathabdhi Organics');
    if (ogImage) upsertMeta('property', 'og:image', ogImage);
    upsertMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    if (ogImage) upsertMeta('name', 'twitter:image', ogImage);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
    const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    blocks.forEach((block) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
    });

    return () => {
      document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path]);

  return null;
};
