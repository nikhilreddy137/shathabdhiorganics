import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Img } from '../Img';

export const EDITORIAL_CARDS = [
  {
    eyebrow: 'Our promise',
    title: 'What does direct from the farmer mean?',
    body: 'Every kilo is grown, sorted and packed by women farmer collectives in Telangana — no middlemen, no cold storage.',
    to: '/about',
    label: 'Read our story',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80',
    alt: 'Golden millet field at harvest in Telangana',
  },
  {
    eyebrow: 'Craft',
    title: 'How our oils are wood-churned',
    body: 'Cold-pressed the slow way on wooden ghani presses — below 40°C, so nothing living in the seed is lost.',
    to: '/collections/oils',
    label: 'Shop cold-pressed oils',
    image: 'https://cdn.shopify.com/s/files/1/0657/0832/6964/files/sunflower_cp_oil.jpg?v=1787778755',
    alt: 'Cold-pressed oil bottle beside raw seeds',
  },
];

export const EditorialCard = ({ card, index = 0 }) => (
  <Link
    to={card.to}
    className="group col-span-2 xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 bg-stone-900 text-white overflow-hidden"
    data-testid={`editorial-card-${index}`}
  >
    <div className="p-7 md:p-9 flex flex-col justify-center order-2 sm:order-1">
      <p className="text-eyebrow uppercase text-amber-300 mb-3">{card.eyebrow}</p>
      <h3 className="font-display text-h2 text-white leading-tight mb-3">{card.title}</h3>
      <p className="text-sm text-stone-300 leading-relaxed mb-5 measure">{card.body}</p>
      <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.06em] text-amber-300 group-hover:gap-3.5 transition-all">
        {card.label}
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </div>
    <Img
      src={card.image}
      alt={card.alt}
      className="order-1 sm:order-2 min-h-[180px] h-full"
      sizes="(min-width: 640px) 50vw, 100vw"
      imgClassName="group-hover:scale-[1.04] transition-transform duration-700"
    />
  </Link>
);
