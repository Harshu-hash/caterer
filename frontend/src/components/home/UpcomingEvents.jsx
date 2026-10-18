import { useEffect, useState } from 'react';
import SectionHeading from '../common/SectionHeading';
import EventCard from '../events/EventCard';
import Reveal from '../common/Reveal';
import { SecondaryButton } from '../common/Buttons';
import { getEvents } from '../../services/publicApi';

export default function UpcomingEvents() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    getEvents({ limit: 3 })
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]));
  }, []);

  // No admin-set events yet — skip the section rather than show an empty shell.
  if (events && events.length === 0) return null;

  return (
    <section className="bg-ivory py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Where to Find Us" title="Live &amp; Upcoming Events" align="center" />
        <div className="mt-12">
          {!events && <div className="h-40" aria-hidden="true" />}
          {events && events.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <Reveal key={event._id} delay={i * 90}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <div className="mt-10 text-center">
          <SecondaryButton to="/events">View All Events</SecondaryButton>
        </div>
      </div>
    </section>
  );
}
