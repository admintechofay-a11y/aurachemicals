import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronDown } from 'lucide-react';
import { Container } from '../components/common/Container';
import { SettingsDto } from '../api/types';
import { UI_LABELS } from '../utils/constants';

interface FooterProps {
  settings?: SettingsDto;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const brandName = settings?.company?.brand_name || 'Aura Chemicals';
  const legalName = settings?.company?.legal_name || 'Aura Space Infra Private Limited';
  const tagline = settings?.company?.tagline || 'Your Trusted Partner in Chemical Excellence';
  const roc = settings?.company?.roc_registration || 'ROC Ahmedabad';
  const phone = settings?.company?.phone;
  const email = settings?.company?.email;
  const address = settings?.company?.registered_address || 'ROC Ahmedabad, Gujarat, India';
  const copyright = settings?.footer?.copyright_text || 'Copyright © 2026 Aura Space Infra Pvt. Ltd. All rights reserved.';
  const legalTagline = settings?.footer?.tagline || 'ROC Ahmedabad Registered · Non-Government Industrial Supply Enterprise';
  const logoUrl =
    settings?.branding?.footer_logo?.url ||
    settings?.branding?.header_logo?.url ||
    '/images/aa6efd8e-logo-footer.png';

  // Mobile Accordion State (Contact open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    company: false,
    products: false,
    industries: false,
    resources: false,
    contact: true, // Contact open by default on mobile
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer className="footer" style={{ marginTop: 'auto', borderTop: '1px solid rgba(213, 217, 220, 0.12)' }}>
      <Container>
        {/* Desktop 5-Column Grid */}
        <div
          className="desktop-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 'clamp(24px, 3vw, 40px)',
            paddingTop: 'var(--space-16)',
            paddingBottom: 'var(--space-12)',
            borderBottom: '1px solid rgba(213, 217, 220, 0.12)',
          }}
        >
          {/* Column 1: Company */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: 'var(--space-4)' }} aria-label={brandName}>
              <img
                src={logoUrl}
                alt={brandName}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    '/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png';
                }}
                style={{
                  height: '42px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Link>
            <p style={{ fontSize: '0.875rem', color: 'rgba(244, 245, 245, 0.78)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              {tagline}
            </p>
            <div style={{ fontSize: '0.8125rem', color: 'rgba(244, 245, 245, 0.60)', lineHeight: 1.5 }}>
              <div><strong>{legalName}</strong></div>
              <div>Registered at {roc}</div>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 style={{ color: 'var(--color-paper)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-4)' }}>
              {UI_LABELS.FOOTER_PRODUCTS}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link to="/products/api" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  Active Pharma Ingredients (APIs)
                </Link>
              </li>
              <li>
                <Link to="/products/solvents" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  Solvents & Intermediates
                </Link>
              </li>
              <li>
                <Link to="/products/manufacturing-phosphates" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  Manufacturing Phosphates
                </Link>
              </li>
              <li>
                <Link to="/products/imports" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  Own Import Products
                </Link>
              </li>
              <li>
                <Link to="/products" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)', fontWeight: 600 }}>
                  All 135 Catalog Products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div>
            <h4 style={{ color: 'var(--color-paper)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-4)' }}>
              {UI_LABELS.FOOTER_INDUSTRIES}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link to="/industries" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  Healthcare & Pharmaceuticals
                </Link>
              </li>
              <li>
                <Link to="/industries" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  Agrochemicals & Fertilizers
                </Link>
              </li>
              <li>
                <Link to="/industries" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  Water Treatment & Effluent Plants
                </Link>
              </li>
              <li>
                <Link to="/industries" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  Paints & Industrial Coatings
                </Link>
              </li>
              <li>
                <Link to="/industries" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)', fontWeight: 600 }}>
                  View All 19 Sectors →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 style={{ color: 'var(--color-paper)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-4)' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link to="/about-us" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  About Aura Chemicals
                </Link>
              </li>
              <li>
                <Link to="/our-mission" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  Corporate Mission & Stewardship
                </Link>
              </li>
              <li>
                <Link to="/services" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  NDT Inspection & Services
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" style={{ fontSize: '0.875rem', color: 'var(--color-accent-on-dark)' }}>
                  Privacy & Compliance Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div>
            <h4 style={{ color: 'var(--color-paper)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-4)' }}>
              {UI_LABELS.FOOTER_CONTACT}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--color-paper)',
                    fontSize: '0.875rem',
                  }}
                >
                  <Phone size={15} style={{ color: 'var(--color-accent-on-dark)' }} />
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
                    color: 'var(--color-paper)',
                    fontSize: '0.875rem',
                  }}
                >
                  <Mail size={15} style={{ color: 'var(--color-accent-on-dark)' }} />
                  <span>{email}</span>
                </a>
              )}
              <div style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '8px', color: 'rgba(244, 245, 245, 0.70)', fontSize: '0.8125rem' }}>
                <MapPin size={15} style={{ color: 'var(--color-accent-on-dark)', flexShrink: 0, marginTop: '2px' }} />
                <span>{address}</span>
              </div>
              <div style={{ marginTop: '6px' }}>
                <Link
                  to="/get-a-quote"
                  style={{
                    color: 'var(--color-accent-on-dark)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textDecoration: 'underline',
                  }}
                >
                  Request Commercial RFQ →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Accordion Footer (Below 768px) */}
        <div className="mobile-footer-accordion" style={{ display: 'none', paddingTop: 'var(--space-8)' }}>
          {/* Logo & Tagline */}
          <div style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(213, 217, 220, 0.12)' }}>
            <img
              src={logoUrl}
              alt={brandName}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  '/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png';
              }}
              style={{ height: '36px', width: 'auto', marginBottom: '8px' }}
            />
            <p style={{ fontSize: '0.875rem', color: 'rgba(244, 245, 245, 0.75)' }}>{tagline}</p>
          </div>

          {/* Contact Accordion (Open by default) */}
          <div style={{ borderBottom: '1px solid rgba(213, 217, 220, 0.12)' }}>
            <button
              type="button"
              onClick={() => toggleSection('contact')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 0',
                background: 'none',
                border: 'none',
                color: 'var(--color-paper)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer',
              }}
            >
              <span>{UI_LABELS.FOOTER_CONTACT}</span>
              <ChevronDown size={16} style={{ transform: openSections.contact ? 'rotate(180deg)' : 'none' }} />
            </button>
            {openSections.contact && (
              <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {phone && (
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-paper)' }}>
                    <Phone size={15} style={{ color: 'var(--color-accent-on-dark)' }} />
                    <span>{phone}</span>
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-paper)' }}>
                    <Mail size={15} style={{ color: 'var(--color-accent-on-dark)' }} />
                    <span>{email}</span>
                  </a>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(244, 245, 245, 0.70)', fontSize: '0.8125rem' }}>
                  <MapPin size={15} style={{ color: 'var(--color-accent-on-dark)' }} />
                  <span>{address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Products Accordion */}
          <div style={{ borderBottom: '1px solid rgba(213, 217, 220, 0.12)' }}>
            <button
              type="button"
              onClick={() => toggleSection('products')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 0',
                background: 'none',
                border: 'none',
                color: 'var(--color-paper)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer',
              }}
            >
              <span>{UI_LABELS.FOOTER_PRODUCTS}</span>
              <ChevronDown size={16} style={{ transform: openSections.products ? 'rotate(180deg)' : 'none' }} />
            </button>
            {openSections.products && (
              <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/products/api" style={{ color: 'var(--color-accent-on-dark)', fontSize: '0.875rem' }}>APIs</Link>
                <Link to="/products/solvents" style={{ color: 'var(--color-accent-on-dark)', fontSize: '0.875rem' }}>Solvents</Link>
                <Link to="/products" style={{ color: 'var(--color-accent-on-dark)', fontSize: '0.875rem', fontWeight: 600 }}>All Products →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Legal & Copyright Line */}
        <div
          style={{
            padding: '20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8125rem',
            color: 'rgba(244, 245, 245, 0.55)',
          }}
        >
          <div>
            {copyright} · <span style={{ color: 'rgba(244, 245, 245, 0.70)' }}>{legalTagline}</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/privacy-policy" style={{ color: 'rgba(244, 245, 245, 0.65)' }}>
              Privacy Policy
            </Link>
            <Link to="/contact" style={{ color: 'rgba(244, 245, 245, 0.65)' }}>
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
