import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
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
  const copyright = settings?.footer?.copyright_text || 'Copyright © 2026 Aura Space Infra Pvt. Ltd. All rights reserved.';
  const poweredBy = settings?.footer?.powered_by || 'TECHOFY Global Ventures';
  const logoUrl = settings?.branding?.footer_logo?.url || settings?.branding?.header_logo?.url || '/images/aa6efd8e-logo-footer.png';

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        paddingTop: 'var(--space-16)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        marginTop: 'auto',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-10)',
            paddingBottom: 'var(--space-12)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Column 1: Company Profile */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: 'var(--space-4)' }}>
              <img
                src={logoUrl}
                alt={brandName}
                style={{
                  height: '46px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Link>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.6,
                marginBottom: 'var(--space-4)',
              }}
            >
              {tagline}
            </p>
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: 1.5,
              }}
            >
              <div><strong>Legal Entity:</strong> {legalName}</div>
              <div><strong>Jurisdiction:</strong> Registered at {roc}</div>
              <div><strong>Experience:</strong> 7+ Years in API & Chemical Distribution</div>
            </div>
          </div>

          {/* Column 2: Products Directory */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '0.9375rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--space-4)',
              }}
            >
              {UI_LABELS.FOOTER_PRODUCTS}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Active Pharmaceutical Ingredients', path: '/products/api' },
                { label: 'Solvents & Intermediates', path: '/products/solvents' },
                { label: 'Manufacturing Phosphates', path: '/products/manufacturing-phosphates' },
                { label: 'Own Import Products (China Make)', path: '/products/imports' },
                { label: 'Commercial & Technical Acids', path: '/products/acids' },
                { label: 'ETP & Industrial Chemicals', path: '/products/industrial-chemicals' },
                { label: 'Complete Chemical Catalog →', path: '/products' },
              ].map((item, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                  <Link
                    to={item.path}
                    style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.75)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '0.9375rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--space-4)',
              }}
            >
              {UI_LABELS.FOOTER_INDUSTRIES}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Healthcare & Pharmaceuticals', path: '/industries/healthcare' },
                { label: 'Agrochemicals & Fertilizers', path: '/industries/agrochemicals' },
                { label: 'Water Treatment & ETP Plants', path: '/industries/water-treatment' },
                { label: 'Food & Beverage Sector', path: '/industries/food-beverage' },
                { label: 'Energy Sector & Petrochemicals', path: '/industries/energy-oil-gas' },
                { label: 'Paints, Coatings & Inks', path: '/industries/paints-coatings' },
                { label: 'View All 19 Industry Sectors →', path: '/industries' },
              ].map((item, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                  <Link
                    to={item.path}
                    style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.75)',
                      textDecoration: 'none',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Inquiries */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '0.9375rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--space-4)',
              }}
            >
              {UI_LABELS.FOOTER_CONTACT}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.875rem',
                  }}
                >
                  <Phone size={16} style={{ color: 'var(--color-accent)' }} />
                  <span>{phone}</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.875rem',
                  }}
                >
                  <Mail size={16} style={{ color: 'var(--color-accent)' }} />
                  <span>{email}</span>
                </a>
              )}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8125rem',
                }}
              >
                <MapPin size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                <span>ROC Ahmedabad, Gujarat, India</span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Link
                  to="/get-a-quote"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--color-accent)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  <span>Submit a Bulk RFQ Online</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer Legal Band */}
        <div
          style={{
            padding: '24px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.8125rem',
            color: 'rgba(255, 255, 255, 0.55)',
          }}
        >
          <div>
            {copyright} | <span style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Powered by {poweredBy}</span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/privacy-policy" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              Privacy Policy
            </Link>
            <Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
