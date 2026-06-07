import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { productAPI } from '../services/api';
import { logger } from '../utils/logger';

const POPULAR = ['Ragi', 'Millet', 'Turmeric', 'Cold Pressed Oil', 'Cookies', 'Spices'];

const SearchOverlay = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const inputRef = useRef(null);

  // Focus input shortly after mount (without setting state)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // ESC to close + lock body scroll
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const runSearch = useCallback(async (q) => {
    const trimmed = (q || '').trim();
    if (trimmed.length < 2) {
      setResults([]);
      setTotal(0);
      return;
    }
    try {
      setLoading(true);
      const data = await productAPI.search(trimmed, 12);
      setResults(data.results || []);
      setTotal(data.total || 0);
    } catch (err) {
      logger.error('Search failed', err);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => runSearch(query), 220);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-stone-900/70 backdrop-blur-sm flex items-start justify-center pt-[8vh] px-4"
      onClick={onClose}
      data-testid="search-overlay"
    >
      <div
        className="w-full max-w-3xl bg-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input bar */}
        <div className="flex items-center gap-3 border-b border-stone-200 px-5 py-4">
          {loading ? (
            <Loader2 className="w-4 h-4 text-amber-600 animate-spin flex-shrink-0" />
          ) : (
            <SearchIcon className="w-4 h-4 text-stone-500 flex-shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for ragi, oils, spices, cookies…"
            data-testid="search-input"
            className="flex-1 bg-transparent outline-none text-base md:text-lg text-stone-900 placeholder:text-stone-400 font-light"
          />
          <button
            type="button"
            onClick={onClose}
            data-testid="search-close-btn"
            aria-label="Close search"
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4 text-stone-600" />
          </button>
        </div>

        {/* Results / Empty / Popular */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Empty query — show popular suggestions */}
          {query.trim().length < 2 && (
            <div className="p-6" data-testid="search-suggestions">
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-4 font-semibold">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setQuery(p)}
                    data-testid={`search-suggestion-${p.replace(/\s+/g, '-').toLowerCase()}`}
                    className="px-4 py-1.5 text-xs tracking-wider uppercase border border-stone-300 bg-white text-stone-800 hover:border-amber-500 hover:bg-amber-50 hover:text-stone-900 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query.trim().length >= 2 && !loading && results.length === 0 && (
            <div className="p-10 text-center" data-testid="search-no-results">
              <p className="font-serif text-2xl text-stone-900 mb-2">No matches for &ldquo;{query}&rdquo;</p>
              <p className="text-sm text-stone-600 font-light">Try a broader keyword like &ldquo;millet&rdquo; or &ldquo;oil&rdquo;.</p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div data-testid="search-results">
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500 px-5 pt-5 pb-2 font-semibold">
                {total} match{total === 1 ? '' : 'es'}
              </p>
              <ul className="divide-y divide-stone-100">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/product/${p.id}`}
                      onClick={onClose}
                      data-testid={`search-result-${p.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-amber-50 transition-colors group"
                    >
                      <div className="w-14 h-14 flex-shrink-0 bg-stone-100 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] tracking-[0.25em] uppercase text-amber-700 font-semibold mb-0.5">{p.category}</p>
                        <p className="font-serif text-stone-900 text-lg leading-tight truncate group-hover:text-amber-700 transition-colors">{p.name}</p>
                        <p className="text-xs text-stone-600 truncate">{p.description}</p>
                      </div>
                      <p className="flex-shrink-0 text-sm font-medium text-stone-900">₹{p.base_price}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-stone-200 px-5 py-3 bg-stone-50 flex items-center justify-between text-[10px] tracking-wider uppercase text-stone-500">
          <span>Press Esc to close</span>
          <span>Powered by Shathabdhi</span>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
