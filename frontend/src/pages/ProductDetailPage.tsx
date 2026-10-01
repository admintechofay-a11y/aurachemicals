import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Printer,
  Plus,
  Check,
  ArrowRight,
  MessageCircle,
  Phone,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  Building,
  Layers,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CASBadge } from '../components/common/CASBadge';
import { SpecRow, SpecTable } from '../components/common/SpecRow';
import { ProductCard } from '../components/common/ProductCard';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { api } from '../api/client';
import { useRFQ } from '../context/RFQContext';

export const ProductDetailPage: React.FC = () => {
  const { slug, slugOrCategory } = useParams<{ slug?: string; slugOrCategory?: string }>();
  const effectiveSlug = slug || slugOrCategory;
  const navigate = useNavigate();
  const { addItem, isInBasket } = useRFQ();

  // Quick RFQ panel form state
  const [rfqVolume, setRfqVolume] = useState('500');
  const [rfqUnit, setRfqUnit] = useState('kg');
  const [rfqGrade, setRfqGrade] = useState('IP/BP/USP Grade');
  const [reqCoA, setReqCoA] = useState(true);
  const [reqMSDS, setReqMSDS] = useState(false);
  const [reqSample, setReqSample] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', effectiveSlug],
    queryFn: () => (effectiveSlug ? api.getProduct(effectiveSlug) : Promise.reject('No slug')),
    enabled: Boolean(effectiveSlug),
  });

  const { data: allCategoryProducts } = useQuery({
    queryKey: ['products', product?.category?.slug],
    queryFn: () =>
      product?.category?.slug
        ? api.getProducts({ category: product.category.slug, per_page: 4 })
        : Promise.resolve({ total: 0, total_pages: 0, current_page: 1, per_page: 4, products: [] }),
    enabled: Boolean(product?.category?.slug),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  // Set document title & Meta
  useEffect(() => {
    if (product) {
      document.title = `${product.chemical_name} ${product.cas_number ? `(CAS ${product.cas_number})` : ''} | Supplier & Price | Aura Chemicals`;
    }
  }, [product]);

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Products', href: '/products' }, { label: 'Loading...' }]} />
        <Section background="paper">
          <Container>
            <Skeleton width="220px" height="24px" style={{ marginBottom: '16px' }} />
            <Skeleton width="60%" height="48px" style={{ marginBottom: '24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
              <div style={{ gridColumn: 'span 8' }}><Skeleton width="100%" height="480px" /></div>
              <div style={{ gridColumn: 'span 4' }}><Skeleton width="100%" height="480px" /></div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Products', href: '/products' }, { label: 'Not Found' }]} />
        <Section background="paper">
          <Container>
            <ErrorState
              title="Chemical Specification Not Found"
              message={`The requested chemical datasheet "${effectiveSlug}" could not be located in our verified directory.`}
              onRetry={() => navigate('/products')}
            />
          </Container>
        </Section>
      </div>
    );
  }

  const phone = settings?.company?.phone || '+91 97274 04415';
  const inBasket = isInBasket(product.slug);
  const relatedProducts = (allCategoryProducts?.products || [])
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const handleAddToBasket = () => {
    addItem({
      slug: product.slug,
      chemical_name: product.chemical_name,
      cas_number: product.cas_number || undefined,
      category: product.category?.name,
      grade: rfqGrade || product.grade || undefined,
      quantity: rfqVolume,
      unit: rfqUnit,
    });
  };

  const handleDirectQuote = () => {
    const params = new URLSearchParams();
    params.set('product', product.chemical_name);
    if (product.cas_number) params.set('cas', product.cas_number);
    params.set('quantity', rfqVolume);
    params.set('unit', rfqUnit);
    params.set('grade', rfqGrade);
    if (reqCoA) params.set('req_coa', '1');
    if (reqMSDS) params.set('req_msds', '1');
    if (reqSample) params.set('req_sample', '1');
    navigate(`/get-a-quote?${params.toString()}`);
  };

  const generateWhatsAppUrl = () => {
    const text = `Hello Aura Chemicals, I would like to inquire about pricing, CoA, and availability for:
Product: ${product.chemical_name}
CAS Number: ${product.cas_number || 'N/A'}
Quantity Required: ${rfqVolume} ${rfqUnit}
Grade: ${rfqGrade}
Documents Needed: ${[reqCoA && 'CoA', reqMSDS && 'MSDS', reqSample && 'Pilot Sample'].filter(Boolean).join(', ')}`;
    return `https://wa.me/919727404415?text=${encodeURIComponent(text)}`;
  };

  // Structured Data (JSON-LD) for B2B Chemical
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.chemical_name,
    category: product.category?.name || 'Chemical Substances',
    identifier: product.cas_number ? `CAS:${product.cas_number}` : undefined,
    description: product.short_description || `${product.chemical_name} supplied by Aura Space Infra Pvt. Ltd.`,
    brand: {
      '@type': 'Brand',
      name: 'Aura Chemicals',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Aura Space Infra Private Limited',
      url: 'https://aurachemicals.in',
    },
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          { label: product.category?.name || 'Catalog', href: `/products?category=${product.category?.slug}` },
          { label: product.chemical_name },
        ]}
      />

      {/* Datasheet Header */}
      <section
        style={{
          backgroundColor: 'var(--color-surface-white)',
          borderBottom: '1px solid var(--color-rule)',
          padding: 'clamp(32px, 4vw, 48px) 0',
        }}
      >
        <Container>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span className="section-index">TECHNICAL DATASHEET</span>
                <span style={{ color: 'var(--color-rule-strong)' }}>/</span>
                <span className="eyebrow" style={{ marginBottom: 0 }}>
                  {product.category?.name || 'CHEMICAL MONOGRAPH'}
                </span>
                {product.cas_number && <CASBadge cas={product.cas_number} />}
              </div>

              <h1 style={{ fontSize: 'var(--font-size-h1)', margin: 0, color: 'var(--color-ink-navy)' }}>
                {product.chemical_name}
              </h1>

              {product.therapeutic_category && (
                <div style={{ marginTop: '8px', fontSize: '0.9375rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-mono)' }}>
                  Classification: <strong>{product.therapeutic_category}</strong>
                </div>
              )}
            </div>

            {/* Print & Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-outline btn-sm"
                style={{ gap: '6px' }}
                title="Print single-page product specification sheet"
              >
                <Printer size={15} />
                <span>Print Product Sheet</span>
              </button>

              <button
                type="button"
                onClick={handleAddToBasket}
                className={inBasket ? 'btn btn-secondary btn-sm' : 'btn btn-teal btn-sm'}
                style={{ gap: '6px' }}
              >
                {inBasket ? <><Check size={15} /> In RFQ Basket</> : <><Plus size={15} /> Add to RFQ</>}
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Main 2-Column Datasheet Content */}
      <Section background="paper">
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(32px, 4vw, 48px)',
            alignItems: 'start',
          }}>
            {/* Left Column (8 cols): Specifications & Overview */}
            <div style={{ gridColumn: 'span 12' }} className="datasheet-left-col">
              {/* Product Overview Note */}
              <div style={{
                backgroundColor: 'var(--color-surface-white)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-xs)',
                padding: '24px',
                marginBottom: '24px',
              }}>
                <h2 style={{ fontSize: '1rem', color: 'var(--color-ink-navy)', marginBottom: '8px', fontWeight: 600 }}>
                  Commercial Sourcing Specification
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {product.short_description ||
                    `${product.chemical_name} is supplied by Aura Space Infra Pvt. Ltd. for commercial formulation, pharmaceutical synthesis, and industrial manufacturing. All batches are accompanied by certified manufacturer Certificates of Analysis (CoAs) meeting applicable statutory pharmacopeial monographs.`}
                </p>
              </div>

              {/* SpecTable Motif */}
              <div style={{
                backgroundColor: 'var(--color-surface-white)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-xs)',
                padding: '24px',
                marginBottom: '24px',
              }}>
                <SpecTable title="Verified Technical Parameters">
                  <SpecRow label="PRODUCT NAME" value={product.chemical_name} />
                  <SpecRow label="CAS REGISTRY NO." value={product.cas_number || 'N/A'} isMono />
                  {product.molecular_formula && (
                    <SpecRow label="MOLECULAR FORMULA" value={product.molecular_formula} isMono />
                  )}
                  {product.molecular_weight && (
                    <SpecRow label="MOLECULAR WEIGHT" value={product.molecular_weight} isMono />
                  )}
                  <SpecRow label="CATEGORY" value={product.category?.name || 'Chemical'} />
                  {product.therapeutic_category && (
                    <SpecRow label="APPLICATION / USE" value={product.therapeutic_category} />
                  )}
                  <SpecRow
                    label="PHARMACOPEIA MONOGRAPH"
                    value={product.grade || 'IP / BP / USP / EP Monograph Specification'}
                    isMono
                  />
                  <SpecRow label="TYPICAL PACKAGING" value={product.packaging || '25kg HDPE Bags / Drums / ISO Tankers on Request'} />
                  <SpecRow label="ORIGIN / SUPPLY MODEL" value="Domestic Manufacturer Allocation & Direct Imports" />
                  <SpecRow label="SUPPLIER" value="Aura Space Infra Pvt. Ltd. (ROC Ahmedabad)" />
                </SpecTable>
              </div>

              {/* Associated Manufacturing Industries */}
              {product.related_industries && product.related_industries.length > 0 && (
                <div style={{
                  backgroundColor: 'var(--color-surface-white)',
                  border: '1px solid var(--color-rule)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '20px 24px',
                  marginBottom: '24px',
                }}>
                  <h4 style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-navy)', marginBottom: '12px' }}>
                    Target Industrial Applications
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.related_industries.map((ind) => (
                      <Link
                        key={ind.slug}
                        to={`/industries#${ind.slug}`}
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-family-mono)',
                          padding: '4px 10px',
                          backgroundColor: 'var(--color-paper)',
                          border: '1px solid var(--color-rule)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--color-text-secondary)',
                          textDecoration: 'none',
                        }}
                      >
                        {ind.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Regulatory Notice */}
              <div style={{
                padding: '16px 20px',
                backgroundColor: 'var(--color-paper-subtle)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}>
                <ShieldCheck size={20} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  <strong>Commercial Manufacturer Notice:</strong> {product.chemical_name} is sold strictly for industrial manufacturing and licensed pharmaceutical processing. Not for retail sales or medical advice. Batches are subject to manufacturer allocation and quality testing.
                </p>
              </div>
            </div>

            {/* Right Column (4 cols): Sticky Quotation Requisition Panel */}
            <div style={{ gridColumn: 'span 12' }} className="datasheet-right-col no-print">
              <aside
                style={{
                  position: 'sticky',
                  top: '96px',
                  backgroundColor: 'var(--color-surface-white)',
                  border: '1px solid var(--color-rule-strong)',
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: 'var(--shadow-dropdown)',
                  overflow: 'hidden',
                }}
              >
                {/* Panel Header */}
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--color-ink-navy)',
                  color: 'var(--color-text-on-dark)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--color-teal-border)' }}>
                      COMMERCIAL INQUIRY
                    </span>
                    <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.6875rem', color: '#FFFFFF' }}>
                      ALLOCATION DESK
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.125rem', color: '#FFFFFF', margin: 0, fontWeight: 600 }}>
                    Request Quote for {product.chemical_name}
                  </h2>
                </div>

                {/* Panel Inputs */}
                <div style={{ padding: '20px' }}>
                  {/* Volume & Unit */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                      Target Volume
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        value={rfqVolume}
                        onChange={(e) => setRfqVolume(e.target.value)}
                        placeholder="e.g. 500"
                        className="form-input"
                      />
                      <select
                        value={rfqUnit}
                        onChange={(e) => setRfqUnit(e.target.value)}
                        className="form-select"
                        aria-label="Target volume unit"
                      >
                        <option value="kg">kg</option>
                        <option value="MT">MT</option>
                        <option value="L">L</option>
                        <option value="Drums">Drums</option>
                        <option value="IBC">IBC</option>
                      </select>
                    </div>
                  </div>

                  {/* Monograph Grade */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                      Required Standard / Grade
                    </label>
                    <input
                      type="text"
                      value={rfqGrade}
                      onChange={(e) => setRfqGrade(e.target.value)}
                      placeholder="e.g. IP/BP/USP Grade, Technical, Anhydrous"
                      className="form-input"
                    />
                  </div>

                  {/* Documentation Checkboxes */}
                  <div style={{ marginBottom: '20px', borderTop: '1px solid var(--color-rule)', paddingTop: '12px' }}>
                    <span style={{ display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                      Documentation Required
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={reqCoA}
                          onChange={(e) => setReqCoA(e.target.checked)}
                        />
                        <span>Certificate of Analysis (CoA)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={reqMSDS}
                          onChange={(e) => setReqMSDS(e.target.checked)}
                        />
                        <span>Material Safety Data Sheet (MSDS)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={reqSample}
                          onChange={(e) => setReqSample(e.target.checked)}
                        />
                        <span>Commercial Pilot Sample</span>
                      </label>
                    </div>
                  </div>

                  {/* Primary Quote Button */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handleDirectQuote}
                      className="btn btn-teal"
                      style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                    >
                      <span>Submit Commercial RFQ</span>
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={handleAddToBasket}
                      className={inBasket ? 'btn btn-secondary' : 'btn btn-outline'}
                      style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                    >
                      {inBasket ? <><Check size={16} /> Added to RFQ Basket</> : <><Plus size={16} /> Add to RFQ Basket</>}
                    </button>

                    <a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ width: '100%', justifyContent: 'center', gap: '8px', color: '#1B8755' }}
                    >
                      <MessageCircle size={16} />
                      <span>Quick WhatsApp Inquiry</span>
                    </a>
                  </div>

                  {/* Desk Phone Reference */}
                  <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Direct Telephone Desk:{' '}
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-ink-navy)', fontWeight: 600 }}>
                      {phone}
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* Related Products in Same Category */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: '56px', borderTop: '1px solid var(--color-rule-strong)', paddingTop: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)' }}>
                  Related Compounds in {product.category?.name}
                </h3>
                <Link to={`/products?category=${product.category?.slug}`} style={{ fontSize: '0.8125rem', color: 'var(--color-teal)', fontWeight: 500 }}>
                  View All in Category →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.slug} product={rel} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Responsive layout styles */}
      <style>{`
        @media (min-width: 1024px) {
          .datasheet-left-col { grid-column: span 8 !important; }
          .datasheet-right-col { grid-column: span 4 !important; }
        }
        @media (max-width: 1023px) {
          .datasheet-left-col, .datasheet-right-col { grid-column: span 12 !important; }
        }
      `}</style>
    </>
  );
};
