import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';
import { PageTransition } from '../components/common/MotionPrimitives';
import { api } from '../api/client';
import { UI_LABELS } from '../utils/constants';

export const RootLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return (
    <>
      <a href="#content" className="skip-to-content">
        {UI_LABELS.SKIP_TO_CONTENT}
      </a>

      <Navbar
        settings={settings}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        settings={settings}
      />

      <main id="content" tabIndex={-1} style={{ outline: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      <Footer settings={settings} />
    </>
  );
};
