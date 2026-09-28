import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  FileDown,
  PhoneCall,
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
import { Reveal, ImageReveal } from '../components/common/MotionPrimitives';
import { api } from '../api/client';
import { UI_LABELS } from '../utils/constants';

export const ProductDetailPage: React.FC = () => {
  const { slug, slugOrCategory } = useParams<{ slug?: string; slugOrCategory?: string }>();
  const effectiveSlug = slug || slugOrCategory;

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
        <Breadcrumb items={[{ label: UI_LABELS.NAV_PRODUCTS, url: '/products' }, { label: 'Loading...' }]} />
        <Section padding="dense">
          <Container>
            <Skeleton width="180px" height="24px" style={{ marginBottom: '16px' }} />
            <Skeleton width="60%" height="48px" style={{ marginBottom: '24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <Skeleton width="100%" height="380px" />
              <Skeleton width="100%" height="380px" />
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div>
        <Breadcrumb items={[{ label: UI_LABELS.NAV_PRODUCTS, url: '/products' }, { label: UI_LABELS.NOT_FOUND_TITLE }]} />
        <Section>
          <Container>
            <ErrorState
              title={UI_LABELS.EMPTY_PRODUCTS_TITLE}
              message={UI_LABELS.EMPTY_PRODUCTS_DESC}
              onRetry={() => (window.location.href = '/products')}
            />
          </Container>
        </Section>
      </div>
    );
  }

  const phone = settings?.company?.phone;
  const relatedProducts = (allCategoryProducts?.products || [])
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  // Technical spec rows (ONLY when values exist)
  const specRows: Array<{ label: string; value: React.ReactNode }> = [];

  if (product.chemical_name) {
    specRows.push({ label: 'Chemical Name', value: <strong>{product.chemical_name}</strong> });
  }
  if (product.cas_number) {
    specRows.push({ label: 'CAS Registry Number', value: <span className="cas-badge">{product.cas_number}</span> });
  }
  if (product.molecular_formula) {
    specRows.push({ label: 'Molecular Formula', value: <code>{product.molecular_formula}</code> });
  }
  if (product.molecular_weight) {
    specRows.push({ label: 'Molecular Weight', value: product.molecular_weight });
  }
  if (product.grade) {
    specRows.push({ label: 'Grade Standard', value: product.grade });
  }
  if (product.purity) {
    specRows.push({ label: 'Assay / Purity', value: product.purity });
  }
  if (product.applications) {
    specRows.push({ label: 'Industrial Applications', value: product.applications });
  }
  if (product.related_industries && product.related_industries.length > 0) {
    specRows.push({
      label: 'Industries Served',
      value: (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {product.related_industries.map((ind, i) => (
            <Link key={i} to={`/industries`} style={{ color: 'var(--color-brand)', textDecoration: 'underline' }}>
              {ind.title}
            </Link>
          ))}
        </div>
      ),
    });
  }
  if (product.packaging) {
    specRows.push({ label: 'Standard Packaging', value: product.packaging });
  }

  const quoteUrl = `/get-a-quote?product=${encodeURIComponent(product.chemical_name)}${product.cas_number ? `&cas=${encodeURIComponent(product.cas_number)}` : ''}`;

  return (
    <div style={{ paddingBottom: 'clamp(56px, 8vw, 80px)' }}>
      <Breadcrumb
        items={[
          { label: UI_LABELS.NAV_PRODUCTS, url: '/products' },
          { label: product.category.name, url: `/products/${product.category.slug}` },
          { label: product.chemical_name },
        ]}
      />

      {/* Main Product Layout: Desktop 2 Columns (Image left, Summary right) */}
      <Section padding="normal">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 5vw, 64px)',
              alignItems: 'start',
            }}
          >
            {/* Left: Gallery / Image */}
            <div>
              {product.image?.url ? (
                <ImageReveal
                  src={product.image.url}
                  alt={product.image.alt || product.chemical_name}
                  aspectRatio="4 / 3"
                  borderRadius="4px"
                  overlay={true}
                  priority={true}
                />
              ) : (
                <div className="image-missing-placeholder" style={{ minHeight: '340px' }}>
                  <span>Verified Chemical Product Asset</span>
                </div>
              )}
            </div>

            {/* Right: Sticky Summary */}
            <div style={{ position: 'sticky', top: '96px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-rule)',
                    color: 'var(--color-brand)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {product.category.name}
                </span>

                {product.cas_number && (
                  <span className="cas-badge">
                    CAS: {product.cas_number}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '16px', color: 'var(--color-ink)' }}>
                {product.chemical_name}
              </h1>

              {product.short_description && (
                <p className="body-large" style={{ marginBottom: '24px' }}>
                  {product.short_description}
                </p>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '24px',
                }}
              >
                <Button
                  to={quoteUrl}
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={16} />}
                >
                  Request Commercial Quote
                </Button>

                {product.datasheet_url && (
                  <Button
                    href={product.datasheet_url}
                    variant="secondary"
                    size="lg"
                    icon={<FileDown size={16} />}
                  >
                    Technical Datasheet
                  </Button>
                )}
              </div>

              {phone && (
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PhoneCall size={15} style={{ color: 'var(--color-accent)' }} />
                  <span>Direct Procurement Desk: <strong>{phone}</strong></span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Technical Specifications Section (Rows ONLY when values exist) */}
      {specRows.length > 0 && (
        <Section variant="surface" padding="normal">
          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <FlaskConical size={20} style={{ color: 'var(--color-brand)' }} />
              <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 600, color: 'var(--color-ink)' }}>
                Technical & Regulatory Specifications
              </h2>
            </div>

            {/* Desktop Table View */}
            <div className="table-responsive" style={{ margin: 0 }}>
              <table className="data-table">
                <tbody>
                  {specRows.map((row, idx) => (
                    <tr key={idx}>
                      <th style={{ width: '32%', color: 'var(--color-muted)', fontWeight: 500 }}>
                        {row.label}
                      </th>
                      <td style={{ color: 'var(--color-text)' }}>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </Section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Section padding="normal">
          <Container>
            <div style={{ marginBottom: '24px' }}>
              <span className="eyebrow">Catalog Exploration</span>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                Related {product.category.name}
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Final Pre-Footer CTA */}
      <CTABand
        heading="Procure Directly from Verified Domestic Manufacturers"
        body="Submit your targeted volume and purity requirements to receive an allocation estimate with batch Certificates of Analysis."
        buttonLabel="Request a Quote"
        buttonUrl={quoteUrl}
        phone={phone}
      />

      {/* Mobile Sticky Bottom Bar (Safe-Area Aware) */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-card)',
          borderTop: '1px solid var(--color-rule)',
          padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 8px)) 20px',
          boxShadow: '0 -4px 16px rgba(22, 25, 29, 0.08)',
          zIndex: 990,
          display: 'none',
        }}
        className="mobile-sticky-quote-bar"
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button
            to={quoteUrl}
            variant="primary"
            size="md"
            style={{ flex: 1, justifyContent: 'center' }}
            icon={<ArrowRight size={16} />}
          >
            Request Quote
          </Button>
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-ink)',
                backgroundColor: 'var(--color-surface)',
              }}
              aria-label="Call sales desk"
            >
              <PhoneCall size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
