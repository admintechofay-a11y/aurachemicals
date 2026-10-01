import React from 'react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const TermsPage: React.FC = () => {
  return (
    <>
      <Breadcrumb items={[{ label: 'Terms of Supply & Commercial Conditions' }]} />

      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(40px, 5vw, 64px) 0',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <span className="eyebrow">Statutory &amp; Commercial Terms</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Commercial Terms of Supply</h1>
            <p className="body-large">
              Standard operating conditions governing chemical quotations, batch allocation agreements, and industrial supply transactions with Aura Space Infra Pvt. Ltd. (Aura Chemicals).
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
              Entity: Aura Space Infra Private Limited (CIN: U51909GJ2014PTC080340) · ROC Ahmedabad, Gujarat, India
            </div>
          </div>
        </Container>
      </section>

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
                1. Scope of Agreement &amp; B2B Commercial Nature
              </h2>
              <p>
                All proforma invoices, quotation schedules, purchase order acknowledgments, and physical product dispatches originating from Aura Space Infra Pvt. Ltd. (&quot;the Seller&quot;) are exclusively commercial B2B transactions. The buyer (&quot;the Purchaser&quot;) certifies that all chemical compounds, active pharmaceutical ingredients (APIs), and technical solvents purchased are intended for manufacturing, synthesis, formulation, or analytical laboratory usage in compliance with applicable Indian and international regulations.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                2. Technical Specifications &amp; Certificate of Analysis (CoA)
              </h2>
              <p>
                Chemicals are supplied strictly in accordance with manufacturer batch Certificates of Analysis and applicable pharmacopeial monographs (IP, BP, USP, EP) as detailed in formal proforma invoices. The Purchaser agrees to verify incoming consignments against the accompanying batch analytical records upon receipt prior to commercial processing or incorporation.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                3. Delivery Terms &amp; Risk Transfer
              </h2>
              <p>
                Unless explicitly agreed in writing, delivery terms shall be governed by Incoterms 2020:
              </p>
              <ul style={{ paddingLeft: '24px', margin: '8px 0 16px 0' }}>
                <li><strong>Ex-Works (EXW):</strong> Risk passes to the Purchaser upon dispatch from synthesis facility or bonded warehouse.</li>
                <li><strong>FOR Destination / CIF:</strong> Transit insurance and carriage are arranged as stipulated in the formal purchase order confirmation.</li>
                <li><strong>Demurrage &amp; Unloading:</strong> Tanker and container turnaround times are subject to standard industrial haulage demurrage terms.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                4. Safety, Handling &amp; Regulatory Compliance
              </h2>
              <p>
                The Purchaser warrants that its personnel, storage infrastructure, and transport receivers are trained in accordance with Safety Data Sheets (SDS/MSDS) and statutory chemical storage licenses under Petroleum and Explosives Safety Organization (PESO), State Pollution Control Boards, and relevant Drug Controller administrations.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                5. Limitation of Liability
              </h2>
              <p>
                The liability of the Seller for any proven batch variance or non-conformance shall not exceed the net invoiced purchase price of the specific consignment in question. In no event shall the Seller be liable for consequential, incidental, or indirect manufacturing downtime losses.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                6. Governing Law &amp; Jurisdiction
              </h2>
              <p>
                These terms, proforma agreements, and supply contracts shall be interpreted in accordance with the laws of the Republic of India. Any legal dispute or proceeding arising out of or in connection with supply contracts shall fall under the exclusive jurisdiction of the competent courts in Ahmedabad, Gujarat, India.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
};
