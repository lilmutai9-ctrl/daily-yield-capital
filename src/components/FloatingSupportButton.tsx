import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { cn } from '@/lib/utils';

export const FloatingSupportButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { settings, loading } = useSiteSettings();

  const handleContactClick = (type: string, value: string) => {
    switch (type) {
      case 'telegram':
        window.open(value, '_blank');
        break;
      case 'phone':
        window.open(`tel:${value}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${value}`, '_blank');
        break;
    }
    setIsExpanded(false);
  };

  if (loading) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded contact options */}
      {isExpanded && (
        <Card className="mb-4 p-4 w-64 bg-card border-border shadow-card animate-scale-in">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Contact Support</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Telegram - Most preferred */}
            <Button
              onClick={() => handleContactClick('telegram', settings.telegram_link)}
              className="w-full justify-start gap-3 bg-accent hover:bg-accent/90 text-accent-foreground"
              size="sm"
            >
              <Send className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Telegram</div>
                <div className="text-xs opacity-80">Fastest response</div>
              </div>
            </Button>

            {/* Email */}
            <Button
              onClick={() => handleContactClick('email', settings.support_email)}
              variant="outline"
              className="w-full justify-start gap-3 border-border hover:bg-muted"
              size="sm"
            >
              <Mail className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Email</div>
                <div className="text-xs text-muted-foreground">{settings.support_email}</div>
              </div>
            </Button>

            {/* Phone */}
            <Button
              onClick={() => handleContactClick('phone', settings.support_phone)}
              variant="outline"
              className="w-full justify-start gap-3 border-border hover:bg-muted"
              size="sm"
            >
              <Phone className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Phone</div>
                <div className="text-xs text-muted-foreground">{settings.support_phone}</div>
              </div>
            </Button>
          </div>
        </Card>
      )}

      {/* Main floating button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "h-14 w-14 rounded-full shadow-glow transition-smooth hover:scale-110",
          "gradient-primary text-primary-foreground",
          "fixed bottom-6 right-6 z-50"
        )}
        size="icon"
      >
        <MessageCircle className={cn(
          "h-6 w-6 transition-transform duration-300",
          isExpanded && "rotate-180"
        )} />
      </Button>
    </div>
  );
};