import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Wrench,
  Search,
  Flame,
  Activity,
  Layers,
  Award,
  ArrowRight,
  PhoneCall,
  Mail,
  Scale,
  Building2,
  FlaskConical,
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

export const ServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'chemicals' | 'inspection'>('all');

  const { data: services, isLoading, isError, refetch } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.getServices(),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Services' }]} />
        <Section padding="dense">
          <Container>
            <Skeleton width="180px" height="18px" style={{ marginBottom: '16px' }} />
            <Skeleton width="60%" height="40px" style={{ marginBottom: '24px' }} />
            <Skeleton width="100%" height="300px" />
          </Container>
        </Section>
      </div>
    );
  }

  if (isError || !services) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Services' }]} />
        <Section>
          <Container>
            <ErrorState
              title="Unable to Load Services"
              message="Could not retrieve service descriptions and technical capabilities from the server."
              onRetry={refetch}
            />
          </Container>
        </Section>
      </div>
    );
  }

  const phone = settings?.company?.phone || '+91 7220000877';

  const ndtDisciplines = [
    {
      title: '1. Non-Destructive Testing (NDT)',
      icon: <Search size={22} style={{ color: 'var(--color-secondary)' }} />,
      desc: 'Conventional and advanced NDT methodologies to verify structural integrity without damaging components.',
      items: [
        'Ultrasonic Testing (UT)',
        'Radiographic Testing (RT) & Film Interpretation',
        'Magnetic Particle Testing (MPT)',
        'Dye Penetrant Testing (DPT)',
        'Visual Testing (VT)',
        'Eddy Current Testing (ECT)',
        'Advanced NDT: Phased Array Ultrasonic (PAUT), TOFD, Digital Radiography',
      ],
    },
    {
      title: '2. Metallurgical & Corrosion Investigation',
      icon: <Flame size={22} style={{ color: 'var(--color-secondary)' }} />,
      desc: 'Scientific root-cause analysis and material evaluation to prevent equipment breakdown.',
      items: [
        'Failure Analysis & Root Cause Investigation',
        'Field & Laboratory Metallography',
        'Positive Material Identification (PMI)',
        'Corrosion Assessment & Continuous Monitoring',
        'Coating & Lining Quality Inspection',
      ],
    },
    {
      title: '3. Welding & Fabrication Inspection',
      icon: <Wrench size={22} style={{ color: 'var(--color-secondary)' }} />,
      desc: 'Ensuring structural welds meet stringent national and international fabrication codes.',
      items: [
        'Welder and Procedure Qualification (WPS / PQR / WPQ)',
        'Third-Party Welding Inspection',
        'Welding Defect Assessment & Repair Protocol Approval',
        'Pre & Post Weld Heat Treatment (PWHT) Supervision',
      ],
    },
    {
      title: '4. In-Service Inspection & Risk-Based Inspection (RBI)',
      icon: <Activity size={22} style={{ color: 'var(--color-secondary)' }} />,
      desc: 'Maximizing plant safety, reducing unplanned outages, and extending asset life cycles.',
      items: [
        'Fitness-for-Service (FFS) Assessments',
        'Risk-Based Inspection (RBI) Program Studies',
        'Pressure Vessel, Piping & Tank Inspection',
        'Static Equipment Integrity Management',
        'API 510, API 570, API 653 Certified Services',
      ],
    },
    {
      title: '5. Calibration & Dimensional Inspection',
      icon: <Scale size={22} style={{ color: 'var(--color-secondary)' }} />,
      desc: 'High-precision metrology and instrumentation calibration for industrial equipment.',
      items: [
        'Instrument Calibration (Pressure, Temperature, Flow, Electrical)',
        'Dimensional & Geometrical Inspection for Components & Structures',
        'General Arrangement (GA) & As-Built Drawing Verification',
      ],
    },
    {
      title: '6. Civil & Infrastructure Quality Services',
      icon: <Building2 size={22} style={{ color: 'var(--color-secondary)' }} />,
      desc: 'Civil quality assurance for industrial foundations, buildings, and critical infrastructure.',
      items: [
        'Concrete Compressive Testing & Reinforcement Inspection',
        'Non-Destructive Civil Testing (Rebound Hammer, Ultrasonic Pulse Velocity)',
        'Structural Integrity Assessment of Industrial Plants & Bridges',
      ],
    },
    {
      title: '7. Third-Party Inspection & Certification',
      icon: <Award size={22} style={{ color: 'var(--color-secondary)' }} />,
      desc: 'Independent witnessing, expediting, and global compliance verification.',
      items: [
        'Vendor Inspection & Expediting Services',
        'Witnessing & Certification (ASME, ASTM, ISO, API, AWS)',
        'QA/QC Comprehensive Documentation Review',
      ],
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'Services' }]} />

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
              <span className="eyebrow">Comprehensive Capabilities</span>
              <h1 style={{ marginBottom: 'var(--space-4)' }}>Our Services & Solutions</h1>
              <p className="body-large" style={{ color: 'var(--color-text)' }}>
                Aura Space Infra Pvt. Ltd. provides dual-pillar operational excellence: dependable chemical sourcing and distribution across 400+ leading domestic manufacturers, alongside world-class engineering inspection and quality assurance services.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Category Filter Pills */}
      <Section padding="dense" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Container>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: activeTab === 'all' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: activeTab === 'all' ? '#FFFFFF' : 'var(--color-text)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--motion-duration-fast) var(--motion-ease)',
              }}
            >
              All Capabilities
            </button>
            <button
              onClick={() => setActiveTab('chemicals')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: activeTab === 'chemicals' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: activeTab === 'chemicals' ? '#FFFFFF' : 'var(--color-text)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--motion-duration-fast) var(--motion-ease)',
              }}
            >
              Chemical Sourcing & API Distribution
            </button>
            <button
              onClick={() => setActiveTab('inspection')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: activeTab === 'inspection' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: activeTab === 'inspection' ? '#FFFFFF' : 'var(--color-text)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--motion-duration-fast) var(--motion-ease)',
              }}
            >
              Inspection & Quality Assurance (NDT / QA)
            </button>
          </div>
        </Container>
      </Section>

      {/* Division 1: Chemical Distribution */}
      {(activeTab === 'all' || activeTab === 'chemicals') && (
        <Section padding="normal">
          <Container>
            <Reveal>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  padding: 'clamp(32px, 5vw, 48px)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '12px' }}>
                  <FlaskConical size={18} /> Pillar 01 · Chemical Commerce
                </div>
                <h2 style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2rem)', marginBottom: '16px' }}>
                  Chemical Sourcing & API Distribution
                </h2>
                <p className="body-large" style={{ color: 'var(--color-text)', maxWidth: '820px', marginBottom: '32px' }}>
                  Assured quality and security in active pharmaceutical ingredient supplies through 400+ leading domestic manufacturers. We efficiently secure raw materials, develop customized compounds, and deliver high-purity chemicals to manufacturing plants across India.
                </p>

                <RevealGroup
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px',
                    marginBottom: '36px',
                  }}
                >
                  {[
                    {
                      title: 'Manufacturer Sourcing Network',
                      desc: 'Direct sourcing alliances with 400+ audited chemical manufacturers across India.',
                    },
                    {
                      title: 'Custom Synthesis & Procurement',
                      desc: 'Procurement of specialized chemical intermediates and tailored compound specifications.',
                    },
                    {
                      title: 'Strict Pharmacopeial Compliance',
                      desc: 'Full batch traceability matching IP, BP, USP, and EP regulatory standards.',
                    },
                    {
                      title: 'Uninterrupted Supply Chain',
                      desc: 'Disciplined inventory planning preventing operational halts in continuous processing plants.',
                    },
                  ].map((cap, i) => (
                    <div
                      key={i}
                      className="product-card"
                      style={{
                        backgroundColor: 'var(--color-surface-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        border: '1px solid var(--color-border)',
                        height: '100%',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, color: 'var(--color-primary)' }}>
                        <div
                          className="card-icon-box"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-xs)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(31, 90, 140, 0.08)',
                            transition: 'all var(--motion-duration-fast) var(--motion-ease)',
                          }}
                        >
                          <CheckCircle2 size={16} style={{ color: 'var(--color-secondary)' }} />
                        </div>
                        {cap.title}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                        {cap.desc}
                      </p>
                    </div>
                  ))}
                </RevealGroup>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Button to="/get-a-quote" variant="primary">
                    Request Chemical RFQ <ArrowRight size={14} />
                  </Button>
                  <Button to="/products" variant="outline">
                    Browse Verified Products (135 Items)
                  </Button>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* Division 2: Inspection & Quality Assurance */}
      {(activeTab === 'all' || activeTab === 'inspection') && (
        <Section padding="normal" style={{ backgroundColor: 'var(--color-surface-subtle)' }}>
          <Container>
            <Reveal>
              <div style={{ maxWidth: '840px', marginBottom: '40px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '12px' }}>
                  <ShieldCheck size={18} /> Pillar 02 · Engineering Assurance
                </div>
                <h2 style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2rem)', marginBottom: '16px' }}>
                  Comprehensive Inspection & Quality Assurance Services
                </h2>
                <p className="body-large" style={{ color: 'var(--color-text)' }}>
                  In today&apos;s demanding industrial environment, companies must comply with international codes while ensuring long-term asset reliability. Aura Space Infra Pvt. Ltd. delivers world-class testing and quality control solutions tailored to Oil &amp; Gas, Power, Petrochemicals, Refining, and Manufacturing sectors.
                </p>

                {/* Standards Banner */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '16px',
                    fontSize: '0.8125rem',
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Standards Compliance:</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>ASME, API, ISO, AWS, ASTM, BIS, NABL / ILAC</span>
                </div>
              </div>
            </Reveal>

            {/* 7 Disciplines Grid */}
            <RevealGroup
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
                marginBottom: '48px',
              }}
            >
              {ndtDisciplines.map((disc, idx) => (
                <div
                  key={idx}
                  className="product-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '28px',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'all var(--motion-duration-base) var(--motion-ease)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
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
                        transition: 'all var(--motion-duration-fast) var(--motion-ease)',
                      }}
                    >
                      {disc.icon}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      QA Standard
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-primary)' }}>
                    {disc.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                    {disc.desc}
                  </p>

                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 20px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      flex: 1,
                    }}
                  >
                    {disc.items.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          lineHeight: 1.4,
                        }}
                      >
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-secondary)',
                            marginTop: '7px',
                            flexShrink: 0,
                          }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    to={`/get-a-quote?service=${encodeURIComponent(disc.title)}`}
                    variant="outline"
                    size="sm"
                    style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
                  >
                    Inquire for Discipline <ArrowRight size={14} />
                  </Button>
                </div>
              ))}
            </RevealGroup>

            {/* Why Choose Aura Space Infra for QA */}
            <Reveal>
              <div
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(32px, 5vw, 48px)',
                }}
              >
                <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '24px' }}>
                  Why Choose Aura Space Infra Pvt. Ltd.?
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '24px',
                  }}
                >
                  <div className="metric-stat-box">
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '6px', color: '#FFFFFF' }}>
                      Technical Expertise
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
                      Team of metallurgists, inspection engineers, certified welding inspectors, and NDT Level-II / Level-III specialists.
                    </p>
                  </div>
                  <div className="metric-stat-box">
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '6px', color: '#FFFFFF' }}>
                      Pan-India Footprint
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
                      Serving refineries, petrochemical complexes, EPC projects, fabrication shops, and power plants across India.
                    </p>
                  </div>
                  <div className="metric-stat-box">
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '6px', color: '#FFFFFF' }}>
                      Code Adherence
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
                      Rigorous adherence to international standards including ASME, API, ISO, AWS, ASTM, BIS, and NABL/ILAC guidelines.
                    </p>
                  </div>
                  <div className="metric-stat-box">
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '6px', color: '#FFFFFF' }}>
                      Direct Consultation
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
                      Direct desk access via <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: '#FFFFFF', textDecoration: 'underline' }}>{phone}</a> for rapid site deployment.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* Global CTA Band */}
      <CTABand
        heading="Engage Technical Inspection or Request Chemical Sourcing"
        body="Our engineers and chemical procurement specialists are ready to review your project scope or tender requirements."
        buttonLabel="Request a Quote"
        buttonUrl="/get-a-quote"
        phone="+91 7220000877"
      />
    </>
  );
};
