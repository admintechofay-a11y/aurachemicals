import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  PhoneCall,
  AlertCircle,
  FlaskConical,
  Trash2,
  Plus,
  Printer,
  Copy,
  Check,
  MessageSquare,
  FileText,
  Clock,
  Building2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { FormField } from '../components/common/FormField';
import { CASBadge } from '../components/common/CASBadge';
import { useRFQ } from '../context/RFQContext';
import { api } from '../api/client';
import { InquiryPayload } from '../api/types';
import { UI_LABELS } from '../utils/constants';

interface SubmittedSummary {
  inquiry_id: number | string;
  name: string;
  company: string;
  email: string;
  phone: string;
  destination: string;
  timeline: string;
  docs: string[];
  items: Array<{
    name: string;
    cas?: string;
    quantity: string;
    unit: string;
    grade?: string;
  }>;
  submittedAt: string;
}

export const QuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { items: basketItems, removeItem, updateItem, clearBasket, addItem } = useRFQ();

  // Query params prefill for single-product direct link
  const paramProduct = searchParams.get('product') || '';
  const paramCas = searchParams.get('cas') || '';
  const paramGrade = searchParams.get('grade') || '';
  const paramQty = searchParams.get('qty') || '';
  const paramUnit = searchParams.get('unit') || 'kg';

  // If arrived via direct product link and basket is empty, seed single item or local state
  const [singleProduct, setSingleProduct] = useState({
    name: paramProduct,
    cas: paramCas,
    grade: paramGrade,
    quantity: paramQty || '',
    unit: paramUnit,
  });

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    destination: 'Domestic Ex-Works / Delivery',
    timeline: 'Within 15 days',
    docsRequired: {
      coa: true,
      msds: true,
      tds: false,
      gmp_traceability: false,
    },
    notes: '',
    consent: true,
    website_url_hp: '', // Honeypot
    timestamp: Math.floor(Date.now() / 1000),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    inquiry_id?: number | string;
    summary?: SubmittedSummary;
  } | null>(null);

  const [isCopied, setIsCopied] = useState(false);

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

  const phone = settings?.company?.phone || '+91 97274 04415';
  const whatsappNumber = phone.replace(/\D/g, '');

  // Determine whether we are in basket mode or single item mode
  const hasBasket = basketItems.length > 0;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name of corporate representative is required.';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company or organization name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Corporate email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid corporate email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required.';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'Please provide a valid telephone or mobile number.';
    }

    if (!hasBasket) {
      if (!singleProduct.name.trim()) {
        newErrors.product = 'Chemical product name or specification is required.';
      }
      if (!singleProduct.quantity.trim()) {
        newErrors.quantity = 'Estimated volume or target quantity is required.';
      }
    } else {
      // Validate each basket item has quantity
      const missingQty = basketItems.some((item) => !item.quantity || !item.quantity.trim());
      if (missingQty) {
        newErrors.basket = 'Please provide target quantities for all chemical items in your quotation schedule.';
      }
    }

    if (!formData.consent) {
      newErrors.consent = 'You must confirm that this is a commercial B2B quotation inquiry.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    if (!selectedTitle) return;

    const matched = productsData?.products.find((p) => p.chemical_name === selectedTitle);
    if (matched) {
      if (hasBasket) {
        // Add to basket
        addItem({
          slug: matched.slug,
          chemical_name: matched.chemical_name,
          cas_number: matched.cas_number || undefined,
          category: matched.category?.name || '',
          quantity: '500',
          unit: 'kg',
        });
      } else {
        setSingleProduct((prev) => ({
          ...prev,
          name: matched.chemical_name,
          cas: matched.cas_number || prev.cas,
        }));
      }
    }
  };

  const getCompiledItems = () => {
    if (hasBasket) {
      return basketItems.map((item) => ({
        name: item.chemical_name,
        cas: item.cas_number,
        quantity: item.quantity || '500',
        unit: item.unit || 'kg',
        grade: item.grade || 'Standard Pharmacopeia / Technical',
      }));
    } else {
      return [
        {
          name: singleProduct.name,
          cas: singleProduct.cas,
          quantity: singleProduct.quantity,
          unit: singleProduct.unit,
          grade: singleProduct.grade || 'Commercial Grade',
        },
      ];
    }
  };

  const buildWhatsAppMessage = () => {
    const items = getCompiledItems();
    const itemsList = items
      .map(
        (i, idx) =>
          `${idx + 1}. *${i.name}* (CAS: ${i.cas || 'N/A'}) - ${i.quantity} ${i.unit} [Grade: ${i.grade || 'Standard'}]`
      )
      .join('\n');

    const message = `*Aura Chemicals — Commercial Quotation Request*\n\n` +
      `*Company:* ${formData.company || 'N/A'}\n` +
      `*Representative:* ${formData.name || 'N/A'}\n` +
      `*Email:* ${formData.email || 'N/A'}\n` +
      `*Phone:* ${formData.phone || 'N/A'}\n` +
      `*Delivery Location:* ${formData.destination}\n` +
      `*Required Timeline:* ${formData.timeline}\n\n` +
      `*Requested Chemicals:*\n${itemsList}\n\n` +
      `*Notes:* ${formData.notes || 'None'}`;

    return encodeURIComponent(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detection honeypot
    if (formData.website_url_hp) {
      setSubmitResult({
        success: true,
        message: 'Quotation request successfully logged in commercial register.',
        inquiry_id: 1042,
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
    setSubmitResult(null);

    const compiledItems = getCompiledItems();
    const docs = Object.entries(formData.docsRequired)
      .filter(([_, checked]) => checked)
      .map(([key]) => key.toUpperCase())
      .join(', ');

    const detailedRequirements = [
      `Destination: ${formData.destination}`,
      `Timeline: ${formData.timeline}`,
      docs ? `Documentation Required: ${docs}` : '',
      formData.notes ? `Special Notes: ${formData.notes}` : '',
      hasBasket
        ? `\nItemized Schedule:\n` +
          compiledItems
            .map(
              (i, idx) =>
                `#${idx + 1}: ${i.name} | CAS: ${i.cas || 'N/A'} | Qty: ${i.quantity} ${i.unit} | Grade: ${i.grade}`
            )
            .join('\n')
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    const primaryProduct = compiledItems[0];

    const payload: InquiryPayload = {
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      product: hasBasket
        ? `${compiledItems.length} Products: ${compiledItems.map((i) => i.name).slice(0, 3).join(', ')}${compiledItems.length > 3 ? '...' : ''}`
        : primaryProduct.name,
      cas_number: hasBasket ? undefined : primaryProduct.cas,
      quantity: hasBasket
        ? `${compiledItems.reduce((acc, curr) => acc + (parseFloat(curr.quantity) || 0), 0)} Total Units`
        : `${primaryProduct.quantity} ${primaryProduct.unit}`,
      requirement: detailedRequirements,
      consent: formData.consent,
      website_url_hp: formData.website_url_hp,
    };

    try {
      const response = await api.submitInquiry(payload);

      const summaryData: SubmittedSummary = {
        inquiry_id: response.inquiry_id || Date.now().toString().slice(-6),
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination,
        timeline: formData.timeline,
        docs: Object.entries(formData.docsRequired)
          .filter(([_, v]) => v)
          .map(([k]) => k.toUpperCase()),
        items: compiledItems,
        submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      setSubmitResult({
        success: true,
        message: 'Your formal quotation specification has been submitted to the Aura Chemicals commercial procurement desk.',
        inquiry_id: response.inquiry_id,
        summary: summaryData,
      });

      // Clear basket upon genuine submission success
      clearBasket();
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err: any) {
      // HONEST ERROR HANDLING: Never fake success!
      setSubmitResult({
        success: false,
        message:
          err.message ||
          'Unable to complete submission over our automated gateway at this moment. Your inquiry information is preserved below.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copySummaryToClipboard = () => {
    if (!submitResult?.summary) return;
    const s = submitResult.summary;
    const itemsText = s.items
      .map((i, idx) => `  ${idx + 1}. ${i.name} (CAS: ${i.cas || 'N/A'}) — ${i.quantity} ${i.unit}`)
      .join('\n');

    const text = `AURA CHEMICALS — COMMERCIAL RFQ SUMMARY\n` +
      `Reference ID: #RFQ-${s.inquiry_id}\n` +
      `Date: ${s.submittedAt} IST\n` +
      `Company: ${s.company}\n` +
      `Representative: ${s.name} (${s.email}, ${s.phone})\n` +
      `Delivery: ${s.destination} (${s.timeline})\n` +
      `Documentation: ${s.docs.join(', ')}\n\n` +
      `Chemical Products:\n${itemsText}\n\n` +
      `Aura Space Infra Pvt. Ltd. | CIN: U51909GJ2014PTC080340`;

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
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
              Submit your chemical specifications, purity requirements, and target volumes. Our technical sales desk reviews manufacturer allocations and returns a structured formal quote with verified CoA within 24 hours.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Section padding="normal">
        <Container>
          {submitResult?.success && submitResult.summary ? (
            /* =========================================================
               CONFIRMATION STATE (REAL SUCCESS)
               ========================================================= */
            <div
              role="status"
              aria-live="polite"
              tabIndex={-1}
              className="card"
              style={{
                maxWidth: '780px',
                margin: '0 auto',
                padding: 'clamp(32px, 5vw, 56px)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(31, 122, 140, 0.08)',
                    border: '1px solid var(--color-teal)',
                    color: 'var(--color-teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>

                <span className="badge" style={{ marginBottom: '8px' }}>
                  Commercial Register
                </span>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
                  Quotation Request Dispatched
                </h2>

                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-rule)',
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9375rem',
                    fontFamily: 'var(--font-family-mono)',
                    fontWeight: 600,
                    color: 'var(--color-teal)',
                    marginTop: '8px',
                  }}
                >
                  Reference ID: #RFQ-{submitResult.inquiry_id}
                </div>

                <p className="body-large" style={{ marginTop: '16px', color: 'var(--color-muted)' }}>
                  {submitResult.message}
                </p>
              </div>

              {/* Quotation Specification Summary Table */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-rule)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '24px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--color-rule)',
                    paddingBottom: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <h3 style={{ fontSize: '1.05rem', margin: 0, fontFamily: 'var(--font-family-sans)' }}>
                    Quotation Specification Record
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', fontFamily: 'var(--font-family-mono)' }}>
                    {submitResult.summary.submittedAt} IST
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '20px',
                    fontSize: '0.875rem',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Client Entity
                    </span>
                    <strong>{submitResult.summary.company}</strong>
                    <div style={{ color: 'var(--color-text-secondary)' }}>{submitResult.summary.name}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Contact Coordinates
                    </span>
                    <div>{submitResult.summary.email}</div>
                    <div style={{ fontFamily: 'var(--font-family-mono)' }}>{submitResult.summary.phone}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Logistics Profile
                    </span>
                    <div>{submitResult.summary.destination}</div>
                    <div style={{ color: 'var(--color-teal)' }}>{submitResult.summary.timeline}</div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="spec-table" style={{ marginTop: '12px' }}>
                  <thead>
                    <tr>
                      <th scope="col">Chemical Specification</th>
                      <th scope="col">CAS Number</th>
                      <th scope="col" style={{ textAlign: 'right' }}>Target Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submitResult.summary.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{item.name}</strong>
                          {item.grade && (
                            <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                              Grade: {item.grade}
                            </div>
                          )}
                        </td>
                        <td>
                          {item.cas ? <CASBadge cas={item.cas} /> : <span style={{ color: 'var(--color-muted)' }}>—</span>}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-family-mono)', fontWeight: 600 }}>
                          {item.quantity} {item.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="primary"
                  icon={<Printer size={16} />}
                  onClick={() => window.print()}
                >
                  Print Specification Sheet
                </Button>

                <Button
                  variant="secondary"
                  icon={isCopied ? <Check size={16} /> : <Copy size={16} />}
                  onClick={copySummaryToClipboard}
                >
                  {isCopied ? 'Summary Copied' : 'Copy Summary'}
                </Button>

                <Button to="/products" variant="ghost">
                  Browse Chemical Catalog
                </Button>
              </div>

              <div
                style={{
                  marginTop: '32px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--color-rule)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-muted)',
                  textAlign: 'center',
                }}
              >
                Urgent commercial inquiry? Direct line: <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-teal)', fontWeight: 600 }}>{phone}</a> (Mon–Sat, 09:30–18:30 IST)
              </div>
            </div>
          ) : (
            /* =========================================================
               ACTIVE RFQ FORM (WITH BASKET / SINGLE PRODUCT SUPPORT)
               ========================================================= */
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                    Commercial Quotation Schedule
                  </h2>
                  {hasBasket && (
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontFamily: 'var(--font-family-mono)',
                        color: 'var(--color-teal)',
                        backgroundColor: 'rgba(31, 122, 140, 0.08)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {basketItems.length} {basketItems.length === 1 ? 'item' : 'items'} in schedule
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '24px' }}>
                  Provide product specifications and commercial requirements. Fields marked with * are mandatory for formal proforma generation.
                </p>

                {/* HONEST FAILURE BANNER */}
                {submitResult?.success === false && (
                  <div
                    style={{
                      padding: '16px 20px',
                      backgroundColor: 'rgba(180, 83, 9, 0.06)',
                      border: '1px solid var(--color-amber)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-ink-navy)',
                      fontSize: '0.875rem',
                      marginBottom: '28px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <AlertCircle size={20} style={{ color: 'var(--color-amber)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--color-amber)' }}>
                          Automated Transmission Notice
                        </strong>
                        <p style={{ margin: '0 0 12px 0' }}>
                          {submitResult.message} Your filled specifications have been preserved below. You may transmit this RFQ directly via WhatsApp or phone:
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <a
                            href={`https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                            style={{ textDecoration: 'none' }}
                          >
                            <MessageSquare size={14} style={{ marginRight: '6px' }} />
                            Transmit via WhatsApp
                          </a>
                          <a
                            href={`tel:${phone.replace(/\s+/g, '')}`}
                            className="btn btn-secondary btn-sm"
                            style={{ textDecoration: 'none' }}
                          >
                            <PhoneCall size={14} style={{ marginRight: '6px' }} />
                            Direct Commercial Call
                          </a>
                        </div>
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
                      autoComplete="off"
                    />
                  </div>

                  {/* Section 1: Chemical Products Schedule */}
                  <div style={{ marginBottom: '32px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--color-rule)',
                        paddingBottom: '8px',
                        marginBottom: '16px',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>
                        01. Chemical Specifications
                      </span>

                      {productsData?.products && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label htmlFor="quick-add-select" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                            Add from catalog:
                          </label>
                          <select
                            id="quick-add-select"
                            onChange={handleProductSelect}
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.8125rem',
                              backgroundColor: 'var(--color-paper)',
                              border: '1px solid var(--color-rule)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--color-text)',
                              maxWidth: '220px',
                            }}
                            value=""
                          >
                            <option value="">— Select Chemical —</option>
                            {productsData.products.map((p) => (
                              <option key={p.id} value={p.chemical_name}>
                                {p.chemical_name} {p.cas_number ? `(${p.cas_number})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {errors.basket && (
                      <div style={{ color: 'var(--color-error)', fontSize: '0.8125rem', marginBottom: '12px' }}>
                        {errors.basket}
                      </div>
                    )}

                    {hasBasket ? (
                      /* Basket Mode: List of multiple products */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {basketItems.map((item, index) => (
                          <div
                            key={item.slug}
                            style={{
                              backgroundColor: 'var(--color-surface)',
                              border: '1px solid var(--color-rule)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '16px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-muted)' }}>
                                    #{index + 1}
                                  </span>
                                  <Link
                                    to={`/products/${item.slug}`}
                                    style={{
                                      fontSize: '1rem',
                                      fontWeight: 600,
                                      color: 'var(--color-ink-navy)',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    {item.chemical_name}
                                  </Link>
                                  {item.cas_number && <CASBadge cas={item.cas_number} />}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(item.slug)}
                                title="Remove chemical from schedule"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--color-muted)',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  borderRadius: 'var(--radius-sm)',
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                                  Target Quantity *
                                </label>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <input
                                    type="text"
                                    value={item.quantity || ''}
                                    onChange={(e) => updateItem(item.slug, { quantity: e.target.value })}
                                    placeholder="500"
                                    required
                                    style={{ flex: 2, padding: '6px 10px', fontSize: '0.875rem' }}
                                  />
                                  <select
                                    value={item.unit || 'kg'}
                                    onChange={(e) => updateItem(item.slug, { unit: e.target.value })}
                                    style={{
                                      flex: 1,
                                      padding: '6px',
                                      fontSize: '0.875rem',
                                      backgroundColor: 'var(--color-card)',
                                      border: '1px solid var(--color-rule)',
                                      borderRadius: 'var(--radius-sm)',
                                    }}
                                  >
                                    <option value="kg">kg</option>
                                    <option value="MT">MT</option>
                                    <option value="L">L</option>
                                    <option value="drums">drums</option>
                                    <option value="bags">bags</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                                  Grade / Monograph
                                </label>
                                <input
                                  type="text"
                                  value={item.grade || ''}
                                  onChange={(e) => updateItem(item.slug, { grade: e.target.value })}
                                  placeholder="e.g. IP / BP / USP / Technical"
                                  style={{ padding: '6px 10px', fontSize: '0.875rem' }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <Link
                            to="/products"
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--color-teal)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Plus size={14} /> Add more chemicals from catalog
                          </Link>
                          <button
                            type="button"
                            onClick={clearBasket}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '0.75rem',
                              color: 'var(--color-muted)',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                          >
                            Clear schedule
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Single Product Mode (Default if no basket) */
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                          <FormField
                            id="product"
                            label="Chemical Product / Compound Name"
                            required
                            error={errors.product}
                            hint="Chemical name or commercial designation"
                          >
                            <input
                              id="product"
                              type="text"
                              value={singleProduct.name}
                              onChange={(e) => setSingleProduct({ ...singleProduct, name: e.target.value })}
                              placeholder="e.g. Aceclofenac, Methanol, Caustic Soda"
                              required
                            />
                          </FormField>

                          <FormField id="cas_number" label="CAS Registry Number" hint="Official CAS (e.g. 89796-99-6)">
                            <input
                              id="cas_number"
                              type="text"
                              value={singleProduct.cas}
                              onChange={(e) => setSingleProduct({ ...singleProduct, cas: e.target.value })}
                              placeholder="e.g. 89796-99-6"
                            />
                          </FormField>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ flex: 2 }}>
                              <FormField id="quantity" label="Target Quantity" required error={errors.quantity}>
                                <input
                                  id="quantity"
                                  type="text"
                                  value={singleProduct.quantity}
                                  onChange={(e) => setSingleProduct({ ...singleProduct, quantity: e.target.value })}
                                  placeholder="e.g. 500"
                                  required
                                />
                              </FormField>
                            </div>
                            <div style={{ flex: 1 }}>
                              <FormField id="unit" label="Unit">
                                <select
                                  id="unit"
                                  value={singleProduct.unit}
                                  onChange={(e) => setSingleProduct({ ...singleProduct, unit: e.target.value })}
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

                          <FormField id="grade" label="Purity / Pharmacopeia Standard">
                            <input
                              id="grade"
                              type="text"
                              value={singleProduct.grade}
                              onChange={(e) => setSingleProduct({ ...singleProduct, grade: e.target.value })}
                              placeholder="e.g. Pharma Grade IP/BP/USP, ≥99%"
                            />
                          </FormField>
                        </div>

                        <div style={{ marginTop: '12px', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                          Need multiple compounds? <Link to="/products" style={{ color: 'var(--color-teal)', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 }}>Browse catalog</Link> to add multiple items to your schedule.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Corporate Representative Coordinates */}
                  <div style={{ marginBottom: '32px' }}>
                    <div
                      style={{
                        borderBottom: '1px solid var(--color-rule)',
                        paddingBottom: '8px',
                        marginBottom: '16px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--color-muted)',
                      }}
                    >
                      02. Representative & Enterprise Coordinates
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

                      <FormField id="company" label="Corporate / Legal Entity Name" required error={errors.company}>
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
                      <FormField id="email" label="Corporate Email Address" required error={errors.email}>
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
                  </div>

                  {/* Section 3: Logistics & Compliance Requirements */}
                  <div style={{ marginBottom: '32px' }}>
                    <div
                      style={{
                        borderBottom: '1px solid var(--color-rule)',
                        paddingBottom: '8px',
                        marginBottom: '16px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--color-muted)',
                      }}
                    >
                      03. Delivery Logistics & Documentation Package
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                      <FormField id="destination" label="Destination Port or Plant Location">
                        <input
                          id="destination"
                          type="text"
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          placeholder="e.g. Ankleshwar GIDC / Hazira Port / Nhava Sheva"
                        />
                      </FormField>

                      <FormField id="timeline" label="Required Delivery Horizon">
                        <select
                          id="timeline"
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        >
                          <option value="Immediate Ex-Stock (1-3 days)">Immediate Ex-Stock (1-3 days)</option>
                          <option value="Within 15 days">Within 15 days</option>
                          <option value="Within 30 days">Within 30 days</option>
                          <option value="Monthly Scheduled Contract">Monthly Scheduled Contract</option>
                          <option value="Forward Allocation / Export Dispatch">Forward Allocation / Export Dispatch</option>
                        </select>
                      </FormField>
                    </div>

                    {/* Documentation Checkboxes */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>
                        Required Technical Documentation Package:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={formData.docsRequired.coa}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                docsRequired: { ...formData.docsRequired, coa: e.target.checked },
                              })
                            }
                          />
                          <span>Batch Certificate of Analysis (CoA)</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={formData.docsRequired.msds}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                docsRequired: { ...formData.docsRequired, msds: e.target.checked },
                              })
                            }
                          />
                          <span>Safety Data Sheet (MSDS/SDS)</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={formData.docsRequired.tds}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                docsRequired: { ...formData.docsRequired, tds: e.target.checked },
                              })
                            }
                          />
                          <span>Technical Data Sheet (TDS)</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={formData.docsRequired.gmp_traceability}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                docsRequired: { ...formData.docsRequired, gmp_traceability: e.target.checked },
                              })
                            }
                          />
                          <span>GMP / Origin Traceability Dossier</span>
                        </label>
                      </div>
                    </div>

                    <FormField id="notes" label="Packaging & Additional Commercial Stipulations">
                      <textarea
                        id="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Specify special packaging (e.g. 25kg UN-rated fiber drums, ISO tank container, nitrogen purging, or specific assay targets)..."
                      />
                    </FormField>
                  </div>

                  {/* Consent & Verification */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        style={{ marginTop: '3px' }}
                      />
                      <span>
                        I confirm that this is a legitimate commercial B2B procurement enquiry representing an active business entity.
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
                    size="lg"
                    isLoading={isSubmitting}
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? UI_LABELS.BTN_SUBMITTING : 'Submit Formal RFQ for Commercial Allocation'}
                  </Button>
                </form>
              </div>

              {/* Sidebar: Institutional Procurement Credentials */}
              <div>
                <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <ShieldCheck size={22} style={{ color: 'var(--color-teal)' }} />
                    <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Allocation Assurance</h3>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    <li style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>✓</span>
                      <div>
                        <strong>Direct Allocation:</strong> Sourced directly from verified domestic producers and bulk port imports.
                      </div>
                    </li>
                    <li style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>✓</span>
                      <div>
                        <strong>CoA Verification:</strong> Every dispatch accompanied by manufacturer batch analytical certificate.
                      </div>
                    </li>
                    <li style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>✓</span>
                      <div>
                        <strong>Corporate Identity:</strong> Aura Space Infra Pvt. Ltd. (ROC Ahmedabad, Estd. 2014, CIN: U51909GJ2014PTC080340).
                      </div>
                    </li>
                    <li style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>✓</span>
                      <div>
                        <strong>Turnaround:</strong> Technical commercial quotes provided within 24 working hours.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Direct Contact Card */}
                <div className="card" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '0.9375rem', marginBottom: '8px' }}>Immediate Desk Contact</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '16px' }}>
                    Require contract rates or emergency plant allocation?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Button
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      variant="secondary"
                      size="md"
                      icon={<PhoneCall size={16} />}
                      iconPosition="left"
                      style={{ justifyContent: 'center' }}
                    >
                      {phone}
                    </Button>

                    <Button
                      href={`https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`}
                      variant="ghost"
                      size="md"
                      icon={<MessageSquare size={16} />}
                      iconPosition="left"
                      style={{ justifyContent: 'center' }}
                    >
                      Instant WhatsApp Desk
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};
