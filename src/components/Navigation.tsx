import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', id: 'home' },
    { name: 'Investment Plans', path: '/', id: 'investment-tiers' },
    { name: 'Calculator', path: '/', id: 'calculator' },
    { name: 'Testimonials', path: '/testimonials', id: 'testimonials' },
    { name: 'FAQ', path: '/', id: 'faq' },
    { name: 'Support', path: '/support', id: 'support' },
    { name: 'Legal', path: '/legal', id: 'legal' }
  ];

  const handleNavClick = (item: any) => {
    if (item.path === '/' && item.id !== 'home') {
      // Scroll to section on home page
      if (location.pathname === '/') {
        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = `/#${item.id}`;
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <TrendingUp className="h-8 w-8 text-accent" />
            <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
              Daily Yield Capital
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <div className="flex gap-3">
              <Link to="/auth">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="cta-button">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-accent/10 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 space-y-3">
                <Link to="/auth" className="block">
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/auth" className="block">
                  <Button className="w-full cta-button">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};