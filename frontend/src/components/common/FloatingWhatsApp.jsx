import { useSiteSettings } from '../../context/SiteSettingsContext';

// Sticky WhatsApp bubble with a soft pulsing ring, so the fastest contact
// path stays reachable from anywhere on the site.
export default function FloatingWhatsApp() {
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
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-success/50 animate-ping-slow" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-success text-white shadow-xl transition-transform duration-200 group-hover:scale-110">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.12-2.9-6.98A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.19 0 4.25.85 5.8 2.41a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.27-8.23zm-4.5 4.59c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.72 4.17 3.71 2.06.83 2.48.66 2.93.62.45-.04 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.36-.77-1.86-.2-.49-.4-.42-.55-.43h-.1z" />
        </svg>
      </span>
    </a>
  );
}
