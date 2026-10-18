import { useEffect, useState } from 'react';
import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import PackageCard from '../../components/services/PackageCard';
import Reveal from '../../components/common/Reveal';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import { getPackages } from '../../services/publicApi';

export default function Packages() {
  useSeo({ title: 'Catering Packages | Shree Sanware Sarkar Caters and Supervision', description: 'Configurable catering packages for every event size.' });

  const [packages, setPackages] = useState(null);
  const [error, setError] = useState(null);

  function load() {
    setError(null);
    setPackages(null);
    getPackages().then(setPackages).catch(() => setError('Unable to load packages right now.'));
  }

  useEffect(load, []);

  return (
    <>
      <PageHero eyebrow="Packages" title="Catering Packages" description="Starting points you can fully customize to your event." />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Packages' }]} />

      <section className="container-page py-16">
        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !packages && <LoadingState label="Loading packages..." />}
        {packages && packages.length === 0 && <EmptyState title="Packages coming soon" />}
        {packages && packages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <Reveal key={pkg._id} delay={(i % 6) * 80}>
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
