import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const testimonials = [
  {
    name: "Marcus Rodriguez",
    location: "New York, USA",
    tier: "Diamond",
    profit: "$47,520",
    period: "6 months",
    text: "Started with $5,000 and now I'm making more than my day job. The daily returns are incredible and withdrawals are always instant.",
    rating: 5,
    avatar: "MR"
  },
  {
    name: "Sarah Chen",
    location: "Singapore",
    tier: "Platinum", 
    profit: "$23,840",
    period: "4 months",
    text: "I was skeptical at first, but after seeing consistent daily returns for months, I'm now a true believer. Best investment platform ever!",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Ahmed Hassan",
    location: "Dubai, UAE",
    tier: "Gold",
    profit: "$15,650",
    period: "3 months", 
    text: "The automated reinvestment feature is genius. I just deposit and watch my money grow every single day. Highly recommended!",
    rating: 5,
    avatar: "AH"
  },
  {
    name: "Emma Johnson",
    location: "London, UK",
    tier: "Diamond",
    profit: "$62,340",
    period: "8 months",
    text: "Made more in 8 months than I did in 3 years at my previous investments. The compound returns are mind-blowing!",
    rating: 5,
    avatar: "EJ"
  },
  {
    name: "Carlos Silva",
    location: "São Paulo, Brazil",
    tier: "Platinum",
    profit: "$31,280",
    period: "5 months",
    text: "Finally found a platform that actually delivers what it promises. Daily profits, instant withdrawals, and amazing support team.",
    rating: 5,
    avatar: "CS"
  },
  {
    name: "Lisa Wang",
    location: "Tokyo, Japan", 
    tier: "Gold",
    profit: "$18,950",
    period: "3 months",
    text: "The transparency and security of this platform is outstanding. I can track every penny and withdraw anytime I want.",
    rating: 5,
    avatar: "LW"
  }
];

export const Testimonials = () => {
  const [activeTab, setActiveTab] = useState("0");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((current) => {
        const nextIndex = (parseInt(current) + 1) % testimonials.length;
        return nextIndex.toString();
      });
    }, 5000); // Change tab every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our <span className="bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">Investors Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied investors who are already earning daily profits with our platform.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="glass-card inline-flex h-12 items-center justify-center rounded-full p-1 mb-8 shadow-premium flex-wrap gap-1">
            {testimonials.map((testimonial, index) => (
              <TabsTrigger 
                key={index}
                value={index.toString()} 
                className="rounded-full px-4 py-2 text-xs font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all duration-300"
              >
                {testimonial.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {testimonials.map((testimonial, index) => (
            <TabsContent key={index} value={index.toString()} className="mt-0">
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-premium animate-fade-in">
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-accent to-success rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-xl">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-accent/20 text-accent px-3 py-1 rounded-full font-semibold">{testimonial.tier}</span>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profit Stats */}
                  <div className="bg-secondary/50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-success">{testimonial.profit}</div>
                        <div className="text-sm text-muted-foreground">Total Profit</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-semibold">{testimonial.period}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          Active
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-muted-foreground italic leading-relaxed text-lg">
                    "{testimonial.text}"
                  </blockquote>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="text-3xl font-bold text-success mb-2">4.9/5</div>
              <div className="text-muted-foreground">Average Rating</div>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="text-3xl font-bold text-accent mb-2">98.7%</div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="text-3xl font-bold text-warning mb-2">24/7</div>
              <div className="text-muted-foreground">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};