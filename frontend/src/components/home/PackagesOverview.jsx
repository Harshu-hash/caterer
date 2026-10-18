import { useEffect, useState } from 'react';
import SectionHeading from '../common/SectionHeading';
import PackageCard from '../services/PackageCard';
import Reveal from '../common/Reveal';
import { SecondaryButton } from '../common/Buttons';
import { LoadingState, ErrorState } from '../common/States';
import { getPackages } from '../../services/publicApi';

export default function PackagesOverview() {
  const [packages, setPackages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPackages()
      .then(setPackages)
      .catch(() => setError('Unable to load packages right now.'));
  }, []);

  // No packages configured yet — skip the section rather than show an empty shell.
  if (packages && packages.length === 0) return null;

  return (
    <section className="bg-ivory py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Plan Your Event" title="Catering Packages" align="center" />
        <div className="mt-12">
          {error && <ErrorState message={error} />}
          {!error && !packages && <LoadingState label="Loading packages..." />}
          {packages && packages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.slice(0, 3).map((pkg, i) => (
                <Reveal key={pkg._id} delay={i * 90}>
                  <PackageCard pkg={pkg} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <div className="mt-10 text-center">
          <SecondaryButton to="/packages">View All Packages</SecondaryButton>
        </div>
      </div>
    </section>
  );
}
