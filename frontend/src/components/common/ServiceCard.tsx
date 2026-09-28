import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from './Card';
import { ServiceDto } from '../../api/types';

interface ServiceCardProps {
  service: ServiceDto;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-secondary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <ShieldCheck size={24} />
      </div>

      <h3
        style={{
          fontSize: '1.25rem',
          lineHeight: 1.3,
          marginBottom: 'var(--space-3)',
          color: 'var(--color-primary)',
        }}
      >
        {service.title}
      </h3>

      <p
        style={{
          fontSize: '0.9375rem',
          color: 'var(--color-text)',
          lineHeight: 1.6,
          marginBottom: 'var(--space-6)',
        }}
      >
        {service.description}
      </p>

      {service.capabilities && service.capabilities.length > 0 && (
        <div style={{ marginTop: 'auto' }}>
          <h4
            style={{
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-muted)',
              marginBottom: 'var(--space-3)',
            }}
          >
            Capabilities & Compliance
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {service.capabilities.map((cap, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text)',
                  marginBottom: '8px',
                  lineHeight: 1.5,
                }}
              >
                <CheckCircle2
                  size={16}
                  style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '3px' }}
                />
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {service.standards && (
        <div
          style={{
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.8125rem',
            color: 'var(--color-muted)',
          }}
        >
          <strong>Codes & Standards:</strong> {service.standards}
        </div>
      )}
    </Card>
  );
};
