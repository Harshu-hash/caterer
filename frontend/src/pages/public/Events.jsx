import { useEffect, useState } from 'react';
import { useSeo } from '../../hooks/useSeo';
import { useInView } from '../../hooks/useInView';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import EventsHero from '../../components/events/EventsHero';
import EventCard, { FeaturedEventCard } from '../../components/events/EventCard';
import SectionHeading from '../../components/common/SectionHeading';
import Reveal from '../../components/common/Reveal';
import Pagination from '../../components/common/Pagination';
import ReviewForm from '../../components/reviews/ReviewForm';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import { getEvents } from '../../services/publicApi';

export default function Events() {
  useSeo({
    title: 'Events | Shree Sanware Sarkar Caters and Supervision',
    description: 'See where we are catering next — live and upcoming events, venues, and menus.',
  });

  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  function load() {
    setEvents(null);
    setError(null);
    getEvents({ page, limit: 12 })
      .then((res) => {
        setEvents(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setError('Unable to load events right now.'));
  }

  useEffect(load, [page]);

  const liveEvents = events?.filter((e) => e.timingStatus === 'live') || [];
  const upcomingEvents = events?.filter((e) => e.timingStatus !== 'live') || [];

  const { ref: timelineRef, isVisible: timelineVisible } = useInView({ threshold: 0.05 });

  return (
    <>
      <EventsHero liveEvent={liveEvents[0]} nextEvent={!liveEvents[0] ? upcomingEvents[0] : undefined} />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Events' }]} />

      <section className="container-page pt-2 pb-16 space-y-16">
        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !events && <LoadingState label="Loading events..." />}
        {events && events.length === 0 && (
          <EmptyState title="No upcoming events right now" description="Check back soon for our next event." />
        )}

        {liveEvents.length > 0 && (
          <div>
            <SectionHeading eyebrow="Right Now" title="Happening Today" />
            <div className="mt-8 space-y-6">
              {liveEvents.map((event, i) => (
                <Reveal key={event._id} delay={i * 100}>
                  <FeaturedEventCard event={event} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {upcomingEvents.length > 0 && (
          <div>
            <SectionHeading eyebrow="Mark Your Calendar" title="Upcoming Events" />
            <div ref={timelineRef} className="relative mt-10 max-w-3xl mx-auto">
              <div
                aria-hidden="true"
                className={`timeline-line hidden sm:block absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-gold via-border-beige to-transparent ${timelineVisible ? 'is-visible' : ''}`}
              />
              <div className="space-y-6 sm:pl-10">
                {upcomingEvents.map((event, i) => (
                  <Reveal key={event._id} delay={200 + (i % 6) * 120} className="relative">
                    <EventCard event={event} />
                  </Reveal>
                ))}
              </div>
            </div>
            <Pagination page={page} totalPages={pagination?.totalPages} onChange={setPage} />
          </div>
        )}

        <div>
          <SectionHeading eyebrow="Been to One of Our Events?" title="Share Your Experience" align="center" />
          <div className="mt-10 max-w-xl mx-auto">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
