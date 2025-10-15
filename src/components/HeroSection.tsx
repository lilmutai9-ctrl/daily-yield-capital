import React from 'react';
import { TrendingUp, Calculator, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bg.jpg';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Background Layers */}
      <div className="absolute inset-0">
        {/* Base Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 gradient-hero opacity-95"></div>
        
        {/* Mesh Gradient */}
        <div className="absolute inset-0 gradient-mesh opacity-60"></div>
        
        {/* Animated Glow Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-primary rounded-full animate-float opacity-30 blur-sm"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-accent rounded-full animate-float opacity-30 blur-sm" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-gradient-success rounded-full animate-float opacity-30 blur-sm" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-gradient-warning rounded-full animate-float opacity-20 blur-sm" style={{ animationDelay: '2.5s' }}></div>
      </div>
      
      {/* Premium Content */}
      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        {/* Premium Badge */}
        <div className="mb-8 inline-block">
          <div className="premium-badge glass-card gradient-primary text-white animate-glow">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trusted by 15,000+ Professional Investors
          </div>
        </div>
        
        {/* Hero Headlines */}
        <div className="mb-10 space-y-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="text-foreground">Professional</span>{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              Investment Platform
            </span>
          </h1>
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-black bg-gradient-to-r from-warning via-success to-accent bg-clip-text text-transparent leading-tight">
            Earn Daily Returns
          </h2>
          <div className="inline-flex items-center gap-3 text-xl md:text-2xl font-semibold">
            <span className="px-4 py-2 glass-card rounded-full text-accent">Forex</span>
            <span className="text-muted-foreground">•</span>
            <span className="px-4 py-2 glass-card rounded-full text-success">Cryptocurrency</span>
            <span className="text-muted-foreground">•</span>
            <span className="px-4 py-2 glass-card rounded-full text-warning">Stocks</span>
          </div>
        </div>
        
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground/90 mb-14 max-w-4xl mx-auto leading-relaxed">
          Experience institutional-grade trading with{' '}
          <span className="text-success font-bold bg-success/10 px-2 py-1 rounded">up to 40% daily returns</span>,{' '}
          automated portfolio management, and{' '}
          <span className="text-accent font-bold bg-accent/10 px-2 py-1 rounded">lightning-fast withdrawals</span>.{' '}
          Join the future of wealth creation.
        </p>
        
        {/* Premium CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
          <Button 
            className="group relative cta-button text-xl px-14 py-7 overflow-hidden"
            onClick={() => window.location.href = '/auth'}
          >
            <span className="relative z-10 flex items-center">
              <TrendingUp className="mr-3 h-6 w-6 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Start Earning Now
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Button>
          
          <Button 
            className="group gradient-accent text-white border-0 px-14 py-7 text-xl rounded-2xl font-bold transition-bounce hover:scale-105 shadow-elegant hover:shadow-glow-accent"
            onClick={() => window.location.href = '/trading-terminal'}
          >
            <Shield className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
            Live Trading Terminal
          </Button>
          
          <Button 
            className="glass-card border-accent/50 hover:border-accent text-accent px-14 py-7 text-xl rounded-2xl font-bold transition-bounce hover:scale-105 hover:shadow-glow-accent"
            onClick={() => window.location.hash = 'calculator'}
          >
            <Calculator className="mr-3 h-6 w-6 transition-transform hover:rotate-12" />
            Calculate Returns
          </Button>
        </div>

        
        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="group glass-card rounded-2xl p-8 border border-primary/20 transition-bounce hover:scale-105 hover:border-primary hover:shadow-glow">
            <div className="text-5xl font-black mb-3 bg-gradient-success bg-clip-text text-transparent">
              $2.5M+
            </div>
            <div className="text-muted-foreground font-medium uppercase tracking-wide text-sm">
              Total Profits Paid
            </div>
            <div className="mt-4 h-1 w-0 bg-gradient-success rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
          
          <div className="group glass-card rounded-2xl p-8 border border-accent/20 transition-bounce hover:scale-105 hover:border-accent hover:shadow-glow-accent">
            <div className="text-5xl font-black mb-3 bg-gradient-primary bg-clip-text text-transparent">
              15,000+
            </div>
            <div className="text-muted-foreground font-medium uppercase tracking-wide text-sm">
              Active Investors
            </div>
            <div className="mt-4 h-1 w-0 bg-gradient-accent rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
          
          <div className="group glass-card rounded-2xl p-8 border border-warning/20 transition-bounce hover:scale-105 hover:border-warning hover:shadow-glow">
            <div className="text-5xl font-black mb-3 bg-gradient-warning bg-clip-text text-transparent">
              99.8%
            </div>
            <div className="text-muted-foreground font-medium uppercase tracking-wide text-sm">
              Success Rate
            </div>
            <div className="mt-4 h-1 w-0 bg-gradient-warning rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
      </div>
      
      {/* Premium Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-7 h-12 border-2 border-accent/50 rounded-full p-1.5 glass-card shadow-glow-accent">
          <div className="w-1.5 h-4 bg-gradient-accent rounded-full mx-auto animate-pulse"></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">Scroll</p>
      </div>
    </section>
  );
};