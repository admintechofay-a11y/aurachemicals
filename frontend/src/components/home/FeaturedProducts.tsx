import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';
import { ProductCard } from '../common/ProductCard';
import { VERIFIED_PRODUCTS } from '../../api/verifiedProducts';

export const FeaturedProducts: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Products' },
    { id: 'api', label: 'APIs' },
    { id: 'solvents', label: 'Solvents' },
    { id: 'manufacturing-phosphates', label: 'Phosphates' },
    { id: 'imports', label: 'Imports' },
    { id: 'acids', label: 'Acids' },
  ];

  const displayedProducts = useMemo(() => {
    let list = [...VERIFIED_PRODUCTS];
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category?.slug === activeCategory);
    }
    return list.slice(0, 6);
  }, [activeCategory]);

  return (
    <section className="section" style={{ backgroundColor: 'var(--color-surface-white)', padding: 'clamp(48px, 6vw, 80px) 0' }}>
      <Container>
        <div className="home-section-header">
          <h2 className="home-section-title">Featured catalog</h2>
          <p className="home-section-sub">
            Procure verified manufacturer batches with full technical documentation.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="featured-filter-tabs" role="tablist" aria-label="Chemical categories">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`featured-tab-btn ${activeCategory === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid / Horizontal Scroll Snap on Mobile */}
        <div className="featured-products-container">
          {displayedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="featured-catalog-footer">
          <Link to="/products" className="btn btn-secondary btn-lg" style={{ gap: '8px' }}>
            <span>View all 140+ products</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
};
