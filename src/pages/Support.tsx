import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Phone, Mail, Clock, HeadphonesIcon } from 'lucide-react';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Support form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            24/7 <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Support Center</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get instant help from our expert support team. We're here to assist you with any questions or issues.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-accent" />
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">Get instant answers to your questions</p>
              <Button className="w-full">Start Chat</Button>
              <p className="text-xs text-green-400 mt-2">● Online - Average response: 30 seconds</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <Phone className="h-12 w-12 mx-auto mb-4 text-success" />
              <CardTitle>Phone Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">Speak directly with our experts</p>
              <div className="font-mono text-lg font-bold mb-2">+1 (555) 123-4567</div>
              <p className="text-xs text-muted-foreground">24/7 International Support</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-warning" />
              <CardTitle>Email Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">Detailed support for complex issues</p>
              <div className="font-mono text-sm mb-2">support@dailyyieldcapital.com</div>
              <p className="text-xs text-muted-foreground">Response within 1 hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Support Form */}
        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 1 hour.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Please describe your issue or question in detail..."
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full cta-button">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Support Info */}
          <div className="space-y-8">
            <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Live Chat</span>
                    <span className="text-green-400">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone Support</span>
                    <span className="text-green-400">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Support</span>
                    <span className="text-green-400">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technical Support</span>
                    <span className="text-green-400">24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeadphonesIcon className="h-5 w-5" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <button className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    How to make a deposit?
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    How to withdraw funds?
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    Account verification help
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    Trading strategies guide
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-accent/10 to-success/10 border border-accent/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Priority Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Platinum and Diamond members get priority support with dedicated account managers.
                </p>
                <Button variant="outline" className="border-accent text-accent">
                  Upgrade Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;