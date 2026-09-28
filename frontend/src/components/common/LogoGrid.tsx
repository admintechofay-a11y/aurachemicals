import React from 'react';
import { ClientBadgeDto } from '../../api/types';
import { Reveal } from './MotionPrimitives';

interface LogoGridProps {
  clients?: ClientBadgeDto[];
  className?: string;
}

export const LogoGrid: React.FC<LogoGridProps> = ({ clients = [], className }) => {
  if (!clients || clients.length === 0) return null;

  return (
    <Reveal duration={0.4} className={className}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 'var(--space-4)',
          alignItems: 'center',
        }}
      >
        {clients.map((client) => (
          <div
            key={client.id}
            style={{
              height: '84px',
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
            }}
            className="client-logo-item"
          >
            <img
              src={client.logo_url}
              alt={client.name}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
              }}
              style={{
                maxHeight: '48px',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        ))}
      </div>
    </Reveal>
  );
};
