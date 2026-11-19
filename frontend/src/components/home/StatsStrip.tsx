import React from 'react';
import { Container } from '../common/Container';

export const StatsStrip: React.FC = () => {
  const stats = [
    { number: 'Est. 2014', label: 'ROC Ahmedabad' },
    { number: '94', label: 'Monograph APIs' },
    { number: '19', label: 'Industries Served' },
    { number: '400+', label: 'Manufacturers' },
  ];

  return (
    <div className="stats-strip-wrapper">
      <Container>
        <div className="stats-card">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-number tabular-nums">{s.number}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
