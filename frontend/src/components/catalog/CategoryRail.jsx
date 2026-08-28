import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Img } from '../Img';

export const slugify = (name) =>
  name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

export const CategoryRail = ({ categories, activeCategory }) => {
  const railRef = useRef(null);

  useEffect(() => {
    const el = railRef.current?.querySelector('[data-active="true"]');
    if (el) el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' });
  }, [activeCategory]);

  return (
    <div ref={railRef} className="snap-rail no-scrollbar gap-4 md:gap-6 px-4 md:px-0" data-testid="category-rail">
      <Link
        to="/collections/best-sellers"
        data-active={!activeCategory}
        data-testid="category-rail-all"
        className="flex-shrink-0 w-[72px] md:w-[88px] text-center group"
      >
        <div className={`w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-full flex items-center justify-center bg-soil text-gold font-display italic text-lg transition-shadow
          ${!activeCategory ? 'ring-2 ring-offset-2 ring-soil' : 'group-hover:ring-1 group-hover:ring-offset-2 group-hover:ring-cream3'}`}>
          All
        </div>
        <p className={`text-sm mt-2 leading-tight ${!activeCategory ? 'text-charcoal font-medium' : 'text-ink'}`}>All</p>
      </Link>
      {categories.map((cat) => {
        const active = activeCategory === cat.name;
        return (
          <Link
            key={cat.id}
            to={`/collections/${slugify(cat.name)}`}
            data-active={active}
            data-testid={`category-rail-${slugify(cat.name)}`}
            className="flex-shrink-0 w-[72px] md:w-[88px] text-center group"
          >
            <div className={`w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-full overflow-hidden transition-shadow
              ${active ? 'ring-2 ring-offset-2 ring-soil' : 'group-hover:ring-1 group-hover:ring-offset-2 group-hover:ring-cream3'}`}>
              <Img
                src={cat.image}
                alt={`${cat.name} collection`}
                ratio="1/1"
                sizes="88px"
                className="w-full h-full rounded-full"
              />
            </div>
            <p className={`text-sm mt-2 leading-tight line-clamp-2 ${active ? 'text-charcoal font-medium' : 'text-ink'}`}>
              {cat.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
