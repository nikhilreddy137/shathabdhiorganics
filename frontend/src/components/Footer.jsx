import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="bg-soil text-cream/70">
      {/* Newsletter Section */}
      <div className="bg-charcoal py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-display text-h3 text-cream mb-3">Stay connected</h3>
          <p className="text-cream/60 mb-8 text-sm">Subscribe to get special offers, recipes and health tips</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-cream text-charcoal border-0 rounded-full px-5"
            />
            <Button className="bg-gold hover:bg-[#d4ad57] text-charcoal whitespace-nowrap rounded-full px-8 uppercase text-xs tracking-wider font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h4 className="font-display text-h3 text-cream mb-6">Shathabdhi Organics</h4>
            <p className="text-sm mb-6 text-cream/60 leading-relaxed">
              Bringing you the finest organic millets and spices from the farms of Telangana.
              Pure, wholesome, and sustainable.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/shathabdhiorganics/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-testid="footer-instagram" className="w-8 h-8 border border-cream/25 hover:border-gold rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-8 h-8 border border-cream/25 hover:border-gold rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 border border-cream/25 hover:border-gold rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream text-eyebrow uppercase mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-cream/60 hover:text-cream transition-colors">About Us</Link></li>
              <li><Link to="/health" className="text-cream/60 hover:text-cream transition-colors">Health Journal</Link></li>
              <li><Link to="/blog" className="text-cream/60 hover:text-cream transition-colors">Blog</Link></li>
              <li><a href="#" className="text-cream/60 hover:text-cream transition-colors">Our Story</a></li>
              <li><a href="#" className="text-cream/60 hover:text-cream transition-colors">Sustainability</a></li>
              <li><a href="#" className="text-cream/60 hover:text-cream transition-colors">Certifications</a></li>
              <li><a href="#" className="text-cream/60 hover:text-cream transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-cream text-eyebrow uppercase mb-6">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/collections/millets" className="text-cream/60 hover:text-gold transition-colors">Millets</Link></li>
              <li><Link to="/collections/millet-flours" className="text-cream/60 hover:text-gold transition-colors">Millet Flours</Link></li>
              <li><Link to="/collections/idli-and-upma-ravas" className="text-cream/60 hover:text-gold transition-colors">Idli & Upma Ravas</Link></li>
              <li><Link to="/collections/rices" className="text-cream/60 hover:text-gold transition-colors">Rices</Link></li>
              <li><Link to="/collections/oils" className="text-cream/60 hover:text-gold transition-colors">Oils</Link></li>
              <li><Link to="/collections/nuts-seeds-and-spices" className="text-cream/60 hover:text-gold transition-colors">Nuts, Seeds & Spices</Link></li>
              <li><Link to="/collections/fruits-and-vegetables" className="text-cream/60 hover:text-gold transition-colors">Fruits & Vegetables</Link></li>
              <li><Link to="/collections/cookies" className="text-cream/60 hover:text-gold transition-colors">Cookies</Link></li>
              <li><Link to="/collections/snacks-and-bars" className="text-cream/60 hover:text-gold transition-colors">Snacks & Bars</Link></li>
              <li><Link to="/collections/sweets-and-treats" className="text-cream/60 hover:text-gold transition-colors">Sweets & Treats</Link></li>
              <li><Link to="/collections/health-drinks" className="text-cream/60 hover:text-gold transition-colors">Health Drinks</Link></li>
              <li><Link to="/collections/pickles" className="text-cream/60 hover:text-gold transition-colors">Pickles</Link></li>
              <li><Link to="/collections/honey" className="text-cream/60 hover:text-gold transition-colors">Honey</Link></li>
              <li><Link to="/collections/ghee" className="text-cream/60 hover:text-gold transition-colors">Ghee</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream text-eyebrow uppercase mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-cream/50" />
                <span className="text-cream/60">Telangana, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 flex-shrink-0 text-cream/50" />
                <span className="text-cream/60">+91 12345 67890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 flex-shrink-0 text-cream/50" />
                <span className="text-cream/60">info@shathabdhi.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-cream/15">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-cream/50">&copy; 2025 Shathabdhi Organics. All rights reserved.</p>
            <div className="flex gap-6 text-xs">
              <a href="#" className="text-cream/50 hover:text-cream transition-colors">Privacy Policy</a>
              <a href="#" className="text-cream/50 hover:text-cream transition-colors">Terms of Service</a>
              <a href="#" className="text-cream/50 hover:text-cream transition-colors">Shipping</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;