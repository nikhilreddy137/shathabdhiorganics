import React from 'react';
import { motion } from 'framer-motion';

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger = (delay = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

export const Reveal = ({ children, className = '', delay = 0, once = true, ...rest }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once, margin: '-60px' }}
    variants={{
      hidden: { opacity: 0, y: 28 },
      show: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
    }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const SplitLines = ({ lines, className = '', lineClassName = '', delay = 0.15, as: Tag = 'span' }) => (
  <span className={className}>
    {lines.map((line, i) => (
      <span key={i} className="block overflow-hidden">
        <motion.span
          className={`block ${lineClassName}`}
          initial={{ y: '112%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 1, delay: delay + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
        >
          {line}
        </motion.span>
      </span>
    ))}
  </span>
);

export const Marquee = ({ items, className = '' }) => {
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="font-display italic text-h2 px-6">{item}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
          </span>
        ))}
      </div>
    </div>
  );
};
