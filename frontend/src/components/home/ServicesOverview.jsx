import { useEffect, useState } from 'react';
import SectionHeading from '../common/SectionHeading';
import ServiceCard from '../services/ServiceCard';
import Reveal from '../common/Reveal';
import { LoadingState, ErrorState } from '../common/States';
import { getServices } from '../../services/publicApi';

export default function ServicesOverview() {
  const [services, setServices] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => setError('Unable to load services right now.'));
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="What We Offer"
          title="Catering for Every Celebration"
          align="center"
        />
        <div className="mt-12">
          {error && <ErrorState message={error} />}
          {!error && !services && <LoadingState label="Loading services..." />}
          {services && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.slice(0, 4).map((service, i) => (
                <Reveal key={service._id} delay={i * 80}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
