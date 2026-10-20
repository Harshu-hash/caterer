import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function WhatsAppCTA({ className = '' }) {
  const { settings } = useSiteSettings();
  const whatsApp = settings.contact?.whatsApp;
  if (!whatsApp) return null;

  const digits = whatsApp.replace(/[^0-9]/g, '');
  const message = encodeURIComponent("Hi! I'd like to know more about your catering services.");

  return (
    <a
      href={`https://wa.me/${digits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 text-sm font-medium text-success hover:underline ${className}`}
    >
      WhatsApp Us
    </a>
  );
}
