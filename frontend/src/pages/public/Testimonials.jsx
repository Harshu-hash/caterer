import { useEffect, useState } from 'react';
import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import TestimonialCard from '../../components/common/TestimonialCard';
import Reveal from '../../components/common/Reveal';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import { getTestimonials } from '../../services/publicApi';

export default function Testimonials() {
  useSeo({ title: 'Testimonials | Shree Sanware Sarkar Caters and Supervision', description: 'Hear from our customers about their events.' });

  const [testimonials, setTestimonials] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTestimonials().then(setTestimonials).catch(() => setError('Unable to load testimonials right now.'));
  }, []);

  return (
    <>
      <PageHero eyebrow="Testimonials" title="What Our Guests Say" />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Testimonials' }]} />

      <section className="container-page py-16">
        {error && <ErrorState message={error} />}
        {!error && !testimonials && <LoadingState label="Loading testimonials..." />}
        {testimonials && testimonials.length === 0 && <EmptyState title="Testimonials coming soon" />}
        {testimonials && testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t._id} delay={(i % 6) * 80}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
