import React from 'react';
import { ShieldCheck, Mail, Lock, FileText, CheckCircle2, PhoneCall } from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

      {/* Header */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(40px, 5vw, 64px) 0',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <span className="eyebrow">Data Governance &amp; Compliance</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Privacy Policy &amp; Data Protection</h1>
            <p className="body-large">
              Aura Space Infra Pvt. Ltd. (trading as Aura Chemicals) enforces strict commercial data governance in alignment with India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act) and international B2B privacy benchmarks.
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
              Last Verified: September 2026 · Registered Entity: Aura Space Infra Private Limited (CIN: U51909GJ2014PTC080340, ROC Ahmedabad)
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <Section padding="normal">
        <Container>
          <div
            className="card"
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              padding: 'clamp(32px, 5vw, 56px)',
              lineHeight: 1.75,
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                1. Data Fiduciary &amp; Legal Entity
              </h2>
              <p>
                This digital presence is operated by <strong>Aura Space Infra Private Limited</strong> (&quot;the Company&quot;, &quot;we&quot;, &quot;us&quot;), incorporated under the Companies Act and registered with the Registrar of Companies (ROC Ahmedabad). The company functions as a Data Fiduciary under the provisions of the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> for all enterprise information collected through our portals, RFQ generation consoles, and technical communication lines.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                2. Information Processed for Commercial Transactions
              </h2>
              <p>
                We process information solely for legitimate B2B procurement, regulatory traceability, and commercial fulfillment:
              </p>
              <ul style={{ paddingLeft: '24px', margin: '8px 0 16px 0' }}>
                <li>Corporate representative name, business designation, and authorization capacity</li>
                <li>Corporate legal name, GSTIN, and registered plant address</li>
                <li>Official corporate email address, telephone, and WhatsApp contact numbers</li>
                <li>Chemical quotation specifications, requested CAS registry numbers, and delivery destinations</li>
                <li>Batch analytical records, delivery receipts, and proforma documentation</li>
              </ul>
              <p>
                Aura Chemicals does <strong>not</strong> engage in the sale, lease, or speculative marketing brokerage of enterprise client details to third-party commercial entities.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                3. Purpose Limitation &amp; Lawful Processing Grounds
              </h2>
              <p>
                In compliance with Section 4 and Section 7 of the DPDP Act 2023, data processing is restricted strictly to:
              </p>
              <ul style={{ paddingLeft: '24px', margin: '8px 0 16px 0' }}>
                <li>Preparation, negotiation, and execution of formal chemical proforma invoices</li>
                <li>Regulatory batch Certificate of Analysis (CoA) traceability and MSDS dissemination</li>
                <li>Customs and excise clearances for direct port imports</li>
                <li>Statutory compliance under applicable GST and corporate laws of India</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                4. Data Protection &amp; Technical Safeguards
              </h2>
              <p>
                All RFQ transmissions, communication logs, and customer interactions are secured using TLS encryption in transit and strict role-based access control (RBAC) at rest. Technical systems undergo periodic security assessments to prevent unauthorized access, alteration, or data breach.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                5. Rights of the Data Principal
              </h2>
              <p>
                Authorized enterprise representatives retain the right under the DPDP Act 2023 to:
              </p>
              <ul style={{ paddingLeft: '24px', margin: '8px 0 16px 0' }}>
                <li>Request access to a summary of personal information processed by the Company</li>
                <li>Request rectification or updating of obsolete business contact coordinates</li>
                <li>Request erasure of personal information once statutory contract and tax retention horizons have elapsed</li>
                <li>Nominate an alternate individual in case of incapacitation or operational handover</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                6. Grievance Redressal &amp; Data Officer Contact
              </h2>
              <p>
                For grievances or privacy inquiries, contact our Data Governance Officer:
              </p>
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '20px',
                  border: '1px solid var(--color-rule)',
                  fontSize: '0.875rem',
                }}
              >
                <div><strong>Aura Space Infra Private Limited</strong></div>
                <div>CIN: U51909GJ2014PTC080340 (ROC Ahmedabad)</div>
                <div>Corporate Compliance Desk</div>
                <div style={{ marginTop: '8px' }}>
                  Email: <a href="mailto:sales@aurachemicals.in" style={{ color: 'var(--color-teal)', fontWeight: 600 }}>sales@aurachemicals.in</a>
                </div>
                <div>
                  Desk Phone: <a href="tel:+919727404415" style={{ color: 'var(--color-teal)', fontWeight: 600 }}>+91 97274 04415</a>
                </div>
              </div>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
};
