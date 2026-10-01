import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MissionPage } from './pages/MissionPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { QuotePage } from './pages/QuotePage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { MotionProvider } from './components/common/MotionPrimitives';

const CATEGORY_SLUGS = new Set([
  'api',
  'solvents',
  'manufacturing-phosphates',
  'imports',
  'acids',
  'industrial-chemicals',
  'grasim-products',
  'magnesia-products',
  'gacl-products',
]);

const ProductRouteDispatcher: React.FC = () => {
  const { slugOrCategory } = useParams<{ slugOrCategory: string }>();
  if (slugOrCategory && CATEGORY_SLUGS.has(slugOrCategory.toLowerCase())) {
    return <ProductsPage />;
  }
  return <ProductDetailPage />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about-us" element={<AboutPage />} />
              <Route path="our-mission" element={<MissionPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/category/:category" element={<ProductsPage />} />
              <Route path="products/detail/:slug" element={<ProductDetailPage />} />
              <Route path="products/:category/:slug" element={<ProductDetailPage />} />
              <Route path="products/:slugOrCategory" element={<ProductRouteDispatcher />} />
              <Route path="industries" element={<IndustriesPage />} />
              <Route path="industries/:slug" element={<IndustriesPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="get-a-quote" element={<QuotePage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="terms-conditions" element={<Navigate to="/terms" replace />} />
              <Route path="design-system" element={<DesignSystemPage />} />

              {/* 301-equivalent redirect routes for legacy WordPress links */}
              <Route path="apis" element={<Navigate to="/products/api" replace />} />
              <Route path="solvents" element={<Navigate to="/products/solvents" replace />} />
              <Route path="industries-copy" element={<Navigate to="/industries" replace />} />
              <Route path="request-a-quote" element={<Navigate to="/get-a-quote" replace />} />
              <Route path="request-quote" element={<Navigate to="/services" replace />} />
              <Route path="privacy-policy-2" element={<Navigate to="/privacy-policy" replace />} />
              <Route path="shop" element={<Navigate to="/products" replace />} />
              <Route path="cart" element={<Navigate to="/get-a-quote" replace />} />
              <Route path="checkout" element={<Navigate to="/get-a-quote" replace />} />
              <Route path="my-account" element={<Navigate to="/contact" replace />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MotionProvider>
    </QueryClientProvider>
  );
};
