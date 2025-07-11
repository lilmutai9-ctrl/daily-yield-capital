import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: "How quickly can I withdraw my profits?",
    answer: "Withdrawals are processed instantly for cryptocurrency and within 5-10 minutes for other payment methods. There are no withdrawal fees and no minimum withdrawal amount."
  },
  {
    question: "What's the minimum investment amount?",
    answer: "You can start investing with as little as $10. Our Starter tier accepts investments from $10-$49 with 20% daily returns."
  },
  {
    question: "How does the daily compounding work?",
    answer: "Your profits are automatically reinvested every 24 hours, allowing your investment to grow exponentially. You can withdraw your profits at any time or let them compound for maximum growth."
  },
  {
    question: "Is my investment secure?",
    answer: "Yes, we use bank-grade security with SSL encryption, 2FA protection, and cold storage for cryptocurrency. We're also licensed and regulated by financial authorities."
  },
  {
    question: "What markets do you trade in?",
    answer: "We trade in Forex, Cryptocurrency, and Stock markets using advanced algorithms and AI-powered trading bots to ensure consistent daily returns."
  },
  {
    question: "Can I upgrade my investment tier?",
    answer: "Absolutely! You can upgrade your tier at any time by making additional deposits. Higher tiers offer better daily return rates."
  },
  {
    question: "What happens if I want to stop investing?",
    answer: "You can withdraw your entire balance (principal + profits) at any time with no penalties or fees. We believe in complete transparency and flexibility."
  },
  {
    question: "Do you offer customer support?",
    answer: "Yes, we provide 24/7 customer support through live chat, email, and phone. Our expert team is always ready to help you with any questions."
  },
  {
    question: "Are there any hidden fees?",
    answer: "No hidden fees whatsoever. What you see is what you get. No management fees, no withdrawal fees, no maintenance fees."
  },
  {
    question: "How do I track my investment performance?",
    answer: "You'll have access to a comprehensive dashboard showing real-time balance, daily profits, withdrawal history, and performance analytics."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Get answers to the most common questions about our investment platform.
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border/30 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-accent transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};