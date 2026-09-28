import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { UI_LABELS } from '@/utils/constants';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = UI_LABELS.ERROR_GENERIC_TITLE,
  message = UI_LABELS.ERROR_GENERIC_DESC,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      style={{
        padding: 'var(--space-8) var(--space-6)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        maxWidth: '560px',
        margin: 'var(--space-8) auto',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-error-bg)',
          color: 'var(--color-error)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
        }}
      >
        <AlertCircle size={24} />
      </div>
      <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-muted)', marginBottom: onRetry ? 'var(--space-6)' : 0 }}>
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          icon={<RefreshCw size={14} />}
          iconPosition="left"
        >
          {UI_LABELS.BTN_RETRY}
        </Button>
      )}
    </div>
  );
};
