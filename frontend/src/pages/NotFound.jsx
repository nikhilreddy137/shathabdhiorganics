import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24 bg-stone-50" data-testid="not-found-page">
      <div className="text-center max-w-md">
        <p className="text-[11px] tracking-[0.4em] uppercase text-amber-700 mb-4">404</p>
        <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          This page wandered off the farm.
        </h1>
        <p className="text-sm text-stone-500 mb-8">
          The page you're looking for doesn't exist. Looking for the Shopify Manage Panel? It's at{' '}
          <Link to="/admin/shopify" className="underline text-stone-900" data-testid="not-found-shopify-link">/admin/shopify</Link>.
        </p>
        <Link
          to="/"
          data-testid="not-found-home-link"
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white text-xs uppercase tracking-wider px-6 py-4 transition-colors"
        >
          Back to Home
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
