import React from 'react';

interface SpecRowProps {
  label: string;
  value: React.ReactNode;
  isMono?: boolean;
  className?: string;
}

export const SpecRow: React.FC<SpecRowProps> = ({ label, value, isMono = false, className = '' }) => {
  if (value === null || value === undefined || value === '') return null;

  return (
    <div className={`spec-row ${className}`}>
      <span className="spec-label">{label}</span>
      <span className={`spec-value ${isMono ? 'spec-value-mono tabular-nums' : ''}`}>
        {value}
      </span>
    </div>
  );
};

interface SpecTableProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const SpecTable: React.FC<SpecTableProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`spec-table-container ${className}`}>
      {title && (
        <div style={{
          paddingBottom: '8px',
          marginBottom: '8px',
          borderBottom: '2px solid var(--color-ink-navy)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline'
        }}>
          <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-navy)', margin: 0, fontWeight: 600 }}>
            {title}
          </h3>
          <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
            VERIFIED MONOGRAPH
          </span>
        </div>
      )}
      <div className="spec-table">
        {children}
      </div>
    </div>
  );
};
