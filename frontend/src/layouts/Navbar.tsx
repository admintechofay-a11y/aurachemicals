import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { SettingsDto } from '../api/types';
import { UI_LABELS } from '../utils/constants';

interface NavbarProps {
  settings?: SettingsDto;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();

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

  const brandName = settings?.company?.brand_name || 'Aura Chemicals';
  const logoUrl = settings?.branding?.header_logo?.url || '/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png';
  const phone = settings?.company?.phone;

  const navLinks = [
    { label: UI_LABELS.NAV_HOME, path: '/' },
    { label: UI_LABELS.NAV_ABOUT, path: '/about-us' },
    {
      label: UI_LABELS.NAV_PRODUCTS,
      path: '/products',
      hasDropdown: true,
    },
    { label: UI_LABELS.NAV_INDUSTRIES, path: '/industries' },
    { label: UI_LABELS.NAV_SERVICES, path: '/services' },
    { label: UI_LABELS.NAV_MISSION, path: '/our-mission' },
    { label: UI_LABELS.NAV_CONTACT, path: '/contact' },
  ];

  return (
    <header
      className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
      }}
    >
      {/* Client Controlled Site-Wide Announcement Bar */}
      {settings?.announcement?.enabled && settings.announcement.text && (
        <div
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            padding: '7px 0',
            fontSize: '0.8125rem',
            textAlign: 'center',
            letterSpacing: '0.02em',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <Container>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)', fontWeight: 700, padding: '2px 8px', borderRadius: '2px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Notice
              </span>
              <span>{settings.announcement.text}</span>
              {settings.announcement.url && (
                <Link
                  to={settings.announcement.url}
                  style={{
                    color: 'var(--color-accent)',
                    textDecoration: 'underline',
                    fontWeight: 600,
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

      {/* Top micro contact bar if phone exists */}
      {phone && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '4px 0',
            fontSize: '0.8125rem',
            color: 'var(--color-muted)',
          }}
        >
          <Container>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{settings?.company?.roc_registration ? `Registered at ${settings.company.roc_registration}` : ''}</span>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--color-primary)',
                  fontWeight: 500,
                }}
              >
                <Phone size={12} />
                <span>{phone}</span>
              </a>
            </div>
          </Container>
        </div>
      )}

      {/* Main navigation container */}
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
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
                height: '48px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'var(--space-6)',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.path}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                  >
                    <Link
                      to={link.path}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px 0',
                        fontSize: '0.9375rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--color-accent)' : 'var(--color-primary)',
                      }}
                    >
                      <span>{link.label}</span>
                      <ChevronDown size={14} />
                    </Link>

                    {productsOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '0',
                          width: '260px',
                          backgroundColor: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-sm)',
                          boxShadow: 'var(--shadow-md)',
                          padding: '8px 0',
                          zIndex: 1100,
                        }}
                      >
                        <Link
                          to="/products/api"
                          style={{
                            display: 'block',
                            padding: '8px 16px',
                            fontSize: '0.875rem',
                            color: 'var(--color-text)',
                          }}
                        >
                          <strong>Active Pharmaceutical Ingredients</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>94 Verified APIs</div>
                        </Link>
                        <Link
                          to="/products/solvents"
                          style={{
                            display: 'block',
                            padding: '8px 16px',
                            fontSize: '0.875rem',
                            color: 'var(--color-text)',
                          }}
                        >
                          <strong>Solvents & Base Chemicals</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>20 Industrial Solvents</div>
                        </Link>
                        <div style={{ borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />
                        <Link
                          to="/products"
                          style={{
                            display: 'block',
                            padding: '8px 16px',
                            fontSize: '0.8125rem',
                            color: 'var(--color-accent)',
                            fontWeight: 600,
                          }}
                        >
                          View Master Chemical Catalog →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={{
                    padding: '8px 0',
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-accent)' : 'var(--color-primary)',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <Button
              to="/get-a-quote"
              variant="primary"
              size="md"
              className="header-quote-btn"
            >
              {UI_LABELS.NAV_GET_A_QUOTE}
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={onOpenMobileMenu}
              aria-label={UI_LABELS.MENU_TOGGLE}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-primary)',
                cursor: 'pointer',
              }}
              className="mobile-nav-toggle"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </Container>

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
        @media (max-width: 540px) {
          .header-quote-btn {
            padding: 8px 12px !important;
            font-size: 0.8125rem !important;
          }
        }
      `}</style>
    </header>
  );
};
