import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import logo from '../../assets/logo-optimized.png';

const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/wedding-catering', label: 'Wedding Catering' },
  { to: '/menu', label: 'Menu' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-gradient-to-r from-maroon-deep via-maroon-rich to-maroon-deep border-b animate-fade-up ${
        isScrolled ? 'shadow-lg border-gold/25' : 'border-gold/10'
      }`}
    >
      <div className="container-page flex items-center justify-between gap-4 h-18 py-3">
        <NavLink to="/" title={settings.businessName} className="flex items-center gap-3 min-w-0">
          <img
            src={logo}
            alt=""
            className={`shrink-0 object-contain transition-all duration-300 ${isScrolled ? 'h-10 w-10' : 'h-12 w-12'}`}
          />
          <span
            className={`sm:hidden font-logo gold-shine-text font-extrabold tracking-wide transition-all duration-300 min-w-0 truncate ${isScrolled ? 'text-sm' : 'text-base'}`}
          >
            SSS Caters and Supervision
          </span>
          <span
            className={`hidden sm:inline font-logo gold-shine-text font-extrabold tracking-wide transition-all duration-300 min-w-0 truncate ${isScrolled ? 'text-base lg:text-lg xl:text-xl' : 'text-lg lg:text-xl xl:text-2xl'}`}
          >
            {settings.businessName}
          </span>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-7 shrink-0" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group relative py-1 text-sm font-medium tracking-wide whitespace-nowrap ${
                  isActive ? 'text-gold' : 'text-ivory/90 hover:text-gold'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-px bg-gold transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block shrink-0">
          <NavLink to="/get-a-quote" className="btn-primary btn-gold whitespace-nowrap">
            Get a Quote
          </NavLink>
        </div>

        <button
          type="button"
          className="lg:hidden shrink-0 text-ivory p-2"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`lg:hidden grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <nav
          id="mobile-nav"
          aria-label="Mobile primary"
          className="overflow-hidden bg-maroon-deep border-t border-gold/20"
        >
          <div className="px-5 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: isOpen ? `${i * 40}ms` : '0ms' }}
                className={({ isActive }) =>
                  `text-base font-medium transition-all duration-300 ${
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  } ${isActive ? 'text-gold' : 'text-ivory/90'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/get-a-quote"
              onClick={() => setIsOpen(false)}
              className="btn-primary btn-gold text-center"
            >
              Get a Quote
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
