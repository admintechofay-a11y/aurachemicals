import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, ArrowRight } from 'lucide-react';
import { CASBadge } from './CASBadge';
import { useRFQ } from '../../context/RFQContext';

export interface ProductRowProps {
  slug: string;
  chemical_name: string;
  cas_number?: string | null;
  category_name?: string;
  category_slug?: string;
  therapeutic_category?: string | null;
  grade?: string | null;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  slug,
  chemical_name,
  cas_number,
  category_name,
  therapeutic_category,
  grade,
}) => {
  const { addItem, isInBasket } = useRFQ();
  const inBasket = isInBasket(slug);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      slug,
      chemical_name,
      cas_number: cas_number || undefined,
      category: category_name,
      grade: grade || undefined,
    });
  };

  return (
    <tr className="product-table-row">
      {/* Chemical Name & Monograph Link */}
      <td>
        <Link
          to={`/products/detail/${slug}`}
          style={{ fontWeight: 600, color: 'var(--color-ink-navy)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>{chemical_name}</span>
          <ArrowRight size={14} style={{ opacity: 0.6 }} />
        </Link>
      </td>

      {/* CAS Number with Copy */}
      <td>
        {cas_number ? (
          <CASBadge cas={cas_number} />
        ) : (
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>—</span>
        )}
      </td>

      {/* Category & Therapeutic Classification */}
      <td>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>
            {category_name || 'Chemical'}
          </span>
          {therapeutic_category && (
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
              {therapeutic_category}
            </span>
          )}
        </div>
      </td>

      {/* Grade / Standards */}
      <td>
        <span style={{
          display: 'inline-block',
          padding: '2px 8px',
          backgroundColor: 'var(--color-paper-subtle)',
          borderRadius: 'var(--radius-xs)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-family-mono)',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-rule)'
        }}>
          {grade || 'Pharma / Technical'}
        </span>
      </td>

      {/* Actions */}
      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        <button
          type="button"
          onClick={handleAdd}
          className={inBasket ? 'btn btn-secondary btn-sm' : 'btn btn-teal btn-sm'}
          style={{ gap: '6px' }}
          aria-label={inBasket ? `${chemical_name} in quotation basket` : `Add ${chemical_name} to quotation basket`}
        >
          {inBasket ? (
            <>
              <Check size={14} />
              <span>In RFQ Basket</span>
            </>
          ) : (
            <>
              <Plus size={14} />
              <span>Add to RFQ</span>
            </>
          )}
        </button>
      </td>
    </tr>
  );
};
