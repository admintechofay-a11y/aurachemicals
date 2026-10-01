import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, Phone, Search, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { Container } from '../components/common/Container';
import { SettingsDto } from '../api/types';
import { useRFQ } from '../context/RFQContext';

interface NavbarProps {
  settings?: SettingsDto;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenMobileMenu, onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const { totalCount, openDrawer } = useRFQ();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setMegaMenuOpen(false);
  }, [location.pathname]);

  // Handle outside click & escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && megaMenuOpen) {
        setMegaMenuOpen(false);
        triggerButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [megaMenuOpen]);

  const phone = settings?.company?.phone || '+91 97274 04415';
  const logoUrl = settings?.branding?.header_logo?.url || '/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png';

  const productCategories = [
    {
      index: '01',
      title: 'Active Pharmaceutical Ingredients',
      count: '94 APIs',
      desc: 'Analgesics, Antibiotics, NSAIDs, Antivirals under IP, BP, USP, EP, JP monographs',
      path: '/products?category=api'
    },
    {
      index: '02',
      title: 'Industrial Solvents & Intermediates',
      count: '20 Chemicals',
      desc: 'MEG, DMF, Toluene, Acetone, N-Hexene, Ethyl Acetate, IPA in drums and bulk ISO tanks',
      path: '/products?category=solvents'
    },
    {
      index: '03',
      title: 'In-House Phosphate Manufacturing',
      count: '11 Salts',
      desc: 'Mono, Di, Tri, Tetra Sodium, Potassium and Ammonium phosphates (Crystals & Anhydrous)',
      path: '/products?category=manufacturing-phosphates'
    },
    {
      index: '04',
      title: 'Direct Global Imports',
      count: '05 Lines',
      desc: 'EDTA Salts, Sodium Percarbonate, Citric Acid, Sodium Gluconate, Xanthan Gum (China make)',
      path: '/products?category=imports'
    },
    {
      index: '05',
      title: 'Technical & Commercial Acids',
      count: '06 Acids',
      desc: 'Glacial Acetic Acid 99.8% (GNFC), Formic Acid 85%, Hydrochloric, Sulphuric, Phosphoric',
      path: '/products?category=acids'
    },
    {
      index: '06',
      title: 'Water Treatment & ETP Chemicals',
      count: '14 Compounds',
      desc: 'Poly Aluminium Chloride (PAC), Sodium Hypochlorite, Ferric Chloride, Flocculants',
      path: '/products?category=industrial-chemicals'
    },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)',
        backgroundColor: 'var(--color-surface-white)',
        borderBottom: isScrolled ? '1px solid var(--color-rule-strong)' : '1px solid var(--color-rule)',
        transition: 'all 200ms ease',
        boxShadow: isScrolled ? '0 2px 12px rgba(8, 27, 51, 0.06)' : 'none',
      }}
    >
      {/* Top Utility Verification Strip */}
      <div
        style={{
          backgroundColor: 'var(--color-paper-subtle)',
          borderBottom: '1px solid var(--color-rule)',
          padding: '4px 0',
          fontSize: '0.6875rem',
          fontFamily: 'var(--font-family-mono)',
          color: 'var(--color-text-muted)',
        }}
      >
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-ink-navy)', fontWeight: 600 }}>
                <ShieldCheck size={12} color="var(--color-teal)" />
                AURA SPACE INFRA PVT. LTD.
              </span>
              <span>·</span>
              <span>ROC AHMEDABAD</span>
              <span>·</span>
              <span>ESTD. 2014</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-primary)' }}
              >
                <Phone size={11} color="var(--color-teal)" />
                <span>Desk: {phone}</span>
              </a>
              <span>·</span>
              <a
                href="https://wa.me/919727404415"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0F5132', fontWeight: 600 }}
              >
                WhatsApp Desk
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Header Row (72px) */}
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
            gap: 'var(--space-6)',
          }}
        >
          {/* Logo & Brand Identity */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            aria-label="Aura Chemicals - Home"
          >
            <img
              src={logoUrl}
              alt="Aura Chemicals"
              style={{
                height: '36px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--color-ink-navy)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em'
              }}>
                AURA CHEMICALS
              </span>
              <span style={{
                fontFamily: 'var(--font-family-mono)',
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-muted)'
              }}>
                Chemical & API Sourcing
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'var(--space-6)',
            }}
            className="desktop-nav"
            aria-label="Primary Navigation"
          >
            {/* Products with Mega Menu */}
            <div
              ref={dropdownRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                ref={triggerButtonRef}
                type="button"
                onClick={() => setMegaMenuOpen((prev) => !prev)}
                aria-expanded={megaMenuOpen}
                aria-haspopup="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'var(--font-family-base)',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: location.pathname.startsWith('/products') ? 'var(--color-teal)' : 'var(--color-ink-navy)',
                  padding: '8px 0',
                }}
              >
                <span>Products</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: megaMenuOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--motion-duration-fast)',
                  }}
                />
              </button>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div
                  className="mega-menu"
                  role="menu"
                  style={{ left: '-200px', width: '920px' }}
                >
                  <Container>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      paddingBottom: '12px',
                      marginBottom: '16px',
                      borderBottom: '1px solid var(--color-rule)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="section-index">01 / DIRECTORY</span>
                        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-ink-navy)' }}>
                          Chemical & Pharmaceutical Product Families
                        </span>
                      </div>
                      <Link
                        to="/products"
                        style={{ fontSize: '0.8125rem', color: 'var(--color-teal)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>View All Products (140+)</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>

                    <div className="mega-menu-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {productCategories.map((cat) => (
                        <Link
                          key={cat.index}
                          to={cat.path}
                          className="mega-menu-item"
                          style={{ textDecoration: 'none', display: 'block' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.6875rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                              {cat.index}
                            </span>
                            <span style={{
                              fontFamily: 'var(--font-family-mono)',
                              fontSize: '0.6875rem',
                              backgroundColor: 'var(--color-paper-subtle)',
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-xs)',
                              color: 'var(--color-text-secondary)'
                            }}>
                              {cat.count}
                            </span>
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-ink-navy)', marginBottom: '4px' }}>
                            {cat.title}
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4, margin: 0 }}>
                            {cat.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </Container>
                </div>
              )}
            </div>

            <Link
              to="/industries"
              style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: location.pathname.startsWith('/industries') ? 'var(--color-teal)' : 'var(--color-ink-navy)',
              }}
            >
              Industries (19)
            </Link>

            <Link
              to="/services"
              style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: location.pathname === '/services' ? 'var(--color-teal)' : 'var(--color-ink-navy)',
              }}
            >
              Services (Inspection & QA)
            </Link>

            <Link
              to="/about-us"
              style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: location.pathname === '/about-us' || location.pathname === '/our-mission' ? 'var(--color-teal)' : 'var(--color-ink-navy)',
              }}
            >
              About
            </Link>

            <Link
              to="/contact"
              style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: location.pathname === '/contact' ? 'var(--color-teal)' : 'var(--color-ink-navy)',
              }}
            >
              Contact
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Command-K Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: 'var(--color-paper-subtle)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--color-text-muted)',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-family-mono)',
              }}
              title="Search chemicals (Cmd+K or /)"
              aria-label="Open chemical catalog search"
            >
              <Search size={14} />
              <span className="desktop-only" style={{ display: 'none' }}>Search</span>
              <kbd style={{
                backgroundColor: 'var(--color-surface-white)',
                border: '1px solid var(--color-rule-strong)',
                borderRadius: '2px',
                padding: '1px 5px',
                fontSize: '0.6875rem'
              }}>
                ⌘K
              </kbd>
            </button>

            {/* Persistent RFQ Basket Trigger */}
            <button
              type="button"
              onClick={openDrawer}
              className="rfq-basket-trigger"
              aria-label={`View RFQ quotation basket with ${totalCount} items`}
              title="View quotation basket"
            >
              <FileText size={16} />
              <span style={{ fontWeight: 600 }}>RFQ</span>
              {totalCount > 0 && (
                <span className="rfq-basket-count tabular-nums">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Primary Quote CTA Button */}
            <Link
              to="/get-a-quote"
              className="btn btn-primary btn-sm desktop-nav"
              style={{ gap: '6px' }}
            >
              <span>Request Quote</span>
              <ArrowRight size={14} />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="mobile-nav-toggle"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                color: 'var(--color-ink-navy)',
              }}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};
