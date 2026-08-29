import React from 'react';
import { MapPin, Clock, Instagram, ArrowUpRight } from 'lucide-react';
import { Reveal } from './motion/Primitives';

const ADDRESS = 'Shathabdhi Organics, 2-35/177/1/A, Road #10, Neknampur, Puppalguda, Gandipet, Hyderabad, Telangana 500089';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
const IG_POST = 'https://www.instagram.com/p/DOGmQs3D29W/';

export const StoreVisit = () => (
  <section className="bg-cream2/60 border-t border-cream3 py-16 md:py-24 px-4" data-testid="store-visit-section">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <Reveal>
        <p className="text-eyebrow uppercase text-jaggery mb-3">Now open · Flagship store</p>
        <h2 className="font-display text-h1 text-charcoal mb-4">
          Visit us in <em className="italic text-leaf">Manikonda</em>
        </h2>
        <p className="text-body text-ink measure mb-8">
          Walk the shelves, smell the cold-pressed oils, and taste the millets before you take them home. Our first flagship store brings the farm to Hyderabad.
        </p>
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3.5">
            <span className="flex-shrink-0 w-9 h-9 bg-soil rounded-full flex items-center justify-center mt-0.5">
              <MapPin className="w-4 h-4 text-gold" />
            </span>
            <p className="text-sm text-charcoal leading-relaxed" data-testid="store-address">
              2-35/177/1/A, Road #10, Neknampur, Puppalguda,<br />Gandipet, Hyderabad, Telangana 500089
            </p>
          </div>
          <div className="flex items-start gap-3.5">
            <span className="flex-shrink-0 w-9 h-9 bg-soil rounded-full flex items-center justify-center mt-0.5">
              <Clock className="w-4 h-4 text-gold" />
            </span>
            <p className="text-sm text-charcoal leading-relaxed">Open all days of the week</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="store-directions-btn"
            className="inline-flex items-center gap-2.5 min-h-[50px] rounded-full bg-soil text-cream hover:bg-jaggery font-bold text-xs tracking-[0.08em] uppercase px-8 transition-colors duration-300"
          >
            Get directions
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href={IG_POST}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="store-instagram-btn"
            className="inline-flex items-center gap-2.5 min-h-[50px] rounded-full border border-soil/30 text-charcoal hover:border-soil hover:bg-cream font-medium text-xs tracking-[0.08em] uppercase px-8 transition-colors duration-300"
          >
            <Instagram className="w-4 h-4" />
            Watch the opening
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="flex justify-center lg:justify-end">
        <div className="w-full max-w-[400px] rounded-2xl overflow-hidden bg-white shadow-[0_20px_40px_-15px_rgba(62,42,30,0.18)]" data-testid="store-video-embed">
          <iframe
            src="https://www.instagram.com/p/DOGmQs3D29W/embed/"
            title="Shathabdhi Organics Manikonda store opening"
            className="w-full border-0"
            style={{ height: 'min(600px, 80vh)' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </Reveal>
    </div>
  </section>
);
