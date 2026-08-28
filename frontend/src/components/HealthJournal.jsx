import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Stethoscope } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Reveal } from './motion/Primitives';
import { HEALTH_VIDEOS, HEALTH_DISCLAIMER } from '../data/healthJournal';

const HealthVideo = ({ src, title }) => (
  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-cream2">
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 w-full h-full object-cover"
      aria-label={title}
    >
      <source src={src} type="video/mp4" />
    </video>
  </div>
);

export const DoctorsNoteDialog = ({ entry, open, onClose }) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="max-w-lg bg-cream rounded-2xl max-h-[85vh] overflow-y-auto" data-testid="doctors-note-dialog">
      {entry && (
        <>
          <DialogHeader>
            <div className="flex items-center gap-2 text-jaggery mb-1">
              <Stethoscope className="w-4 h-4" />
              <span className="text-eyebrow uppercase">{entry.eyebrow}</span>
            </div>
            <DialogTitle className="font-display font-normal text-h3 text-charcoal text-left">
              {entry.note.heading}
            </DialogTitle>
            <DialogDescription className="sr-only">Detailed medical note on {entry.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {entry.note.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-charcoal/90 leading-relaxed">{p}</p>
            ))}
            <p className="text-sm font-medium text-leaf bg-cream2 rounded-xl px-4 py-3">{entry.note.takeaway}</p>
            <p className="text-xs text-ink leading-relaxed border-t border-cream3 pt-3">{HEALTH_DISCLAIMER}</p>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);

export const HealthJournal = ({ compact = false }) => {
  const [note, setNote] = useState(null);
  const items = HEALTH_VIDEOS;

  return (
    <section className={`px-4 ${compact ? 'py-16 md:py-24 bg-cream2/60' : 'py-16 md:py-24'}`} data-testid="health-journal-section">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-10 md:mb-14">
          <p className="text-eyebrow uppercase text-jaggery mb-3">The Health Journal</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display text-h1 text-charcoal max-w-2xl">
              What changes when you eat <em className="italic text-leaf">the way we grew</em>
            </h2>
            {compact && (
              <Link
                to="/health"
                data-testid="health-journal-see-all"
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.06em] text-charcoal hover:text-jaggery hover:gap-3.5 transition-all min-h-[44px] flex-shrink-0"
              >
                Read the full journal
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </Reveal>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${compact ? 'lg:grid-cols-4' : ''} gap-8 md:gap-10`}>
          {items.map((entry, i) => (
            <Reveal key={entry.id} delay={i * 0.08} className="flex flex-col" data-testid={`health-card-${entry.id}`}>
              <HealthVideo src={entry.video} title={entry.title} />
              <p className="text-eyebrow uppercase text-jaggery mt-5 mb-2">{entry.eyebrow}</p>
              <h3 className="font-display text-h3 text-charcoal mb-2">{entry.title}</h3>
              <p className="text-sm text-ink leading-relaxed mb-4">{entry.lede}</p>
              {!compact && (
                <ul className="space-y-2 mb-5">
                  {entry.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-charcoal/90">
                      <Check className="w-4 h-4 text-leaf mt-0.5 flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => setNote(entry)}
                data-testid={`doctors-note-btn-${entry.id}`}
                className="mt-auto inline-flex items-center gap-2 self-start text-xs font-medium uppercase tracking-[0.06em] text-leaf hover:text-jaggery transition-colors min-h-[44px]"
              >
                <Stethoscope className="w-4 h-4" />
                Read the Doctor&apos;s Note
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <DoctorsNoteDialog entry={note} open={!!note} onClose={() => setNote(null)} />
    </section>
  );
};
