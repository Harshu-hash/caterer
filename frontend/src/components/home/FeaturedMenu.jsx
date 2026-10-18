import { useEffect, useState } from 'react';
import SectionHeading from '../common/SectionHeading';
import MenuItemCard from '../menu/MenuItemCard';
import Reveal from '../common/Reveal';
import { LoadingState, ErrorState } from '../common/States';
import { SecondaryButton } from '../common/Buttons';
import { getMenuItems } from '../../services/publicApi';

export default function FeaturedMenu() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMenuItems({ limit: 4, sort: 'sortOrder' })
      .then((res) => setItems(res.data))
      .catch(() => setError('Unable to load the menu right now.'));
  }, []);

  return (
    <section className="bg-ivory py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Signature Dishes" title="A Taste of Our Menu" align="center" />
        <div className="mt-12">
          {error && <ErrorState message={error} />}
          {!error && !items && <LoadingState label="Loading menu..." />}
          {items && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item, i) => (
                <Reveal key={item._id} delay={i * 80}>
                  <MenuItemCard item={item} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <div className="mt-10 text-center">
          <SecondaryButton to="/menu">View Full Menu</SecondaryButton>
        </div>
      </div>
    </section>
  );
}
