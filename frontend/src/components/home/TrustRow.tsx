import React from 'react';
import { FileCheck, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Container } from '../common/Container';
import { IndustryChips } from './IndustryChips';

export const TrustRow: React.FC = () => {
  const documents = [
    { title: 'Certificate of Analysis (CoA)', icon: FileCheck },
    { title: '16-Section MSDS / SDS', icon: ShieldCheck },
    { title: 'Technical Data Sheet (TDS)', icon: FileText },
    { title: 'Batch Traceability Records', icon: CheckCircle2 },
  ];

  const principals = [
    'Grasim Industries Ltd.',
    'Gujarat Alkalies & Chemicals (GACL)',
    'GNFC',
    'Magnesia Chemical LLP',
  ];

  return (
    <section className="section" style={{ backgroundColor: 'var(--color-surface-white)', padding: 'clamp(48px, 6vw, 80px) 0' }}>
      <Container>
        <div className="home-section-header">
          <h2 className="home-section-title">Compliance and reach</h2>
          <p className="home-section-sub">
            Verified documentation across Indian manufacturing sectors.
          </p>
        </div>

        <div className="trust-block">
          {/* 4 Document Chips */}
          <div className="docs-chips-grid">
            {documents.map((d) => {
              const IconComp = d.icon;
              return (
                <div key={d.title} className="doc-chip">
                  <IconComp size={18} className="doc-chip-icon" />
                  <span>{d.title}</span>
                </div>
              );
            })}
          </div>

          {/* Authorized Distributors Row */}
          <div className="principals-row">
            <span className="principals-label">Authorized Distributor For</span>
            <div className="principals-list">
              {principals.map((p, idx) => (
                <React.Fragment key={p}>
                  <span>{p}</span>
                  {idx < principals.length - 1 && <span style={{ color: 'var(--color-rule-strong)' }}>·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Industry Chips Row */}
          <IndustryChips />
        </div>
      </Container>
    </section>
  );
};
