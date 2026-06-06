import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartDrawer from './CartDrawer';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItemCount } = useCart();

  const navItems = [
    { name: 'Millets', href: '/collections/millets' },
    { name: 'Spices & Powders', href: '/collections/spices-and-powders' },
    { name: 'Rices', href: '/collections/rices' },
    { name: 'Oils', href: '/collections/oils' },
    { name: 'Processed', href: '/collections/processed-products' },
    { name: 'Dals', href: '/collections/dals' },
    { name: 'Cookies', href: '/collections/cookies' },
    { name: 'Social', href: '/social' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-center py-2 px-4 text-xs tracking-wide">
        Free shipping on orders over ₹500. <span className="underline cursor-pointer">Shop Now</span>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-light text-gray-900 tracking-widest" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                SHATHABDHI
                <br />
                <span className="text-[10px] tracking-[0.3em] text-gray-600">ORGANICS</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-xs text-gray-700 hover:text-gray-900 font-normal tracking-wide uppercase transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:block p-2 hover:bg-gray-50 rounded-full transition-colors">
                <Search className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <User className="w-4 h-4 text-gray-700" />
              </button>
              <button 
                onClick={() => setCartOpen(true)}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors relative"
              >
                <ShoppingCart className="w-4 h-4 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm text-gray-700 hover:text-gray-900 font-normal tracking-wide uppercase transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;