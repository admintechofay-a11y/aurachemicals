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
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { CTABand } from '../components/common/CTABand';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { LineDraw, Reveal, RevealGroup } from '../components/common/MotionPrimitives';
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
  const phone = settings?.company?.phone || '+91 7220000877';
  const email = settings?.company?.email || 'management.aurachemicals@gmail.com';

  const pillars = [
    {
      icon: <Leaf size={28} style={{ color: 'var(--color-secondary)' }} />,
      title: 'Sustainability at the Core',
      description:
        sections.sustainability ||
        'Sustainability is at the heart of our mission. We are dedicated to promoting environmentally responsible practices by sourcing and distributing eco-friendly and high-performance chemicals that align with global environmental standards. Our aim is to empower industries to achieve their goals while reducing their ecological footprint.',
    },
    {
      icon: <Lightbulb size={28} style={{ color: 'var(--color-secondary)' }} />,
      title: 'Innovation Drives Us',
      description:
        sections.innovation ||
        'Innovation drives our approach as we continuously seek to adopt advanced technologies, improve supply chain efficiency, and provide unparalleled customer support. We endeavor to anticipate market demands, offering competitive pricing, timely delivery, and personalized service to exceed client expectations.',
    },
    {
      icon: <Users2 size={28} style={{ color: 'var(--color-secondary)' }} />,
      title: 'Collaboration and Growth',
      description:
        sections.collaboration ||
        'We believe in the power of collaboration, not only within our organization but also with our stakeholders. By fostering an inclusive and growth-oriented environment, we empower our team members to contribute their expertise and passion, driving our shared vision forward.',
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'Our Mission' }]} />

      {/* Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(48px, 6vw, 72px) 0',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <LineDraw width="32px" height={2} color="var(--color-accent)" style={{ marginBottom: '16px' }} />
            <Reveal immediate>
              <span className="eyebrow">Strategic Purpose & Principles</span>
              <h1 style={{ marginBottom: 'var(--space-4)' }}>Our Mission & Values</h1>
              <p className="body-large" style={{ color: 'var(--color-text)' }}>
                Empowering global industries with verified, sustainable chemical distribution and active pharmaceutical ingredients backed by disciplined supply assurance.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Mission Statement Hero Card */}
      <Section padding="normal">
        <Container>
          <Reveal>
            <div
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(32px, 5vw, 56px)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ maxWidth: '860px', position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '20px',
                  }}
                >
                  <Target size={16} /> Mission Statement
                </div>
                <h2
                  style={{
                    color: '#FFFFFF',
                    fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)',
                    lineHeight: 1.35,
                    fontWeight: 600,
                    marginBottom: '20px',
                  }}
                >
                  Delivering Excellence in Active Pharmaceutical Ingredients & Chemical Trading
                </h2>
                <p
                  style={{
                    fontSize: 'clamp(1.05rem, 1.4vw, 1.2rem)',
                    lineHeight: 1.7,
                    color: 'rgba(255, 255, 255, 0.92)',
                    margin: 0,
                  }}
                >
                  {sections.statement ||
                    'At Aura Space Infra Private Limited, our mission is to be the leading and most trusted chemical trading partner by delivering superior quality Active Pharmaceutical Ingredients (APIs), solvents, and specialty chemicals. We are dedicated to providing sustainable, reliable, and cost-effective chemical solutions that drive innovation and empower industries worldwide.'}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Core Principles Grid */}
      <Section padding="normal" style={{ backgroundColor: 'var(--color-surface-subtle)' }}>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Core Guiding Principles"
              title="How We Deliver on Our Promise"
              description="Our operations are grounded in environmental responsibility, forward-looking process optimization, and collaborative stakeholder relationships."
              align="center"
            />
          </Reveal>

          <RevealGroup
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginTop: '40px',
            }}
          >
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="product-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '32px',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  className="card-icon-box"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(31, 90, 140, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    transition: 'all var(--motion-duration-fast) var(--motion-ease)',
                  }}
                >
                  {pillar.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontWeight: 600 }}>
                  {pillar.title}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Long-Term Vision Section */}
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
            <Reveal>
              <div>
                <span className="eyebrow">Strategic Direction</span>
                <h2 style={{ marginBottom: '20px' }}>Our Long-Term Vision</h2>
                <p className="body-large" style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                  {sections.vision ||
                    'At Aura Chemicals, we envision a future where we are recognized as a leading chemical trading company that balances profitability with responsibility, providing value to our clients, communities, and the planet. Our journey is guided by the principle of excellence, as we continue to innovate, adapt, and lead in the dynamic world of chemical trade.'}
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderLeft: '3px solid var(--color-secondary)',
                    paddingLeft: '20px',
                    marginTop: '24px',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                    Excellence · Responsibility · Reliability
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
                    Registered with ROC Ahmedabad as a verified corporate trading entity serving clients nationally and across global markets.
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '36px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <ShieldCheck size={28} style={{ color: 'var(--color-secondary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
                    Global Expansion & Inquiries
                  </h3>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
                  Aura Chemicals continues to expand its footprint with an unyielding commitment to quality assurance, sustainable chemistry, and supply security.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(11, 37, 69, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PhoneCall size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                        Direct Sales Line
                      </div>
                      {phone}
                    </div>
                  </a>

                  <a
                    href={`mailto:${email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(11, 37, 69, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                        Corporate Email
                      </div>
                      {email}
                    </div>
                  </a>
                </div>

                <Button to="/get-a-quote" variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Submit Formal Inquiry <ArrowRight size={16} />
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Global CTA Band */}
      <CTABand
        heading="Looking for a Certified Chemical Trading Partner?"
        body="Connect with our technical desk to discuss API sourcing, solvent allocations, or custom compounding requirements."
        buttonLabel="Request a Quote"
        buttonUrl="/get-a-quote"
        phone="+91 7220000877"
      />
    </>
  );
};
