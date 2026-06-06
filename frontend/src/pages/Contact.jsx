import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../components/ui/sonner';
import { Toaster } from '../components/ui/sonner';

const INSTAGRAM_URL = 'https://www.instagram.com/shathabdhiorganics/';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Mock submission — wire to /api/contact when backend route is added
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Thank you! We'll get back to you within 24 hours.");
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white" data-testid="contact-page">
      <Toaster position="top-right" />

      {/* Editorial Hero */}
      <div className="relative h-[58vh] min-h-[440px] bg-stone-100 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80"
          alt="Sunlit farm fields"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(28,25,23,0.88) 0%, rgba(28,25,23,0.62) 50%, rgba(28,25,23,0.30) 100%)',
          }}
        ></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="max-w-2xl text-white">
            <p className="text-[11px] tracking-[0.4em] uppercase text-amber-300 mb-6" data-testid="contact-eyebrow">
              Talk To Us
            </p>
            <h1
              className="text-white font-bold leading-[0.98] mb-7"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.75rem, 5.5vw, 5rem)' }}
              data-testid="contact-headline"
            >
              We answer<br />
              <em className="italic text-amber-300">every email.</em>
            </h1>
            <div className="w-16 h-px bg-amber-400 mb-7"></div>
            <p className="text-base md:text-lg text-stone-100 leading-relaxed font-light max-w-xl">
              Questions about grains, bulk orders, retail partnerships, or just want to say hi to the women behind every packet? You're in the right place.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Strip — quick stats */}
      <div className="border-b border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '< 24h', label: 'Email Response' },
            { num: '2,400+', label: 'Happy Households' },
            { num: '87', label: 'Villages Served' },
            { num: '100%', label: 'Human Replies' },
          ].map((s) => (
            <div key={s.label} data-testid={`contact-stat-${s.label.replace(/\s+/g, '-').toLowerCase()}`}>
              <p className="text-2xl md:text-3xl font-serif text-amber-700 font-semibold leading-none">{s.num}</p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-stone-600 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-5" data-testid="contact-info">
            <div>
              <p className="text-[11px] tracking-[0.4em] uppercase text-amber-700 mb-3">Reach Us</p>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-5 leading-[1.05]">
                Five ways<br />
                <em className="italic text-amber-700">to start a conversation.</em>
              </h2>
              <div className="w-12 h-px bg-amber-400 mb-7"></div>
              <p className="text-stone-700 font-light leading-relaxed mb-10">
                Whether it's a recipe question, a bulk enquiry, or you want to bring our heritage millets to your city — we read every word.
              </p>
            </div>

            {[
              {
                icon: Phone,
                label: 'Call',
                primary: '+91 90000 12345',
                sub: 'Mon – Sat · 9 AM to 7 PM IST',
                href: 'tel:+919000012345',
              },
              {
                icon: Mail,
                label: 'Email',
                primary: 'hello@shathabdhiorganics.com',
                sub: 'For partnerships: partners@shathabdhiorganics.com',
                href: 'mailto:hello@shathabdhiorganics.com',
              },
              {
                icon: MessageSquare,
                label: 'WhatsApp',
                primary: '+91 90000 12345',
                sub: 'Fastest replies for order help',
                href: 'https://wa.me/919000012345',
              },
              {
                icon: Instagram,
                label: 'Instagram',
                primary: '@shathabdhiorganics',
                sub: 'DMs open · Reels, recipes & farm diaries',
                href: INSTAGRAM_URL,
              },
              {
                icon: MapPin,
                label: 'Visit',
                primary: 'Shathabdhi Organics, Banjara Hills',
                sub: 'Hyderabad, Telangana 500034, India',
                href: 'https://maps.google.com/?q=Banjara+Hills+Hyderabad',
              },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                data-testid={`contact-link-${c.label.toLowerCase()}`}
                className="group flex items-start gap-5 bg-white border border-stone-200 hover:border-amber-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-5"
              >
                <div className="flex-shrink-0 w-11 h-11 bg-stone-900 group-hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors duration-300">
                  <c.icon className="w-4 h-4 text-white group-hover:text-stone-900 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-1.5 font-semibold">{c.label}</p>
                  <p className="text-stone-900 font-medium leading-tight truncate">{c.primary}</p>
                  <p className="text-xs text-stone-600 mt-1 leading-snug">{c.sub}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
              </a>
            ))}

            <div className="flex items-center gap-3 text-xs text-stone-600 pt-4">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="tracking-wider">Open Mon – Sat · 9:00 AM – 7:00 PM IST</span>
            </div>
          </div>

          {/* Right: Form Card */}
          <div className="lg:col-span-7" data-testid="contact-form-section">
            <div className="bg-stone-50 border border-stone-200 p-8 md:p-12 sticky top-28">
              <p className="text-[11px] tracking-[0.4em] uppercase text-amber-700 mb-3">Drop A Line</p>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2 leading-tight">
                Send us a message
              </h2>
              <p className="text-stone-600 font-light mb-10 leading-relaxed">
                A real human (often Bhanu herself) reads every form — no bots, no auto-replies.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-700 mb-2">
                      Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      data-testid="contact-input-name"
                      className="bg-white border-stone-300 rounded-none h-12 focus-visible:ring-amber-400 focus-visible:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-700 mb-2">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 …"
                      data-testid="contact-input-phone"
                      className="bg-white border-stone-300 rounded-none h-12 focus-visible:ring-amber-400 focus-visible:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    data-testid="contact-input-email"
                    className="bg-white border-stone-300 rounded-none h-12 focus-visible:ring-amber-400 focus-visible:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Bulk order for our cafe"
                    data-testid="contact-input-subject"
                    className="bg-white border-stone-300 rounded-none h-12 focus-visible:ring-amber-400 focus-visible:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us more — recipe questions, partnership ideas, anything…"
                    data-testid="contact-input-message"
                    className="bg-white border-stone-300 rounded-none focus-visible:ring-amber-400 focus-visible:border-amber-400 transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  data-testid="contact-submit-btn"
                  className="w-full bg-stone-900 hover:bg-amber-500 hover:text-stone-900 active:scale-[0.98] text-white font-semibold border-0 rounded-none py-7 uppercase text-xs tracking-[0.3em] transition-all duration-300 disabled:opacity-60"
                >
                  <Send className="w-4 h-4 mr-3" />
                  {submitting ? 'Sending…' : 'Send Message'}
                </Button>

                <p className="text-[11px] text-stone-500 text-center pt-2 tracking-wider">
                  We typically respond within 24 hours · Your data stays with us.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ teaser strip */}
      <div className="bg-stone-900 text-white py-20 px-4" data-testid="contact-faq-strip">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              q: 'How fresh is your stock?',
              a: 'Every grain is milled and packed within 7 days of ordering — never warehoused for months.',
            },
            {
              q: 'Do you ship pan-India?',
              a: 'Yes. Free shipping on orders above ₹500. International orders on request.',
            },
            {
              q: 'Can I visit a farm?',
              a: 'Absolutely. Email partners@shathabdhiorganics.com to schedule a guided farm visit in Telangana.',
            },
          ].map((f, i) => (
            <div key={i} className="border-l-2 border-amber-400 pl-5">
              <h3 className="text-xl font-serif mb-3 leading-tight">{f.q}</h3>
              <p className="text-stone-300 font-light leading-relaxed text-sm">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Map */}
      <div className="w-full h-[420px] bg-stone-200" data-testid="contact-map">
        <iframe
          title="Shathabdhi Organics — Hyderabad"
          src="https://www.google.com/maps?q=Banjara+Hills,+Hyderabad,+Telangana&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(0.25) contrast(1.05)' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
