import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Phone, MessageCircle, FileText } from 'lucide-react';
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
      <a href="#content" className="skip-to-content">
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

      {/* Mobile Persistent Bottom Bar (Phone, WhatsApp, RFQ Basket) */}
      <div className="mobile-bottom-bar" role="navigation" aria-label="Quick Actions">
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.6875rem', color: 'var(--color-text-primary)' }}
        >
          <Phone size={18} color="var(--color-teal)" />
          <span>Call Desk</span>
        </a>

        <a
          href="https://wa.me/919727404415"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.6875rem', color: '#0F5132' }}
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={openDrawer}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.6875rem', color: 'var(--color-ink-navy)', position: 'relative' }}
        >
          <div style={{ position: 'relative' }}>
            <FileText size={18} color="var(--color-teal)" />
            {totalCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-8px',
                  backgroundColor: 'var(--color-teal)',
                  color: '#FFFFFF',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalCount}
              </span>
            )}
          </div>
          <span>RFQ Basket</span>
        </button>

        <Link
          to="/get-a-quote"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-ink-navy)',
            color: '#FFFFFF',
            padding: '6px 12px',
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          Get Quote
        </Link>
      </div>
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
