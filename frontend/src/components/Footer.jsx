import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gray-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-light text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Stay Connected</h3>
          <p className="text-gray-400 mb-8 text-sm">Subscribe to get special offers, recipes, and health tips</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-gray-900 border-0 rounded-none"
            />
            <Button className="bg-gray-900 hover:bg-black text-white whitespace-nowrap border border-white rounded-none px-8 uppercase text-xs tracking-wider">
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
            <h4 className="text-white font-light text-lg mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Shathabdhi Organics</h4>
            <p className="text-sm mb-6 text-gray-400 leading-relaxed">
              Bringing you the finest organic millets and spices from the farms of Telangana.
              Pure, wholesome, and sustainable.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/shathabdhiorganics/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-testid="footer-instagram" className="w-8 h-8 border border-gray-600 hover:border-white rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-8 h-8 border border-gray-600 hover:border-white rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 border border-gray-600 hover:border-white rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-normal text-xs uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sustainability</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Certifications</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-normal text-xs uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/collections/best-sellers" className="text-gray-400 hover:text-white transition-colors">Millets</Link></li>
              <li><Link to="/collections/best-sellers" className="text-gray-400 hover:text-white transition-colors">Spices & Powders</Link></li>
              <li><Link to="/collections/best-sellers" className="text-gray-400 hover:text-white transition-colors">Rices</Link></li>
              <li><Link to="/collections/best-sellers" className="text-gray-400 hover:text-white transition-colors">Oils</Link></li>
              <li><Link to="/collections/best-sellers" className="text-gray-400 hover:text-white transition-colors">Processed Products</Link></li>
              <li><Link to="/collections/best-sellers" className="text-gray-400 hover:text-white transition-colors">Dals</Link></li>
              <li><Link to="/collections/best-sellers" className="text-gray-400 hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-normal text-xs uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-gray-400" />
                <span className="text-gray-400">Telangana, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="text-gray-400">+91 12345 67890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="text-gray-400">info@shathabdhi.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">&copy; 2025 Shathabdhi Organics. All rights reserved.</p>
            <div className="flex gap-6 text-xs">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Shipping</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;