import React from 'react';
import clsx from 'clsx';

interface SectionHeadingProps {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  inverse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  eyebrow,
  title,
  description,
  align = 'left',
  inverse = false,
  className,
  style,
}) => {
  return (
    <div
      className={clsx('section-heading', className)}
      style={{
        textAlign: align,
        maxWidth: align === 'center' ? '760px' : '880px',
        margin: align === 'center' ? '0 auto var(--space-8) auto' : '0 0 var(--space-8) 0',
        ...style,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        marginBottom: 'var(--space-2)'
      }}>
        {index && (
          <span className="section-index" style={{ color: inverse ? 'var(--color-teal-border)' : 'var(--color-teal)' }}>
            {index}
          </span>
        )}
        {index && eyebrow && (
          <span style={{ color: 'var(--color-rule-strong)', fontSize: '0.75rem' }}>/</span>
        )}
        {eyebrow && (
          <span
            className="eyebrow"
            style={{
              marginBottom: 0,
              color: inverse ? 'var(--color-text-muted-dark)' : 'var(--color-text-muted)',
            }}
          >
            {eyebrow}
          </span>
        )}
      </div>

      <h2
        style={{
          color: inverse ? 'var(--color-text-on-dark)' : 'var(--color-ink-navy)',
          marginBottom: description ? 'var(--space-3)' : 0,
        }}
      >
        {title}
      </h2>

      {description && (
        <p
          className="body-large"
          style={{
            color: inverse ? 'var(--color-text-muted-dark)' : 'var(--color-text-secondary)',
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
