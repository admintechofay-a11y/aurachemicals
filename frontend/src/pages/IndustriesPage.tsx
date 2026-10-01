import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Search,
  CheckCircle2,
  Building,
  Layers,
  FlaskConical,
  Filter,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { CTABand } from '../components/common/CTABand';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { api } from '../api/client';
import { IndustryDto } from '../api/types';

const INDUSTRY_COMPOUNDS_MAP: Record<string, string[]> = {
  adhesives: ['Synthetic Resins', 'PVA Emulsions', 'Plasticizers', 'Tackifiers'],
  agriculture: ['Copper Sulphate', 'Zinc Sulphate', 'Phosphoric Acid', 'Micronutrients', 'Formulation Solvents'],
  agro: ['Copper Sulphate', 'Zinc Sulphate', 'Phosphoric Acid', 'Micronutrients'],
  automotive: ['Ethylene Glycol', 'Coolant Concentrates', 'Corrosion Inhibitors', 'Brake Fluid Bases'],
  cleaning: ['LABSA 90%', 'SLES 70%', 'Caustic Soda Flakes', 'Sodium Metasilicate', 'Pine Oil'],
  construction: ['Concrete Admixtures', 'Sodium Silicate', 'Calcium Formate', 'Defoamers', 'Bonding Agents'],
  cosmetic: ['USP Glycerin', 'Stearic Acid Triple Pressed', 'Cetyl Alcohol', 'Carbomers', 'Preservatives'],
  energy: ['Drilling Fluid Additives', 'Demulsifiers', 'Scale Inhibitors', 'Corrosion Mitigators'],
  food: ['Citric Acid Anhydrous', 'Sodium Benzoate', 'Potassium Sorbate', 'Phosphoric Acid Food Grade'],
  healthcare: ['Diagnostic Reagents', 'Buffer Solutions', 'Disinfectant Actives', 'USP Purified Solvents'],
  leather: ['Basic Chromium Sulphate', 'Sodium Sulphide', 'Formic Acid', 'Syntans', 'Degreasing Agents'],
  mining: ['Flotation Reagents', 'Sodium Metabisulphite', 'Flocculants', 'Leaching Acids'],
  packaging: ['Barrier Coatings', 'Printing Ink Solvents', 'Laminating Adhesives'],
  paint: ['Titanium Dioxide', 'Solvent Bases (MEK, IPA, Toluene)', 'Alkyd Resins', 'Dispersing Agents'],
  paper: ['Poly Aluminium Chloride (PAC)', 'Alum', 'Defoamers', 'Sizing Agents', 'Bleaching Stabilizers'],
  plastic: ['DOP / DOTP Plasticizers', 'Stabilizers', 'Antioxidants', 'Polymer Lubricants'],
  rubber: ['Zinc Oxide Active', 'Stearic Acid Rubber Grade', 'Vulcanization Accelerators', 'Processing Oils'],
  semiconductor: ['Electronic Grade Isopropanol', 'Ultra-Pure Nitric Acid', 'Etching Reagents', 'High-Purity Solvents'],
  textile: ['Hydrogen Peroxide 50%', 'Caustic Soda Lye', 'Sodium Hydrosulphite', 'Acetic Acid Glacial'],
  water: ['Poly Aluminium Chloride (PAC)', 'Ferric Chloride', 'Sodium Hypochlorite', 'Biocides', 'Scale Inhibitors'],
};

const getCompoundsForIndustry = (slug: string, title: string): string[] => {
  const text = `${slug} ${title}`.toLowerCase();
  for (const [key, compounds] of Object.entries(INDUSTRY_COMPOUNDS_MAP)) {
    if (text.includes(key)) return compounds;
  }
  return ['High-Purity Solvents', 'Technical Intermediates', 'Custom Formulations', 'Inorganic Salts'];
};

const decodeHtml = (text?: string): string => {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

export const IndustriesPage: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: industries, isLoading, isError, refetch } = useQuery({
    queryKey: ['industries'],
    queryFn: () => api.getIndustries(),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  const phone = settings?.company?.phone || '+91 97274 04415';

  // Handle hash scrolling when navigated directly to a sector anchor
  useEffect(() => {
    if (location.hash && industries) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [location.hash, industries]);

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Industries' }]} />
        <Section padding="dense">
          <Container>
            <Skeleton width="180px" height="20px" style={{ marginBottom: '16px' }} />
            <Skeleton width="60%" height="40px" style={{ marginBottom: '24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} width="100%" height="240px" />
              ))}
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (isError || !industries) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Industries' }]} />
        <Section>
          <Container>
            <ErrorState
              title="Unable to Load Industrial Directory"
              message="Could not retrieve industrial sectors catalog from the server."
              onRetry={refetch}
            />
          </Container>
        </Section>
      </div>
    );
  }

  const filteredIndustries = industries.filter((ind) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = ind.title.toLowerCase().includes(q);
    const overviewMatch = ind.overview.toLowerCase().includes(q);
    const compoundMatch = getCompoundsForIndustry(ind.slug, ind.title).some((c) =>
      c.toLowerCase().includes(q)
    );
    return titleMatch || overviewMatch || compoundMatch;
  });

  return (
    <>
      <Breadcrumb items={[{ label: 'Industries' }]} />

      {/* Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(48px, 6vw, 72px) 0',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <span className="eyebrow">End-Market Expertise</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Industries We Serve</h1>
            <p className="body-large">
              Aura Space Infra Pvt. Ltd. supplies high-purity APIs, technical solvents, performance phosphates, and chemical compounds to 19 distinct industrial manufacturing sectors across domestic Indian corridors and export supply chains.
            </p>
          </div>
        </Container>
      </section>

      {/* Directory Quick Navigation & Search */}
      <section
        style={{
          backgroundColor: 'var(--color-card)',
          borderBottom: '1px solid var(--color-rule)',
          padding: '24px 0',
        }}
      >
        <Container>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                Sector Directory ({industries.length} Industrial Manufacturing Sectors)
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', margin: '4px 0 0' }}>
                Select any sector to jump directly to technical allocations and key compound families.
              </p>
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-muted)',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by sector, application, or chemical..."
                aria-label="Filter industries by keyword"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-rule)',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--color-paper)',
                }}
              />
            </div>
          </div>

          {/* Quick jump badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {industries.map((ind, idx) => (
              <a
                key={ind.id}
                href={`#${ind.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-rule)',
                  color: 'var(--color-ink-navy)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <span style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--color-teal)', fontSize: '0.75rem' }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{decodeHtml(ind.title).split('&')[0].trim()}</span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Comprehensive Industry Grid / Sections */}
      <Section padding="normal">
        <Container>
          {filteredIndustries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p className="body-large" style={{ color: 'var(--color-muted)' }}>
                No industrial sectors matched &quot;{searchQuery}&quot;.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')} style={{ marginTop: '16px' }}>
                Reset Filter
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {filteredIndustries.map((ind, idx) => {
                const sectorNum = String(idx + 1).padStart(2, '0');
                const compounds = getCompoundsForIndustry(ind.slug, ind.title);
                return (
                  <article
                    key={ind.id}
                    id={ind.slug}
                    className="card"
                    style={{
                      scrollMarginTop: '110px',
                      padding: 'clamp(28px, 4vw, 40px)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: 'clamp(24px, 4vw, 48px)',
                      alignItems: 'start',
                    }}
                  >
                    {/* Left Column: Index, Title, and Technical Overview */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <span className="section-index" style={{ color: 'var(--color-teal)', fontSize: '0.875rem' }}>
                          {sectorNum}
                        </span>
                        <span style={{ color: 'var(--color-rule-strong)' }}>/</span>
                        <span className="eyebrow" style={{ marginBottom: 0 }}>
                          Manufacturing Sector
                        </span>
                      </div>

                      <h2
                        style={{
                          fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)',
                          lineHeight: 1.25,
                          marginBottom: '16px',
                          color: 'var(--color-ink-navy)',
                        }}
                      >
                        {decodeHtml(ind.title)}
                      </h2>

                      <p
                        style={{
                          color: 'var(--color-text-secondary)',
                          lineHeight: 1.65,
                          fontSize: '0.9375rem',
                          marginBottom: '20px',
                        }}
                      >
                        {decodeHtml(ind.overview)}
                      </p>

                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Button
                          to={`/get-a-quote?product=${encodeURIComponent(decodeHtml(ind.title))}`}
                          variant="primary"
                          size="sm"
                          icon={<ArrowRight size={14} />}
                        >
                          Request Sector Allocation
                        </Button>
                        <Button
                          to={`/products?category=${ind.slug}`}
                          variant="secondary"
                          size="sm"
                        >
                          View Catalog Compounds
                        </Button>
                      </div>
                    </div>

                    {/* Right Column: Key Compound Allocations & Quality Monograph */}
                    <div
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-rule)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '24px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          borderBottom: '1px solid var(--color-rule)',
                          paddingBottom: '12px',
                          marginBottom: '16px',
                        }}
                      >
                        <FlaskConical size={18} style={{ color: 'var(--color-teal)' }} />
                        <h3 style={{ fontSize: '0.9375rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Primary Compound Allocations
                        </h3>
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginBottom: '14px' }}>
                        Regularly supplied chemical raw materials with batch Certificates of Analysis:
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                        {compounds.map((cmp, cIdx) => (
                          <span
                            key={cIdx}
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              backgroundColor: 'var(--color-card)',
                              border: '1px solid var(--color-rule)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.8125rem',
                              color: 'var(--color-ink-navy)',
                              fontFamily: 'var(--font-family-sans)',
                            }}
                          >
                            {cmp}
                          </span>
                        ))}
                      </div>

                      <div
                        style={{
                          borderTop: '1px solid var(--color-rule)',
                          paddingTop: '14px',
                          fontSize: '0.8125rem',
                          color: 'var(--color-muted)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={14} style={{ color: 'var(--color-teal)' }} />
                          <span>Standard compliance: IP / BP / USP / Technical Grades</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={14} style={{ color: 'var(--color-teal)' }} />
                          <span>Packaging: Fiber drums, ISO tank containers, bulk dispatch</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </Section>

      {/* Global CTA Band */}
      <CTABand
        heading="Custom Chemical Sourcing & Production Allocations"
        body="Require dedicated plant supply contracts, custom purity assays, or high-volume import lots? Contact our commercial procurement desk."
        buttonLabel="Request Formal RFQ"
        buttonUrl="/get-a-quote"
        phone={phone}
      />
    </>
  );
};
