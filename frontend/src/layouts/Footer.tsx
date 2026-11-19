import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Container } from '../components/common/Container';
import { SettingsDto } from '../api/types';

interface FooterProps {
  settings?: SettingsDto;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  const phone = settings?.company?.phone || '+91 97274 04415';
  const email = settings?.company?.email || 'management.aurachemicals@gmail.com';
  const logoUrl = settings?.branding?.header_logo?.url || '/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productCategories = [
    { title: 'Active Pharmaceutical Ingredients (94)', path: '/products?category=api' },
    { title: 'Industrial Solvents & Intermediates (20)', path: '/products?category=solvents' },
    { title: 'Phosphates & Inorganic Salts (11)', path: '/products?category=manufacturing-phosphates' },
    { title: 'Direct Global Imports (China Make) (5)', path: '/products?category=imports' },
    { title: 'Technical & Commercial Acids (6)', path: '/products?category=acids' },
    { title: 'Water Treatment & ETP Chemicals (14)', path: '/products?category=industrial-chemicals' },
  ];

  const companyLinks = [
    { label: 'About Company & History', path: '/about-us' },
    { label: 'Our Mission & Sourcing Model', path: '/our-mission' },
    { label: 'Industries Served (19 Sectors)', path: '/industries' },
    { label: 'Inspection & NDT Services', path: '/services' },
    { label: 'Corporate Contact Desk', path: '/contact' },
  ];

  const complianceLinks = [
    { label: 'Request Quotation (RFQ)', path: '/get-a-quote' },
    { label: 'Commercial Terms of Supply', path: '/terms' },
    { label: 'Privacy & Data Protection', path: '/privacy-policy' },
    { label: 'Design System & Specs', path: '/design-system' },
  ];

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-ink-deep)',
        color: 'var(--color-text-on-dark)',
        borderTop: '1px solid var(--color-rule-dark)',
        marginTop: 'auto',
      }}
    >
      <Container>
        {/* 4-Column Grid */}
        <div
          style={{
            padding: 'clamp(48px, 6vw, 72px) 0 clamp(32px, 4vw, 48px) 0',
            borderBottom: '1px solid var(--color-rule-dark)',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(24px, 3vw, 36px)',
          }}
        >
          {/* Column 1: Identity & Contact */}
          <div style={{ gridColumn: 'span 12' }} className="footer-col-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img
                src={logoUrl}
                alt="Aura Chemicals"
                style={{
                  height: '32px',
                  width: 'auto',
                  backgroundColor: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              />
              <div>
                <span style={{
                  fontFamily: 'var(--font-family-display)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: 'var(--color-text-on-dark)',
                  display: 'block',
                  lineHeight: 1.1,
                }}>
                  AURA CHEMICALS
                </span>
                <span style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted-dark)',
                }}>
                  Aura Space Infra Pvt. Ltd. (ROC Ahmedabad)
                </span>
              </div>
            </div>

            <p style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted-dark)',
              lineHeight: 1.5,
              marginBottom: '16px',
              maxWidth: '320px',
            }}>
              Supplying verified APIs, industrial solvents, and manufactured phosphates to commercial formulation facilities across India since 2014.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)' }}
              >
                <Phone size={14} />
                <span>{phone}</span>
              </a>
              <a
                href={`mailto:${email}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted-dark)' }}
              >
                <Mail size={14} />
                <span>{email}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Chemical Categories */}
          <div style={{ gridColumn: 'span 12' }} className="footer-col-2">
            <h4 style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-accent)',
              marginBottom: '14px',
            }}>
              Chemical Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {productCategories.map((c) => (
                <li key={c.title}>
                  <Link
                    to={c.path}
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted-dark)',
                      transition: 'color 150ms ease',
                    }}
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company & Services */}
          <div style={{ gridColumn: 'span 12' }} className="footer-col-3">
            <h4 style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-accent)',
              marginBottom: '14px',
            }}>
              Company & Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.path}
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted-dark)',
                      transition: 'color 150ms ease',
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Compliance & Governance */}
          <div style={{ gridColumn: 'span 12' }} className="footer-col-4">
            <h4 style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-accent)',
              marginBottom: '14px',
            }}>
              Compliance & RFQ
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {complianceLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.path}
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted-dark)',
                      transition: 'color 150ms ease',
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                onClick={scrollToTop}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-on-dark)',
                  padding: '6px 12px',
                  border: '1px solid var(--color-rule-dark)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                }}
              >
                <ArrowUp size={12} />
                <span>Return to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Regulatory & B2B Compliance Disclaimer */}
        <div
          style={{
            padding: '20px 0',
            borderBottom: '1px solid var(--color-rule-dark)',
            fontSize: '0.6875rem',
            lineHeight: 1.6,
            color: 'var(--color-text-muted-dark)',
          }}
        >
          <p style={{ margin: 0 }}>
            <strong style={{ color: 'var(--color-text-on-dark)' }}>Commercial Notice:</strong> Chemicals and APIs listed are supplied strictly for commercial manufacturing, pharmaceutical synthesis, and industrial processing to licensed entities. Products are not intended for retail consumption. All supplies governed by formal purchase orders and batch CoAs.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Tech Partner */}
        <div style={{
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted-dark)',
        }}>
          <div>
            © {currentYear} Aura Space Infra Private Limited. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Powered by</span>
            <span style={{ color: 'var(--color-text-on-dark)', fontWeight: 600 }}>TECHOFY Global</span>
          </div>
        </div>
      </Container>

      {/* Responsive Grid Styles for Footer */}
      <style>{`
        @media (min-width: 1024px) {
          .footer-col-1 { grid-column: span 4 !important; }
          .footer-col-2 { grid-column: span 3 !important; }
          .footer-col-3 { grid-column: span 3 !important; }
          .footer-col-4 { grid-column: span 2 !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .footer-col-1 { grid-column: span 6 !important; }
          .footer-col-2 { grid-column: span 6 !important; }
          .footer-col-3 { grid-column: span 6 !important; }
          .footer-col-4 { grid-column: span 6 !important; }
        }
        @media (max-width: 639px) {
          .footer-col-1, .footer-col-2, .footer-col-3, .footer-col-4 {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </footer>
  );
};
