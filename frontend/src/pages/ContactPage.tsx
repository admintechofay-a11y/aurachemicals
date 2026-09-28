import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PhoneCall,
  Mail,
  Building2,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Globe,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { FormField } from '../components/common/FormField';
import { api } from '../api/client';
import { InquiryPayload } from '../api/types';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Chemical Sourcing & Distribution',
    message: '',
    website_url_hp: '', // Honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  const phone = settings?.company?.phone || '+91 7220000877';
  const email = settings?.company?.email || 'management.aurachemicals@gmail.com';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Business email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your inquiry.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.website_url_hp) {
      setSubmitResult({ success: true, message: 'Message sent successfully.' });
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: InquiryPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        product: formData.subject,
        requirement: formData.message,
        consent: true,
      };

      await api.submitInquiry(payload);
      setSubmitResult({
        success: true,
        message: 'Thank you for contacting Aura Chemicals. Our representative will contact you shortly.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Chemical Sourcing & Distribution',
        message: '',
        website_url_hp: '',
      });
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err.message || 'Failed to send message. Please contact us via phone directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      {/* Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(40px, 5vw, 64px) 0',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <span className="eyebrow">Corporate Communications</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Contact Aura Space Infra Pvt. Ltd.</h1>
            <p className="body-large" style={{ color: 'var(--color-text)' }}>
              Get in touch with our commercial trading desk, technical procurement team, or inspection services division. We are at your service for bulk allocations, pro-forma quotes, and operational inquiries.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Cards & Form Section */}
      <Section padding="normal">
        <Container>
          {/* 3 Core Contact Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '56px',
            }}
          >
            {/* Phone Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                padding: '32px',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(31, 90, 140, 0.08)',
                  color: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <PhoneCall size={22} />
              </div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-primary)' }}>
                Phone &amp; WhatsApp
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                Direct access to our commercial sales managers for fast spot price confirmation and logistics coordination.
              </p>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                style={{
                  marginTop: 'auto',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--color-secondary)',
                  textDecoration: 'none',
                }}
              >
                {phone}
              </a>
            </div>

            {/* Email Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                padding: '32px',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(42, 127, 134, 0.08)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Mail size={22} />
              </div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-primary)' }}>
                Corporate Email
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                Send formal RFQs, tender documents, or purchase orders directly to executive management.
              </p>
              <a
                href={`mailto:${email}`}
                style={{
                  marginTop: 'auto',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--color-secondary)',
                  textDecoration: 'none',
                  wordBreak: 'break-all',
                }}
              >
                {email}
              </a>
            </div>

            {/* Entity Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                padding: '32px',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(11, 37, 69, 0.08)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Building2 size={22} />
              </div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-primary)' }}>
                Registration &amp; Jurisdiction
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                Aura Space Infra Private Limited (Non-Government private company registered with ROC Ahmedabad).
              </p>
              <div style={{ marginTop: 'auto', fontSize: '0.8125rem', color: 'var(--color-text)', fontWeight: 600 }}>
                ROC Ahmedabad, Gujarat, India
              </div>
            </div>
          </div>

          {/* Form and Hours Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            {/* General Inquiry Form */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                padding: 'clamp(28px, 4vw, 40px)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-primary)' }}>
                Send Us a Message
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                Fill out the form below and our team will get back to you promptly.
              </p>

              {submitResult && (
                <div
                  role="status"
                  aria-live="polite"
                  tabIndex={-1}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: submitResult.success ? 'rgba(42, 127, 134, 0.08)' : 'rgba(197, 48, 48, 0.08)',
                    border: `1px solid ${submitResult.success ? 'var(--color-accent)' : 'var(--color-error)'}`,
                    color: submitResult.success ? 'var(--color-accent)' : 'var(--color-error)',
                    fontSize: '0.875rem',
                    animation: 'feedbackFadeIn 250ms var(--motion-ease) forwards',
                  }}
                >
                  {submitResult.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <div>{submitResult.message}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="website_url_hp"
                    tabIndex={-1}
                    value={formData.website_url_hp}
                    onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <FormField id="name" label="Full Name" required error={errors.name}>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </FormField>

                  <FormField id="email" label="Business Email" required error={errors.email}>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@company.com"
                    />
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <FormField id="phone" label="Phone Number" required error={errors.phone}>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </FormField>

                  <FormField id="subject" label="Subject / Department">
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="Chemical Sourcing & Distribution">Chemical Sourcing &amp; Distribution</option>
                      <option value="Active Pharmaceutical Ingredients">Active Pharmaceutical Ingredients (APIs)</option>
                      <option value="Inspection & Quality Assurance">Inspection &amp; QA (NDT Services)</option>
                      <option value="Partnership & Sourcing Alliances">Partnership &amp; Manufacturer Alliances</option>
                      <option value="General Corporate Inquiry">General Corporate Inquiry</option>
                    </select>
                  </FormField>
                </div>

                <FormField id="message" label="Your Message or Request Details" required error={errors.message}>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your requirement, products of interest, or technical specifications..."
                  />
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isSubmitting ? (
                    'Transmitting Message...'
                  ) : (
                    <>
                      <Send size={16} /> Send Inquiry
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Distribution Network & SLA Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  padding: '32px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Globe size={22} style={{ color: 'var(--color-secondary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>
                    Pan-India Distribution Network
                  </h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Aura Space Infra Pvt. Ltd. coordinates industrial chemical freight, bulk tanker dispatches, and warehouse allocations across all major manufacturing clusters throughout India.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--color-secondary)' }} />
                    <span>Active partnerships with 400+ leading domestic manufacturers</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--color-secondary)' }} />
                    <span>Dedicated technical and sales desks for prompt dispatch coordination</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--color-secondary)' }} />
                    <span>Compliance with all national transportation and chemical handling guidelines</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  padding: '28px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Clock size={20} style={{ color: 'var(--color-primary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
                    Operational Hours &amp; Response Times
                  </h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Trading desk hours: <strong>Monday – Saturday: 9:00 AM – 6:30 PM IST</strong>.<br />
                  Electronic quotation requests submitted via the portal are monitored 24/7 with a 24 business hours SLA commitment.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};
