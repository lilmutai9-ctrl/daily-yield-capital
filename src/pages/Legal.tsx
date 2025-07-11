import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, AlertTriangle, Scale } from 'lucide-react';

const Legal = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Legal <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Information</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete legal documentation and regulatory compliance information for Daily Yield Capital.
          </p>
        </div>

        <Tabs defaultValue="terms" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm">
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Terms & Conditions
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Disclosure
            </TabsTrigger>
            <TabsTrigger value="regulatory" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Regulatory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms">
            <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Terms & Conditions</CardTitle>
                <p className="text-muted-foreground">Last updated: January 2024</p>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      By accessing and using Daily Yield Capital's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">2. Investment Services</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Daily Yield Capital provides automated investment services in Forex, Cryptocurrency, and Stock markets. All investments carry risk, and past performance does not guarantee future results.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">3. Account Registration</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Users must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">4. Deposits and Withdrawals</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Minimum deposit amounts vary by tier. Withdrawals are processed according to our standard procedures. We reserve the right to request additional verification for large transactions.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">5. Prohibited Activities</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Users are prohibited from engaging in fraudulent activities, money laundering, or any illegal activities. Violation may result in account suspension or termination.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Privacy Policy</CardTitle>
                <p className="text-muted-foreground">Last updated: January 2024</p>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3">Information We Collect</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We collect personal information including name, email, phone number, and financial information necessary to provide our services. We also collect usage data to improve our platform.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">How We Use Your Information</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Your information is used to provide investment services, process transactions, comply with legal requirements, and communicate important updates about your account.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Data Protection</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We implement industry-standard security measures including SSL encryption, two-factor authentication, and secure data storage to protect your personal information.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Third-Party Sharing</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We do not sell or share your personal information with third parties except as required by law or necessary to provide our services (payment processors, compliance partners).
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card className="bg-card/80 backdrop-blur-sm border border-destructive/20">
              <CardHeader>
                <CardTitle className="text-2xl text-destructive">Risk Disclosure Statement</CardTitle>
                <p className="text-muted-foreground">Important risk information - Please read carefully</p>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div className="space-y-6">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3 text-destructive">⚠️ High-Risk Investment Warning</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Trading in Forex, Cryptocurrencies, and Stocks involves substantial risk of loss and is not suitable for all investors. You should carefully consider whether such trading is suitable for you in light of your financial condition.
                    </p>
                  </div>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Market Volatility</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Financial markets are highly volatile and unpredictable. Past performance is not indicative of future results. You may lose some or all of your invested capital.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Leverage Risk</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our trading strategies may use leverage, which can amplify both gains and losses. This means your losses could exceed your initial investment.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Technology Risk</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our platform relies on technology and automated systems. System failures, connectivity issues, or software bugs could impact your ability to trade or access your account.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Regulatory Risk</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Changes in regulations or legal requirements may affect our services or your investments. We cannot guarantee continued operation under all regulatory scenarios.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regulatory">
            <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Regulatory Information</CardTitle>
                <p className="text-muted-foreground">Our compliance and licensing information</p>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3">Licensing</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Daily Yield Capital is licensed and regulated by the Financial Conduct Authority (FCA) under registration number DYC-2024-001. We comply with all applicable financial regulations.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Anti-Money Laundering (AML)</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We maintain strict AML policies and procedures. All customers must complete identity verification (KYC) before accessing our services.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Client Fund Protection</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Client funds are held in segregated accounts separate from company funds. We maintain insurance coverage for client deposits up to $500,000 per account.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Dispute Resolution</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We are members of the Financial Ombudsman Service for dispute resolution. Eligible complaints can be referred to this independent service.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Regulatory Compliance</h3>
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• FCA Registration: DYC-2024-001</li>
                        <li>• GDPR Compliant</li>
                        <li>• PCI DSS Level 1 Certified</li>
                        <li>• ISO 27001 Information Security</li>
                        <li>• SOC 2 Type II Audited</li>
                      </ul>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Legal;