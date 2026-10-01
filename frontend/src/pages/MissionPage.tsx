import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Compass,
  Leaf,
  Lightbulb,
  Users2,
  Target,
  PhoneCall,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
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

export const MissionPage: React.FC = () => {
  const { data: pageData, isLoading, isError, refetch } = useQuery({
    queryKey: ['pages', 'our-mission'],
    queryFn: () => api.getPage('our-mission'),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Our Mission' }]} />
        <Section padding="dense">
          <Container>
            <Skeleton width="160px" height="18px" style={{ marginBottom: '16px' }} />
            <Skeleton width="60%" height="40px" style={{ marginBottom: '24px' }} />
            <Skeleton width="100%" height="220px" />
          </Container>
        </Section>
      </div>
    );
  }

  if (isError || !pageData) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Our Mission' }]} />
        <Section>
          <Container>
            <ErrorState
              title="Unable to Load Mission Statement"
              message="Could not retrieve company mission and vision data from the server."
              onRetry={refetch}
            />
          </Container>
        </Section>
      </div>
    );
  }

  const sections = pageData.sections || {};
  const phone = settings?.company?.phone || '+91 97274 04415';
  const email = settings?.company?.email || 'sales@aurachemicals.in';

  const pillars = [
    {
      index: '01',
      icon: <Leaf size={24} style={{ color: 'var(--color-teal)' }} />,
      title: 'Environmental Stewardship & Responsible Sourcing',
      description:
        sections.sustainability ||
        'We prioritize environmentally compliant synthesis partners who adhere to zero-liquid-discharge (ZLD) norms and environmental clearance guidelines. By distributing high-purity compounds with minimal batch impurities, we assist industrial formulators in achieving stringent green chemistry and effluent standards.',
    },
    {
      index: '02',
      icon: <Lightbulb size={24} style={{ color: 'var(--color-teal)' }} />,
      title: 'Continuous Supply Chain & Process Optimization',
      description:
        sections.innovation ||
        'Through integrated inventory monitoring, multimodal logistics scheduling, and direct plant allocation reservations, we eliminate supply friction. Our commercial desk anticipates commodity cycle shifts to safeguard institutional manufacturers against market shortages and price volatility.',
    },
    {
      index: '03',
      icon: <Users2 size={24} style={{ color: 'var(--color-teal)' }} />,
      title: 'Stakeholder Integrity & Technical Transparency',
      description:
        sections.collaboration ||
        'We operate with full technical clarity: sharing unadulterated manufacturer analytical records, providing sample lots for pilot qualification, and honoring contract rate commitments without spot market reneging.',
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'Our Mission & Values' }]} />

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
            <span className="eyebrow">Operating Ethos</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Our Mission &amp; Guiding Principles</h1>
            <p className="body-large">
              Empowering institutional manufacturers with verified high-purity chemical distribution and certified plant asset integrity services backed by contractual supply certainty.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission Statement Hero Box */}
      <Section padding="normal">
        <Container>
          <div
            className="card"
            style={{
              padding: 'clamp(32px, 5vw, 56px)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-rule)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ maxWidth: '840px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(31, 122, 140, 0.08)',
                  border: '1px solid var(--color-teal)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-teal)',
                  marginBottom: '20px',
                }}
              >
                <Target size={14} /> Mission Statement
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                  lineHeight: 1.3,
                  marginBottom: '20px',
                  color: 'var(--color-ink-navy)',
                }}
              >
                Delivering Excellence in Chemical Distribution &amp; Industrial Inspection
              </h2>

              <p
                style={{
                  fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
                  lineHeight: 1.75,
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                {sections.statement ||
                  'At Aura Space Infra Private Limited (trading as Aura Chemicals), our mission is to serve as the most reliable bridge between primary chemical manufacturers and institutional procurement teams. We deliver verified Active Pharmaceutical Ingredients (APIs), industrial solvents, and certified NDT plant inspection services that guarantee regulatory compliance, production continuity, and absolute quality assurance.'}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Guiding Principles (3 Editorial Columns) */}
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
            index="01"
            eyebrow="Operating Principles"
            title="How We Fulfill Our Mandate"
            description="Our daily distribution and inspection operations are governed by three rigorous technical tenets."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {pillars.map((pillar) => (
              <div
                key={pillar.index}
                className="card"
                style={{
                  padding: '32px',
                  backgroundColor: 'var(--color-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
                    }}
                  >
                    {pillar.icon}
                  </div>
                  <span className="section-index" style={{ color: 'var(--color-teal)' }}>
                    {pillar.index}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1875rem', marginBottom: '12px', color: 'var(--color-ink-navy)' }}>
                  {pillar.title}
                </h3>

                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65, fontSize: '0.875rem', margin: 0 }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Strategic Outlook & Direct Commercial Access */}
      <Section padding="normal">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="eyebrow">Strategic Outlook</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginBottom: '16px' }}>
                Long-Term Vision for Indian Chemical Supply Chains
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem', marginBottom: '20px' }}>
                {sections.vision ||
                  'We envision an industrial manufacturing ecosystem where supply vulnerability is eliminated through transparent, verified domestic sourcing. Aura Chemicals will continue expanding direct producer partnerships, investing in analytical traceability, and advancing asset inspection technologies to serve India’s burgeoning pharmaceutical and specialty chemical leadership.'}
              </p>

              <div
                style={{
                  borderLeft: '2px solid var(--color-teal)',
                  paddingLeft: '16px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                <strong>ROC Ahmedabad Verified Entity:</strong> Aura Space Infra Private Limited (CIN: U51909GJ2014PTC080340), active in continuous commercial distribution since 2014.
              </div>
            </div>

            {/* Direct Commercial Access Card */}
            <div
              className="card"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-rule)',
                padding: '36px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <ShieldCheck size={24} style={{ color: 'var(--color-teal)' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                  Institutional Procurement Coordination
                </h3>
              </div>

              <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: 1.6 }}>
                Speak directly with our technical sourcing engineers to review product specifications, pharmacopeia monographs, or plant inspection requirements.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'var(--color-ink-navy)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                  }}
                >
                  <PhoneCall size={16} style={{ color: 'var(--color-teal)' }} />
                  <span style={{ fontFamily: 'var(--font-family-mono)' }}>{phone}</span>
                </a>

                <a
                  href={`mailto:${email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'var(--color-ink-navy)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                  }}
                >
                  <Mail size={16} style={{ color: 'var(--color-teal)' }} />
                  <span style={{ fontFamily: 'var(--font-family-mono)' }}>{email}</span>
                </a>
              </div>

              <Button to="/get-a-quote" variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Formal RFQ Specification <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Global CTA Band */}
      <CTABand
        heading="Looking for a Certified Chemical Supply Partner?"
        body="Connect directly with our commercial trading desk to discuss compound allocations, bulk deliveries, or inspection services."
        buttonLabel="Request a Quote"
        buttonUrl="/get-a-quote"
        phone={phone}
      />
    </>
  );
};
