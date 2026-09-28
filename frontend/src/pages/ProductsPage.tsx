import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  X,
  FileCheck,
  FlaskConical,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { CTABand } from '../components/common/CTABand';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { ProductCard } from '../components/common/ProductCard';
import { Pagination } from '../components/common/Pagination';
import { api } from '../api/client';
import { ProductDto } from '../api/types';

export const ProductsPage: React.FC = () => {
  const { category: routeCategory, slugOrCategory } = useParams<{ category?: string; slugOrCategory?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Data fetching
  const { data: categories, isLoading: isCatLoading } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => api.getProductCategories(),
  });

  const { data: industries } = useQuery({
    queryKey: ['industries'],
    queryFn: () => api.getIndustries(),
  });

  // Current selected category (route param takes precedence or URL search param)
  const currentCategorySlug = routeCategory || slugOrCategory || searchParams.get('category') || 'all';

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
        per_page: 500, // Fetch filtered set to allow robust client table/grid pagination
      }),
  });

  // All products matching filters
  const allFilteredProducts = useMemo(() => {
    return productsData?.products || [];
  }, [productsData]);

  // Client-side pagination slice
  const totalItems = allFilteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = useMemo(() => {
    return allFilteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [allFilteredProducts, startIndex, itemsPerPage]);

  const handleCategoryChange = (slug: string) => {
    setCurrentPage(1);
    if (slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      searchParams.set('category', slug);
      setSearchParams(searchParams);
    }
  };

  const handleIndustryChange = (slug: string) => {
    setCurrentPage(1);
    setSelectedIndustry(slug);
    if (slug) {
      searchParams.set('industry', slug);
    } else {
      searchParams.delete('industry');
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    if (val) {
      searchParams.set('q', val);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('');
    searchParams.delete('q');
    searchParams.delete('industry');
    searchParams.delete('category');
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  // Find active category label
  const activeCategoryObj = categories?.find((c) => c.slug === currentCategorySlug);

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Products', url: '/products' },
          ...(activeCategoryObj ? [{ label: activeCategoryObj.name }] : []),
        ]}
      />

      {/* Header Banner */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: 'clamp(40px, 5vw, 64px) 0',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '840px' }}>
            <span className="eyebrow">Verified Chemical Catalog</span>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>
              {activeCategoryObj ? activeCategoryObj.name : 'Chemical Products & APIs'}
            </h1>
            <p className="body-large" style={{ color: 'var(--color-text)' }}>
              Explore 135 verified active pharmaceutical ingredients, industrial solvents, phosphates, and acids directly sourced through our network of 400+ domestic manufacturers.
            </p>
          </div>
        </Container>
      </section>

      {/* Controls Section: Category Tabs, Search, Industry Filter, View Toggle */}
      <Section padding="dense" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Container>
          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '12px',
              marginBottom: '20px',
              scrollbarWidth: 'thin',
            }}
          >
            <button
              onClick={() => handleCategoryChange('all')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: currentCategorySlug === 'all' ? 'var(--color-primary)' : '#FFFFFF',
                color: currentCategorySlug === 'all' ? '#FFFFFF' : 'var(--color-text)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              All Categories (135)
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: currentCategorySlug === cat.slug ? 'var(--color-primary)' : '#FFFFFF',
                  color: currentCategorySlug === cat.slug ? '#FFFFFF' : 'var(--color-text)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Search, Industry Select, and View Switcher */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search chemical name, CAS number, or class..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 36px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                  }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Industry Dropdown */}
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedIndustry}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  style={{
                    padding: '10px 36px 10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                  }}
                >
                  <option value="">All Applications &amp; Industries</option>
                  {industries?.map((ind) => (
                    <option key={ind.id} value={ind.slug}>
                      {ind.title}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--color-text-muted)',
                  }}
                />
              </div>

              {/* View Toggle */}
              <div
                style={{
                  display: 'flex',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: viewMode === 'grid' ? 'var(--color-surface)' : '#FFFFFF',
                    border: 'none',
                    borderRight: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8125rem',
                    color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: viewMode === 'grid' ? 600 : 400,
                  }}
                  title="Grid View"
                >
                  <LayoutGrid size={15} /> Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: viewMode === 'table' ? 'var(--color-surface)' : '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8125rem',
                    color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: viewMode === 'table' ? 600 : 400,
                  }}
                  title="Table View"
                >
                  <List size={15} /> Table
                </button>
              </div>

              {(searchQuery || selectedIndustry || currentCategorySlug !== 'all') && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    color: 'var(--color-secondary)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Product Content Listing */}
      <Section padding="normal">
        <Container>
          {/* Status bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <span>
              Showing <strong>{totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of{' '}
              <strong>{totalItems}</strong> chemical products
            </span>
          </div>

          {/* Loading State for initial fetch */}
          {isProdLoading && paginatedProducts.length === 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} width="100%" height="240px" />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <ErrorState
              title="Unable to Load Chemical Catalog"
              message="Could not retrieve the product inventory from the server."
              onRetry={refetch}
            />
          )}

          {/* Empty State */}
          {!isProdLoading && !isError && totalItems === 0 && (
            <EmptyState
              title="No Chemical Products Found"
              message={`No chemicals matched your criteria${
                searchQuery ? ` for "${searchQuery}"` : ''
              }. Try adjusting your keywords, selecting a different category, or requesting a custom procurement.`}
              action={
                <Button variant="outline" onClick={clearAllFilters} style={{ marginTop: '16px' }}>
                  Clear All Filters
                </Button>
              }
            />
          )}

          {/* Grid View (Crossfade transition preserves previous results at reduced opacity while loading) */}
          {!isError && totalItems > 0 && viewMode === 'grid' && (
            <div
              className={`grid-crossfade ${isProdLoading ? 'loading' : ''}`}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '40px',
              }}
            >
              {paginatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

          {/* Table View */}
          {!isProdLoading && !isError && totalItems > 0 && viewMode === 'table' && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                overflowX: 'auto',
                boxShadow: 'var(--shadow-xs)',
                marginBottom: '40px',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderBottom: '1px solid var(--color-border)',
                      color: 'var(--color-primary)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    <th style={{ padding: '14px 20px' }}>Chemical Name</th>
                    <th style={{ padding: '14px 20px' }}>CAS Number</th>
                    <th style={{ padding: '14px 20px' }}>Category</th>
                    <th style={{ padding: '14px 20px' }}>Therapeutic / Class</th>
                    <th style={{ padding: '14px 20px' }}>Grade</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((prod, idx) => (
                    <tr
                      key={prod.id}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : 'var(--color-surface-subtle)',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '16px 20px', fontWeight: 600 }}>
                        <Link
                          to={`/products/${prod.slug}`}
                          style={{
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                          }}
                        >
                          {prod.chemical_name}
                        </Link>
                      </td>
                      <td style={{ padding: '16px 20px', fontFamily: 'var(--font-family-mono)', fontSize: '0.8125rem' }}>
                        {prod.cas_number ? (
                          <span className="cas-badge">{prod.cas_number}</span>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                        {prod.category.name}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--color-text)', fontSize: '0.8125rem' }}>
                        {prod.therapeutic_category || '—'}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--color-secondary)', fontSize: '0.8125rem' }}>
                        {prod.grade || 'Industrial / Commercial'}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                          <Link
                            to={`/products/${prod.slug}`}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--color-primary)',
                              textDecoration: 'none',
                              backgroundColor: '#FFFFFF',
                            }}
                          >
                            Details
                          </Link>
                          <Button
                            to={`/get-a-quote?product=${encodeURIComponent(prod.chemical_name)}&cas=${encodeURIComponent(prod.cas_number || '')}`}
                            variant="primary"
                            size="sm"
                          >
                            RFQ
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isProdLoading && !isError && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
            />
          )}
        </Container>
      </Section>

      {/* Custom Procurement Callout */}
      <CTABand
        heading="Need a Specific Chemical Grade, Custom Compound, or Unlisted CAS?"
        body="Through our direct alliances with 400+ domestic chemical and API manufacturers, we source, formulate, and deliver tailored chemicals on demand."
        buttonLabel="Request Custom Chemical Sourcing"
        buttonUrl="/get-a-quote"
        phone="+91 7220000877"
      />
    </>
  );
};
