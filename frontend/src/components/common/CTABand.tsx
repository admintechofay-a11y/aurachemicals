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
      className="cta-band-dark"
      style={{
        backgroundColor: 'var(--color-ink)',
        color: 'var(--color-paper)',
        padding: 'clamp(56px, 7vw, 96px) 0',
        position: 'relative',
        borderTop: '1px solid rgba(213, 217, 220, 0.12)',
      }}
    >
      <Container>
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {heading && (
            <h2
              style={{
                color: 'var(--color-paper)',
                marginBottom: 'var(--space-4)',
                textAlign: 'center',
              }}
            >
              {heading}
            </h2>
          )}
          {body && (
            <p
              className="body-large"
              style={{
                color: 'rgba(244, 245, 245, 0.85)',
                marginBottom: 'var(--space-8)',
                lineHeight: 1.6,
                margin: '0 auto var(--space-8) auto',
                textAlign: 'center',
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
              style={{
                backgroundColor: 'var(--color-paper)',
                color: 'var(--color-ink)',
                borderColor: 'var(--color-paper)',
              }}
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
                  color: 'var(--color-paper)',
                  borderColor: 'rgba(244, 245, 245, 0.35)',
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
