import { Link } from 'react-router-dom';
import { PinIcon, ClockIcon, PlateIcon } from './icons';

const DAY_FMT = new Intl.DateTimeFormat('en-IN', { day: '2-digit' });
const MONTH_FMT = new Intl.DateTimeFormat('en-IN', { month: 'short' });
const WEEKDAY_FMT = new Intl.DateTimeFormat('en-IN', { weekday: 'short' });
const TIME_FMT = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
const DATE_FMT = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function formatTimeRange(startDateTime, endDateTime) {
  const start = new Date(startDateTime);
  const end = endDateTime ? new Date(endDateTime) : null;
  const sameDay = end && start.toDateString() === end.toDateString();

  if (!end) return TIME_FMT.format(start);
  if (sameDay) return `${TIME_FMT.format(start)} - ${TIME_FMT.format(end)}`;
  return `${TIME_FMT.format(start)} - ${DATE_FMT.format(end)}, ${TIME_FMT.format(end)}`;
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-maroon text-ivory text-xs font-semibold px-2.5 py-1 shadow-lg">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-gold-bright animate-ping-slow" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-bright" />
      </span>
      LIVE NOW
    </span>
  );
}

function MenuChips({ highlights, max = 5 }) {
  if (!highlights?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {highlights.slice(0, max).map((dish) => (
        <span key={dish} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-ivory border border-border-beige text-espresso">
          <PlateIcon className="w-3 h-3 text-gold" />
          {dish}
        </span>
      ))}
      {highlights.length > max && (
        <span className="text-xs font-medium px-2 py-1 text-brown-muted">+{highlights.length - max} more</span>
      )}
    </div>
  );
}

// Large spotlight card for events currently in progress.
export function FeaturedEventCard({ event }) {
  const highlights = event.menuHighlights || [];

  return (
    <Link to={`/events/${event._id}`} className="relative block p-[2px] overflow-hidden">
      {/* Slowly rotating gold conic gradient, visible only as a thin animated border */}
      <div
        aria-hidden="true"
        className="absolute -inset-[150%] -z-10 animate-conic-spin"
        style={{
          background:
            'conic-gradient(from 0deg, var(--color-gold) 0%, var(--color-gold-bright) 20%, transparent 45%, transparent 55%, var(--color-gold) 80%, var(--color-gold-bright) 100%)',
        }}
      />
      <div className="shine-auto wine-surface text-ivory shadow-[0_0_45px_-12px_var(--color-gold-bright)]">
        <div className="relative grid md:grid-cols-5">
          {event.image && (
            <div className="md:col-span-2 aspect-[16/9] md:aspect-auto relative overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover animate-ken-burns" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/70 md:bg-gradient-to-r md:from-transparent md:to-maroon-deep/40" />
            </div>
          )}
        <div className={`p-6 md:p-8 flex flex-col justify-center ${event.image ? 'md:col-span-3' : 'md:col-span-5'}`}>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <LiveBadge />
            {event.eventType && <span className="eyebrow text-gold-light">{event.eventType}</span>}
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3">{event.title}</h3>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/90 mb-3">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-gold" /> {formatTimeRange(event.startDateTime, event.endDateTime)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PinIcon className="w-4 h-4 text-gold" /> {event.venueName}
            </span>
          </div>

          {event.description && <p className="text-sm text-ivory/80 leading-relaxed">{event.description}</p>}

          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {highlights.slice(0, 6).map((dish) => (
                <span key={dish} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-ivory/10 border border-gold/30 text-ivory">
                  <PlateIcon className="w-3 h-3 text-gold-light" />
                  {dish}
                </span>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </Link>
  );
}

// Ticket-stub styled card for the upcoming-events timeline.
export default function EventCard({ event }) {
  const start = new Date(event.startDateTime);
  const isPast = event.timingStatus === 'past';
  const highlights = event.menuHighlights || [];

  return (
    <Link
      to={`/events/${event._id}`}
      className="shine-auto card-elevated animate-card-blink group relative bg-white border flex flex-col sm:flex-row overflow-hidden"
    >
      {/* Date stub */}
      <div className="sm:w-24 shrink-0 bg-maroon text-ivory flex sm:flex-col items-center justify-center gap-2 sm:gap-0 px-4 py-3 sm:py-4 relative z-10">
        <span className="text-xs uppercase tracking-widest text-gold-light">{WEEKDAY_FMT.format(start)}</span>
        <span className="font-display text-2xl sm:text-3xl font-bold leading-none">{DAY_FMT.format(start)}</span>
        <span className="text-xs uppercase tracking-widest text-gold-light">{MONTH_FMT.format(start)}</span>
        {/* Perforated edge between the stub and the card body */}
        <span
          aria-hidden="true"
          className="hidden sm:block absolute right-0 top-0 bottom-0 w-px"
          style={{
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 6px, rgba(250,245,234,0.35) 6px 12px)',
          }}
        />
      </div>

      {/* Event photo */}
      {event.image && (
        <div className="sm:w-36 h-28 sm:h-auto shrink-0 overflow-hidden relative">
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent sm:bg-gradient-to-r" />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {event.eventType && <span className="eyebrow">{event.eventType}</span>}
        </div>
        <h3 className="font-display text-lg text-espresso mb-1.5 group-hover:text-maroon transition-colors">{event.title}</h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brown-muted">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="w-4 h-4 text-gold" /> {formatTimeRange(event.startDateTime, event.endDateTime)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PinIcon className="w-4 h-4 text-gold" /> {event.venueName}
          </span>
        </div>
        {event.venueAddress && <p className="text-xs text-brown-muted mt-0.5">{event.venueAddress}</p>}

        {event.description && <p className="text-sm text-brown-muted mt-2 line-clamp-2">{event.description}</p>}

        <MenuChips highlights={highlights} max={3} />

        {isPast && <p className="text-xs text-brown-muted mt-2 italic">This event has concluded.</p>}

        <span className="shine-auto inline-flex items-center gap-1.5 mt-3 self-start bg-maroon text-ivory text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all group-hover:bg-gold group-hover:text-maroon group-hover:gap-2.5">
          View Details
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
