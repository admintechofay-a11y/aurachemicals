import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Menu, ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { SettingsDto } from '../api/types';
import { api } from '../api/client';
import { UI_LABELS } from '../utils/constants';

interface NavbarProps {
  settings?: SettingsDto;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Fetch product categories from CMS for dynamic dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => api.getProductCategories(),
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setProductsOpen(false);
  }, [location.pathname]);

  // Handle outside click & escape key for dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && productsOpen) {
        setProductsOpen(false);
        triggerButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [productsOpen]);

  const brandName = settings?.company?.brand_name || 'Aura Chemicals';
  const logoUrl = settings?.branding?.header_logo?.url || '/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png';
  const phone = settings?.company?.phone;

  const isProductsActive = location.pathname.startsWith('/products');

  return (
    <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
      {/* Client Controlled Site-Wide Announcement Bar */}
      {settings?.announcement?.enabled && settings.announcement.text && (
        <div
          style={{
            backgroundColor: 'var(--color-ink)',
            color: 'var(--color-paper)',
            padding: '6px 0',
            fontSize: '0.8125rem',
            textAlign: 'center',
            letterSpacing: '0.01em',
            borderBottom: '1px solid var(--color-rule)',
          }}
        >
          <Container>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-ink-dark)',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Notice
              </span>
              <span>{settings.announcement.text}</span>
              {settings.announcement.url && (
                <Link
                  to={settings.announcement.url}
                  style={{
                    color: 'var(--color-accent-on-dark)',
                    textDecoration: 'underline',
                    fontWeight: 500,
                    marginLeft: '4px',
                  }}
                >
                  Learn More →
                </Link>
              )}
            </div>
          </Container>
        </div>
      )}

      {/* Main navigation container (60-64px mobile, 76px desktop) */}
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'clamp(60px, 7vw, 76px)',
            gap: 'var(--space-6)',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            aria-label={brandName}
          >
            <img
              src={logoUrl}
              alt={brandName}
              style={{
                height: 'clamp(38px, 5vw, 48px)',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Link>

          {/* Desktop Navigation (Visible at >= 1024px) */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'clamp(20px, 2.5vw, 32px)',
            }}
            className="desktop-nav"
            aria-label="Main Navigation"
          >
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              {UI_LABELS.NAV_HOME}
            </Link>

            <Link
              to="/about-us"
              className={`nav-link ${location.pathname === '/about-us' ? 'active' : ''}`}
            >
              {UI_LABELS.NAV_ABOUT}
            </Link>

            {/* Products Dropdown (operable by hover, click and keyboard) */}
            <div
              ref={dropdownRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                ref={triggerButtonRef}
                type="button"
                onClick={() => setProductsOpen((prev) => !prev)}
                aria-expanded={productsOpen}
                aria-haspopup="true"
                className={`nav-link ${isProductsActive ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.9375rem',
                  fontFamily: 'inherit',
                }}
              >
                <span>{UI_LABELS.NAV_PRODUCTS}</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: productsOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--motion-duration-fast) var(--motion-ease)',
                  }}
                />
              </button>

              {productsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '280px',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 8px 24px rgba(22, 25, 29, 0.10)',
                    padding: '8px 0',
                    zIndex: 1100,
                  }}
                  role="menu"
                >
                  <Link
                    to="/products"
                    role="menuitem"
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--color-ink)',
                      borderBottom: '1px solid var(--color-rule)',
                    }}
                  >
                    All Products Catalog
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products/${cat.slug}`}
                      role="menuitem"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 16px',
                        fontSize: '0.875rem',
                        color: 'var(--color-text)',
                      }}
                    >
                      <span>{cat.name}</span>
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

            <Link
              to="/industries"
              className={`nav-link ${location.pathname.startsWith('/industries') ? 'active' : ''}`}
            >
              {UI_LABELS.NAV_INDUSTRIES}
            </Link>

            <Link
              to="/services"
              className={`nav-link ${location.pathname.startsWith('/services') ? 'active' : ''}`}
            >
              {UI_LABELS.NAV_SERVICES}
            </Link>

            <Link
              to="/our-mission"
              className={`nav-link ${location.pathname === '/our-mission' ? 'active' : ''}`}
            >
              {UI_LABELS.NAV_MISSION}
            </Link>

            <Link
              to="/contact"
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              {UI_LABELS.NAV_CONTACT}
            </Link>
          </nav>

          {/* Action CTAs (Desktop Request a Quote + Mobile Hamburger) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Button
              to="/get-a-quote"
              variant="primary"
              size="md"
              className="header-quote-btn"
              icon={<ArrowRight size={15} />}
            >
              {UI_LABELS.NAV_GET_A_QUOTE}
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={onOpenMobileMenu}
              aria-label={UI_LABELS.MENU_TOGGLE}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-ink)',
                cursor: 'pointer',
              }}
              className="mobile-nav-toggle"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};
