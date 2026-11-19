import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Home, FlaskConical, MessageCircle, FileText, Menu } from 'lucide-react';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';
import { PageTransition } from '../components/common/MotionPrimitives';
import { RFQProvider, useRFQ } from '../context/RFQContext';
import { RFQBasketDrawer } from '../components/common/RFQBasketDrawer';
import { CommandPalette } from '../components/common/CommandPalette';
import { api } from '../api/client';
import { UI_LABELS } from '../utils/constants';

const LayoutInner: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { totalCount, openDrawer } = useRFQ();

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
    staleTime: 1000 * 60 * 30,
  });

  // Global keyboard shortcuts: Cmd+K / Ctrl+K and '/' to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const phone = settings?.company?.phone || '+91 97274 04415';

  return (
    <>
      <a
        href="#content"
        className="skip-to-content"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          zIndex: 10000,
          opacity: 0,
        }}
      >
        {UI_LABELS.SKIP_TO_CONTENT}
      </a>

      <Navbar
        settings={settings}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        settings={settings}
      />

      {/* Global RFQ Drawer */}
      <RFQBasketDrawer />

      {/* Global Command Search (Cmd+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <main id="content" tabIndex={-1} style={{ outline: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      <Footer settings={settings} />

      {/* Mobile App-Style Bottom Tab Bar */}
      <nav className="mobile-app-tabbar" role="navigation" aria-label="Mobile Bottom Navigation">
        <Link
          to="/"
          className={`tabbar-item ${location.pathname === '/' ? 'active' : ''}`}
          aria-label="Home"
        >
          <Home size={20} className="tabbar-icon" />
          <span className="tabbar-label">Home</span>
        </Link>

        <Link
          to="/products"
          className={`tabbar-item ${location.pathname.startsWith('/products') ? 'active' : ''}`}
          aria-label="Products Catalog"
        >
          <FlaskConical size={20} className="tabbar-icon" />
          <span className="tabbar-label">Catalog</span>
        </Link>

        <button
          type="button"
          onClick={openDrawer}
          className="tabbar-item tabbar-basket"
          aria-label={`RFQ Basket with ${totalCount} items`}
        >
          <div className="tabbar-icon-wrap">
            <FileText size={20} className="tabbar-icon" />
            {totalCount > 0 && (
              <span className="tabbar-badge tabular-nums">
                {totalCount}
              </span>
            )}
          </div>
          <span className="tabbar-label">RFQ Cart</span>
        </button>

        <a
          href="https://wa.me/917220000877?text=Hello%20Aura%20Chemicals%2C%20I%20would%20like%20to%20request%20a%20commercial%20quote."
          target="_blank"
          rel="noopener noreferrer"
          className="tabbar-item tabbar-whatsapp"
          aria-label="WhatsApp Desk"
        >
          <MessageCircle size={20} className="tabbar-icon text-whatsapp" />
          <span className="tabbar-label">WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="tabbar-item"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} className="tabbar-icon" />
          <span className="tabbar-label">Menu</span>
        </button>
      </nav>
    </>
  );
};

export const RootLayout: React.FC = () => {
  return (
    <RFQProvider>
      <LayoutInner />
    </RFQProvider>
  );
};
