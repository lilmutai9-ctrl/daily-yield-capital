import React from 'react';
import { Crown, Star, Award, Diamond, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    name: 'Starter',
    range: '$10 - $49',
    rate: '20%',
    icon: Zap,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20'
  },
  {
    name: 'Silver',
    range: '$50 - $99',
    rate: '25%',
    icon: Star,
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
    borderColor: 'border-gray-400/20'
  },
  {
    name: 'Gold',
    range: '$100 - $499',
    rate: '30%',
    icon: Award,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20',
    popular: true
  },
  {
    name: 'Platinum',
    range: '$500 - $999',
    rate: '35%',
    icon: Crown,
    color: 'text-gray-300',
    bgColor: 'bg-gray-300/10',
    borderColor: 'border-gray-300/20'
  },
  {
    name: 'Diamond',
    range: '$1,000+',
    rate: '40%',
    icon: Diamond,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
    premium: true
  }
];

export const InvestmentTiers = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Investment Tiers</h2>
          <p className="text-xl text-muted-foreground">
            Higher investments unlock better daily returns
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
          <Card 
            key={tier.name}
            className={`tier-card relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 ${tier.bgColor} ${tier.borderColor} ${
              tier.popular ? 'scale-105 border-2' : ''
            } ${tier.premium ? 'scale-105 border-2 animate-pulse' : ''}`}
            onClick={() => window.location.hash = 'register'}
          >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-warning text-warning-foreground text-center py-1 text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                {tier.premium && (
                  <div className="absolute top-0 left-0 right-0 bg-purple-500 text-white text-center py-1 text-sm font-bold">
                    PREMIUM
                  </div>
                )}
                
                <div className={`text-center ${tier.popular || tier.premium ? 'pt-8' : ''}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${tier.bgColor} mb-4`}>
                    <Icon className={`h-8 w-8 ${tier.color}`} />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-2 ${tier.color}`}>
                    {tier.name}
                  </h3>
                  
                  <div className="text-sm text-muted-foreground mb-4">
                    {tier.range}
                  </div>
                  
                  <div className="text-3xl font-bold text-success mb-6">
                    {tier.rate}
                    <span className="text-sm text-muted-foreground">/day</span>
                  </div>
                  
                  <Button 
                    className={`w-full ${tier.color === 'text-warning' ? 'cta-button' : 'bg-secondary hover:bg-muted'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.hash = 'register';
                    }}
                  >
                    Choose Plan
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            All tiers include automated daily compounding and instant withdrawals
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Daily Compounding</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Fast Withdrawals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};