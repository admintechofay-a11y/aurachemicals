import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactElement;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  error,
  hint,
  children,
}) => {
  return (
    <div style={{ marginBottom: 'var(--space-4)', width: '100%' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-primary)',
          marginBottom: '6px',
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--color-error)', marginLeft: '4px' }}>*</span>}
      </label>

      {React.cloneElement(children, {
        id,
        'aria-invalid': !!error,
        'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
        style: {
          width: '100%',
          padding: '10px 14px',
          fontSize: '0.9375rem',
          backgroundColor: 'var(--color-bg)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-text)',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color var(--motion-duration-fast) var(--motion-ease), box-shadow var(--motion-duration-fast) var(--motion-ease)',
          ...(children.props.style || {}),
        },
      })}

      {hint && !error && (
        <p
          id={`${id}-hint`}
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-muted)',
            marginTop: '4px',
          }}
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-error)',
            marginTop: '4px',
            fontWeight: 500,
            animation: 'feedbackFadeIn 150ms var(--motion-ease) forwards',
          }}
        >
          {error}
        </p>
      )}

      <style>{`
        @keyframes feedbackFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
