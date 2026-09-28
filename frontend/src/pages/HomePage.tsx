import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  TrendingUp,
  Truck,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { ProductCard } from '../components/common/ProductCard';
import { IndustryCard } from '../components/common/IndustryCard';
import { LogoGrid } from '../components/common/LogoGrid';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { CTABand } from '../components/common/CTABand';
import {
  Reveal,
  RevealGroup,
  LineDraw,
  ImageReveal,
  CountUp,
} from '../components/common/MotionPrimitives';
import { api } from '../api/client';
import { UI_LABELS } from '../utils/constants';

export const HomePage: React.FC = () => {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('api');

  // Fetch Homepage Data
  const {
    data: homeData,
    isLoading: isHomeLoading,
    isError: isHomeError,
    refetch: refetchHome,
  } = useQuery({
    queryKey: ['home'],
    queryFn: () => api.getHome(),
  });

  // Fetch Settings (phone, ROC, supplier count, group name)
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  // Fetch Product Categories for Hero Capability Strip
  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => api.getProductCategories(),
  });

  // Fetch Featured Products
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products', 'featured', selectedCategoryTab],
    queryFn: () => api.getProducts({ category: selectedCategoryTab, per_page: 6 }),
  });

  // Fetch Industries preview
  const { data: industriesData } = useQuery({
    queryKey: ['industries', 'preview'],
    queryFn: () => api.getIndustries(),
  });

  if (isHomeLoading) {
    return (
      <div>
        <section className="hero-section">
          <Container>
            <div className="hero-grid">
              <div className="hero-left-col">
                <Skeleton width="180px" height="18px" style={{ marginBottom: '16px' }} />
                <Skeleton width="100%" height="48px" style={{ marginBottom: '16px' }} />
                <Skeleton width="80%" height="24px" style={{ marginBottom: '32px' }} />
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Skeleton width="160px" height="48px" />
                  <Skeleton width="160px" height="48px" />
                </div>
              </div>
              <div className="hero-right-col">
                <Skeleton width="100%" height="380px" borderRadius="4px" />
              </div>
            </div>
          </Container>
        </section>
        <Section>
          <Container>
            <Skeleton width="100%" height="320px" />
          </Container>
        </Section>
      </div>
    );
  }

  if (isHomeError || !homeData) {
    return (
      <Section>
        <Container>
          <ErrorState
            title="Unable to Load Homepage"
            message="Could not retrieve verified corporate information from the server."
            onRetry={refetchHome}
          />
        </Container>
      </Section>
    );
  }

  const { hero, intro, services, pillars, clientele, cta } = homeData;
  const phone = settings?.company?.phone;
  const supplierCount = settings?.company?.supplier_count;
  const experienceYears = settings?.company?.experience_years;
  const roc = settings?.company?.roc_registration;
  const groupName = settings?.company?.group_name;

  const pillarIcons: Record<string, React.ReactNode> = {
    'wide-range': <Building2 size={24} style={{ color: 'var(--color-secondary)' }} />,
    'competitive-pricing': <TrendingUp size={24} style={{ color: 'var(--color-secondary)' }} />,
    'reliable-supply-chain': <Truck size={24} style={{ color: 'var(--color-secondary)' }} />,
    'extensive-network': <ShieldCheck size={24} style={{ color: 'var(--color-secondary)' }} />,
  };

  return (
    <>
      {/* 1. PREMIUM HERO SECTION (Redesign with 12-column grid & LCP-safe motion) */}
      {hero && (
        <section className="hero-section">
          <Container>
            <div className="hero-grid">
              {/* Left Column: 5 Columns (Desktop) / Left-aligned text */}
              <div className="hero-left-col">
                {/* Eyebrow with drawing 32px accent hairline */}
                {(hero.eyebrow || groupName) && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    <LineDraw width={32} height={1} color="var(--color-accent)" delay={0.05} />
                    <span className="eyebrow" style={{ marginBottom: 0 }}>
                      {hero.eyebrow || groupName}
                    </span>
                  </div>
                )}

                {/* H1 Headline (LCP-safe immediate visibility with subtle 12px rise) */}
                {hero.title && (
                  <Reveal immediate delay={0}>
                    <h1
                      style={{
                        fontSize: 'clamp(2.5rem, 3.8vw, 3.5rem)',
                        lineHeight: 1.15,
                        marginBottom: 'var(--space-4)',
                        color: 'var(--color-primary)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {hero.title}
                    </h1>
                  </Reveal>
                )}

                {/* Supporting Paragraph (max ~60 characters width, 16-18px) */}
                {hero.tagline && (
                  <Reveal delay={0.06} duration={0.35}>
                    <p
                      className="body-large"
                      style={{
                        maxWidth: '580px',
                        marginBottom: 'var(--space-8)',
                        color: 'var(--color-text)',
                        fontSize: 'clamp(1rem, 0.4vw + 0.9rem, 1.125rem)',
                        lineHeight: 1.6,
                      }}
                    >
                      {hero.tagline}
                    </p>
                  </Reveal>
                )}

                {/* Dual Buttons (Primary Quote + Secondary Explore Products) */}
                <Reveal delay={0.12} duration={0.35}>
                  <div
                    className="hero-buttons"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      flexWrap: 'wrap',
                    }}
                  >
                    {hero.cta_primary && (
                      <Button
                        to={hero.cta_primary.url}
                        variant="primary"
                        size="lg"
                        icon={<ArrowRight size={18} />}
                      >
                        {hero.cta_primary.label}
                      </Button>
                    )}
                    {hero.cta_secondary && (
                      <Button
                        to={hero.cta_secondary.url}
                        variant="outline"
                        size="lg"
                      >
                        {hero.cta_secondary.label}
                      </Button>
                    )}
                  </div>
                </Reveal>

                {/* Sub-features list (400+ Suppliers, Direct Domestic, Compliance) */}
                <Reveal delay={0.18} duration={0.35}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--space-6)',
                      marginTop: 'var(--space-8)',
                      paddingTop: 'var(--space-6)',
                      borderTop: '1px solid var(--color-border)',
                      fontSize: '0.875rem',
                      color: 'var(--color-muted)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                      <span>400+ Verified Suppliers</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                      <span>Direct Domestic Sourcing</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                      <span>Pharmacopeial Compliance</span>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: 7 Columns (Desktop) / High-Quality Real Image from WordPress */}
              <div className="hero-right-col">
                {hero.image?.url ? (
                  <ImageReveal
                    src={hero.image.url}
                    alt={hero.image.alt || 'Laboratory facility'}
                    aspectRatio="16 / 11"
                    borderRadius="4px"
                    overlay={true}
                    priority={true}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 11',
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '4px',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-muted)',
                      fontSize: '0.875rem',
                    }}
                  >
                    Laboratory Facility
                  </div>
                )}
              </div>
            </div>
          </Container>

          {/* Slim Capability Strip at Hero Bottom (Separated by 1px border) */}
          {categories && categories.length > 0 && (
            <div className="hero-capability-strip" style={{ marginTop: 'clamp(36px, 5vw, 60px)' }}>
              <Container>
                <Reveal delay={0.24} duration={0.4}>
                  <div className="hero-capability-list">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products/${cat.slug}`}
                        className="hero-capability-item"
                      >
                        <span>{cat.name}</span>
                        <ArrowRight size={14} />
                      </Link>
                    ))}
                  </div>
                </Reveal>
              </Container>
            </div>
          )}
        </section>
      )}

      {/* 2. CORPORATE INTRODUCTION SECTION */}
      {intro && (intro.heading || intro.body) && (
        <Section variant="default">
          <Container>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'clamp(32px, 6vw, 72px)',
                alignItems: 'center',
              }}
            >
              <div>
                <ImageReveal
                  src="/images/pexels-max-flinterman-225455-2506594-scaled.jpg"
                  alt="Industrial chemical manufacturing complex"
                  aspectRatio="16 / 11"
                  borderRadius="4px"
                />
              </div>

              <div>
                <Reveal>
                  <span className="eyebrow">Company Profile</span>
                  {intro.heading && (
                    <h2 style={{ marginBottom: 'var(--space-2)' }}>{intro.heading}</h2>
                  )}
                  <LineDraw width={48} height={1} color="var(--color-accent)" style={{ margin: '8px 0 16px 0' }} />
                  {intro.body && (
                    <p
                      className="body-large"
                      style={{
                        color: 'var(--color-text)',
                        lineHeight: 1.7,
                        marginBottom: 'var(--space-6)',
                      }}
                    >
                      {intro.body}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <Button to="/about-us" variant="outline" icon={<ArrowRight size={16} />}>
                      About Aura Chemicals
                    </Button>
                    <Button to="/our-mission" variant="text" icon={<ArrowRight size={16} />}>
                      Our Mission & Sustainability
                    </Button>
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 3. OUR SERVICES & SOURCING STRENGTHS */}
      {services && (services.heading || services.body) && (
        <Section variant="surface">
          <Container>
            <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
              <Reveal>
                <span className="eyebrow">Distribution Capabilities</span>
                {services.heading && (
                  <h2 style={{ marginBottom: 'var(--space-2)' }}>{services.heading}</h2>
                )}
                <LineDraw width={48} height={1} color="var(--color-accent)" style={{ margin: '8px auto 16px auto' }} />
                {services.body && (
                  <p
                    className="body-large"
                    style={{
                      color: 'var(--color-text)',
                      lineHeight: 1.7,
                      marginBottom: 'var(--space-8)',
                    }}
                  >
                    {services.body}
                  </p>
                )}

                <Button to="/services" variant="primary" icon={<ArrowRight size={16} />}>
                  View Technical Services & Quality Assurance
                </Button>
              </Reveal>
            </div>
          </Container>
        </Section>
      )}

      {/* 4. FOUR STRATEGIC BUSINESS PILLARS (With Connecting Supply Chain Flow on Desktop) */}
      {pillars && pillars.length > 0 && (
        <Section variant="default">
          <Container>
            <SectionHeading
              eyebrow="Core Strengths"
              title="Strategic Advantages for Industrial Procurement"
              description="Aura Chemicals combines technical chemical expertise, domestic sourcing efficiency, and ethical compliance to serve commercial clients."
            />

            <div className="pillar-chain-row" style={{ position: 'relative' }}>
              {/* Connecting 1px supply chain line between items on desktop (hidden on mobile or if < 2 items) */}
              {pillars.length >= 2 && <div className="pillar-chain-line" />}

              <RevealGroup
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 'var(--space-6)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {pillars.map((pillar) => (
                  <div
                    key={pillar.id}
                    className="product-card"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-6)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <div
                      className="card-icon-box"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 'var(--space-4)',
                      }}
                    >
                      {pillarIcons[pillar.id] || <ShieldCheck size={24} style={{ color: 'var(--color-secondary)' }} />}
                    </div>

                    <h3
                      style={{
                        fontSize: '1.1875rem',
                        marginBottom: 'var(--space-3)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {pillar.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--color-muted)',
                        lineHeight: 1.6,
                        flex: 1,
                      }}
                    >
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </RevealGroup>
            </div>
          </Container>
        </Section>
      )}

      {/* 5. RESTRICTED CORPORATE FIGURES ROW (CountUp strictly on verified numeric CMS values) */}
      {(supplierCount || experienceYears || roc) && (
        <section
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            padding: '40px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Container>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 'var(--space-8)',
                textAlign: 'center',
              }}
            >
              {supplierCount && (
                <div className="metric-stat-box">
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                    <CountUp value={supplierCount} suffix="+" />
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '4px' }}>
                    Leading Domestic Chemical Suppliers
                  </div>
                </div>
              )}

              {experienceYears && (
                <div className="metric-stat-box">
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                    {experienceYears}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '4px' }}>
                    Active in API & Chemical Distribution (Since 2014)
                  </div>
                </div>
              )}

              {roc && (
                <div className="metric-stat-box">
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                    {roc}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '4px' }}>
                    Registered Non-Government Corporate Entity
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* 6. FEATURED PRODUCTS CATALOG PREVIEW */}
      <Section variant="surface">
        <Container>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-8)',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <span className="eyebrow">Chemical Catalog</span>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>Featured Product Lines</h2>
              <LineDraw width={48} height={1} color="var(--color-accent)" style={{ margin: '8px 0 16px 0' }} />
              <p className="body-large" style={{ marginTop: '4px' }}>
                Explore certified Active Pharmaceutical Ingredients and high-purity industrial solvents.
              </p>
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedCategoryTab('api')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedCategoryTab === 'api' ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: selectedCategoryTab === 'api' ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: selectedCategoryTab === 'api' ? '#FFFFFF' : 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                APIs (94 Items)
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategoryTab('solvents')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedCategoryTab === 'solvents' ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: selectedCategoryTab === 'solvents' ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: selectedCategoryTab === 'solvents' ? '#FFFFFF' : 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Solvents & Chemicals
              </button>
            </div>
          </div>

          {/* Product Cards Grid with Staggered Entrance */}
          {isProductsLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Skeleton key={n} height="220px" />
              ))}
            </div>
          ) : (
            <RevealGroup
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {productsData?.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </RevealGroup>
          )}

          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <Button
              to="/products"
              variant="navy"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              View All 135+ Products in Master Catalog
            </Button>
          </div>
        </Container>
      </Section>

      {/* 7. INDUSTRIES OVERVIEW PREVIEW */}
      {industriesData && industriesData.length > 0 && (
        <Section variant="default">
          <Container>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-8)',
                flexWrap: 'wrap',
                gap: 'var(--space-4)',
              }}
            >
              <div>
                <span className="eyebrow">Market Sectors</span>
                <h2 style={{ marginBottom: 'var(--space-2)' }}>Industries We Serve</h2>
                <LineDraw width={48} height={1} color="var(--color-accent)" style={{ margin: '8px 0 16px 0' }} />
                <p className="body-large" style={{ marginTop: '4px' }}>
                  Delivering compliant chemical formulations tailored to 19 specialized industrial sectors.
                </p>
              </div>

              <Link
                to="/industries"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                  fontSize: '0.9375rem',
                }}
              >
                <span>View All 19 Sectors</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <RevealGroup
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {industriesData.slice(0, 6).map((ind) => (
                <IndustryCard key={ind.id} industry={ind} />
              ))}
            </RevealGroup>
          </Container>
        </Section>
      )}

      {/* 8. CLIENTELE & PARTNERS (Grayscale responsive grid; real logos fade in as ONE group) */}
      {clientele?.clients && clientele.clients.length > 0 && (
        <Section variant="surface">
          <Container>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <span className="eyebrow">Strategic Network</span>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>{clientele.heading || 'OUR CLIENTELE'}</h2>
              <LineDraw width={48} height={1} color="var(--color-accent)" style={{ margin: '8px auto 16px auto' }} />
              {clientele.subheading && (
                <p className="body-large" style={{ marginTop: '4px' }}>
                  {clientele.subheading}
                </p>
              )}
            </div>

            <LogoGrid clients={clientele.clients} />
          </Container>
        </Section>
      )}

      {/* 9. FINAL CTA SECTION */}
      {cta && (
        <CTABand
          heading={cta.heading}
          body={cta.body}
          buttonLabel={cta.button?.label || 'Request a Quote'}
          buttonUrl={cta.button?.url || '/get-a-quote'}
          phone={phone}
        />
      )}
    </>
  );
};
