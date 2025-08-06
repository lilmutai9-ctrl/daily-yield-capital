import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { EarningsCalculator } from '@/components/EarningsCalculator';
import { InvestmentTiers } from '@/components/InvestmentTiers';
import { HowItWorks } from '@/components/HowItWorks';
// PaymentMethods component removed - crypto only
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { LiveTicker } from '@/components/LiveTicker';

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <HeroSection />
      <section id="calculator"><EarningsCalculator /></section>
      <section id="investment-tiers"><InvestmentTiers /></section>
      <HowItWorks />
      {/* PaymentMethods removed - crypto only */}
      <Testimonials />
      <section id="faq"><FAQ /></section>
      <Footer />
      <LiveTicker />
    </div>
  );
};

export default Index;
