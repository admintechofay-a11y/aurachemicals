import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { api } from '../../api/client';

export const IndustryChips: React.FC = () => {
  const { data: industries = [] } = useQuery({
    queryKey: ['industries'],
    queryFn: () => api.getIndustries(),
  });

  const first12 = industries.slice(0, 12);

  return (
    <div className="industries-chips-wrap">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span className="principals-label">Industries Served</span>
        <Link to="/industries" style={{ fontSize: '0.8125rem', color: 'var(--color-teal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span>View all 19</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="industries-scroll-row" role="list" aria-label="Industries served">
        {first12.map((ind) => (
          <Link
            key={ind.id}
            to={`/industries#${ind.slug || ind.id}`}
            className="industry-chip-pill"
            role="listitem"
          >
            <span>{ind.title}</span>
          </Link>
        ))}

        <Link to="/industries" className="industry-chip-pill industry-chip-more">
          <span>+7 more</span>
        </Link>
      </div>
    </div>
  );
};
