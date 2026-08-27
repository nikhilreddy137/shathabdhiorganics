import React, { useState } from 'react';

const WIDTHS = [320, 480, 640, 768, 1024, 1280, 1600, 2000];

const buildSrc = (src, w) => {
  if (!src) return null;
  if (src.includes('cdn.shopify.com')) {
    return `${src}${src.includes('?') ? '&' : '?'}width=${w}`;
  }
  if (src.includes('images.unsplash.com')) {
    const base = src.replace(/([?&])w=\d+/, '$1w=' + w);
    return base.includes(`w=${w}`) ? base : `${base}${base.includes('?') ? '&' : '?'}w=${w}`;
  }
  if (src.includes('images.pexels.com')) {
    const base = src.replace(/([?&])w=\d+/, '$1w=' + w);
    return base.includes(`w=${w}`) ? base : `${base}${base.includes('?') ? '&' : '?'}w=${w}`;
  }
  return null;
};

export const Img = ({
  src,
  alt,
  ratio,
  sizes = '100vw',
  priority = false,
  className = '',
  imgClassName = '',
  position = '50% 50%',
  testId,
}) => {
  const [loaded, setLoaded] = useState(false);
  const canResize = !!buildSrc(src, 640);
  const srcSet = canResize ? WIDTHS.map((w) => `${buildSrc(src, w)} ${w}w`).join(', ') : undefined;

  return (
    <div
      className={`img-frame ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      data-testid={testId}
    >
      <img
        src={canResize ? buildSrc(src, 1024) : src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        loading={priority ? undefined : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? undefined : 'async'}
        onLoad={() => setLoaded(true)}
        className={`img-el ${loaded ? 'is-loaded' : ''} ${imgClassName}`}
        style={{ objectPosition: position }}
      />
    </div>
  );
};
