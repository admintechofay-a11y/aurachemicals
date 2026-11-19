import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';
import { api } from '../../api/client';

export const FinalCTA: React.FC = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  const phone = settings?.company?.phone || '+91 97274 04415';
  const whatsappUrl = 'https://wa.me/917220000877?text=Hello%20Aura%20Chemicals%2C%20I%20would%20like%20to%20request%20a%20commercial%20quote.';

  return (
    <section className="section" style={{ padding: 'clamp(48px, 6vw, 80px) 0' }}>
      <Container>
        <div className="final-cta-band">
          <div className="final-cta-inner">
            <h2 className="final-cta-title">Need a quote today?</h2>
            <p className="final-cta-sub">
              Speak with our sourcing desk for immediate pricing and availability.
            </p>

            <div className="final-cta-buttons">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="btn btn-glass btn-lg"
              >
                <Phone size={18} />
                <span>Call {phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass btn-lg"
              >
                <MessageCircle size={18} color="#25D366" />
                <span>WhatsApp Desk</span>
              </a>

              <Link
                to="/get-a-quote"
                className="btn btn-primary btn-lg"
              >
                <span>Request Quote</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
