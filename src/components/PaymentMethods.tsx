import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Smartphone, Building, Bitcoin, DollarSign } from 'lucide-react';

const paymentMethods = [
  {
    category: "Cryptocurrency",
    description: "Fastest & Most Secure",
    icon: Bitcoin,
    methods: ["Bitcoin (BTC)", "Ethereum (ETH)", "USDT", "USDC", "Litecoin (LTC)"],
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    recommended: true
  },
  {
    category: "Credit/Debit Cards",
    description: "Instant Processing",
    icon: CreditCard,
    methods: ["Visa", "Mastercard", "American Express", "Discover"],
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  {
    category: "Bank Transfer",
    description: "Secure & Reliable",
    icon: Building,
    methods: ["Wire Transfer", "ACH Transfer", "SEPA", "International Transfer"],
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  },
  {
    category: "Digital Wallets",
    description: "Quick & Convenient",
    icon: Smartphone,
    methods: ["PayPal", "Skrill", "Neteller", "Perfect Money", "Payeer"],
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  }
];

export const PaymentMethods = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Multiple <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Payment Methods</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from a variety of secure payment options to fund your investment account. 
            All transactions are protected with bank-grade encryption.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {paymentMethods.map((method) => (
            <Card key={method.category} className={`${method.bgColor} ${method.borderColor} hover:scale-105 transition-all duration-300 relative group cursor-pointer`}>
              {method.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-warning to-accent px-4 py-1 rounded-full text-xs font-bold text-black">
                  RECOMMENDED
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <method.icon className={`h-12 w-12 mx-auto mb-4 ${method.color}`} />
                <CardTitle className="text-xl font-bold">{method.category}</CardTitle>
                <p className={`text-sm ${method.color} font-medium`}>{method.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {method.methods.map((paymentMethod) => (
                    <li key={paymentMethod} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${method.color.replace('text-', 'bg-')}`}></div>
                      {paymentMethod}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Processing Times */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border/50">
          <h3 className="text-2xl font-bold text-center mb-8">Processing Times & Limits</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-orange-400 text-2xl font-bold mb-2">Instant</div>
              <div className="text-sm text-muted-foreground">Cryptocurrency</div>
              <div className="text-xs text-muted-foreground mt-1">Min: $10 • Max: $100,000</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-2xl font-bold mb-2">5-10 mins</div>
              <div className="text-sm text-muted-foreground">Credit/Debit Cards</div>
              <div className="text-xs text-muted-foreground mt-1">Min: $25 • Max: $10,000</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl font-bold mb-2">1-3 days</div>
              <div className="text-sm text-muted-foreground">Bank Transfer</div>
              <div className="text-xs text-muted-foreground mt-1">Min: $100 • Max: $500,000</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 text-2xl font-bold mb-2">15-30 mins</div>
              <div className="text-sm text-muted-foreground">Digital Wallets</div>
              <div className="text-xs text-muted-foreground mt-1">Min: $20 • Max: $25,000</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};