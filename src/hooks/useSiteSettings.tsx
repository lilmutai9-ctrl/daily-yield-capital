import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  support_email: string;
  support_phone: string;
  telegram_link: string;
  bitcoin_address: string;
  ethereum_address: string;
  usdt_address: string;
  company_name: string;
  company_description: string;
}

const defaultSettings: SiteSettings = {
  support_email: 'dailyyieldcapital@gmail.com',
  support_phone: '+1 (762) 203-5587',
  telegram_link: 'https://t.me/daily_yield_capital',
  bitcoin_address: '1G34ANDa8vBWrUFd3Pz8aopxuYCcgfQ6kk',
  ethereum_address: '0xd11334f91e89eef052dd2d6feb401f45c890639f',
  usdt_address: 'TPdhkjKLtYgVMDJKJGzaGgHZLcDjJsBx5J',
  company_name: 'Daily Yield Capital',
  company_description: 'Professional Forex, Crypto & Stock Investment Platform'
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      if (data) {
        const settingsObject = data.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {} as any);

        setSettings({ ...defaultSettings, ...settingsObject });
      }
    } catch (err: any) {
      console.error('Error fetching site settings:', err);
      setError(err.message);
      // Use default settings on error
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Listen for real-time updates to site settings
    const channel = supabase
      .channel('site-settings-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'site_settings'
      }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading, error, refetch: fetchSettings };
};