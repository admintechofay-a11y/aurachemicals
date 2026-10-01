import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Plus, Check } from 'lucide-react';
import { VERIFIED_PRODUCTS } from '../../api/verifiedProducts';
import { CASBadge } from './CASBadge';
import { useRFQ } from '../../context/RFQContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addItem, isInBasket } = useRFQ();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredProducts = React.useMemo(() => {
    if (!query.trim()) {
      // Default to 8 prominent APIs & solvents
      return VERIFIED_PRODUCTS.slice(0, 8);
    }
    const q = query.toLowerCase().trim();
    return VERIFIED_PRODUCTS.filter(
      (p) =>
        p.chemical_name.toLowerCase().includes(q) ||
        (p.cas_number && p.cas_number.includes(q)) ||
        (p.therapeutic_category && p.therapeutic_category.toLowerCase().includes(q)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(q))
    ).slice(0, 12);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredProducts.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredProducts[selectedIndex]) {
          const prod = filteredProducts[selectedIndex];
          onClose();
          navigate(`/products/detail/${prod.slug}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredProducts, selectedIndex, onClose, navigate]);

  if (!isOpen) return null;

  return (
    <div
      className="cmd-palette-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search Chemical Catalog"
    >
      <div
        className="cmd-palette-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={20} style={{ position: 'absolute', left: '20px', color: 'var(--color-text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search 140+ chemicals by name, CAS number (e.g. 103-90-2), or grade..."
            className="cmd-palette-input"
            style={{ paddingLeft: '52px', paddingRight: '44px' }}
          />
          <button
            type="button"
            onClick={onClose}
            style={{ position: 'absolute', right: '16px', color: 'var(--color-text-muted)' }}
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
                No chemical found matching &ldquo;{query}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/get-a-quote?product=${encodeURIComponent(query)}`);
                }}
                className="btn btn-outline btn-sm"
              >
                Request custom sourcing for &ldquo;{query}&rdquo;
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                padding: '6px 12px',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-family-mono)',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                {query.trim() ? `Search Results (${filteredProducts.length})` : 'Popular Catalog Items'}
              </div>
              {filteredProducts.map((p, idx) => {
                const isSelected = idx === selectedIndex;
                const inBasket = isInBasket(p.slug);

                return (
                  <div
                    key={p.slug}
                    onClick={() => {
                      onClose();
                      navigate(`/products/detail/${p.slug}`);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: isSelected ? 'var(--color-paper-subtle)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--color-teal)' : '3px solid transparent',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-xs)',
                      transition: 'background-color 100ms'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-ink-navy)', fontSize: '0.9375rem' }}>
                          {p.chemical_name}
                        </span>
                        {p.cas_number && <CASBadge cas={p.cas_number} showCopy={false} />}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {p.category?.name} {p.therapeutic_category ? `· ${p.therapeutic_category}` : ''}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem({
                            slug: p.slug,
                            chemical_name: p.chemical_name,
                            cas_number: p.cas_number || undefined,
                            category: p.category?.name,
                            grade: p.grade || undefined,
                          });
                        }}
                        className={inBasket ? 'btn btn-secondary btn-sm' : 'btn btn-outline btn-sm'}
                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                      >
                        {inBasket ? <><Check size={12} /> In RFQ</> : <><Plus size={12} /> RFQ</>}
                      </button>
                      <ArrowRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--color-rule)',
          backgroundColor: 'var(--color-paper)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.6875rem',
          fontFamily: 'var(--font-family-mono)',
          color: 'var(--color-text-muted)'
        }}>
          <div>
            <span>↑↓ Navigate</span>
            <span style={{ margin: '0 8px' }}>·</span>
            <span>↵ Select Datasheet</span>
            <span style={{ margin: '0 8px' }}>·</span>
            <span>Esc Close</span>
          </div>
          <span>AURA CHEMICALS SPEC SEARCH</span>
        </div>
      </div>
    </div>
  );
};
