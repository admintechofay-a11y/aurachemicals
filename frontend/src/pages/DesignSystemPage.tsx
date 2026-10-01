import React, { useState } from 'react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { CASBadge } from '../components/common/CASBadge';
import { SpecRow, SpecTable } from '../components/common/SpecRow';
import { FormField } from '../components/common/FormField';
import { Check, Copy, ArrowRight, ShieldCheck, Download } from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const tokens = [
    { name: '--color-paper', value: '#F7F6F2', role: 'Warm Technical Paper Canvas' },
    { name: '--color-ink-navy', value: '#081B33', role: 'Deep Technical Ink & Headings' },
    { name: '--color-surface', value: '#F0EFEA', role: 'Subtle Hairline Box Surface' },
    { name: '--color-card', value: '#FFFFFF', role: 'Component Surface Background' },
    { name: '--color-teal', value: '#1F7A8C', role: 'Refined Technical Accent (4.9:1 AA)' },
    { name: '--color-amber', value: '#B45309', role: 'Oxide Amber Highlighting' },
    { name: '--color-rule', value: '#E2E0D8', role: 'Precision Hairline Border' },
    { name: '--color-text-secondary', value: '#364152', role: 'Accessible Body Text (7.1:1 AA)' },
    { name: '--color-muted', value: '#5B6777', role: 'Tabular & Secondary Labels (4.6:1 AA)' },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'Design System & Specification Tokens' }]} />

      {/* Header */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(48px, 6vw, 72px) 0',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <span className="eyebrow">Aura Chemicals Brand Architecture</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Direction A: Laboratory Editorial Design System</h1>
            <p className="body-large">
              A bespoke, content-grounded visual language for industrial chemical procurement. Prioritizes editorial typography (Newsreader + IBM Plex Sans), hairline-ruled specification tables, high-contrast accessible tokens, and exact chemical nomenclature.
            </p>
          </div>
        </Container>
      </section>

      {/* 01: Color Tokens */}
      <Section padding="normal">
        <Container>
          <SectionHeading
            index="01"
            eyebrow="Foundational Palette"
            title="Color Tokens & Contrast Verification"
            description="Designed for 100% WCAG 2.2 AA compliance against paper and surface backgrounds."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {tokens.map((t) => (
              <div
                key={t.name}
                onClick={() => copyToken(`var(${t.name})`)}
                className="card"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    height: '60px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: `var(${t.name})`,
                    border: '1px solid var(--color-rule)',
                  }}
                />
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.8125rem', color: 'var(--color-ink-navy)', fontWeight: 600 }}>
                      {t.name}
                    </code>
                    {copiedToken === `var(${t.name})` ? (
                      <Check size={14} style={{ color: 'var(--color-teal)' }} />
                    ) : (
                      <Copy size={14} style={{ color: 'var(--color-muted)' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-muted)', marginTop: '2px' }}>
                    {t.value}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 02: Typography */}
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
            eyebrow="Typographic Scale"
            title="Editorial & Technical Typography"
            description="The tripartite hierarchy: Newsreader (editorial serif), IBM Plex Sans (modern body), and IBM Plex Mono (tabular monographs)."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="card" style={{ padding: '32px', backgroundColor: 'var(--color-card)' }}>
              <span className="eyebrow">Display Optical Serif · Newsreader</span>
              <h1 style={{ margin: '8px 0 12px 0' }}>High-Purity Active Pharmaceutical Ingredients</h1>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', margin: 0 }}>
                Used for primary display headings, editorial titles, and section anchors (weights 400, 500, 600).
              </p>
            </div>

            <div className="card" style={{ padding: '32px', backgroundColor: 'var(--color-card)' }}>
              <span className="eyebrow">Workhorse Grotesque · IBM Plex Sans</span>
              <p className="body-large" style={{ margin: '8px 0 12px 0' }}>
                Aura Space Infra Pvt. Ltd. coordinates primary chemical synthesizers across Gujarat with institutional pharmaceutical formulators worldwide, guaranteeing uninterrupted allocation schedules.
              </p>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', margin: 0 }}>
                Optimized for technical readability, density, and legibility across all screen sizes.
              </p>
            </div>

            <div className="card" style={{ padding: '32px', backgroundColor: 'var(--color-card)' }}>
              <span className="eyebrow">Technical Monospace · IBM Plex Mono</span>
              <div
                style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'var(--color-ink-navy)',
                  margin: '8px 0 12px 0',
                }}
              >
                CAS: 89796-99-6 | Mol. Formula: C16H13Cl2NO4 | Assay: ≥99.0% IP/BP | Batch: #2024-AC-1049
              </div>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', margin: 0 }}>
                Enforces tabular figure alignment for CAS numbers, chemical formulas, and batch analytical figures.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 03: Component Specimens */}
      <Section padding="normal">
        <Container>
          <SectionHeading
            index="03"
            eyebrow="Signature Components"
            title="Specification Atoms & Molecules"
            description="The core reusable primitives defining the Aura technical aesthetic."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {/* SpecRow & SpecTable */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>Hairline Specification Table</h3>
              <SpecTable title="Active Pharmaceutical Ingredient Specification">
                <SpecRow label="Chemical Name" value="Aceclofenac" />
                <SpecRow label="CAS Registry Number" value={<CASBadge cas="89796-99-6" />} />
                <SpecRow label="Pharmacopeia Grade" value="Pharma Grade IP / BP / EP" />
                <SpecRow label="Minimum Assay Purity" value="≥ 99.0% (HPLC)" isMono />
                <SpecRow label="Standard Packaging" value="25 kg UN-rated Fiber Drums" />
              </SpecTable>
            </div>

            {/* CAS Badges with Copy Feedback */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>Interactive CAS Badges</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '16px' }}>
                Click any CAS badge to copy official identifier to clipboard with instant feedback:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <CASBadge cas="89796-99-6" />
                <CASBadge cas="103-90-2" />
                <CASBadge cas="657-27-2" />
                <CASBadge cas="1115-70-4" />
                <CASBadge cas="7758-19-2" />
                <CASBadge cas="67-56-1" />
              </div>
            </div>

            {/* Button Variations */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>Button Variants &amp; Sizes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button variant="primary" size="md">Primary Action</Button>
                  <Button variant="secondary" size="md">Secondary Action</Button>
                  <Button variant="outline" size="md">Outline Action</Button>
                  <Button variant="ghost" size="md">Ghost Action</Button>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Button variant="primary" size="sm">Small (36px)</Button>
                  <Button variant="primary" size="md">Medium (44px)</Button>
                  <Button variant="primary" size="lg">Large (50px)</Button>
                </div>
                <div>
                  <Button variant="primary" size="md" isLoading>Loading State</Button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>Form Input States</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FormField id="demo-name" label="Standard Text Field" hint="Helper instruction text">
                  <input id="demo-name" type="text" placeholder="e.g. Dr. Rajesh Patel" defaultValue="Dr. Rajesh Patel" />
                </FormField>

                <FormField id="demo-err" label="Validation Error Field" error="Please provide a valid business email address.">
                  <input id="demo-err" type="email" defaultValue="invalid-email" />
                </FormField>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};
