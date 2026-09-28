import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PhoneCall,
  Mail,
  Building2,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { FormField } from '../components/common/FormField';
import { api } from '../api/client';
import { InquiryPayload } from '../api/types';
import { UI_LABELS } from '../utils/constants';

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

  const brandName = settings?.company?.brand_name || 'Aura Chemicals';
  const legalName = settings?.company?.legal_name || 'Aura Space Infra Private Limited';
  const phone = settings?.company?.phone;
  const email = settings?.company?.email;
  const address = settings?.company?.registered_address || 'ROC Ahmedabad, Gujarat, India';
  const businessHours = settings?.company?.business_hours || 'Monday – Saturday: 9:00 AM – 6:00 PM IST';
  const mapEmbed = (settings?.company as any)?.map_embed;

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
      <Breadcrumb items={[{ label: UI_LABELS.NAV_CONTACT }]} />

      {/* Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(40px, 5vw, 64px) 0',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <span className="eyebrow">Direct Communications</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Contact {brandName}</h1>
            <p className="body-large">
              Connect with our corporate sales desk, technical distribution team, and regulatory documentation office.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Cards & Form Section */}
      <Section padding="normal">
        <Container>
          {/* Core Contact Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '48px',
            }}
          >
            {/* Phone Card */}
            {phone && (
              <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-rule)',
                    color: 'var(--color-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <PhoneCall size={20} />
                </div>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                  Phone &amp; WhatsApp
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  Direct procurement desk for spot allocations and order logistics.
                </p>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  style={{
                    marginTop: 'auto',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    textDecoration: 'none',
                  }}
                >
                  {phone}
                </a>
              </div>
            )}

            {/* Email Card */}
            {email && (
              <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-rule)',
                    color: 'var(--color-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Mail size={20} />
                </div>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                  Corporate Email
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  Submit technical specifications, RFQ documents, and formal POs.
                </p>
                <a
                  href={`mailto:${email}`}
                  style={{
                    marginTop: 'auto',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    textDecoration: 'none',
                    wordBreak: 'break-all',
                  }}
                >
                  {email}
                </a>
              </div>
            )}

            {/* Entity & Address Card */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-rule)',
                  color: 'var(--color-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Building2 size={20} />
              </div>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                Corporate Registration
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                {legalName}
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                <MapPin size={16} style={{ color: 'var(--color-accent)' }} />
                <span>{address}</span>
              </div>
            </div>
          </div>

          {/* Form and Hours Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* General Inquiry Form */}
            <div className="card" style={{ padding: 'clamp(24px, 4vw, 36px)' }}>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
                Send Us a Message
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '24px' }}>
                Please specify your chemical or business requirement below:
              </p>

              {submitResult && (
                <div
                  role="status"
                  aria-live="polite"
                  tabIndex={-1}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'var(--color-surface)',
                    border: `1px solid ${submitResult.success ? 'var(--color-success)' : 'var(--color-error)'}`,
                    color: submitResult.success ? 'var(--color-success)' : 'var(--color-error)',
                    fontSize: '0.875rem',
                  }}
                >
                  {submitResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
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
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </FormField>

                  <FormField id="email" label="Business Email" required error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@company.com"
                      required
                    />
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <FormField id="phone" label="Phone / WhatsApp" required error={errors.phone}>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98000 00000"
                      required
                    />
                  </FormField>

                  <FormField id="subject" label="Subject / Domain">
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Bulk Solvent Supply"
                    />
                  </FormField>
                </div>

                <FormField id="message" label="Your Message or Request Details" required error={errors.message}>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your requirement, products of interest, or technical specifications..."
                    required
                  />
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  style={{ width: '100%', justifyContent: 'center' }}
                  icon={<Send size={15} />}
                >
                  {isSubmitting ? 'Transmitting...' : 'Send Inquiry'}
                </Button>
              </form>
            </div>

            {/* Distribution Network & Hours Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Clock size={20} style={{ color: 'var(--color-brand)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
                    Operational Desk Hours
                  </h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6, margin: 0 }}>
                  Trading desk: <strong>{businessHours}</strong>.<br />
                  Electronic inquiries submitted via the portal are recorded immediately.
                </p>
              </div>

              {/* Optional Map Embed (only if configured in CMS) */}
              {mapEmbed && (
                <div className="card" style={{ padding: '16px', overflow: 'hidden' }}>
                  <div
                    style={{ width: '100%', height: '260px' }}
                    dangerouslySetInnerHTML={{ __html: mapEmbed }}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};
