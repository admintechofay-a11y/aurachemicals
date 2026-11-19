import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Container } from '../common/Container';

export const HomeHero: React.FC = () => {
  return (
    <section className="home-hero">
      <img
        src="/images/hero-scaled.jpg"
        alt="Aura Chemicals Supply Infrastructure"
        className="home-hero-bg"
        fetchPriority="high"
        width={1920}
        height={1080}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/images/pexels-pixabay-247763-scaled.jpg';
        }}
      />
      <div className="home-hero-overlay" />

      <Container>
        <div className="home-hero-content">
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            <span>Trusted since 2014</span>
          </div>

          <h1 className="home-hero-title">
            Pharma & industrial chemicals, delivered reliably.
          </h1>

          <p className="home-hero-sub">
            APIs, solvents and specialty chemicals for manufacturers across India.
          </p>

          <div className="home-hero-actions">
            <Link to="/get-a-quote" className="btn btn-primary btn-lg">
              <span>Get a Quote</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/products" className="btn btn-glass btn-lg">
              <span>Browse Products</span>
            </Link>
          </div>

          <div className="hero-trust-chips">
            <span className="hero-trust-chip">
              <CheckCircle2 size={13} color="var(--color-accent)" />
              <span>94 APIs</span>
            </span>
            <span className="hero-trust-chip">
              <CheckCircle2 size={13} color="var(--color-accent)" />
              <span>19 Industries</span>
            </span>
            <span className="hero-trust-chip">
              <CheckCircle2 size={13} color="var(--color-accent)" />
              <span>IP/BP/USP/EP</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};
