import React from 'react';
import { PackageOpen } from 'lucide-react';
import { UI_LABELS } from '@/utils/constants';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = UI_LABELS.EMPTY_PRODUCTS_TITLE,
  message = UI_LABELS.EMPTY_PRODUCTS_DESC,
  action,
}) => {
  return (
    <div
      style={{
        padding: 'var(--space-12) var(--space-6)',
        backgroundColor: 'var(--color-surface)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        margin: 'var(--space-6) 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
          border: '1px solid var(--color-border)',
        }}
      >
        <PackageOpen size={28} />
      </div>
      <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>
      <p
        style={{
          color: 'var(--color-muted)',
          maxWidth: '460px',
          margin: '0 auto',
          marginBottom: action ? 'var(--space-6)' : 0,
        }}
      >
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
