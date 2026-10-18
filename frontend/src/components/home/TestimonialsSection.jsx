import { useEffect, useState } from 'react';
import SectionHeading from '../common/SectionHeading';
import TestimonialCard from '../common/TestimonialCard';
import Reveal from '../common/Reveal';
import { LoadingState, ErrorState, EmptyState } from '../common/States';
import { getTestimonials } from '../../services/publicApi';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTestimonials()
      .then(setTestimonials)
      .catch(() => setError('Unable to load testimonials right now.'));
  }, []);

  return (
    <section className="bg-ivory py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Kind Words" title="What Our Guests Say" align="center" />
        <div className="mt-12">
          {error && <ErrorState message={error} />}
          {!error && !testimonials && <LoadingState label="Loading testimonials..." />}
          {testimonials && testimonials.length === 0 && <EmptyState title="Testimonials coming soon" />}
          {testimonials && testimonials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t, i) => (
                <Reveal key={t._id} delay={i * 90}>
                  <TestimonialCard testimonial={t} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
