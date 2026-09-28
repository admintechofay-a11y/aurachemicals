import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  PhoneCall,
  AlertCircle,
  FlaskConical,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { FormField } from '../components/common/FormField';
import { api } from '../api/client';
import { InquiryPayload } from '../api/types';
import { UI_LABELS } from '../utils/constants';

export const QuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Query params prefill
  const paramProduct = searchParams.get('product') || '';
  const paramCas = searchParams.get('cas') || '';

  const [formData, setFormData] = useState<InquiryPayload & { unit: string; message: string; timestamp: number }>({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: paramProduct,
    cas_number: paramCas,
    quantity: '',
    unit: 'kg',
    requirement: '',
    message: '',
    consent: true,
    website_url_hp: '', // Honeypot
    timestamp: Math.floor(Date.now() / 1000), // Time check for bot prevention
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; inquiry_id?: number } | null>(null);

  // Fetch settings for phone and company
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  // Fetch verified products for dropdown
  const { data: productsData } = useQuery({
    queryKey: ['products-for-quote-dropdown'],
    queryFn: () => api.getProducts({ per_page: 200 }),
  });

  const phone = settings?.company?.phone;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name of representative is required.';
    }

    if (!formData.company?.trim()) {
      newErrors.company = 'Company or organization name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Business email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid business email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone or WhatsApp contact number is required.';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'Please provide a valid telephone or mobile number.';
    }

    if (!formData.product?.trim()) {
      newErrors.product = 'Chemical product name or specification is required.';
    }

    if (!formData.quantity?.trim()) {
      newErrors.quantity = 'Estimated volume or target quantity is required.';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must confirm that this is a commercial quotation inquiry.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    if (!selectedTitle) return;

    const matched = productsData?.products.find((p) => p.chemical_name === selectedTitle);
    setFormData((prev) => ({
      ...prev,
      product: selectedTitle,
      cas_number: matched?.cas_number || prev.cas_number,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.website_url_hp) {
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
      const payload: InquiryPayload = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        product: formData.product,
        cas_number: formData.cas_number,
        quantity: `${formData.quantity} ${formData.unit}`,
        requirement: [formData.requirement, formData.message].filter(Boolean).join('\n\nAdditional Notes: '),
        consent: formData.consent,
        website_url_hp: formData.website_url_hp,
      };

      const response = await api.submitInquiry(payload);
      setSubmitResult(response);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err.message || 'Failed to submit quotation inquiry. Please contact our procurement desk directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: UI_LABELS.NAV_GET_A_QUOTE }]} />

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
            <span className="eyebrow">Commercial Procurement</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Request a Commercial Quotation</h1>
            <p className="body-large">
              Submit your required chemical volume, purity grade, and delivery specifications. Our sales desk reviews technical specifications directly against manufacturer allocations.
            </p>
          </div>
        </Container>
      </section>

      {/* Form Content */}
      <Section padding="normal">
        <Container>
          {submitResult?.success ? (
            /* Success State (Shown ONLY after real 2xx response) */
            <div
              role="status"
              aria-live="polite"
              tabIndex={-1}
              className="card"
              style={{
                maxWidth: '680px',
                margin: '0 auto',
                padding: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-rule)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle2 size={32} />
              </div>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', textAlign: 'center' }}>
                {UI_LABELS.FORM_SUCCESS_TITLE}
              </h2>

              {submitResult.inquiry_id && (
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-rule)',
                    padding: '4px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-family-mono)',
                    marginBottom: '16px',
                  }}
                >
                  Reference ID: #RFQ-{submitResult.inquiry_id}
                </div>
              )}

              <p className="body-large" style={{ textAlign: 'center', margin: '0 auto 24px auto' }}>
                {submitResult.message}
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button to="/products" variant="primary">
                  Browse Chemical Catalog
                </Button>
                <Button
                  variant="secondary"
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
                      unit: 'kg',
                      requirement: '',
                      message: '',
                      consent: true,
                      website_url_hp: '',
                      timestamp: Math.floor(Date.now() / 1000),
                    });
                  }}
                >
                  Submit Another Inquiry
                </Button>
              </div>
            </div>
          ) : (
            /* Active Form */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'clamp(32px, 5vw, 56px)',
                alignItems: 'start',
              }}
            >
              {/* Form Column */}
              <div className="card" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
                <h2 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
                  Quotation Specifications
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '24px' }}>
                  Fields marked with * are required for formal pricing and batch allocation.
                </p>

                {submitResult?.success === false && (
                  <div
                    style={{
                      padding: '14px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-error)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-error)',
                      fontSize: '0.875rem',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                    <div>{submitResult.message}</div>
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
                      autoComplete="off"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
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

                    <FormField id="company" label="Corporate / Firm Name" required error={errors.company}>
                      <input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Apex Pharma Laboratories"
                        required
                      />
                    </FormField>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
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
                  </div>

                  {/* Product selection: Dropdown from CMS + Free Text Input */}
                  <div style={{ marginBottom: '16px' }}>
                    {productsData?.products && productsData.products.length > 0 && (
                      <div style={{ marginBottom: '8px' }}>
                        <label
                          htmlFor="product-catalog-select"
                          style={{
                            display: 'block',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: 'var(--color-muted)',
                            marginBottom: '4px',
                          }}
                        >
                          Quick select from verified catalog:
                        </label>
                        <select
                          id="product-catalog-select"
                          onChange={handleProductSelect}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '0.875rem',
                            backgroundColor: 'var(--color-card)',
                            border: '1px solid var(--color-rule)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-text)',
                          }}
                          value=""
                        >
                          <option value="">— Select a product to auto-fill name & CAS —</option>
                          {productsData.products.map((p) => (
                            <option key={p.id} value={p.chemical_name}>
                              {p.chemical_name} {p.cas_number ? `(CAS: ${p.cas_number})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <FormField
                      id="product"
                      label="Chemical Product / API Name"
                      required
                      error={errors.product}
                      hint="Specify chemical name, grade, or custom specifications"
                    >
                      <input
                        id="product"
                        type="text"
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        placeholder="e.g. Aceclofenac, Methanol Pure, or custom compound"
                        required
                      />
                    </FormField>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FormField id="cas_number" label="CAS Registry Number" error={errors.cas_number}>
                      <input
                        id="cas_number"
                        type="text"
                        value={formData.cas_number || ''}
                        onChange={(e) => setFormData({ ...formData, cas_number: e.target.value })}
                        placeholder="e.g. 89796-99-6"
                      />
                    </FormField>

                    {/* Quantity + Unit */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 2 }}>
                        <FormField id="quantity" label="Target Quantity" required error={errors.quantity}>
                          <input
                            id="quantity"
                            type="text"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            placeholder="e.g. 500"
                            required
                          />
                        </FormField>
                      </div>
                      <div style={{ flex: 1 }}>
                        <FormField id="unit" label="Unit">
                          <select
                            id="unit"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          >
                            <option value="kg">kg</option>
                            <option value="MT">MT</option>
                            <option value="L">L</option>
                            <option value="drums">drums</option>
                            <option value="bags">bags</option>
                            <option value="tanker">tanker</option>
                          </select>
                        </FormField>
                      </div>
                    </div>
                  </div>

                  <FormField id="requirement" label="Technical Grade & Pharmacopeia Standard">
                    <input
                      id="requirement"
                      type="text"
                      value={formData.requirement || ''}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      placeholder="e.g. Pharma Grade IP/BP/USP, ≥99% purity, 25kg fiber drum"
                    />
                  </FormField>

                  <FormField id="message" label="Delivery Timeline & Special Requirements">
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify destination port / plant location, batch delivery schedule, or COA requirements..."
                    />
                  </FormField>

                  {/* Consent checkbox */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        style={{ marginTop: '3px' }}
                      />
                      <span>{UI_LABELS.FORM_CONSENT_LABEL}</span>
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
                    size="lg"
                    isLoading={isSubmitting}
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? UI_LABELS.BTN_SUBMITTING : UI_LABELS.NAV_GET_A_QUOTE}
                  </Button>
                </form>
              </div>

              {/* Sidebar Info */}
              <div>
                <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <FlaskConical size={20} style={{ color: 'var(--color-brand)' }} />
                    <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Direct Sourcing Benefits</h3>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                    <li>✓ Direct manufacturer allocations across 400+ domestic chemical producers</li>
                    <li>✓ Verified batch Certificates of Analysis (COA) with regulatory traceability</li>
                    <li>✓ Strict compliance with IP, BP, USP, and EP pharmacopeial monographs</li>
                    <li>✓ Standardized packaging: fiber drums, ISO tankers, and moisture-barrier liners</li>
                  </ul>
                </div>

                {phone && (
                  <div className="card" style={{ padding: '24px' }}>
                    <h4 style={{ fontSize: '0.9375rem', marginBottom: '8px' }}>Direct Phone Inquiries</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '16px' }}>
                      Speak directly with our technical procurement desk during business hours:
                    </p>
                    <Button
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      variant="secondary"
                      size="md"
                      icon={<PhoneCall size={16} />}
                      iconPosition="left"
                    >
                      {phone}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};
