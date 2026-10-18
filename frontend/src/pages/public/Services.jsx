import { useEffect, useState } from 'react';
import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import ServiceCard from '../../components/services/ServiceCard';
import Reveal from '../../components/common/Reveal';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import { getServices } from '../../services/publicApi';

export default function Services() {
  useSeo({ title: 'Our Services | Shree Sanware Sarkar Caters and Supervision', description: 'Explore our catering services for every type of celebration.' });

  const [services, setServices] = useState(null);
  const [error, setError] = useState(null);

  function load() {
    setError(null);
    setServices(null);
    getServices().then(setServices).catch(() => setError('Unable to load services right now.'));
  }

  useEffect(load, []);

  return (
    <>
      <PageHero eyebrow="Our Services" title="Catering for Every Celebration" />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services' }]} />

      <section className="container-page py-16">
        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !services && <LoadingState label="Loading services..." />}
        {services && services.length === 0 && <EmptyState title="Services coming soon" />}
        {services && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <Reveal key={service._id} delay={(i % 6) * 80}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
