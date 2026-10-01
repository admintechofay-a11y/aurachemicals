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

  const principals = [
    'Grasim Industries Ltd. (Aditya Birla Group)',
    'Gujarat Alkalies and Chemicals Limited (GACL)',
    'Gujarat Narmada Valley Fertilizers & Chemicals (GNFC)',
    'Magnesia Chemical LLP',
  ];

  const quickLinks = [
    { label: 'About Company & History', path: '/about-us' },
    { label: 'Our Mission & Sourcing Model', path: '/our-mission' },
    { label: 'Industries Served (19 Sectors)', path: '/industries' },
    { label: 'Inspection & NDT Services', path: '/services' },
    { label: 'Request a Commercial Quote (RFQ)', path: '/get-a-quote' },
    { label: 'Corporate Contact Desk', path: '/contact' },
    { label: 'Privacy & Data Protection Policy', path: '/privacy-policy' },
    { label: 'Commercial Terms of Supply', path: '/terms' },
    { label: 'Design System & Specifications', path: '/design-system' },
  ];

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-ink-deep)',
        color: 'var(--color-text-on-dark)',
        borderTop: '2px solid var(--color-ink-navy)',
        marginTop: 'auto',
      }}
    >
      {/* Upper Architectural Grid */}
      <Container>
        <div
          style={{
            padding: 'clamp(48px, 6vw, 80px) 0 clamp(32px, 4vw, 48px) 0',
            borderBottom: '1px solid var(--color-rule-dark)',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(24px, 3vw, 40px)',
          }}
        >
          {/* Col 1-4: Corporate Identity & Spec Table */}
          <div style={{ gridColumn: 'span 12' }} className="footer-col-main">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src={logoUrl}
                alt="Aura Chemicals"
                style={{
                  height: '32px',
                  width: 'auto',
                  backgroundColor: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: '2px',
                }}
              />
              <div>
                <span style={{
                  fontFamily: 'var(--font-family-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--color-text-on-dark)',
                  display: 'block',
                  lineHeight: 1.1,
                }}>
                  AURA CHEMICALS
                </span>
                <span style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-muted-dark)',
                }}>
                  Trading Brand of Aura Space Infra Pvt. Ltd.
                </span>
              </div>
            </div>

            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-muted-dark)',
              lineHeight: 1.6,
              marginBottom: '20px',
              maxWidth: '380px',
            }}>
              Supplying verified Active Pharmaceutical Ingredients, industrial solvents, and manufactured phosphates to licensed manufacturers across India since 2014.
            </p>

            {/* Spec-Style Contact Details */}
            <div style={{
              border: '1px solid var(--color-rule-dark)',
              borderRadius: 'var(--radius-xs)',
              padding: '12px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-family-mono)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-rule-dark)' }}>
                <span style={{ color: 'var(--color-text-muted-dark)' }}>LEGAL ENTITY</span>
                <span style={{ color: 'var(--color-text-on-dark)', fontWeight: 500 }}>Aura Space Infra Pvt. Ltd.</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-rule-dark)' }}>
                <span style={{ color: 'var(--color-text-muted-dark)' }}>REGISTRATION</span>
                <span style={{ color: 'var(--color-text-on-dark)', fontWeight: 500 }}>ROC Ahmedabad · Estd. 2014</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-rule-dark)' }}>
                <span style={{ color: 'var(--color-text-muted-dark)' }}>DIRECT INQUIRY</span>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-teal-border)' }}>{phone}</a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ color: 'var(--color-text-muted-dark)' }}>SALES DESK</span>
                <a href={`mailto:${email}`} style={{ color: 'var(--color-teal-border)' }}>{email}</a>
              </div>
            </div>
          </div>

          {/* Col 5-7: Product Families */}
          <div style={{ gridColumn: 'span 12' }} className="footer-col-products">
            <span className="eyebrow" style={{ color: 'var(--color-teal-border)', marginBottom: '12px' }}>
              01 / PRODUCTS DIRECTORY
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {productCategories.map((c) => (
                <li key={c.title}>
                  <Link
                    to={c.path}
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted-dark)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{c.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '24px' }}>
              <span className="eyebrow" style={{ color: 'var(--color-teal-border)', marginBottom: '8px' }}>
                02 / AUTHORIZED PRINCIPALS
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {principals.map((p) => (
                  <li key={p} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted-dark)', fontFamily: 'var(--font-family-mono)' }}>
                    · {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 8-10: Navigation & Institutional Links */}
          <div style={{ gridColumn: 'span 12' }} className="footer-col-nav">
            <span className="eyebrow" style={{ color: 'var(--color-teal-border)', marginBottom: '12px' }}>
              03 / CORPORATE GOVERNANCE
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.path}
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted-dark)',
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Back to Top */}
            <div style={{ marginTop: '24px' }}>
              <button
                type="button"
                onClick={scrollToTop}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-family-mono)',
                  color: 'var(--color-text-on-dark)',
                  padding: '6px 12px',
                  border: '1px solid var(--color-rule-dark)',
                  borderRadius: 'var(--radius-xs)',
                  background: 'transparent',
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
          className="footer-disclaimer"
          style={{
            padding: '20px 0',
            borderBottom: '1px solid var(--color-rule-dark)',
            fontSize: '0.6875rem',
            lineHeight: 1.6,
            color: 'var(--color-text-muted-dark)',
          }}
        >
          <p style={{ margin: 0, color: 'var(--color-text-muted-dark)' }}>
            <strong style={{ color: 'var(--color-text-on-dark)' }}>Regulatory & Commercial Compliance Notice:</strong> Active Pharmaceutical Ingredients (APIs), industrial solvents, and chemical substances listed herein are supplied strictly for commercial manufacturing, pharmaceutical synthesis, formulation, and industrial processing to verified, licensed entities holding requisite statutory authorizations (GST, State Drug Licensing where applicable). Products are not intended for retail, personal, or direct consumer consumption. All transactions are governed by standard commercial purchase orders and verified Certificates of Analysis (CoAs).
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
          fontFamily: 'var(--font-family-mono)',
          color: 'var(--color-text-muted-dark)',
        }}>
          <div>
            © {currentYear} Aura Space Infra Private Limited. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Powered by</span>
            <span style={{ color: 'var(--color-text-on-dark)', fontWeight: 600 }}>TECHOFY Global Ventures</span>
          </div>
        </div>
      </Container>

      {/* Responsive Grid Column Styles for Footer */}
      <style>{`
        @media (min-width: 1024px) {
          .footer-col-main { grid-column: span 5 !important; }
          .footer-col-products { grid-column: span 4 !important; }
          .footer-col-nav { grid-column: span 3 !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .footer-col-main { grid-column: span 12 !important; }
          .footer-col-products { grid-column: span 6 !important; }
          .footer-col-nav { grid-column: span 6 !important; }
        }
      `}</style>
    </footer>
  );
};
