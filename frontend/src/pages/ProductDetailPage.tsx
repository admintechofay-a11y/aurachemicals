import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  PhoneCall,
  CheckCircle2,
  Building2,
  Package,
  Sparkles,
  FlaskConical,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { CTABand } from '../components/common/CTABand';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { ProductCard } from '../components/common/ProductCard';
import { Reveal, RevealGroup, ImageReveal } from '../components/common/MotionPrimitives';
import { api } from '../api/client';
import { ProductDto } from '../api/types';

export const ProductDetailPage: React.FC = () => {
  const { slug, slugOrCategory } = useParams<{ slug?: string; slugOrCategory?: string }>();
  const effectiveSlug = slug || slugOrCategory;

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['product', effectiveSlug],
    queryFn: () => (effectiveSlug ? api.getProduct(effectiveSlug) : Promise.reject('No slug')),
    enabled: Boolean(effectiveSlug),
  });

  const { data: allCategoryProducts } = useQuery({
    queryKey: ['products', product?.category?.slug],
    queryFn: () =>
      product?.category?.slug
        ? api.getProducts({ category: product.category.slug, per_page: 8 })
        : Promise.resolve({ total: 0, total_pages: 0, current_page: 1, per_page: 8, products: [] }),
    enabled: Boolean(product?.category?.slug),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Products', url: '/products' }, { label: 'Loading...' }]} />
        <Section padding="dense">
          <Container>
            <Skeleton width="140px" height="20px" style={{ marginBottom: '16px' }} />
            <Skeleton width="60%" height="48px" style={{ marginBottom: '24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
              <Skeleton width="100%" height="360px" />
              <Skeleton width="100%" height="360px" />
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Products', url: '/products' }, { label: 'Product Not Found' }]} />
        <Section>
          <Container>
            <ErrorState
              title="Chemical Product Not Found"
              message={`We could not locate any product matching "${effectiveSlug || ''}". It may have been reclassified or is temporarily unavailable.`}
              onRetry={() => (window.location.href = '/products')}
            />
          </Container>
        </Section>
      </div>
    );
  }

  const phone = settings?.company?.phone || '+91 7220000877';
  const relatedProducts = (allCategoryProducts?.products || [])
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Products', url: '/products' },
          { label: product.category.name, url: `/products?category=${product.category.slug}` },
          { label: product.chemical_name },
        ]}
      />

      {/* Product Overview Header */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(40px, 5vw, 64px) 0',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Container>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '24px',
            }}
          >
            <div style={{ maxWidth: '780px' }}>
              {/* Category & CAS header badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(31, 90, 140, 0.1)',
                    color: 'var(--color-secondary)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {product.category.name}
                </span>

                {product.cas_number && (
                  <span className="cas-badge" style={{ fontSize: '0.875rem', padding: '4px 12px' }}>
                    CAS: {product.cas_number}
                  </span>
                )}

                {product.grade && (
                  <span
                    style={{
                      backgroundColor: 'rgba(11, 37, 69, 0.06)',
                      color: 'var(--color-primary)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                    }}
                  >
                    {product.grade}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '16px' }}>
                {product.chemical_name}
              </h1>

              <p className="body-large" style={{ color: 'var(--color-text)' }}>
                {product.short_description ||
                  `${product.chemical_name} is a verified chemical trading item supplied across pharmaceutical and industrial applications by Aura Space Infra Pvt. Ltd.`}
              </p>
            </div>

            {/* Quick Action Box */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '24px',
                minWidth: '280px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                Bulk Commercial Allocation
              </div>
              <Button
                to={`/get-a-quote?product=${encodeURIComponent(product.chemical_name)}&cas=${encodeURIComponent(product.cas_number || '')}`}
                variant="primary"
                style={{ justifyContent: 'center' }}
              >
                Request Quotation <ArrowRight size={14} />
              </Button>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <PhoneCall size={15} /> Desk: {phone}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Details & Specs */}
      <Section padding="normal">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* Technical Specification Table (Appears as ONE block) */}
            <div>
              <Reveal duration={0.35}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <FlaskConical size={20} style={{ color: 'var(--color-secondary)' }} />
                  <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 600 }}>
                    Technical Specifications
                  </h2>
                </div>

                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-xs)',
                    marginBottom: '32px',
                  }}
                >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '14px 20px', width: '35%', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'left' }}>
                        Chemical Name
                      </th>
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--color-primary)' }}>
                        {product.chemical_name}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '14px 20px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'left' }}>
                        CAS Registry Number
                      </th>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-family-mono)' }}>
                        {product.cas_number ? (
                          <span className="cas-badge">{product.cas_number}</span>
                        ) : (
                          'Available on Technical Request'
                        )}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '14px 20px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'left' }}>
                        Category
                      </th>
                      <td style={{ padding: '14px 20px' }}>
                        {product.category.name}
                      </td>
                    </tr>

                    {product.therapeutic_category && (
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '14px 20px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'left' }}>
                          Therapeutic / Class
                        </th>
                        <td style={{ padding: '14px 20px' }}>
                          {product.therapeutic_category}
                        </td>
                      </tr>
                    )}

                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '14px 20px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'left' }}>
                        Grade Standard
                      </th>
                      <td style={{ padding: '14px 20px', color: 'var(--color-secondary)', fontWeight: 500 }}>
                        {product.grade || 'Technical / Commercial / Pharma Grade'}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '14px 20px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'left' }}>
                        Compliance Reference
                      </th>
                      <td style={{ padding: '14px 20px' }}>
                        {product.category.slug === 'api'
                          ? 'Strict Pharmacopeia Standards (IP / BP / USP / EP)'
                          : 'Commercial Specification / Industry Grade Standards'}
                      </td>
                    </tr>

                    <tr>
                      <th style={{ padding: '14px 20px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'left' }}>
                        Sourcing Network
                      </th>
                      <td style={{ padding: '14px 20px' }}>
                        Direct Domestic Audited Manufacturers (400+ Network)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              </Reveal>

              {/* Related Industries */}
              {product.related_industries && product.related_industries.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '12px', fontWeight: 600 }}>
                    Target Industrial Applications
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.related_industries.map((ind, idx) => (
                      <Link
                        key={idx}
                        to={`/industries#${ind.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--color-surface-subtle)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-primary)',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}
                      >
                        <Building2 size={13} style={{ color: 'var(--color-secondary)' }} />
                        {ind.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quality Assurance & Documentation Guarantee Column */}
            <div>
              <div
                style={{
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  padding: '32px',
                  marginBottom: '32px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <ShieldCheck size={24} style={{ color: 'var(--color-secondary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
                    Quality Assurance &amp; Documentation
                  </h3>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Aura Space Infra Pvt. Ltd. provides complete regulatory dossier documentation and batch-level verification for every commercial shipment:
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Certificate of Analysis (COA) with comprehensive purity assays',
                    'Material Safety Data Sheet (MSDS / SDS) compliant with GHS standards',
                    'Batch manufacturing records & shelf-life stability verification',
                    'Pharmacopeial compliance certificates (IP, BP, USP, EP)',
                    'Secure industrial packaging: fiber drums, HDPE barrels, or ISO tanks',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.875rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <Package size={24} style={{ color: 'var(--color-primary)' }} />
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                    <strong>Packaging Options:</strong> Standard 25kg drums, customized drum packaging, bulk carboys, and industrial tanker deliveries available across India.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <Section padding="normal" style={{ backgroundColor: 'var(--color-surface)' }}>
          <Container>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span className="eyebrow">Category Discovery</span>
                <h2 style={{ fontSize: '1.5rem', margin: '4px 0 0', fontWeight: 600 }}>
                  Other Chemicals in {product.category.name}
                </h2>
              </div>
              <Link
                to={`/products?category=${product.category.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--color-secondary)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                <span>View All ({product.category.name})</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <RevealGroup
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </RevealGroup>
          </Container>
        </Section>
      )}

      {/* Global RFQ CTABand */}
      <CTABand
        heading={`Request Quotation for ${product.chemical_name}`}
        body={`Connect with our technical sales desk for bulk pricing, COA requests, minimum order quantities, and delivery schedules across India.`}
        buttonLabel="Submit RFQ"
        buttonUrl={`/get-a-quote?product=${encodeURIComponent(product.chemical_name)}&cas=${encodeURIComponent(product.cas_number || '')}`}
        phone={phone}
      />
    </>
  );
};
