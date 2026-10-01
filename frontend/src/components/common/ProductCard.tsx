import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, ArrowRight, FileText } from 'lucide-react';
import { ProductDto } from '../../api/types';
import { CASBadge } from './CASBadge';
import { SpecRow } from './SpecRow';
import { useRFQ } from '../../context/RFQContext';

interface ProductCardProps {
  product: ProductDto;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, isInBasket } = useRFQ();
  const inBasket = isInBasket(product.slug);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      slug: product.slug,
      chemical_name: product.chemical_name,
      cas_number: product.cas_number || undefined,
      category: product.category?.name,
      grade: product.grade || undefined,
    });
  };

  return (
    <article className="product-card">
      {/* Category Eyebrow & CAS Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: 'var(--space-3)',
        paddingBottom: 'var(--space-2)',
        borderBottom: '1px solid var(--color-rule)'
      }}>
        <span className="eyebrow" style={{ marginBottom: 0, fontSize: '0.6875rem' }}>
          {product.category?.name || 'Chemical'}
        </span>
        {product.cas_number && <CASBadge cas={product.cas_number} />}
      </div>

      {/* Chemical Headline */}
      <Link to={`/products/detail/${product.slug}`} style={{ textDecoration: 'none' }}>
        <h3 className="product-card-title" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
          {product.chemical_name}
        </h3>
      </Link>

      {/* Technical Specification Rows */}
      <div style={{ margin: 'var(--space-3) 0', flex: 1 }}>
        {product.therapeutic_category && (
          <SpecRow label="Therapeutic" value={product.therapeutic_category} />
        )}
        {product.grade && (
          <SpecRow label="Monograph" value={product.grade} isMono />
        )}
        <SpecRow label="Regulatory" value="Commercial / Manufacturing" />
      </div>

      {/* Card Action Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: 'var(--space-4)',
        paddingTop: 'var(--space-3)',
        borderTop: '1px solid var(--color-rule)'
      }}>
        <button
          type="button"
          onClick={handleAdd}
          className={inBasket ? 'btn btn-secondary btn-sm' : 'btn btn-teal btn-sm'}
          style={{ flex: 1, gap: '6px' }}
          aria-label={inBasket ? `${product.chemical_name} in quote basket` : `Add ${product.chemical_name} to quotation basket`}
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

        <Link
          to={`/products/detail/${product.slug}`}
          className="btn btn-outline btn-sm"
          style={{ padding: '8px 12px' }}
          title={`View full technical datasheet for ${product.chemical_name}`}
          aria-label={`Datasheet for ${product.chemical_name}`}
        >
          <FileText size={14} />
        </Link>
      </div>
    </article>
  );
};
