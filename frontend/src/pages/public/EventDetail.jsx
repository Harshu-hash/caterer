import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SectionHeading from '../../components/common/SectionHeading';
import Reveal from '../../components/common/Reveal';
import { PrimaryButton } from '../../components/common/Buttons';
import { LoadingState, ErrorState } from '../../components/common/States';
import { PinIcon, ClockIcon, PlateIcon } from '../../components/events/icons';
import { getEventById } from '../../services/publicApi';

const DATE_FMT = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const TIME_FMT = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

function formatSchedule(startDateTime, endDateTime) {
  const start = new Date(startDateTime);
  const end = endDateTime ? new Date(endDateTime) : null;
  if (!end) return `${DATE_FMT.format(start)} · ${TIME_FMT.format(start)}`;
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) return `${DATE_FMT.format(start)} · ${TIME_FMT.format(start)} - ${TIME_FMT.format(end)}`;
  return `${DATE_FMT.format(start)}, ${TIME_FMT.format(start)} - ${DATE_FMT.format(end)}, ${TIME_FMT.format(end)}`;
}

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEvent(null);
    setError(null);
    getEventById(id)
      .then(setEvent)
      .catch(() => setError('This event could not be found.'));
  }, [id]);

  useSeo({
    title: event ? `${event.title} | Shree Sanware Sarkar Caters and Supervision` : 'Event',
    description: event?.description || 'Event details from Shree Sanware Sarkar Caters and Supervision.',
  });

  if (error) {
    return (
      <section className="container-page py-20">
        <ErrorState message={error} />
        <div className="text-center mt-6">
          <Link to="/events" className="btn-secondary">Back to Events</Link>
        </div>
      </section>
    );
  }

  if (!event) return <LoadingState label="Loading event..." />;

  const isLive = event.timingStatus === 'live';
  const isPast = event.timingStatus === 'past';
  const dishSections = event.dishSections || [];

  return (
    <>
      <PageHero
        eyebrow={event.eventType || 'Event'}
        title={event.title}
        description={formatSchedule(event.startDateTime, event.endDateTime)}
        image={event.image}
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Events', to: '/events' }, { label: event.title }]} />

      <section className="container-page pt-2 pb-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            {isLive && (
              <Reveal>
                <span className="inline-flex items-center gap-1.5 bg-maroon text-ivory text-xs font-semibold px-2.5 py-1 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-gold-bright animate-ping-slow" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-bright" />
                  </span>
                  LIVE NOW
                </span>
              </Reveal>
            )}

            <Reveal delay={60}>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brown-muted mb-6">
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4 text-gold" /> {formatSchedule(event.startDateTime, event.endDateTime)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PinIcon className="w-4 h-4 text-gold" /> {event.venueName}
                  {event.venueAddress && `, ${event.venueAddress}`}
                </span>
              </div>
            </Reveal>

            {event.description && (
              <Reveal delay={100}>
                <p className="text-brown-muted leading-relaxed whitespace-pre-line mb-10">{event.description}</p>
              </Reveal>
            )}

            {dishSections.length > 0 && (
              <div className="space-y-10">
                {dishSections.map((section, sectionIndex) => (
                  <div key={section.heading + sectionIndex}>
                    <SectionHeading eyebrow={sectionIndex === 0 ? 'On the Menu' : undefined} title={section.heading} />
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {section.dishes.map((dish, i) => (
                        <Reveal key={dish.name + i} delay={(i % 6) * 70}>
                          <div className="card-elevated bg-white border border-border-beige flex overflow-hidden">
                            {dish.image && (
                              <div className="w-28 shrink-0 overflow-hidden bg-ivory">
                                <img src={dish.image} alt={dish.name} className="w-full h-full object-contain" loading="lazy" />
                              </div>
                            )}
                            <div className="p-4 min-w-0 flex-1 flex items-center">
                              <h3 className="font-display text-lg text-espresso truncate">{dish.name}</h3>
                            </div>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {dishSections.length === 0 && event.menuHighlights?.length > 0 && (
              <div>
                <SectionHeading eyebrow="On the Menu" title="Menu Highlights" />
                <div className="flex flex-wrap gap-2 mt-6">
                  {event.menuHighlights.map((dish) => (
                    <span key={dish} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 bg-ivory border border-border-beige text-espresso">
                      <PlateIcon className="w-3.5 h-3.5 text-gold" />
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isPast && <p className="text-sm text-brown-muted italic mt-8">This event has concluded.</p>}
          </div>

          <aside className="bg-white border border-border-beige p-6 h-fit">
            <h3 className="font-display text-xl text-espresso mb-3">Want an Event Like This?</h3>
            <p className="text-sm text-brown-muted mb-6">
              Request a customized catering quote for your own celebration.
            </p>
            <PrimaryButton to="/get-a-quote" className="w-full">Get a Quote</PrimaryButton>
            <Link to="/events" className="block text-center text-sm text-maroon hover:underline mt-4">
              &larr; Back to all events
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
