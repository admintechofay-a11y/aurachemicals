import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, Home, FileText, FlaskConical, HelpCircle } from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const corePillars = [
    { title: 'Active Pharmaceutical Ingredients (APIs)', href: '/products/api', count: '94 Monographs' },
    { title: 'Industrial Solvents & Diluents', href: '/products/solvents', count: 'Technical & Pure Grades' },
    { title: 'Performance Phosphates', href: '/products/manufacturing-phosphates', count: 'Direct Synthesis' },
    { title: 'Direct Port Imports', href: '/products/imports', count: 'JNPT / Mundra / Hazira' },
    { title: 'Industrial Sectors Directory', href: '/industries', count: '19 Manufacturing Sectors' },
    { title: 'Plant Integrity & NDT Inspection', href: '/services', count: 'ASME / API / ASTM' },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: '404 Page Not Found' }]} />

      <Section padding="normal">
        <Container>
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-family-mono)',
                fontSize: '4.5rem',
                fontWeight: 700,
                color: 'var(--color-teal)',
                lineHeight: 1,
                display: 'block',
                marginBottom: '16px',
              }}
            >
              404
            </span>

            <span className="eyebrow">Resource Not Located</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginBottom: '16px' }}>
              The Requested Chemical Specification Does Not Exist
            </h1>

            <p className="body-large" style={{ color: 'var(--color-muted)', marginBottom: '32px' }}>
              The URL you entered may have been re-indexed, or the chemical catalog slug may have changed. Search our chemical registry or explore our core supply pillars below.
            </p>

            {/* Interactive Search Console */}
            <form
              onSubmit={handleSearch}
              style={{
                display: 'flex',
                gap: '8px',
                maxWidth: '520px',
                margin: '0 auto 40px auto',
              }}
            >
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-muted)',
                  }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by chemical name or CAS (e.g. Aceclofenac, 89796-99-6)..."
                  aria-label="Search chemical catalog"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    fontSize: '0.9375rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-rule)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                />
              </div>
              <Button type="submit" variant="primary">
                Search Catalog
              </Button>
            </form>

            {/* Quick Pillars Grid */}
            <div
              style={{
                borderTop: '1px solid var(--color-rule)',
                paddingTop: '32px',
                textAlign: 'left',
              }}
            >
              <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-muted)', marginBottom: '16px', textAlign: 'center' }}>
                Verified Supply Pillars &amp; Direct Links
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                }}
              >
                {corePillars.map((p, idx) => (
                  <Link
                    key={idx}
                    to={p.href}
                    className="card"
                    style={{
                      padding: '16px',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-ink-navy)', marginBottom: '4px' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontFamily: 'var(--font-family-mono)' }}>
                      {p.count} →
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '36px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button to="/" variant="secondary" icon={<Home size={16} />} iconPosition="left">
                Return to Homepage
              </Button>
              <Button to="/get-a-quote" variant="outline" icon={<FileText size={16} />} iconPosition="left">
                Commercial RFQ Desk
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};
