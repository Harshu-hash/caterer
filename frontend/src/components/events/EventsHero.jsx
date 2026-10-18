import { useRef } from 'react';
import BokehLights from '../common/BokehLights';
import FloatingPetals from '../common/FloatingPetals';
import EventCountdown from './EventCountdown';
import rangoli from '../../assets/rangoli.png';

export default function EventsHero({ liveEvent, nextEvent }) {
  const parallaxRef = useRef(null);

  function handlePointerMove(e) {
    const el = parallaxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--px', `${x * 20}px`);
    el.style.setProperty('--py', `${y * 20}px`);
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
      className="relative overflow-hidden wine-surface text-ivory"
    >
      <div
        className="absolute inset-0 -z-[5] transition-transform duration-300 ease-out"
        style={{ transform: 'translate3d(var(--px, 0px), var(--py, 0px), 0)' }}
      >
        <BokehLights opacity={0.7} />
      </div>
      <FloatingPetals className="-z-[4]" />

      <img
        src={rangoli}
        alt=""
        aria-hidden="true"
        className="hidden sm:block absolute -z-[4] left-[85%] top-1/2 -translate-y-1/2 w-[45vw] max-w-[480px] opacity-15 animate-spin-slow pointer-events-none select-none"
      />

      <div
        aria-hidden="true"
        className="absolute -z-[3] left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] max-w-[600px] aspect-square rounded-full animate-aura-pulse pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-gold-bright) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="container-page relative py-14 sm:py-20 md:py-28">
        <p className="eyebrow text-gold-light mb-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
          Events
        </p>
        <h1
          className="font-display text-3xl md:text-5xl font-semibold max-w-2xl animate-fade-up"
          style={{ animationDelay: '180ms' }}
        >
          <span className="gold-shine-text">Live &amp; Upcoming Events</span>
        </h1>
        <p className="mt-4 max-w-xl text-ivory/85 animate-fade-up" style={{ animationDelay: '280ms' }}>
          See where we&apos;re catering next, with venue and menu details.
        </p>

        {liveEvent && (
          <div className="mt-8 sm:mt-10 inline-flex flex-wrap items-center gap-3 bg-maroon/60 border border-gold/40 px-5 py-4 animate-fade-up" style={{ animationDelay: '380ms' }}>
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold-bright animate-ping-slow" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-bright" />
            </span>
            <span className="text-sm">
              <span className="font-semibold text-gold-light">Happening now:</span>{' '}
              {liveEvent.title} at {liveEvent.venueName}
            </span>
          </div>
        )}

        {!liveEvent && nextEvent && (
          <div className="mt-8 sm:mt-10 animate-fade-up" style={{ animationDelay: '380ms' }}>
            <p className="eyebrow text-gold-light mb-4">
              Next Event: {nextEvent.title} &middot; {nextEvent.venueName}
            </p>
            <EventCountdown target={nextEvent.startDateTime} />
          </div>
        )}
      </div>
    </section>
  );
}
