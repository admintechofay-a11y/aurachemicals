import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  MessageSquare,
  FileText,
  Wrench,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { FormField } from '../components/common/FormField';
import { api } from '../api/client';
import { InquiryPayload } from '../api/types';
import { UI_LABELS } from '../utils/constants';

type InquiryIntent = 'rfq' | 'documentation' | 'inspection' | 'general';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';

  const [intent, setIntent] = useState<InquiryIntent>(() => {
    if (initialSubject.toLowerCase().includes('inspection') || initialSubject.toLowerCase().includes('ndt')) {
      return 'inspection';
    }
    if (initialSubject.toLowerCase().includes('quote') || initialSubject.toLowerCase().includes('rfq')) {
      return 'rfq';
    }
    return 'general';
  });

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: initialSubject || 'Commercial Chemical Sourcing Inquiry',
    compoundOrService: '',
    volumeOrBatch: '',
    message: '',
    website_url_hp: '', // Bot honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  const brandName = 'Aura Chemicals';
  const legalName = 'Aura Space Infra Private Limited';
  const cin = 'U51909GJ2014PTC080340';
  const phone = settings?.company?.phone || '+91 97274 04415';
  const whatsappNumber = phone.replace(/\D/g, '');
  const email = settings?.company?.email || 'sales@aurachemicals.in';
  const address = settings?.company?.registered_address || 'ROC Ahmedabad, Gujarat, India';
  const businessHours = 'Monday – Saturday: 09:30 AM – 06:30 PM IST';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Representative name is required.';
    if (!formData.company.trim()) newErrors.company = 'Corporate or entity name is required.';

    if (!formData.email.trim()) {
      newErrors.email = 'Corporate email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid business email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact telephone or WhatsApp number is required.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide brief details regarding your requirement.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildWhatsAppFallback = () => {
    const msg = `*Aura Chemicals — Contact Desk Inquiry*\n\n` +
      `*Intent:* ${intent.toUpperCase()}\n` +
      `*Company:* ${formData.company || 'N/A'}\n` +
      `*Representative:* ${formData.name || 'N/A'}\n` +
      `*Email:* ${formData.email || 'N/A'}\n` +
      `*Phone:* ${formData.phone || 'N/A'}\n` +
      `*Subject:* ${formData.subject}\n` +
      `*Details:* ${formData.compoundOrService ? `Item: ${formData.compoundOrService}` : ''} ${formData.volumeOrBatch ? `(${formData.volumeOrBatch})` : ''}\n` +
      `*Message:* ${formData.message}`;

    return encodeURIComponent(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.website_url_hp) {
      setSubmitResult({ success: true, message: 'Message logged in communication register.' });
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const detailedRequirement = [
        `Intent: ${intent.toUpperCase()}`,
        formData.compoundOrService ? `Compound / Service Target: ${formData.compoundOrService}` : '',
        formData.volumeOrBatch ? `Quantity / Batch Reference: ${formData.volumeOrBatch}` : '',
        `Message: ${formData.message}`,
      ]
        .filter(Boolean)
        .join('\n');

      const payload: InquiryPayload = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        product: formData.subject || `Inquiry: ${intent}`,
        requirement: detailedRequirement,
        consent: true,
      };

      await api.submitInquiry(payload);
      setSubmitResult({
        success: true,
        message: 'Thank you for contacting Aura Chemicals. Your communication has been dispatched to our desk and assigned for review.',
      });
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        subject: '',
        compoundOrService: '',
        volumeOrBatch: '',
        message: '',
        website_url_hp: '',
      });
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err.message || 'Unable to transmit through the automated gateway at this moment. Your data is preserved below.',
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
          padding: 'clamp(48px, 6vw, 72px) 0',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <span className="eyebrow">Corporate Communications</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Contact Aura Chemicals</h1>
            <p className="body-large">
              Connect directly with our commercial trading desk, regulatory compliance office, or technical NDT plant inspection team. Direct response guaranteed within 24 working hours.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content Section */}
      <Section padding="normal">
        <Container>
          {/* Top 3 Corporate Coordinates Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '48px',
            }}
          >
            {/* Phone & WhatsApp Card */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-rule)',
                  color: 'var(--color-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <PhoneCall size={20} />
              </div>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                Commercial Trading Desk
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                Direct procurement line for spot allocations, contract pricing, and urgent order logistics.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 600,
                    color: 'var(--color-ink-navy)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-family-mono)',
                  }}
                >
                  {phone}
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-teal)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 500,
                  }}
                >
                  <MessageSquare size={13} /> Chat with desk on WhatsApp
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-rule)',
                  color: 'var(--color-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Mail size={20} />
              </div>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                Formal Inquiries &amp; POs
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                Submit technical specifications, tender documentation, and formal purchase orders.
              </p>
              <a
                href={`mailto:${email}`}
                style={{
                  marginTop: 'auto',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--color-ink-navy)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-family-mono)',
                }}
              >
                {email}
              </a>
            </div>

            {/* Corporate Registration & Entity Card */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-rule)',
                  color: 'var(--color-teal)',
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
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
                {legalName}
              </p>
              <div style={{ marginTop: 'auto', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>CIN:</strong> <span style={{ fontFamily: 'var(--font-family-mono)' }}>{cin}</span></div>
                <div><strong>Jurisdiction:</strong> ROC Ahmedabad (Gujarat)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <MapPin size={14} style={{ color: 'var(--color-teal)' }} />
                  <span>{address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form and Office Hours Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* Left: Interactive Structured Inquiry Form */}
            <div className="card" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
                Submit Commercial or Technical Communication
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '20px' }}>
                Select your communication intent to direct your message to the appropriate department:
              </p>

              {/* Intent Chooser Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '8px',
                  marginBottom: '28px',
                }}
              >
                {[
                  { id: 'rfq', label: 'Commercial RFQ', icon: <FileText size={14} /> },
                  { id: 'documentation', label: 'CoA / TDS Request', icon: <ShieldCheck size={14} /> },
                  { id: 'inspection', label: 'Plant NDT Service', icon: <Wrench size={14} /> },
                  { id: 'general', label: 'General Enquiry', icon: <HelpCircle size={14} /> },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setIntent(t.id as InquiryIntent);
                      setFormData((prev) => ({
                        ...prev,
                        subject:
                          t.id === 'rfq'
                            ? 'Commercial Chemical Quotation'
                            : t.id === 'documentation'
                            ? 'Regulatory CoA & TDS Document Request'
                            : t.id === 'inspection'
                            ? 'Plant Inspection & NDT Booking'
                            : 'General Corporate Communication',
                      }));
                    }}
                    style={{
                      padding: '10px 8px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      border: intent === t.id ? '1px solid var(--color-teal)' : '1px solid var(--color-rule)',
                      backgroundColor: intent === t.id ? 'rgba(31, 122, 140, 0.08)' : 'var(--color-card)',
                      color: intent === t.id ? 'var(--color-teal)' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* If RFQ intent selected, show quick helpful tip to use full RFQ schedule */}
              {intent === 'rfq' && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Need to quote multiple chemicals with exact delivery milestones?</span>
                  <Link to="/get-a-quote" style={{ color: 'var(--color-teal)', fontWeight: 600, textDecoration: 'none' }}>
                    Open RFQ Desk →
                  </Link>
                </div>
              )}

              {/* Submission Feedback Banner */}
              {submitResult && (
                <div
                  role="status"
                  aria-live="polite"
                  tabIndex={-1}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '24px',
                    backgroundColor: submitResult.success ? 'var(--color-surface)' : 'rgba(180, 83, 9, 0.06)',
                    border: `1px solid ${submitResult.success ? 'var(--color-teal)' : 'var(--color-amber)'}`,
                    color: submitResult.success ? 'var(--color-teal)' : 'var(--color-ink-navy)',
                    fontSize: '0.875rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    {submitResult.success ? (
                      <CheckCircle2 size={18} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <AlertCircle size={18} style={{ color: 'var(--color-amber)', flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <div>
                      <div>{submitResult.message}</div>
                      {!submitResult.success && (
                        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                          <a
                            href={`https://wa.me/${whatsappNumber}?text=${buildWhatsAppFallback()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                            style={{ textDecoration: 'none' }}
                          >
                            <MessageSquare size={13} style={{ marginRight: '4px' }} /> Transmit via WhatsApp
                          </a>
                          <a
                            href={`tel:${phone.replace(/\s+/g, '')}`}
                            className="btn btn-secondary btn-sm"
                            style={{ textDecoration: 'none' }}
                          >
                            Call Desk
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot */}
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
                  <FormField id="name" label="Representative Full Name" required error={errors.name}>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Patel"
                      required
                    />
                  </FormField>

                  <FormField id="company" label="Corporate Entity / Plant Name" required error={errors.company}>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Apex Pharma Laboratories Ltd."
                      required
                    />
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  <FormField id="email" label="Corporate Email" required error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="procurement@company.com"
                      required
                    />
                  </FormField>

                  <FormField id="phone" label="Direct Phone / WhatsApp" required error={errors.phone}>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98000 00000"
                      required
                    />
                  </FormField>
                </div>

                {/* Dynamic Intent Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  <FormField
                    id="compoundOrService"
                    label={
                      intent === 'inspection'
                        ? 'Target Plant Equipment / Method'
                        : intent === 'documentation'
                        ? 'Chemical Product / API Name'
                        : 'Compound or Service Specification'
                    }
                    hint={
                      intent === 'inspection'
                        ? 'e.g. Storage Tank API 653, Pressure Vessel UT'
                        : 'e.g. Aceclofenac IP or Methanol Pure'
                    }
                  >
                    <input
                      id="compoundOrService"
                      type="text"
                      value={formData.compoundOrService}
                      onChange={(e) => setFormData({ ...formData, compoundOrService: e.target.value })}
                      placeholder={intent === 'inspection' ? 'e.g. Reactor Vessel / Pipeline UT' : 'e.g. Paracetamol IP'}
                    />
                  </FormField>

                  <FormField
                    id="volumeOrBatch"
                    label={
                      intent === 'documentation'
                        ? 'Batch / Lot Number (if known)'
                        : intent === 'inspection'
                        ? 'Plant Location / Scheduled Date'
                        : 'Target Volume / Packaging'
                    }
                  >
                    <input
                      id="volumeOrBatch"
                      type="text"
                      value={formData.volumeOrBatch}
                      onChange={(e) => setFormData({ ...formData, volumeOrBatch: e.target.value })}
                      placeholder={intent === 'documentation' ? 'e.g. Batch #2024-AC-08' : 'e.g. 5 MT in fiber drums'}
                    />
                  </FormField>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <FormField id="message" label="Technical Requirements or Inquiries" required error={errors.message}>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify required pharmacopeia standards, delivery timeline, or inspection scope..."
                      required
                    />
                  </FormField>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                  icon={<Send size={15} />}
                >
                  {isSubmitting ? 'Transmitting Inbound...' : 'Transmit Inbound Communication'}
                </Button>
              </form>
            </div>

            {/* Right: Desk Operational Schedule & Physical Infrastructure */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Clock size={20} style={{ color: 'var(--color-teal)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-ink-navy)' }}>
                    Commercial Desk Hours
                  </h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  Trading desk active: <strong>{businessHours}</strong>.<br />
                  Electronic inquiries received outside hours are logged in our commercial register and prioritized on the following business morning.
                </p>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <strong>Emergency Consignment Notice:</strong> Plant shutdown or critical stock shortage? Call desk directly at{' '}
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-teal)', fontWeight: 600 }}>
                    {phone}
                  </a>.
                </div>
              </div>

              <div className="card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Building2 size={20} style={{ color: 'var(--color-teal)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-ink-navy)' }}>
                    Port &amp; Synthesis Logistics Corridors
                  </h3>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
                  Aura operates coordinated transport lines connecting major manufacturing and import hubs:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: 'var(--color-text)' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--color-teal)' }}>•</span>
                    <span><strong>Gujarat Synthesis Hubs:</strong> Ankleshwar, Dahej, Vapi, Panoli, Hazira</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--color-teal)' }}>•</span>
                    <span><strong>Import Terminals:</strong> JNPT / Nhava Sheva (Maharashtra), Mundra Port (Gujarat)</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--color-teal)' }}>•</span>
                    <span><strong>Pharma Formulation Hubs:</strong> Ahmedabad, Hyderabad, Baddi, Indore</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};
