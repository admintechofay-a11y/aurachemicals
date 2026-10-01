import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Leaf,
  Users2,
  Building2,
  Target,
  Eye,
  FileCheck,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
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

export const AboutPage: React.FC = () => {
  const { data: pageData, isLoading, isError, refetch } = useQuery({
    queryKey: ['pages', 'about-us'],
    queryFn: () => api.getPage('about-us'),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'About Us' }]} />
        <Section padding="dense">
          <Container>
            <Skeleton width="180px" height="18px" style={{ marginBottom: '16px' }} />
            <Skeleton width="60%" height="40px" style={{ marginBottom: '24px' }} />
            <Skeleton width="100%" height="200px" />
          </Container>
        </Section>
      </div>
    );
  }

  if (isError || !pageData) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'About Us' }]} />
        <Section>
          <Container>
            <ErrorState
              title="Unable to Load About Us Page"
              message="Could not retrieve company profile information from the server."
              onRetry={refetch}
            />
          </Container>
        </Section>
      </div>
    );
  }

  const sections = pageData.sections || {};
  const phone = settings?.company?.phone || '+91 97274 04415';

  const corporateFacts = [
    { label: 'Corporate Legal Name', value: 'Aura Space Infra Private Limited' },
    { label: 'Trade Name / Brand', value: 'Aura Chemicals' },
    { label: 'Corporate Identity Number (CIN)', value: 'U51909GJ2014PTC080340', isMono: true },
    { label: 'ROC Registration Jurisdiction', value: 'ROC Ahmedabad (Gujarat, India)' },
    { label: 'Year of Incorporation', value: '2014 (Active operations for over a decade)' },
    { label: 'Company Category & Class', value: 'Company limited by Shares / Non-govt company' },
    { label: 'Operating Sourcing Hubs', value: 'Ankleshwar, Dahej, Vapi, Hazira, Nhava Sheva (JNPT), Mundra' },
    { label: 'Manufacturing Partner Network', value: '400+ Verified Domestic Producers & Direct Import Allocations' },
    { label: 'Pharmacopeia Standards', value: 'Indian Pharmacopoeia (IP), British (BP), United States (USP), European (EP)' },
  ];

  const milestones = [
    {
      year: '2014',
      title: 'Company Incorporation',
      desc: 'Aura Space Infra Private Limited formally incorporated under the Companies Act, registered with ROC Ahmedabad (CIN: U51909GJ2014PTC080340).',
    },
    {
      year: '2016',
      title: 'Domestic Chemical Distribution Expansion',
      desc: 'Established direct sourcing lines with bulk chemical synthesizers in Ankleshwar, Dahej, and Vapi industrial belts.',
    },
    {
      year: '2019',
      title: 'NDT & Engineering Inspection Wing',
      desc: 'Formed technical division offering certified Level II/III Non-Destructive Testing and plant asset integrity inspection under ASME and API codes.',
    },
    {
      year: '2021',
      title: 'Direct Maritime Import Infrastructure',
      desc: 'Expanded direct import clearance and storage operations through Nhava Sheva (JNPT) and Mundra ports for critical solvents and bulk compounds.',
    },
    {
      year: 'Present',
      title: 'Enterprise Technical Supply Network',
      desc: 'Supplying 94 high-purity APIs, solvents, and specialty chemicals across 19 manufacturing sectors with batch CoA verification.',
    },
  ];

  const valuePillars = [
    {
      title: 'Regulatory & Monograph Traceability',
      description: 'Strict adherence to IP, BP, USP, and EP pharmacopeial standards. Every single batch is traceable back to the primary manufacturer with complete documentation.',
      icon: <FileCheck size={22} style={{ color: 'var(--color-teal)' }} />,
    },
    {
      title: 'Direct Manufacturer Allocations',
      description: 'Direct relationships with over 400 Indian chemical synthesis facilities, bypassing informal broker channels to ensure price stability and allocation continuity.',
      icon: <Building2 size={22} style={{ color: 'var(--color-teal)' }} />,
    },
    {
      title: 'Dual Industrial Capability',
      description: 'Uniquely combining raw material distribution with certified NDT plant integrity inspection services (ASME, API, ASTM) under a single corporate umbrella.',
      icon: <ShieldCheck size={22} style={{ color: 'var(--color-teal)' }} />,
    },
    {
      title: 'Verified Corporate Standing',
      description: 'Active since 2014 under ROC Ahmedabad with transparent corporate filings, statutory compliance, and accountable enterprise governance.',
      icon: <Scale size={22} style={{ color: 'var(--color-teal)' }} />,
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'About Us' }]} />

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
            <span className="eyebrow">Corporate Profile</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>About Aura Space Infra Pvt. Ltd.</h1>
            <p className="body-large">
              Operating under the commercial banner of Aura Chemicals, Aura Space Infra Pvt. Ltd. (ROC Ahmedabad, Estd. 2014) is an established B2B chemical distribution house and industrial testing partner serving pharmaceutical, agrochemical, water treatment, and specialized manufacturing sectors.
            </p>
          </div>
        </Container>
      </section>

      {/* Section 1: Corporate Profile & Verified Facts Specification Table */}
      <Section padding="normal">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 5vw, 64px)',
              alignItems: 'start',
            }}
          >
            {/* Left: Background & Operational Model */}
            <div>
              <span className="eyebrow">Enterprise Overview</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginBottom: '16px' }}>
                Bridging Manufacturers with Institutional Procurement
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem', marginBottom: '16px' }}>
                {sections.business_overview ||
                  'Aura Space Infra Pvt. Ltd. operates as a strategic distributor and supply partner for pharmaceutical active pharmaceutical ingredients (APIs), industrial solvents, specialty phosphates, and fine chemical intermediates. Headquartered in Gujarat—the chemical manufacturing powerhouse of India—our team coordinates production allocations with synthesis plants and overseas import lines.'}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem', marginBottom: '24px' }}>
                Unlike speculative trading desks, Aura Chemicals operates on disciplined commercial allocations, direct plant pickups, and strict batch testing verification. Every consignment delivered is backed by manufacturer Certificate of Analysis (CoA), Safety Data Sheet (MSDS), and batch origin traceability.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button to="/products" variant="primary" icon={<ArrowRight size={14} />}>
                  Explore Verified Catalog
                </Button>
                <Button to="/get-a-quote" variant="secondary">
                  Request Quotation
                </Button>
              </div>
            </div>

            {/* Right: Statutory Corporate Facts Specification Table */}
            <div
              className="card"
              style={{
                padding: '24px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-rule)',
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
                <Building2 size={20} style={{ color: 'var(--color-teal)' }} />
                <h3 style={{ fontSize: '1rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Statutory Corporate Monograph
                </h3>
              </div>

              <table className="spec-table" style={{ margin: 0 }}>
                <tbody>
                  {corporateFacts.map((fact, idx) => (
                    <tr key={idx}>
                      <td style={{ width: '42%', color: 'var(--color-muted)', fontSize: '0.8125rem' }}>
                        {fact.label}
                      </td>
                      <td
                        style={{
                          fontSize: '0.875rem',
                          fontFamily: fact.isMono ? 'var(--font-family-mono)' : 'inherit',
                          fontWeight: fact.isMono ? 600 : 500,
                          color: fact.isMono ? 'var(--color-teal)' : 'var(--color-ink-navy)',
                        }}
                      >
                        {fact.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 2: Chronological Milestone Timeline */}
      <Section
        padding="normal"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-rule)',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <Container>
          <SectionHeading
            index="02"
            eyebrow="Company History"
            title="A Decade of Disciplined Growth"
            description="Established in 2014, Aura has evolved from regional distribution to a nationwide supply network and dual-capability engineering partner."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              position: 'relative',
            }}
          >
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--color-card)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-teal)',
                    marginBottom: '8px',
                  }}
                >
                  {m.year}
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--color-ink-navy)', fontWeight: 600 }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.55, margin: 0 }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 3: Four Institutional Value Pillars */}
      <Section padding="normal">
        <Container>
          <SectionHeading
            index="03"
            eyebrow="Commercial Philosophy"
            title="The Aura Supply Standards"
            description="Our operating principles ensure institutional buyers receive verified compliance, price discipline, and supply predictability."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {valuePillars.map((p, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-rule)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  {p.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '10px', color: 'var(--color-ink-navy)' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 4: Vision & Mission Dual Editorial Monograph */}
      <Section
        padding="normal"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-rule)',
        }}
      >
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Vision */}
            <div className="card" style={{ padding: '36px', backgroundColor: 'var(--color-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Eye size={22} style={{ color: 'var(--color-teal)' }} />
                <span className="eyebrow" style={{ marginBottom: 0 }}>Strategic Outlook</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: 'var(--color-ink-navy)' }}>
                Our Vision
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem', margin: 0 }}>
                {sections.vision ||
                  'To be recognized as India’s most dependable technical chemical distributor and industrial testing partner, renowned for unwavering batch integrity, pharmacopeial compliance, and transparent supplier relationships across global manufacturing corridors.'}
              </p>
            </div>

            {/* Mission */}
            <div className="card" style={{ padding: '36px', backgroundColor: 'var(--color-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Target size={22} style={{ color: 'var(--color-teal)' }} />
                <span className="eyebrow" style={{ marginBottom: 0 }}>Operational Purpose</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: 'var(--color-ink-navy)' }}>
                Our Mission
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem', margin: 0 }}>
                {sections.mission ||
                  'To deliver high-purity APIs, industrial solvents, and certified NDT plant inspection services that enable our manufacturing clients to maintain uninterrupted production, fulfill regulatory mandates, and achieve operational excellence with absolute supply certainty.'}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Global CTA Band */}
      <CTABand
        heading="Partner with Aura Chemicals for Verified Sourcing"
        body="Connect directly with our procurement desk to access verified Indian manufacturing allocations with complete CoA batch documentation."
        buttonLabel="Request a Commercial Quote"
        buttonUrl="/get-a-quote"
        phone={phone}
      />
    </>
  );
};
