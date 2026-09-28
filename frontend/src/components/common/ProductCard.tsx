import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { ProductDto } from '../../api/types';
import { UI_LABELS } from '../../utils/constants';

interface ProductCardProps {
  product: ProductDto;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card
      hoverable
      className="product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Product Image if available in CMS */}
      {product.image?.url && (
        <div
          className="product-card-image"
          style={{
            height: '160px',
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            margin: 'calc(-1 * var(--space-6)) calc(-1 * var(--space-6)) var(--space-4) calc(-1 * var(--space-6))',
            width: 'calc(100% + (2 * var(--space-6)))',
          }}
        >
          <img
            src={product.image.url}
            alt={product.image.alt || product.chemical_name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* Category Tag & CAS Code Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: 'var(--space-3)',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--color-secondary)',
          }}
        >
          {product.category.name}
        </span>

        {product.cas_number && (
          <span className="cas-badge">
            <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>CAS:</span>
            {product.cas_number}
          </span>
        )}
      </div>

      {/* Chemical Title */}
      <h3
        style={{
          fontSize: '1.25rem',
          lineHeight: 1.3,
          marginBottom: 'var(--space-2)',
          color: 'var(--color-primary)',
        }}
      >
        <Link
          to={`/products/${product.slug}`}
          style={{
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          {product.chemical_name}
        </Link>
      </h3>

      {/* Therapeutic / Technical Category */}
      {product.therapeutic_category && (
        <div
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-muted)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <strong>Class:</strong> {product.therapeutic_category}
        </div>
      )}

      {/* Grade info if present */}
      {product.grade && (
        <div
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-secondary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <strong>Grade:</strong> {product.grade}
        </div>
      )}

      {/* Short description if present */}
      {product.short_description && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text)',
            lineHeight: 1.5,
            marginBottom: 'var(--space-6)',
            flex: 1,
          }}
        >
          {product.short_description}
        </p>
      )}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
          marginTop: 'auto',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <Link
          to={`/products/${product.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-secondary)',
          }}
        >
          <span>{UI_LABELS.BTN_VIEW_PRODUCT}</span>
          <ArrowRight size={14} className="product-card-arrow" />
        </Link>

        <Button
          to={`/get-a-quote?product=${encodeURIComponent(product.chemical_name)}&cas=${encodeURIComponent(product.cas_number || '')}`}
          variant="outline"
          size="sm"
        >
          {UI_LABELS.BTN_REQUEST_QUOTE}
        </Button>
      </div>
    </Card>
  );
};
