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
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CTABand } from '../components/common/CTABand';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Reveal,
  RevealGroup,
  LineDraw,
  ImageReveal,
} from '../components/common/MotionPrimitives';
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
  const phone = settings?.company?.phone;

  const whyChooseIcons = [
    <ShieldCheck size={24} style={{ color: 'var(--color-secondary)' }} />,
    <FileCheck size={24} style={{ color: 'var(--color-secondary)' }} />,
    <Building2 size={24} style={{ color: 'var(--color-secondary)' }} />,
    <Users2 size={24} style={{ color: 'var(--color-secondary)' }} />,
    <Award size={24} style={{ color: 'var(--color-secondary)' }} />,
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'About Us' }]} />

      {/* Hero Header with Drawing Hairline */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(48px, 6vw, 72px) 0',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: 'var(--space-3)',
              }}
            >
              <LineDraw width={32} height={1} color="var(--color-accent)" delay={0.05} />
              <span className="eyebrow" style={{ marginBottom: 0 }}>Corporate Profile</span>
            </div>
            <Reveal immediate delay={0}>
              <h1 style={{ marginBottom: 'var(--space-4)' }}>About Aura Space Infra Pvt. Ltd.</h1>
            </Reveal>
            <Reveal delay={0.08} duration={0.35}>
              <p className="body-large" style={{ color: 'var(--color-text)' }}>
                {sections.overview ||
                  'A trusted partner in the global pharmaceutical and chemical trading industry, specializing in high-purity APIs, solvents, and specialty chemicals.'}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Business Overview & Sourcing Infrastructure */}
      <Section variant="default">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 5vw, 64px)',
              alignItems: 'center',
            }}
          >
            <div>
              <Reveal>
                <span className="eyebrow">Operations & Reach</span>
                <h2 style={{ marginBottom: 'var(--space-2)' }}>Business Overview</h2>
                <LineDraw width={48} height={1} color="var(--color-accent)" style={{ margin: '8px 0 16px 0' }} />
                <p
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-6)',
                  }}
                >
                  {sections.business_overview}
                </p>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-6)',
                  }}
                >
                  <h4 style={{ marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>
                    Key Operating Credentials
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                      <span><strong>Entity:</strong> Aura Space Infra Private Limited (Non-Government)</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                      <span><strong>Jurisdiction:</strong> Registered with ROC Ahmedabad</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                      <span><strong>Track Record:</strong> Active in chemical & API distribution since 2014</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                      <span><strong>Supplier Base:</strong> Direct sourcing from 400+ leading Indian manufacturers</span>
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>

            <div>
              <ImageReveal
                src="/images/hero-scaled.jpg"
                alt="Aura Chemicals Facility"
                aspectRatio="16 / 11"
                borderRadius="4px"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Why Choose Us (5 Pillars) */}
      {sections.why_choose_us && sections.why_choose_us.length > 0 && (
        <Section variant="surface">
          <Container>
            <SectionHeading
              eyebrow="Value Proposition"
              title="Why Industry Leaders Choose Us"
              description="Aura Chemicals delivers international regulatory compliance, verified domestic sourcing, and disciplined supply continuity."
            />

            <RevealGroup
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {sections.why_choose_us.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="product-card"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-6)',
                    boxShadow: 'var(--shadow-sm)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    className="card-icon-box"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    {whyChooseIcons[idx % whyChooseIcons.length]}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.1875rem',
                      color: 'var(--color-primary)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-muted)',
                      lineHeight: 1.6,
                      flex: 1,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      )}

      {/* Vision & Mission Cards */}
      <Section variant="default">
        <Container>
          <RevealGroup
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-8)',
            }}
          >
            {/* Vision */}
            <div
              className="product-card"
              style={{
                padding: 'var(--space-8)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div
                className="card-icon-box"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--color-secondary)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <Eye size={20} />
                <span className="eyebrow" style={{ margin: 0 }}>Long-Term Aspiration</span>
              </div>
              <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>Our Vision</h3>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                {sections.vision}
              </p>
            </div>

            {/* Mission */}
            <div
              className="product-card"
              style={{
                padding: 'var(--space-8)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div
                className="card-icon-box"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--color-secondary)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <Target size={20} />
                <span className="eyebrow" style={{ margin: 0 }}>Operational Purpose</span>
              </div>
              <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>Our Mission</h3>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                {sections.mission}
              </p>
            </div>
          </RevealGroup>
        </Container>
      </Section>

      {/* Sustainability & Collaboration Row */}
      <Section variant="surface">
        <Container>
          <Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'var(--space-8)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
                  <Leaf size={20} style={{ color: 'var(--color-success)' }} />
                  <h3 style={{ margin: 0 }}>Commitment to Sustainability</h3>
                </div>
                <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                  {sections.sustainability}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
                  <Users2 size={20} style={{ color: 'var(--color-secondary)' }} />
                  <h3 style={{ margin: 0 }}>Collaboration & Industrial Growth</h3>
                </div>
                <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                  {sections.collaboration}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Final CTA */}
      <CTABand
        heading="Partner with Aura Chemicals for Verified Sourcing"
        body="Join thousands of pharmaceutical and industrial manufacturing partners relying on our direct domestic sourcing network."
        buttonLabel="Request a Technical Quote"
        buttonUrl="/get-a-quote"
        phone={phone}
      />
    </>
  );
};
