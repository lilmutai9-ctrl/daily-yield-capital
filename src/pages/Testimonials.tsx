import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    investment: "$5,000",
    profit: "$127,500",
    tier: "Platinum",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    quote: "I started with $5,000 six months ago and I've already made over $127,000! The daily returns are incredible and withdrawals are instant. Best investment platform I've ever used.",
    days: 180
  },
  {
    name: "Michael Chen",
    location: "Singapore",
    investment: "$25,000",
    profit: "$425,000",
    tier: "Diamond",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote: "As a Diamond member, I get 40% daily returns and priority support. The compounding effect is amazing - I've made more in 4 months than I did in 5 years of traditional investing.",
    days: 120
  },
  {
    name: "Emma Rodriguez",
    location: "Madrid, Spain",
    investment: "$1,200",
    profit: "$18,750",
    tier: "VIP",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    quote: "Started small with $1,200 and upgraded to VIP tier. The 35% daily returns helped me pay off my student loans in just 3 months. Life-changing!",
    days: 90
  },
  {
    name: "David Thompson",
    location: "London, UK",
    investment: "$8,500",
    profit: "$198,000",
    tier: "Platinum",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    quote: "The transparency and reliability of Daily Yield Capital is outstanding. I can withdraw my profits anytime and the support team is incredibly helpful 24/7.",
    days: 150
  },
  {
    name: "Lisa Wang",
    location: "Toronto, Canada",
    investment: "$3,800",
    profit: "$89,500",
    tier: "Premium",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    quote: "I was skeptical at first, but the daily profits keep coming consistently. The automated reinvestment feature has helped me grow my portfolio exponentially.",
    days: 200
  },
  {
    name: "James Wilson",
    location: "Sydney, Australia",
    investment: "$15,000",
    profit: "$312,000",
    tier: "Diamond",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    quote: "Retired early thanks to Daily Yield Capital. The 40% daily returns in Diamond tier allowed me to achieve financial freedom in less than 6 months.",
    days: 165
  }
];

const Testimonials = () => {
  const tierColors = {
    'Starter': 'text-blue-400',
    'Basic': 'text-green-400', 
    'Premium': 'text-purple-400',
    'VIP': 'text-orange-400',
    'Platinum': 'text-cyan-400',
    'Diamond': 'text-yellow-400'
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Success <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Stories</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Real investors, real profits. See how our community is building wealth with daily compounded returns.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="text-3xl font-bold text-success mb-2">$12.8M+</div>
              <div className="text-muted-foreground">Total Profits Earned</div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="text-3xl font-bold text-accent mb-2">98.7%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="text-3xl font-bold text-warning mb-2">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border border-border/50 hover:scale-105 transition-all duration-300">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-muted-foreground text-sm">{testimonial.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${tierColors[testimonial.tier as keyof typeof tierColors]} bg-current/10`}>
                    {testimonial.tier}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-muted-foreground italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Investment</div>
                    <div className="font-bold text-accent">{testimonial.investment}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Total Profit</div>
                    <div className="font-bold text-success">{testimonial.profit}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Days</div>
                    <div className="font-bold text-warning">{testimonial.days}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-accent/10 to-success/10 rounded-2xl p-12 border border-accent/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are already earning daily profits. Start with as little as $50 and watch your wealth grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button className="cta-button text-lg px-8 py-6">
                <TrendingUp className="mr-2 h-5 w-5" />
                Start Investing Now
              </Button>
            </Link>
            <Link to="/#calculator">
              <Button variant="outline" className="border-accent text-accent text-lg px-8 py-6">
                <DollarSign className="mr-2 h-5 w-5" />
                Calculate Your Profits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;