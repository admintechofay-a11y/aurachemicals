import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, MessageCircle, FileText, Plus } from 'lucide-react';
import { useRFQ } from '../../context/RFQContext';
import { CASBadge } from './CASBadge';

export const RFQBasketDrawer: React.FC = () => {
  const { items, removeItem, updateItem, clearBasket, isDrawerOpen, closeDrawer, totalCount } = useRFQ();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleProceed = () => {
    closeDrawer();
    navigate('/get-a-quote');
  };

  const generateWhatsAppUrl = () => {
    let msg = `Hello Aura Chemicals, I would like to request a commercial quote for:\n\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.chemical_name} ${item.cas_number ? `(CAS: ${item.cas_number})` : ''} - Vol: ${item.quantity || ''} ${item.unit || 'kg'} - Grade: ${item.grade || 'Standard'}\n`;
    });
    msg += `\nPlease share pricing, current availability, and specification CoAs.`;
    return `https://wa.me/919727404415?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="rfq-drawer-backdrop"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className="rfq-drawer-panel"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rfq-drawer-title"
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-rule)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-paper-subtle)'
        }}>
          <div>
            <span className="eyebrow" style={{ marginBottom: 2 }}>Commercial Procurement</span>
            <h2 id="rfq-drawer-title" style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-ink-navy)' }}>
              Quotation Basket ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="btn-outline btn-sm"
            style={{ padding: '6px 10px' }}
            aria-label="Close Quotation Basket"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px'
        }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <FileText size={48} style={{ color: 'var(--color-rule-strong)', margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Your quotation basket is empty</h3>
              <p className="body-small" style={{ marginBottom: '24px' }}>
                Search our catalog of 94 APIs, solvents, and phosphates to build a multi-item commercial RFQ.
              </p>
              <button
                type="button"
                onClick={() => { closeDrawer(); navigate('/products'); }}
                className="btn btn-primary"
              >
                Browse Chemical Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item, index) => (
                <div
                  key={item.slug || index}
                  style={{
                    padding: '16px',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--color-surface-white)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'var(--color-ink-navy)', marginBottom: '4px' }}>
                        {item.chemical_name}
                      </h4>
                      {item.cas_number && <CASBadge cas={item.cas_number} />}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      style={{ color: 'var(--color-text-muted)', padding: '4px' }}
                      title="Remove product from RFQ"
                      aria-label={`Remove ${item.chemical_name} from quote basket`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Quantity & Unit Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                        Target Volume
                      </label>
                      <input
                        type="text"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(item.slug, { quantity: e.target.value })}
                        placeholder="e.g. 500"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                        Unit
                      </label>
                      <select
                        value={item.unit || 'kg'}
                        onChange={(e) => updateItem(item.slug, { unit: e.target.value })}
                        className="form-select"
                        style={{ padding: '6px 10px', fontSize: '0.875rem' }}
                      >
                        <option value="kg">Kilograms (kg)</option>
                        <option value="MT">Metric Tons (MT)</option>
                        <option value="L">Liters (L)</option>
                        <option value="Drums">Standard Drums</option>
                        <option value="IBC">IBC Tanks (1000L)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => { closeDrawer(); navigate('/products'); }}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Plus size={14} /> Add Another Chemical
                </button>
                <button
                  type="button"
                  onClick={clearBasket}
                  style={{ fontSize: '0.75rem', color: 'var(--color-error)', textDecoration: 'underline' }}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--color-rule)',
            backgroundColor: 'var(--color-paper-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={handleProceed}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span>Proceed to Commercial Quote ({totalCount} items)</span>
              <ArrowRight size={18} />
            </button>

            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
            >
              <MessageCircle size={18} color="#25D366" />
              <span>Inquire via WhatsApp Desk</span>
            </a>
          </div>
        )}
      </aside>
    </>
  );
};
