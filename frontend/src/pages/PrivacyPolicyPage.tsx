import React from 'react';
import { ShieldCheck, Mail, Lock, FileText, CheckCircle2 } from 'lucide-react';
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
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <span className="eyebrow">Corporate Governance</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Privacy Policy</h1>
            <p className="body-large" style={{ color: 'var(--color-text)' }}>
              Aura Space Infra Pvt. Ltd. (Aura Chemicals) is committed to safeguarding personal and commercial information collected across our website and B2B communication channels.
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Last Updated: March 2026 · Registered Entity: Aura Space Infra Private Limited (ROC Ahmedabad)
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <Section padding="normal">
        <Container>
          <div
            style={{
              maxWidth: '840px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: 'clamp(32px, 5vw, 56px)',
              boxShadow: 'var(--shadow-xs)',
              lineHeight: 1.7,
              color: 'var(--color-text)',
            }}
          >
            <section style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '16px' }}>
                1. Who We Are
              </h2>
              <p>
                Our official corporate website address is <strong>https://aurachemicals.in</strong>. This portal is operated by <strong>Aura Space Infra Private Limited</strong>, an Indian non-government private corporate entity registered with the Registrar of Companies (ROC Ahmedabad). We operate as a premier distributor of Active Pharmaceutical Ingredients (APIs), industrial solvents, performance phosphates, and specialized inspection engineering services.
              </p>
            </section>

            <section style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '16px' }}>
                2. Information We Collect
              </h2>
              <p>
                When you interact with our website—such as when requesting a commercial quotation, downloading technical data sheets, or submitting a business inquiry—we may collect the following business and personal details:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                <li>Contact person full name and professional designation</li>
                <li>Company or legal firm name</li>
                <li>Business email address and telephone / WhatsApp numbers</li>
                <li>Target chemical products, CAS numbers, order volumes, and delivery destination</li>
                <li>Technical communication logs and pro-forma invoice records</li>
              </ul>
              <p>
                We do not sell, rent, or lease client information to third-party commercial marketers. Information is collected exclusively for commercial quotation, contract fulfillment, regulatory compliance, and verified communication.
              </p>
            </section>

            <section style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '16px' }}>
                3. Cookies and Session Management
              </h2>
              <p>
                Our website utilizes essential functional cookies and session tokens to ensure website stability, secure CSRF form transmission, and optimize page load performance:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                <li><strong>Essential Cookies:</strong> Required to maintain security tokens, shopping and inquiry state, and browser compatibility.</li>
                <li><strong>Analytics &amp; Performance:</strong> Aggregated, anonymized traffic statistics to evaluate site usability and improve user experience across diverse devices.</li>
              </ul>
              <p>
                You may configure your browser to decline non-essential cookies. However, disabling all cookies may impair the functionality of interactive quote generators and user account areas.
              </p>
            </section>

            <section style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '16px' }}>
                4. Data Security and Confidentiality
              </h2>
              <p>
                We maintain appropriate administrative, technical, and physical safeguards designed to protect commercial information against accidental, unlawful, or unauthorized destruction, loss, alteration, or access. All electronic quote submissions are transmitted over TLS-encrypted connections.
              </p>
            </section>

            <section style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '16px' }}>
                5. Data Retention
              </h2>
              <p>
                We retain commercial inquiry information for the duration necessary to satisfy business procurement processes, facilitate repeat orders, and fulfill legal, tax, or regulatory obligations under Indian law and ROC guidelines.
              </p>
            </section>

            <section style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '16px' }}>
                6. Your Rights Over Your Data
              </h2>
              <p>
                You have the right to request access to the personal and commercial data we maintain about you, request corrections to inaccurate records, or request erasure of your data, subject to statutory retention obligations required for tax and commercial contracts.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '16px' }}>
                7. Contact Information for Privacy Matters
              </h2>
              <p>
                If you have questions, comments, or requests regarding this Privacy Policy, please contact our data compliance desk:
              </p>
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div><strong>Aura Space Infra Private Limited</strong></div>
                <div>ROC Ahmedabad, Gujarat, India</div>
                <div>Email: <a href="mailto:management.aurachemicals@gmail.com" style={{ color: 'var(--color-secondary)' }}>management.aurachemicals@gmail.com</a></div>
                <div>Phone: <a href="tel:+917220000877" style={{ color: 'var(--color-secondary)' }}>+91 7220000877</a></div>
              </div>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
};
