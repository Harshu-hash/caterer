import { createContext, useContext, useEffect, useState } from 'react';
import { getSiteSettings } from '../services/publicApi';

const SiteSettingsContext = createContext(null);

const FALLBACK_SETTINGS = {
  businessName: 'Shree Sanware Sarkar Caters and Supervision',
  contact: { phone: '', email: '', whatsApp: '' },
  address: '',
  serviceArea: '',
  operatingHours: '',
  socialLinks: {},
  hero: { headline: "An Artful Feast for Life's Grandest Celebrations", subheading: '', image: '' },
  brandStory: {
    eyebrow: 'Our Story',
    title: 'Tradition, Presented with Understated Luxury',
    description:
      'We bring Indian culinary heritage to life with contemporary elegance, careful presentation, and genuine hospitality. Every menu is thoughtfully built around the celebration it is created for.',
    image: '',
  },
  footer: { aboutText: '' },
};

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSiteSettings()
      .then((data) => setSettings(data))
      .catch(() => setSettings(FALLBACK_SETTINGS))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  return ctx;
}
