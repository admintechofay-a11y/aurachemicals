import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { X, Phone, Mail, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { SettingsDto } from '../api/types';
import { api } from '../api/client';
import { UI_LABELS } from '../utils/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SettingsDto;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, settings }) => {
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [productsAccordionOpen, setProductsAccordionOpen] = useState(false);

  // Fetch product categories from CMS
  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => api.getProductCategories(),
  });

  const decodeHtml = (html: string) => {
    return html
      .replace(/&amp;/g, '&')
      .replace(/&#038;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  };

  const activeCategories = categories.filter((cat) => (cat.count ?? 0) > 0);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Focus trap, Escape key, scroll lock, and focus restore
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const phone = settings?.company?.phone || '+91 97274 04415';
  const email = settings?.company?.email || 'management.aurachemicals@gmail.com';

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '54px',
    padding: '0 20px',
    fontSize: '1rem',
    fontFamily: 'var(--font-family-display)',
    fontWeight: 600,
    color: 'var(--color-ink-navy)',
    borderBottom: '1px solid var(--color-rule)',
    textDecoration: 'none',
    transition: 'color 150ms ease, background-color 150ms ease',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(6, 20, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Right-side drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        style={{
          position: 'relative',
          width: '88%',
          maxWidth: '380px',
          height: '100%',
          backgroundColor: 'var(--color-surface-white)',
          boxShadow: '-12px 0 32px rgba(6, 20, 42, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2001,
          outline: 'none',
        }}
      >
        {/* Header: 60-64px */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            padding: '0 20px',
            backgroundColor: 'var(--color-surface-white)',
            borderBottom: '1px solid var(--color-rule)',
          }}
        >
          <span style={{ fontWeight: 700, color: 'var(--color-ink-navy)', fontSize: '1.125rem', fontFamily: 'var(--font-family-display)' }}>
            Menu
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={UI_LABELS.CLOSE_MENU}
            style={{
              width: '38px',
              height: '38px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-paper)',
              border: '1px solid var(--color-rule)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--color-ink-navy)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 56px Nav Rows with Products Accordion */}
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          <Link to="/" style={rowStyle}>
            <span>{UI_LABELS.NAV_HOME}</span>
          </Link>

          <Link to="/about-us" style={rowStyle}>
            <span>{UI_LABELS.NAV_ABOUT}</span>
          </Link>

          {/* Products Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setProductsAccordionOpen((prev) => !prev)}
              aria-expanded={productsAccordionOpen}
              style={{
                ...rowStyle,
                width: '100%',
                background: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{UI_LABELS.NAV_PRODUCTS}</span>
              <ChevronDown
                size={18}
                style={{
                  transform: productsAccordionOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform var(--motion-duration-fast) var(--motion-ease)',
                }}
              />
            </button>

            {productsAccordionOpen && (
              <div style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-rule)' }}>
                <Link
                  to="/products"
                  style={{
                    ...rowStyle,
                    minHeight: '48px',
                    paddingLeft: '36px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    borderBottom: '1px solid var(--color-rule)',
                  }}
                >
                  All Products Catalog
                </Link>
                {activeCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products/${cat.slug}`}
                    style={{
                      ...rowStyle,
                      minHeight: '48px',
                      paddingLeft: '36px',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid var(--color-rule)',
                    }}
                  >
                    <span>{decodeHtml(cat.name)}</span>
                    {typeof cat.count === 'number' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                        {cat.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/industries" style={rowStyle}>
            <span>{UI_LABELS.NAV_INDUSTRIES}</span>
          </Link>

          <Link to="/services" style={rowStyle}>
            <span>{UI_LABELS.NAV_SERVICES}</span>
          </Link>

          <Link to="/our-mission" style={rowStyle}>
            <span>{UI_LABELS.NAV_MISSION}</span>
          </Link>

          <Link to="/contact" style={rowStyle}>
            <span>{UI_LABELS.NAV_CONTACT}</span>
          </Link>
        </nav>

        {/* Pinned Bottom Drawer: Request a Quote + Contact Links */}
        <div
          style={{
            padding: '16px 20px calc(16px + env(safe-area-inset-bottom, 12px)) 20px',
            borderTop: '1px solid var(--color-rule)',
            backgroundColor: 'var(--color-surface-white)',
          }}
        >
          <Link
            to="/get-a-quote"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '14px', gap: '8px' }}
          >
            <span>{UI_LABELS.NAV_GET_A_QUOTE}</span>
            <ArrowRight size={16} />
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--color-ink-navy)',
                  padding: '6px 0',
                  fontWeight: 500,
                }}
              >
                <Phone size={15} style={{ color: 'var(--color-teal)' }} />
                <span>{phone}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--color-ink-navy)',
                  padding: '6px 0',
                  fontWeight: 500,
                }}
              >
                <Mail size={15} style={{ color: 'var(--color-teal)' }} />
                <span>{email}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
