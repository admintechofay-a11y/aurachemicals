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
  Award,
  ArrowRight,
  PhoneCall,
  Mail,
  Scale,
  Building2,
  FlaskConical,
  Truck,
  FileText,
  BadgeCheck,
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
        <Breadcrumb items={[{ label: 'Services & Capabilities' }]} />
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
        <Breadcrumb items={[{ label: 'Services & Capabilities' }]} />
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

  const phone = settings?.company?.phone || '+91 97274 04415';
  const email = settings?.company?.email || 'sales@aurachemicals.in';

  const chemicalCapabilities = [
    {
      index: '01',
      title: 'Direct Domestic Manufacturer Allocations',
      desc: 'Exclusive sourcing arrangements across 400+ leading chemical manufacturing hubs in Gujarat, Maharashtra, and Andhra Pradesh, guaranteeing contractual delivery allocations.',
      points: [
        'Contractual monthly quotas for bulk commercial plants',
        'Direct ex-factory dispatch with sealed packaging',
        'Price stabilization mechanisms for high-demand compounds',
        'Direct relationship with primary chemical synthesizers',
      ],
      icon: <FlaskConical size={22} style={{ color: 'var(--color-teal)' }} />,
    },
    {
      index: '02',
      title: 'Direct Maritime Import & Port Logistics',
      desc: 'End-to-end import clearing, bonded warehouse handling, and inland transport directly from major Indian maritime gateways including Nhava Sheva (JNPT), Mundra, and Hazira.',
      points: [
        'Customs clearance and chemical regulatory documentation',
        'ISO tank containers and dedicated bulk storage handling',
        'Port-to-plant direct multimodal logistics scheduling',
        'Traceable demurrage and import lot verification',
      ],
      icon: <Truck size={22} style={{ color: 'var(--color-teal)' }} />,
    },
    {
      index: '03',
      title: 'Batch Analytical CoA Verification',
      desc: 'Every single commercial consignment is validated against pharmacopeial monographs (IP / BP / USP / EP) with manufacturer batch analytical certificates and retain sample archiving.',
      points: [
        'Batch-specific Certificate of Analysis (CoA) with each delivery',
        'Safety Data Sheets (MSDS/SDS) compliant with GHS regulations',
        'Technical Data Sheets (TDS) and solubility monographs',
        'Full traceability from manufacturer synthesis lot to client facility',
      ],
      icon: <FileCheck2 size={22} style={{ color: 'var(--color-teal)' }} />,
    },
    {
      index: '04',
      title: 'Custom Packaging & Storage Conditioning',
      desc: 'Industrial repackaging and preservation under inert or moisture-barrier conditions according to chemical sensitivity and international UN shipping regulations.',
      points: [
        'UN-rated fiber drums with poly-lined vacuum barriers',
        'HDPE carboys, intermediate bulk containers (IBCs), and barrels',
        'Nitrogen purging for hygroscopic and oxidizable APIs',
        'Dedicated temperature and humidity monitored transit for sensitive compounds',
      ],
      icon: <ShieldCheck size={22} style={{ color: 'var(--color-teal)' }} />,
    },
  ];

  const ndtDisciplines = [
    {
      index: '01',
      code: 'ASME Sec V / ASNT SNT-TC-1A',
      title: 'Ultrasonic Testing (UT) & Advanced PAUT / TOFD',
      desc: 'Conventional and phased-array ultrasonic inspection for detecting subsurface flaws, laminar tears, and wall-thickness degradation in pressure vessels, pipelines, and heavy structural weldments.',
      deliverables: [
        'Digital A-scan / B-scan / C-scan flaw characterization',
        'Precision thickness gauging and corrosion grid mapping',
        'Phased Array Ultrasonic Testing (PAUT) of complex geometries',
        'Time of Flight Diffraction (TOFD) for root weld sizing',
      ],
      standards: 'ASME Sec V, ASME Sec VIII, API 510, ASTM E164',
    },
    {
      index: '02',
      code: 'ASME Sec V / ASTM E94',
      title: 'Radiographic Testing (RT) & Film Interpretation',
      desc: 'Gamma-ray and X-ray volumetric examination of critical butt welds, casting integrity, and fabricated assemblies with calibrated optical density film evaluation.',
      deliverables: [
        'Iridium-192 / Cobalt-60 isotope and industrial X-ray exposure',
        'Certified ASNT Level II / III radiographic film interpretation',
        'Digital radiography scanning and archival storage',
        'Porosity, lack of fusion, and slag inclusion mapping',
      ],
      standards: 'ASME Sec I, ASME B31.3, API 1104, AWS D1.1',
    },
    {
      index: '03',
      code: 'ASTM E709 / ASME Sec V Art 7',
      title: 'Magnetic Particle Testing (MPT / MT)',
      desc: 'Surface and shallow subsurface defect evaluation in ferromagnetic components utilizing electromagnetic yokes and high-contrast fluorescent or black wet particles.',
      deliverables: [
        'AC/DC electromagnetic yoke testing for field welds and nozzles',
        'Fluorescent magnetic particle inspection under UV-A illumination',
        'Fatigue crack identification in rotating equipment and shafts',
        'Demagnetization verification and residual field measurement',
      ],
      standards: 'ASTM E709, ASME Sec V Art 7, ISO 9934',
    },
    {
      index: '04',
      code: 'ASTM E165 / ASME Sec V Art 6',
      title: 'Liquid Dye Penetrant Testing (DPT / PT)',
      desc: 'Capillary-action inspection for non-porous metallic and composite materials, identifying surface-breaking discontinuities, porosity, and micro-fissures in non-magnetic alloys.',
      deliverables: [
        'Solvent-removable visible dye penetrant systems',
        'High-sensitivity fluorescent post-emulsifiable penetrant examination',
        'Austenitic stainless steel, Inconel, and non-ferrous weld inspection',
        'Machined flange face and valve seat surface integrity',
      ],
      standards: 'ASTM E165, ASME Sec V Art 6, ISO 3452',
    },
    {
      index: '05',
      code: 'API 510 / 570 / 653',
      title: 'In-Service Inspection & Risk-Based Inspection (RBI)',
      desc: 'Plant integrity management, asset life calculation, and scheduled turn-around inspection for operating chemical refineries, tank terminals, and pharmaceutical utilities.',
      deliverables: [
        'API 510 Pressure Vessel in-service remaining life assessment',
        'API 570 Piping circuit inspection and circuit isometric generation',
        'API 653 Aboveground Storage Tank floor settlement and shell scanning',
        'Fitness-for-Service (FFS) evaluation per API 579-1 / ASME FFS-1',
      ],
      standards: 'API 510, API 570, API 653, API 580, API 579',
    },
    {
      index: '06',
      code: 'ASME Sec IX / AWS D1.1',
      title: 'Welding Inspection, Procedure & Welder Qualification',
      desc: 'Full-cycle surveillance of industrial fabrication, from base material trace checking through Welding Procedure Specification (WPS) and Welder Performance Qualification (WPQ).',
      deliverables: [
        'WPS drafting, PQR test witness, and mechanical testing protocol',
        'WPQ performance testing and welder ID card issuance',
        'Preheat and Post-Weld Heat Treatment (PWHT) monitoring',
        'Fit-up, root pass, and final weld visual inspection per AWS/ASME',
      ],
      standards: 'ASME Sec IX, AWS D1.1, EN ISO 15614',
    },
    {
      index: '07',
      code: 'ASTM E1476 / Positive Material ID',
      title: 'Positive Material Identification (PMI) & Metallurgy',
      desc: 'Non-destructive elemental chemical analysis and alloy verification using handheld X-Ray Fluorescence (XRF) and Optical Emission Spectrometry (OES) instruments.',
      deliverables: [
        'Instant alloy grade confirmation (304L, 316L, 321, Duplex, Inconel)',
        'Carbon and light element detection in low-carbon grade steels',
        'Material Test Report (MTR) verification against incoming stock',
        'On-site metallographic replica testing and failure investigations',
      ],
      standards: 'API 578, ASTM E1476, ASTM E572',
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'Services & Capabilities' }]} />

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
            <span className="eyebrow">Operating Divisions</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Services &amp; Technical Capabilities</h1>
            <p className="body-large">
              Aura Space Infra Pvt. Ltd. integrates two specialized industrial capabilities: high-purity chemical distribution across 400+ Indian synthesizers, and certified plant integrity &amp; NDT inspection services conforming to ASME, API, and ASTM engineering standards.
            </p>
          </div>
        </Container>
      </section>

      {/* Capability Selector Filter */}
      <section
        style={{
          backgroundColor: 'var(--color-card)',
          borderBottom: '1px solid var(--color-rule)',
          padding: '16px 0',
        }}
      >
        <Container>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', marginRight: '8px' }}>
              Division View:
            </span>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
            >
              All Capabilities (Dual Division)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chemicals')}
              className={`btn btn-sm ${activeTab === 'chemicals' ? 'btn-primary' : 'btn-outline'}`}
            >
              Chemical Distribution &amp; Imports
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inspection')}
              className={`btn btn-sm ${activeTab === 'inspection' ? 'btn-primary' : 'btn-outline'}`}
            >
              NDT &amp; Engineering Inspection
            </button>
          </div>
        </Container>
      </section>

      {/* DIVISION 1: Chemical Distribution & Sourcing */}
      {(activeTab === 'all' || activeTab === 'chemicals') && (
        <Section padding="normal">
          <Container>
            <SectionHeading
              index="01"
              eyebrow="Commercial Supply"
              title="Chemical Distribution & Sourcing Infrastructure"
              description="Direct-from-manufacturer allocation models eliminating unverified intermediaries, supported by documented batch analytical testing and compliant logistics."
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              {chemicalCapabilities.map((cap) => (
                <div
                  key={cap.index}
                  className="card"
                  style={{
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
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
                      {cap.icon}
                    </div>
                    <span className="section-index" style={{ color: 'var(--color-teal)' }}>
                      {cap.index}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.125rem', marginBottom: '10px', color: 'var(--color-ink-navy)' }}>
                    {cap.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                    {cap.desc}
                  </p>

                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 'auto 0 0 0',
                      borderTop: '1px solid var(--color-rule)',
                      paddingTop: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text)',
                    }}
                  >
                    {cap.points.map((pt, pIdx) => (
                      <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CheckCircle2 size={14} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button to="/products" variant="primary" size="md" icon={<ArrowRight size={16} />}>
                Browse High-Purity Chemical Catalog
              </Button>
            </div>
          </Container>
        </Section>
      )}

      {/* DIVISION 2: Non-Destructive Testing (NDT) & Inspection */}
      {(activeTab === 'all' || activeTab === 'inspection') && (
        <Section
          padding="normal"
          style={{
            backgroundColor: activeTab === 'all' ? 'var(--color-surface)' : 'transparent',
            borderTop: activeTab === 'all' ? '1px solid var(--color-rule)' : 'none',
          }}
        >
          <Container>
            <SectionHeading
              index="02"
              eyebrow="Asset Integrity & QA"
              title="NDT &amp; Industrial Plant Inspection Services"
              description="Aura Space Infra Pvt. Ltd. provides certified Level II & Level III inspection services under ASME, API, AWS, and ASTM codes to guarantee pressure vessel, piping, and structural safety."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '36px' }}>
              {ndtDisciplines.map((ndt) => (
                <div
                  key={ndt.index}
                  className="card"
                  style={{
                    padding: 'clamp(24px, 3vw, 32px)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    alignItems: 'start',
                    backgroundColor: 'var(--color-card)',
                  }}
                >
                  {/* Left: Code, Title, and Description */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span className="section-index" style={{ color: 'var(--color-teal)', fontSize: '0.8125rem' }}>
                        {ndt.index}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-family-mono)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-rule)',
                          color: 'var(--color-teal)',
                          fontWeight: 600,
                        }}
                      >
                        {ndt.code}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--color-ink-navy)' }}>
                      {ndt.title}
                    </h3>

                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                      {ndt.desc}
                    </p>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                      <strong>Governing Standards:</strong>{' '}
                      <span style={{ fontFamily: 'var(--font-family-mono)' }}>{ndt.standards}</span>
                    </div>
                  </div>

                  {/* Right: Technical Deliverables Table */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-rule)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: 'var(--color-ink-navy)',
                        marginBottom: '12px',
                        borderBottom: '1px solid var(--color-rule)',
                        paddingBottom: '8px',
                      }}
                    >
                      Technical Deliverables &amp; Protocols
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: 'var(--color-text)' }}>
                      {ndt.deliverables.map((del, dIdx) => (
                        <li key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <BadgeCheck size={15} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }} />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button
                to={`/contact?subject=${encodeURIComponent('NDT & Plant Inspection Services')}`}
                variant="primary"
                size="md"
                icon={<ArrowRight size={16} />}
              >
                Inquire for Plant Inspection &amp; NDT Deployment
              </Button>
            </div>
          </Container>
        </Section>
      )}

      {/* Global CTA Band */}
      <CTABand
        heading="Enterprise Procurement &amp; Plant Quality Assurance"
        body="Whether sourcing high-purity chemical batches or scheduling shutdown inspection crews, our technical engineers are at your disposal."
        buttonLabel="Request Technical Consultation"
        buttonUrl="/contact"
        phone={phone}
      />
    </>
  );
};
