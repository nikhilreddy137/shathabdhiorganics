import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartItemCount } = useCart();

  const navItems = [
    { name: 'Millets', href: '/collections/millets' },
    { name: 'Spices', href: '/collections/spices-and-powders' },
    { name: 'Rices', href: '/collections/rices' },
    { name: 'Oils', href: '/collections/oils' },
    { name: 'Dals', href: '/collections/dals' },
    { name: 'Cookies', href: '/collections/cookies' },
    { name: 'Snacks', href: '/collections/snacks-and-bars' },
    { name: 'Sweets', href: '/collections/sweets-and-treats' },
    { name: 'Drinks', href: '/collections/health-drinks' },
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
            <Link to="/" data-testid="header-logo" className="group flex items-center transition-transform duration-300 hover:scale-[1.02]">
              <h1 className="text-xl font-light text-gray-900 tracking-widest transition-colors group-hover:text-amber-700" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                SHATHABDHI
                <br />
                <span className="text-[10px] tracking-[0.3em] text-gray-600 group-hover:text-amber-600 transition-colors">ORGANICS</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-x-5 xl:gap-x-7">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  data-testid={`nav-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                  className="relative text-xs text-gray-700 hover:text-gray-900 font-medium tracking-[0.15em] uppercase py-2 transition-all duration-300 hover:-translate-y-[1px]
                  after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1.5px] after:bg-amber-500 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              <button data-testid="header-search-btn" onClick={() => setSearchOpen(true)} aria-label="Search" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-amber-50 hover:scale-110 active:scale-95 transition-all duration-200">
                <Search className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                data-testid="header-cart-btn"
                aria-label="Cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-amber-50 hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <ShoppingCart className="w-4 h-4 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-amber-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow-sm animate-in zoom-in duration-300">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center justify-between text-sm text-gray-700 hover:text-amber-700 hover:bg-amber-50/60 font-medium tracking-[0.15em] uppercase px-3 py-3 rounded transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                    <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-600">→</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
};

export default Header;