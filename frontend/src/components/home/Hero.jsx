import { useRef } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import BokehLights from '../common/BokehLights';
import FloatingPetals from '../common/FloatingPetals';
import rangoli from '../../assets/rangoli.png';

export default function Hero() {
  const { settings } = useSiteSettings();
  const hero = settings.hero || {};
  const parallaxRef = useRef(null);

  function handlePointerMove(e) {
    const el = parallaxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--px', `${x * 24}px`);
    el.style.setProperty('--py', `${y * 24}px`);
  }

  function handlePointerLeave() {
    const el = parallaxRef.current;
    if (!el) return;
    el.style.setProperty('--px', '0px');
    el.style.setProperty('--py', '0px');
  }

  return (
    <section
      ref={parallaxRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative min-h-[88vh] flex items-center overflow-hidden wine-surface"
    >
      <div className="absolute inset-0 -z-10">
        {hero.image && (
          <img
            src={hero.image}
            alt=""
            className="w-full h-full object-cover mix-blend-luminosity opacity-40"
            fetchPriority="high"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/70 to-maroon-rich/40" />
      </div>

      <div
        className="absolute inset-0 -z-[6] transition-transform duration-300 ease-out"
        style={{ transform: 'translate3d(var(--px, 0px), var(--py, 0px), 0)' }}
      >
        <BokehLights />
      </div>

      <FloatingPetals className="-z-[4]" />

      {/* Slowly spinning rangoli medallion, centered behind the content */}
      <img
        src={rangoli}
        alt=""
        aria-hidden="true"
        className="absolute -z-[4] left-[92%] top-1/2 w-[72vw] max-w-[760px] opacity-20 animate-spin-slow pointer-events-none select-none"
      />

      {/* Soft pulsing gold aura behind the headline for extra depth */}
      <div
        aria-hidden="true"
        className="absolute -z-[3] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[760px] aspect-square rounded-full animate-aura-pulse pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-gold-bright) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="container-page relative py-32 text-ivory">
        <p className="eyebrow text-gold-light mb-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
          Premium Indian Catering &amp; Events
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-semibold max-w-3xl leading-tight animate-fade-up" style={{ animationDelay: '200ms' }}>
          <span className="gold-shine-text">{hero.headline}</span>
        </h1>
        {hero.subheading && (
          <p className="mt-6 max-w-xl text-lg text-ivory/90 animate-fade-up" style={{ animationDelay: '340ms' }}>
            {hero.subheading}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '460ms' }}>
          <PrimaryButton to="/get-a-quote" className="btn-gold">
            Get a Quote
          </PrimaryButton>
          <SecondaryButton to="/menu" className="border-ivory/60 text-ivory hover:bg-ivory hover:text-maroon-deep">
            Explore Our Menu
          </SecondaryButton>
        </div>
      </div>

      <div className="absolute bottom-6 inset-x-0 flex justify-center animate-arrow-bounce" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-light)" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
