import React from 'react';
import { Container } from './Container';
import { Button } from './Button';
import { ArrowRight, PhoneCall } from 'lucide-react';

interface CTABandProps {
  heading?: string;
  body?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  phone?: string;
}

export const CTABand: React.FC<CTABandProps> = ({
  heading,
  body,
  buttonLabel = 'Request a Quote',
  buttonUrl = '/get-a-quote',
  phone,
}) => {
  if (!heading && !body) return null;

  return (
    <section
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text-inverse)',
        padding: 'clamp(64px, 8vw, 96px) 0',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {heading && (
            <h2
              style={{
                color: 'var(--color-text-inverse)',
                marginBottom: 'var(--space-4)',
              }}
            >
              {heading}
            </h2>
          )}
          {body && (
            <p
              className="body-large"
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                marginBottom: 'var(--space-8)',
                lineHeight: 1.6,
              }}
            >
              {body}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
            }}
          >
            <Button
              to={buttonUrl}
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              {buttonLabel}
            </Button>

            {phone && (
              <Button
                href={`tel:${phone.replace(/\s+/g, '')}`}
                variant="outline"
                size="lg"
                style={{
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
                icon={<PhoneCall size={18} />}
                iconPosition="left"
              >
                {phone}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};
