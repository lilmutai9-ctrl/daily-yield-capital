import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { EarningsCalculator } from '@/components/EarningsCalculator';
import { InvestmentTiers } from '@/components/InvestmentTiers';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { LiveTicker } from '@/components/LiveTicker';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <EarningsCalculator />
      <InvestmentTiers />
      <HowItWorks />
      <Footer />
      <LiveTicker />
    </div>
  );
};

export default Index;
