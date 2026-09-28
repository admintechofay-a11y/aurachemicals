import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Phone, Mail, ChevronRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { SettingsDto } from '../api/types';
import { UI_LABELS } from '../utils/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SettingsDto;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, settings }) => {
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Handle ESC key, focus trap, and scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Auto-focus the close button for accessibility
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const phone = settings?.company?.phone;
  const email = settings?.company?.email;

  const links = [
    { label: UI_LABELS.NAV_HOME, path: '/' },
    { label: UI_LABELS.NAV_ABOUT, path: '/about-us' },
    { label: 'Active Pharmaceutical Ingredients (APIs)', path: '/products/api' },
    { label: 'Solvents & Intermediates', path: '/products/solvents' },
    { label: 'All Products (Master Catalog)', path: '/products' },
    { label: UI_LABELS.NAV_INDUSTRIES, path: '/industries' },
    { label: UI_LABELS.NAV_SERVICES, path: '/services' },
    { label: UI_LABELS.NAV_MISSION, path: '/our-mission' },
    { label: UI_LABELS.NAV_CONTACT, path: '/contact' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
      }}
    >
      {/* Backdrop with 250ms fade */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(11, 37, 69, 0.65)',
          backdropFilter: 'blur(3px)',
          animation: 'backdropFade 250ms var(--motion-ease) forwards',
        }}
      />

      {/* Drawer with 250ms slide from right */}
      <div
        ref={drawerRef}
        style={{
          position: 'relative',
          marginLeft: 'auto',
          width: '100%',
          maxWidth: '380px',
          height: '100%',
          backgroundColor: 'var(--color-bg)',
          boxShadow: 'var(--shadow-hover)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          zIndex: 2001,
          animation: 'drawerSlide 250ms var(--motion-ease) forwards',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Navigation Menu
          </span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={UI_LABELS.CLOSE_MENU}
            style={{
              width: '40px',
              height: '40px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--color-primary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '16px 0', flex: 1 }}>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  fontSize: '0.9375rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-primary)',
                  backgroundColor: isActive ? 'var(--color-surface)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
                  textDecoration: 'none',
                }}
              >
                <span>{link.label}</span>
                <ChevronRight size={16} style={{ color: 'var(--color-muted)', opacity: 0.6 }} />
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer & Direct Contacts */}
        <div
          style={{
            padding: '20px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <Button
            to="/get-a-quote"
            variant="primary"
            size="lg"
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {UI_LABELS.NAV_GET_A_QUOTE}
          </Button>

          {phone && (
            <div style={{ marginBottom: '8px' }}>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--color-primary)',
                  fontWeight: 500,
                }}
              >
                <Phone size={14} style={{ color: 'var(--color-accent)' }} />
                <span>{phone}</span>
              </a>
            </div>
          )}

          {email && (
            <div>
              <a
                href={`mailto:${email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--color-muted)',
                }}
              >
                <Mail size={14} style={{ color: 'var(--color-accent)' }} />
                <span>{email}</span>
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes backdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawerSlide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
