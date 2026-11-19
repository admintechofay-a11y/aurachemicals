import React from 'react';
import { HomeHero } from '../components/home/HomeHero';
import { StatsStrip } from '../components/home/StatsStrip';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { ProcessSteps } from '../components/home/ProcessSteps';
import { TrustRow } from '../components/home/TrustRow';
import { FinalCTA } from '../components/home/FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page-root">
      <HomeHero />
      <StatsStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <ProcessSteps />
      <TrustRow />
      <FinalCTA />
    </div>
  );
};
