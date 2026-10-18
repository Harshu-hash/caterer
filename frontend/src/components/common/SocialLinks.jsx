import { useSiteSettings } from '../../context/SiteSettingsContext';

const PLATFORMS = [
  {
    key: 'instagram',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h2.5l.5-4H13V7a1 1 0 0 1 1-1h2z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2.5" y="5.5" width="19" height="13" rx="3" />
        <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function SocialLinks({ className = '' }) {
  const { settings } = useSiteSettings();
  const links = settings.socialLinks || {};

  const active = PLATFORMS.filter((p) => links[p.key]);
  if (active.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {active.map((p) => (
        <a
          key={p.key}
          href={links[p.key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={p.label}
          className="w-9 h-9 flex items-center justify-center border border-gold/40 text-gold hover:bg-gold hover:text-maroon-deep transition-colors"
        >
          {p.icon}
        </a>
      ))}
    </div>
  );
}
