import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Container } from './Container';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '12px 0',
        fontSize: '0.875rem',
      }}
    >
      <Container>
        <ol
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            listStyle: 'none',
          }}
        >
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--color-muted)',
              }}
            >
              <Home size={14} />
              <span>Home</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ChevronRight size={14} style={{ color: 'var(--color-muted)', opacity: 0.6 }} />
                {item.url && !isLast ? (
                  <Link
                    to={item.url}
                    style={{
                      color: 'var(--color-muted)',
                      textDecoration: 'none',
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    style={{
                      color: 'var(--color-primary)',
                      fontWeight: 500,
                    }}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
};
