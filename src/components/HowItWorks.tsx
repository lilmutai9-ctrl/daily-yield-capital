import React from 'react';
import { UserPlus, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';

const steps = [
  {
    icon: UserPlus,
    title: 'Register Account',
    description: 'Create your free account in under 2 minutes with email verification and secure login.',
    color: 'text-accent'
  },
  {
    icon: DollarSign,
    title: 'Choose & Deposit',
    description: 'Select your investment tier and deposit using crypto, cards, or bank transfer.',
    color: 'text-warning'
  },
  {
    icon: TrendingUp,
    title: 'Watch Growth',
    description: 'Monitor your daily compounded returns from Forex, Crypto, and Stock investments.',
    color: 'text-success'
  },
  {
    icon: Wallet,
    title: 'Withdraw Profits',
    description: 'Request instant withdrawals anytime with no hidden fees or minimum limits.',
    color: 'text-purple-400'
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">
            Start earning in 4 simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="investment-card text-center group">
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Average setup time: 5 minutes</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">First profits within 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};