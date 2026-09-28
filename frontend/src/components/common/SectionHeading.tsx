import React from 'react';
import clsx from 'clsx';
import { LineDraw } from './MotionPrimitives';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  inverse?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  inverse = false,
  className,
}) => {
  return (
    <div
      className={clsx('section-heading', className)}
      style={{
        textAlign: align,
        maxWidth: align === 'center' ? '760px' : '840px',
        margin: align === 'center' ? '0 auto var(--space-10) auto' : '0 0 var(--space-8) 0',
      }}
    >
      {eyebrow && (
        <span
          className="eyebrow"
          style={{
            color: inverse ? 'var(--color-accent)' : undefined,
          }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        style={{
          color: inverse ? 'var(--color-text-inverse)' : 'var(--color-primary)',
          marginBottom: 'var(--space-2)',
        }}
      >
        {title}
      </h2>

      {/* Signature Technical Hairline Accent Line (draws in from left, 500ms, once) */}
      <LineDraw
        width={48}
        height={1}
        color={inverse ? 'var(--color-accent)' : 'var(--color-accent)'}
        style={{
          margin: align === 'center' ? '8px auto 16px auto' : '8px 0 16px 0',
        }}
      />

      {description && (
        <p
          className="body-large"
          style={{
            color: inverse ? 'rgba(255, 255, 255, 0.82)' : 'var(--color-muted)',
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
