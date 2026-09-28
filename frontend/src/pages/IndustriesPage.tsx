import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Factory,
  ArrowRight,
  Search,
  CheckCircle2,
  Building,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { CTABand } from '../components/common/CTABand';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { LineDraw, Reveal } from '../components/common/MotionPrimitives';
import { api } from '../api/client';
import { IndustryDto } from '../api/types';

export const IndustriesPage: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: industries, isLoading, isError, refetch } = useQuery({
    queryKey: ['industries'],
    queryFn: () => api.getIndustries(),
  });

  // Handle hash scrolling when navigated from cards
  useEffect(() => {
    if (location.hash && industries) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash, industries]);

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Industries' }]} />
        <Section padding="dense">
          <Container>
            <Skeleton width="180px" height="20px" style={{ marginBottom: '16px' }} />
            <Skeleton width="60%" height="40px" style={{ marginBottom: '24px' }} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} width="100%" height="280px" />
              ))}
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (isError || !industries) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Industries' }]} />
        <Section>
          <Container>
            <ErrorState
              title="Unable to Load Industries"
              message="Could not retrieve industrial sectors catalog from the server."
              onRetry={refetch}
            />
          </Container>
        </Section>
      </div>
    );
  }

  const filteredIndustries = industries.filter((ind) =>
    ind.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ind.overview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Breadcrumb items={[{ label: 'Industries' }]} />

      {/* Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(48px, 6vw, 72px) 0',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <LineDraw width="32px" height={2} color="var(--color-accent)" style={{ marginBottom: '16px' }} />
            <Reveal immediate>
              <span className="eyebrow">End-Market Expertise</span>
              <h1 style={{ marginBottom: 'var(--space-4)' }}>Industries We Serve</h1>
              <p className="body-large" style={{ color: 'var(--color-text)' }}>
                Aura Space Infra Pvt. Ltd. supplies high-purity APIs, solvents, performance phosphates, and chemical solutions to 19 distinct industrial manufacturing sectors across India and global supply chains.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Directory Quick Navigation & Search */}
      <Section padding="dense" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Container>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                Sector Directory ({industries.length} Verified Industries)
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                Click any sector to jump directly to detailed chemical specifications and applications.
              </p>
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by sector or chemical need..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 36px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Quick jump badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {industries.map((ind) => (
              <a
                key={ind.id}
                href={`#${ind.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {ind.title.split('&')[0].trim()}
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Comprehensive Industry Grid / Sections */}
      <Section padding="normal">
        <Container>
          {filteredIndustries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p className="body-large" style={{ color: 'var(--color-text-muted)' }}>
                No industrial sectors matched &quot;{searchQuery}&quot;.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')} style={{ marginTop: '16px' }}>
                Reset Filter
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {filteredIndustries.map((ind, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <Reveal key={ind.id}>
                    <div
                      id={ind.slug}
                      className="industry-card"
                      style={{
                        scrollMarginTop: '100px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                      }}
                    >
                      {/* Media Column */}
                      <div
                        className="industry-card-image"
                        style={{
                          position: 'relative',
                          minHeight: '260px',
                          backgroundColor: 'var(--color-surface)',
                          order: isEven ? 2 : 1,
                        }}
                      >
                        {ind.image?.url ? (
                          <img
                            src={ind.image.url}
                            alt={ind.image.alt || ind.title}
                            loading="lazy"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100%',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            <div
                              className="card-icon-box"
                              style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(31, 90, 140, 0.08)',
                              }}
                            >
                              <Factory size={40} style={{ color: 'var(--color-secondary)' }} />
                            </div>
                          </div>
                        )}
                        <div
                          style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            backgroundColor: 'rgba(11, 37, 69, 0.85)',
                            color: '#FFFFFF',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-xs)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Sector #{ind.id}
                        </div>
                      </div>

                      {/* Content Column */}
                      <div
                        style={{
                          padding: 'clamp(28px, 4vw, 40px)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          order: isEven ? 1 : 2,
                        }}
                      >
                        <h2
                          style={{
                            fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
                            lineHeight: 1.3,
                            marginBottom: '16px',
                            color: 'var(--color-primary)',
                          }}
                        >
                          {ind.title}
                        </h2>

                        <p
                          style={{
                            color: 'var(--color-text)',
                            lineHeight: 1.65,
                            fontSize: '0.95rem',
                            marginBottom: '24px',
                          }}
                        >
                          {ind.overview}
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                            marginTop: 'auto',
                            paddingTop: '16px',
                            borderTop: '1px solid var(--color-border)',
                          }}
                        >
                          <Button
                            to={`/get-a-quote?industry=${encodeURIComponent(ind.title)}`}
                            variant="primary"
                            size="sm"
                          >
                            Request Quote for {ind.title.split(' ')[0]} <ArrowRight size={14} />
                          </Button>
                          <Button
                            to="/products"
                            variant="outline"
                            size="sm"
                          >
                            Explore Matching Chemicals
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </Section>

      {/* Global CTA Band */}
      <CTABand
        heading="Custom Chemical Formulations & Volume Allocations"
        body="Need high-volume supplies or tailored compound sourcing for your plant? Contact our technical procurement team today."
        buttonLabel="Request a Quote"
        buttonUrl="/get-a-quote"
        phone="+91 7220000877"
      />
    </>
  );
};
