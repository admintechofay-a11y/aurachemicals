import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from './Card';
import { IndustryDto } from '../../api/types';

interface IndustryCardProps {
  industry: IndustryDto;
}

export const IndustryCard: React.FC<IndustryCardProps> = ({ industry }) => {
  return (
    <Card
      hoverable
      padding="none"
      className="industry-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Featured Photo */}
      {industry.image?.url && (
        <div
          style={{
            height: '180px',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <img
            src={industry.image.url}
            alt={industry.image.alt || industry.title}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/water-treatment-plant.jpg';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div
        style={{
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <h3
          style={{
            fontSize: '1.1875rem',
            lineHeight: 1.3,
            marginBottom: 'var(--space-3)',
            color: 'var(--color-primary)',
          }}
        >
          {industry.title}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text)',
            lineHeight: 1.6,
            marginBottom: 'var(--space-6)',
            flex: 1,
          }}
        >
          {industry.overview.length > 180
            ? `${industry.overview.slice(0, 180)}...`
            : industry.overview}
        </p>

        <Link
          to={`/industries#${industry.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-accent)',
            marginTop: 'auto',
          }}
        >
          <span>View Industry Applications</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </Card>
  );
};
