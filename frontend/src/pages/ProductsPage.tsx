import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  ArrowRight,
  ChevronDown,
  X,
  FileCheck,
  Plus,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/common/ProductCard';
import { ProductRow } from '../components/common/ProductRow';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Skeleton } from '../components/common/Skeleton';
import { api } from '../api/client';
import { ProductDto } from '../api/types';

export const ProductsPage: React.FC = () => {
  const { category: routeCategory, slugOrCategory } = useParams<{ category?: string; slugOrCategory?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const currentCategorySlug = routeCategory || slugOrCategory || searchParams.get('category') || 'all';
  const selectedIndustry = searchParams.get('industry') || '';

  // Data fetching
  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => api.getProductCategories(),
  });

  const { data: industries = [] } = useQuery({
    queryKey: ['industries'],
    queryFn: () => api.getIndustries(),
  });

  const {
    data: productsData,
    isLoading: isProdLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', currentCategorySlug, searchQuery, selectedIndustry],
    queryFn: () =>
      api.getProducts({
        category: currentCategorySlug !== 'all' ? currentCategorySlug : undefined,
        search: searchQuery || undefined,
        industry: selectedIndustry || undefined,
        per_page: 500,
      }),
  });

  // Alphabetical letters available
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Filter products by letter if selected
  const allFilteredProducts = useMemo(() => {
    let list = productsData?.products || [];
    if (selectedLetter) {
      list = list.filter((p) =>
        p.chemical_name.toUpperCase().startsWith(selectedLetter)
      );
    }
    return list;
  }, [productsData, selectedLetter]);

  // Client-side pagination slice
  const totalItems = allFilteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = useMemo(() => {
    return allFilteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [allFilteredProducts, startIndex, itemsPerPage]);

  const handleCategoryChange = (slug: string) => {
    setCurrentPage(1);
    setSelectedLetter('');
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleIndustryChange = (slug: string) => {
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('industry', slug);
    } else {
      newParams.delete('industry');
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('q', val.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedLetter('');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Set document title
  useEffect(() => {
    const catName = categories.find((c) => c.slug === currentCategorySlug)?.name;
    document.title = catName
      ? `${catName} Supplier & Price | Aura Chemicals`
      : 'Chemical & API Product Directory (140+ Specifications) | Aura Chemicals';
  }, [currentCategorySlug, categories]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          ...(currentCategorySlug !== 'all'
            ? [
                {
                  label:
                    categories.find((c) => c.slug === currentCategorySlug)?.name ||
                    currentCategorySlug.toUpperCase(),
                },
              ]
            : []),
        ]}
      />

      {/* Header & Faceted Filter Bar */}
      <section
        style={{
          backgroundColor: 'var(--color-surface-white)',
          borderBottom: '1px solid var(--color-rule)',
          padding: 'clamp(36px, 4vw, 56px) 0 clamp(24px, 3vw, 36px) 0',
        }}
      >
        <Container>
          <div style={{ maxWidth: '920px', marginBottom: 'var(--space-6)' }}>
            <span className="section-index">01 / COMMERCIAL CATALOG</span>
            <h1 style={{ fontSize: 'var(--font-size-h1)', margin: '8px 0 12px 0', color: 'var(--color-ink-navy)' }}>
              Chemical & Pharmaceutical Product Directory
            </h1>
            <p className="body-large">
              Browse 94 Active Pharmaceutical Ingredients (IP/BP/USP/EP/JP), high-purity industrial solvents, in-house synthesized phosphates, and direct global imports. Submit multi-item RFQs directly from the catalog.
            </p>
          </div>

          {/* Search & Category Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search Input Bar */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search chemicals by name, synonym, or CAS # (e.g. Paracetamol, 103-90-2)..."
                  className="form-input"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  aria-label="Search chemical products by name or CAS number"
                />
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', background: 'none', border: 'none' }}
                    aria-label="Clear search query"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Industry Dropdown with accessible label */}
              <div style={{ minWidth: '220px' }}>
                <select
                  value={selectedIndustry}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  className="form-select"
                  aria-label="Filter products by target manufacturing industry"
                >
                  <option value="">All 19 Industries</option>
                  {industries.map((ind) => (
                    <option key={ind.slug} value={ind.slug}>
                      {ind.title.replace(' Industry', '')}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle: Table (default) vs Grid */}
              <div style={{
                display: 'inline-flex',
                border: '1px solid var(--color-rule-strong)',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface-white)',
              }}>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '8px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-family-mono)',
                    backgroundColor: viewMode === 'table' ? 'var(--color-ink-navy)' : 'transparent',
                    color: viewMode === 'table' ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-pressed={viewMode === 'table'}
                  title="Dense Specification Table View"
                >
                  <List size={16} />
                  <span>Table</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-family-mono)',
                    backgroundColor: viewMode === 'grid' ? 'var(--color-ink-navy)' : 'transparent',
                    color: viewMode === 'grid' ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-pressed={viewMode === 'grid'}
                  title="Card Grid View"
                >
                  <LayoutGrid size={16} />
                  <span>Cards</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: currentCategorySlug === 'all' ? '1px solid var(--color-teal)' : '1px solid var(--color-rule)',
                  backgroundColor: currentCategorySlug === 'all' ? 'var(--color-teal)' : 'var(--color-paper)',
                  color: currentCategorySlug === 'all' ? '#FFFFFF' : 'var(--color-text-primary)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-family-mono)',
                  cursor: 'pointer',
                  fontWeight: currentCategorySlug === 'all' ? 600 : 400,
                }}
              >
                All Products (140+)
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: currentCategorySlug === cat.slug ? '1px solid var(--color-teal)' : '1px solid var(--color-rule)',
                    backgroundColor: currentCategorySlug === cat.slug ? 'var(--color-teal)' : 'var(--color-paper)',
                    color: currentCategorySlug === cat.slug ? '#FFFFFF' : 'var(--color-text-primary)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-family-mono)',
                    cursor: 'pointer',
                    fontWeight: currentCategorySlug === cat.slug ? 600 : 400,
                  }}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>

            {/* A-Z Alphabetical Jump Bar for APIs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              backgroundColor: 'var(--color-paper)',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--color-rule)',
              overflowX: 'auto',
            }}>
              <span style={{
                fontFamily: 'var(--font-family-mono)',
                fontSize: '0.6875rem',
                color: 'var(--color-text-muted)',
                marginRight: '6px',
                textTransform: 'uppercase',
                flexShrink: 0,
              }}>
                A-Z Index:
              </span>

              <button
                type="button"
                onClick={() => { setSelectedLetter(''); setCurrentPage(1); }}
                style={{
                  padding: '2px 6px',
                  borderRadius: '2px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-family-mono)',
                  border: 'none',
                  backgroundColor: selectedLetter === '' ? 'var(--color-teal)' : 'transparent',
                  color: selectedLetter === '' ? '#FFFFFF' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                ALL
              </button>

              {alphabet.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => { setSelectedLetter(letter); setCurrentPage(1); }}
                  style={{
                    padding: '2px 6px',
                    borderRadius: '2px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-family-mono)',
                    border: 'none',
                    backgroundColor: selectedLetter === letter ? 'var(--color-teal)' : 'transparent',
                    color: selectedLetter === letter ? '#FFFFFF' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontWeight: selectedLetter === letter ? 600 : 400,
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Listing View */}
      <Section background="paper">
        <Container>
          {/* Status Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            fontSize: '0.8125rem',
            fontFamily: 'var(--font-family-mono)',
            color: 'var(--color-text-muted)',
          }}>
            <div aria-live="polite">
              Showing <strong>{totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of{' '}
              <strong>{totalItems}</strong> verified chemicals
              {selectedLetter && <span> (Starting with &ldquo;{selectedLetter}&rdquo;)</span>}
            </div>

            {(searchQuery || selectedIndustry || currentCategorySlug !== 'all' || selectedLetter) && (
              <button
                type="button"
                onClick={clearAllFilters}
                style={{
                  color: 'var(--color-teal)',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-family-mono)',
                  cursor: 'pointer',
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Loading Skeleton */}
          {isProdLoading && (
            <div style={{ padding: '40px 0' }}>
              <Skeleton width="100%" height="320px" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <ErrorState
              title="Catalog Loading Error"
              message="Could not retrieve chemical records. Please retry or contact our commercial desk."
              onRetry={refetch}
            />
          )}

          {/* Empty Results State */}
          {!isProdLoading && !isError && totalItems === 0 && (
            <div style={{
              backgroundColor: 'var(--color-surface-white)',
              border: '1px solid var(--color-rule-strong)',
              borderRadius: 'var(--radius-xs)',
              padding: '48px 24px',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '8px' }}>
                No chemical specifications matched your search
              </h3>
              <p className="body-small" style={{ marginBottom: '24px', maxWidth: '540px', margin: '0 auto 24px auto' }}>
                We source over 400 chemical compounds beyond our online catalog. If you require a specific API, high-purity solvent, or custom phosphate salt, submit your requirement directly to our sourcing desk.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <Link
                  to={`/get-a-quote?product=${encodeURIComponent(searchQuery)}`}
                  className="btn btn-teal"
                >
                  Request Custom Sourcing Quote for &ldquo;{searchQuery || 'Unlisted Chemical'}&rdquo;
                </Link>
                <button type="button" onClick={clearAllFilters} className="btn btn-outline">
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Table View (Default Desktop View) */}
          {!isError && totalItems > 0 && viewMode === 'table' && (
            <div style={{
              overflowX: 'auto',
              border: '1px solid var(--color-rule)',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-surface-white)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <table className="product-table" role="table" aria-label="Chemical Catalog Specifications Table">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: '30%' }}>Product / Chemical Name</th>
                    <th scope="col" style={{ width: '18%' }}>CAS Registry Number</th>
                    <th scope="col" style={{ width: '22%' }}>Category / Application</th>
                    <th scope="col" style={{ width: '18%' }}>Grade / Monograph</th>
                    <th scope="col" style={{ width: '12%', textAlign: 'right' }}>RFQ Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((p) => (
                    <ProductRow
                      key={p.slug}
                      slug={p.slug}
                      chemical_name={p.chemical_name}
                      cas_number={p.cas_number}
                      category_name={p.category?.name}
                      category_slug={p.category?.slug}
                      therapeutic_category={p.therapeutic_category}
                      grade={p.grade}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid View */}
          {!isError && totalItems > 0 && viewMode === 'grid' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}>
              {paginatedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: '32px' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};
