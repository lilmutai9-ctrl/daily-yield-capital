import React from 'react';
import { TrendingUp, Calculator, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bg.jpg';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 gradient-hero opacity-90"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-accent/20 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-success/20 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-warning/20 rounded-full animate-float delay-2000"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Professional{' '}
            <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
              Investment Platform
            </span>
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent mb-8">
            Earn Daily Compounded Returns
          </h2>
          <div className="text-2xl md:text-3xl font-semibold text-muted-foreground">
            Forex • Cryptocurrency • Stocks
          </div>
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
          Earn up to <span className="text-success font-bold">40% daily returns</span> with 
          automated reinvestment and <span className="text-accent font-bold">fast withdrawals</span>. 
          Start building wealth today with our proven investment platform.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            className="cta-button text-xl px-12 py-6 group"
            onClick={() => window.location.hash = 'investment-tiers'}
          >
            <TrendingUp className="mr-3 h-6 w-6 group-hover:animate-bounce" />
            Start Earning Now
          </Button>
          
          <Button 
            className="bg-secondary hover:bg-muted border border-accent text-accent px-12 py-6 text-xl transition-smooth hover:scale-105"
            onClick={() => window.location.hash = 'calculator'}
          >
            <Calculator className="mr-3 h-6 w-6" />
            Try Calculator
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <div className="text-3xl font-bold text-success mb-2">$2.5M+</div>
            <div className="text-muted-foreground">Total Profits Paid</div>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <div className="text-3xl font-bold text-accent mb-2">15,000+</div>
            <div className="text-muted-foreground">Active Investors</div>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <div className="text-3xl font-bold text-warning mb-2">99.8%</div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent rounded-full p-1">
          <div className="w-1 h-3 bg-accent rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};