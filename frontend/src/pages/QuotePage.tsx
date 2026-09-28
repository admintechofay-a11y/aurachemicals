import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Send,
  CheckCircle2,
  PhoneCall,
  Mail,
  ShieldCheck,
  FileCheck2,
  Clock,
  ArrowRight,
  AlertCircle,
  Building2,
  FlaskConical,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { FormField } from '../components/common/FormField';
import { api } from '../api/client';
import { InquiryPayload } from '../api/types';

export const QuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Initial values from query params
  const paramProduct = searchParams.get('product') || '';
  const paramCas = searchParams.get('cas') || '';
  const paramIndustry = searchParams.get('industry') || '';
  const paramService = searchParams.get('service') || '';

  const [formData, setFormData] = useState<InquiryPayload>({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: paramProduct,
    cas_number: paramCas,
    quantity: '',
    requirement: paramService ? `Service Inquiry: ${paramService}` : paramIndustry ? `Industry requirement for ${paramIndustry}` : '',
    consent: true,
    website_url_hp: '', // Honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; inquiry_id?: number } | null>(null);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  const phone = settings?.company?.phone || '+91 7220000877';
  const email = settings?.company?.email || 'management.aurachemicals@gmail.com';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Contact person full name is required.';
    }

    if (!formData.company?.trim()) {
      newErrors.company = 'Company or legal entity name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Business email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid business email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone or WhatsApp contact number is required.';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'Please provide a valid phone number (at least 8 digits).';
    }

    if (!formData.product?.trim()) {
      newErrors.product = 'Chemical product name or requirement is required.';
    }

    if (!formData.quantity?.trim()) {
      newErrors.quantity = 'Target quantity or order volume is required (e.g., 500 kg, 5 MT, 1 tanker).';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must consent to being contacted regarding this quotation request.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot spam protection check
    if (formData.website_url_hp) {
      // Silently reject bot submissions
      setSubmitResult({
        success: true,
        message: 'Inquiry received successfully.',
        inquiry_id: 1001,
      });
      return;
    }

    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.submitInquiry(formData);
      setSubmitResult(response);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err.message || 'Failed to submit quotation inquiry. Please contact our sales desk directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Request a Quote' }]} />

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
            <span className="eyebrow">Commercial Procurement</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Request a Formal Quotation</h1>
            <p className="body-large" style={{ color: 'var(--color-text)' }}>
              Submit your chemical, API, or inspection service specifications. Our commercial sourcing desk responds within 24 business hours with verified pricing, minimum order quantities, and COA documentation.
            </p>
          </div>
        </Container>
      </section>

      {/* Form & Sidebar Grid */}
      <Section padding="normal">
        <Container>
          {submitResult?.success ? (
            /* Success Confirmation Screen */
            <div
              role="status"
              aria-live="polite"
              tabIndex={-1}
              style={{
                maxWidth: '720px',
                margin: '0 auto',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                padding: 'clamp(36px, 6vw, 56px)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                animation: 'feedbackFadeIn 250ms var(--motion-ease) forwards',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(42, 127, 134, 0.12)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h2 style={{ fontSize: '1.75rem', marginBottom: '12px', color: 'var(--color-primary)' }}>
                Quotation Request Received
              </h2>

              {submitResult.inquiry_id && (
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    marginBottom: '20px',
                  }}
                >
                  Reference ID: #RFQ-{submitResult.inquiry_id}
                </div>
              )}

              <p className="body-large" style={{ color: 'var(--color-text)', marginBottom: '28px', lineHeight: 1.6 }}>
                {submitResult.message}
              </p>

              <div
                style={{
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  textAlign: 'left',
                  marginBottom: '32px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
                  Next Steps:
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  <li>Our technical sales desk will review your target specifications and delivery cluster.</li>
                  <li>A verified pro-forma quotation with manufacturer batch availability and purity assays will be sent to <strong>{formData.email}</strong>.</li>
                  <li>For urgent requirements, please contact our dispatch desk directly at <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{phone}</a>.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button to="/products" variant="primary">
                  Browse Chemical Catalog
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitResult(null);
                    setFormData({
                      name: '',
                      company: '',
                      email: '',
                      phone: '',
                      product: '',
                      cas_number: '',
                      quantity: '',
                      requirement: '',
                      consent: true,
                      website_url_hp: '',
                    });
                  }}
                >
                  Submit Another RFQ
                </Button>
              </div>
            </div>
          ) : (
            /* Active Form Grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '48px',
                alignItems: 'start',
              }}
            >
              {/* Form Column */}
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
                  RFQ Specifications
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '28px' }}>
                  Fields marked with <span style={{ color: 'var(--color-error)' }}>*</span> are required for commercial review.
                </p>

                {submitResult?.success === false && (
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'rgba(197, 48, 48, 0.08)',
                      border: '1px solid var(--color-error)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-error)',
                      fontSize: '0.875rem',
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <AlertCircle size={20} style={{ flexShrink: 0 }} />
                    <div>{submitResult.message}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot field (hidden from real users) */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <input
                      type="text"
                      name="website_url_hp"
                      tabIndex={-1}
                      value={formData.website_url_hp}
                      onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
                      autoComplete="off"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <FormField id="name" label="Contact Person Full Name" required error={errors.name}>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Rajesh Sharma"
                      />
                    </FormField>

                    <FormField id="company" label="Individual / Firm / Company Name" required error={errors.company}>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g., Apex Pharmaceuticals Ltd."
                      />
                    </FormField>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <FormField id="email" label="Business Email Address" required error={errors.email}>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="procurement@company.com"
                      />
                    </FormField>

                    <FormField id="phone" label="Phone / WhatsApp Contact" required error={errors.phone} hint="Include country code for export inquiries">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </FormField>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <FormField id="product" label="Chemical Product / API Name" required error={errors.product}>
                      <input
                        type="text"
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        placeholder="e.g., Aceclofenac / Caustic Flakes"
                      />
                    </FormField>

                    <FormField id="cas_number" label="CAS Registry Number (if known)" error={errors.cas_number}>
                      <input
                        type="text"
                        value={formData.cas_number || ''}
                        onChange={(e) => setFormData({ ...formData, cas_number: e.target.value })}
                        placeholder="e.g., 89796-99-6"
                      />
                    </FormField>
                  </div>

                  <FormField id="quantity" label="Target Quantity / Volume" required error={errors.quantity} hint="Indicate required packaging format (e.g., 500 kg in 25kg drums, 10 MT tanker, ISO tank)">
                    <input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="e.g., 1,000 kg (in 25kg fiber drums)"
                    />
                  </FormField>

                  <FormField id="requirement" label="Additional Technical Specifications or In-Service Requirements" error={errors.requirement}>
                    <textarea
                      rows={4}
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      placeholder="Specify pharmacopeia standard (IP, BP, USP, EP), desired purity percentage, target delivery location, or special testing requirements..."
                    />
                  </FormField>

                  {/* Consent checkbox */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        style={{ marginTop: '3px' }}
                      />
                      <span>
                        I consent to Aura Space Infra Pvt. Ltd. processing this business information for commercial quotation purposes in accordance with the{' '}
                        <Link to="/privacy-policy" style={{ color: 'var(--color-secondary)', textDecoration: 'underline' }}>
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.consent && (
                      <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '4px' }}>
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {isSubmitting ? (
                      'Processing Quotation Request...'
                    ) : (
                      <>
                        <Send size={16} /> Submit Quotation Request
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Sidebar Support & Information Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Direct Sales Desk Card */}
                <div
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    padding: '32px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <PhoneCall size={24} style={{ color: 'var(--color-secondary)' }} />
                    <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                      Direct Commercial Desk
                    </h3>
                  </div>

                  <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
                    Need immediate spot price confirmation, dispatch status, or urgent allocation? Speak directly with our trading managers:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      style={{
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <PhoneCall size={18} /> {phone}
                    </a>

                    <a
                      href={`mailto:${email}`}
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <Mail size={16} /> {email}
                    </a>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                      paddingTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8125rem',
                      color: 'rgba(255, 255, 255, 0.75)',
                    }}
                  >
                    <Clock size={16} />
                    <span>Response within 24 business hours guaranteed.</span>
                  </div>
                </div>

                {/* Assurance & Documentation Card */}
                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <ShieldCheck size={22} style={{ color: 'var(--color-secondary)' }} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                      Compliance &amp; Quality Guarantee
                    </h3>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      'Manufacturer batch Certificate of Analysis (COA) included',
                      'Material Safety Data Sheet (MSDS / SDS) compliant with GHS',
                      'Direct sourcing from audited domestic chemical manufacturers',
                      'Strict adherence to IP / BP / USP / EP pharmacopeia monographs',
                      'Registered corporate trading entity with ROC Ahmedabad',
                    ].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: 'var(--color-text)' }}>
                        <CheckCircle2 size={15} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};
