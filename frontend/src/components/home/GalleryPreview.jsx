import { useEffect, useState } from 'react';
import SectionHeading from '../common/SectionHeading';
import GalleryGrid from '../gallery/GalleryGrid';
import { LoadingState, ErrorState } from '../common/States';
import { SecondaryButton } from '../common/Buttons';
import { getGalleryItems } from '../../services/publicApi';

export default function GalleryPreview() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getGalleryItems({ limit: 6 })
      .then((res) => setItems(res.data))
      .catch(() => setError('Unable to load the gallery right now.'));
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Recent Celebrations" title="Moments We've Catered" align="center" />
        <div className="mt-12">
          {error && <ErrorState message={error} />}
          {!error && !items && <LoadingState label="Loading gallery..." />}
          {items && items.length > 0 && <GalleryGrid items={items} />}
        </div>
        <div className="mt-10 text-center">
          <SecondaryButton to="/gallery">View Gallery</SecondaryButton>
        </div>
      </div>
    </section>
  );
}
