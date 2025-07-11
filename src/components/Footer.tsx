import React from 'react';
import { Shield, Lock, CheckCircle, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border pb-16">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Security & Compliance Banner */}
        <div className="mb-12 p-6 bg-secondary rounded-xl border border-border">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-success" />
              <span className="font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-6 w-6 text-accent" />
              <span className="font-medium">2FA Protected</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-warning" />
              <span className="font-medium">KYC/AML Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-purple-400" />
              <span className="font-medium">Licensed & Regulated</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-xl font-bold mb-4">Daily Yield Capital</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Professional investment platform offering daily compounded returns from Forex, Crypto, and Stock markets.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-accent cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-accent cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Investment Plans</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Calculator</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Live Chat</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Support Tickets</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Risk Disclosure</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Regulatory</a></li>
            </ul>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-destructive mb-2">⚠️ Risk Disclaimer</h4>
          <p className="text-sm text-muted-foreground">
            Trading and investment involve substantial risk of loss. Past performance does not guarantee future results. 
            Only invest what you can afford to lose. Please read our full risk disclosure before investing.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-muted-foreground border-t border-border pt-8">
          <p>&copy; 2024 Daily Yield Capital. All rights reserved.</p>
          <p className="text-sm mt-2">
            Licensed by Financial Conduct Authority (FCA) • Reg No: DYC-2024-001
          </p>
        </div>
      </div>
    </footer>
  );
};