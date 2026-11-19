import React from 'react';
import { Container } from '../common/Container';

export const ProcessSteps: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Send Enquiry',
      desc: 'Submit requirements online or via WhatsApp desk.',
    },
    {
      num: '2',
      title: 'Get Quotation',
      desc: 'Receive formal pricing and batch availability fast.',
    },
    {
      num: '3',
      title: 'Receive CoA & Docs',
      desc: 'Review batch certificates and compliance sheets.',
    },
    {
      num: '4',
      title: 'Site Delivery',
      desc: 'Prompt ISO tanker, drum, or freight dispatch.',
    },
  ];

  return (
    <section className="section" style={{ padding: 'clamp(48px, 6vw, 80px) 0' }}>
      <Container>
        <div className="home-section-header">
          <h2 className="home-section-title">How it works</h2>
          <p className="home-section-sub">
            Transparent commercial sourcing from enquiry to plant delivery.
          </p>
        </div>

        <div className="process-grid">
          {steps.map((s) => (
            <div key={s.num} className="process-card">
              <div className="process-number">{s.num}</div>
              <h3 className="process-title">{s.title}</h3>
              <p className="process-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
