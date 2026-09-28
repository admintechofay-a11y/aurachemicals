import React from 'react';
import { ProductCategoryDto } from '../../api/types';
import { UI_LABELS } from '../../utils/constants';

interface FilterBarProps {
  categories: ProductCategoryDto[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        WebkitOverflowScrolling: 'touch',
      }}
      className="filter-bar"
    >
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        style={{
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.875rem',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          border: '1px solid',
          borderColor: activeCategory === 'all' ? 'var(--color-primary)' : 'var(--color-border)',
          backgroundColor: activeCategory === 'all' ? 'var(--color-primary)' : 'var(--color-bg)',
          color: activeCategory === 'all' ? '#FFFFFF' : 'var(--color-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {UI_LABELS.FILTER_ALL_CATEGORIES}
      </button>

      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat.slug}
            type="button"
            onClick={() => onSelectCategory(cat.slug)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              border: '1px solid',
              borderColor: isActive ? 'var(--color-secondary)' : 'var(--color-border)',
              backgroundColor: isActive ? 'var(--color-surface)' : 'var(--color-bg)',
              color: isActive ? 'var(--color-secondary)' : 'var(--color-text)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{cat.name}</span>
            {cat.count > 0 && (
              <span
                style={{
                  marginLeft: '6px',
                  fontSize: '0.75rem',
                  opacity: 0.7,
                }}
              >
                ({cat.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
