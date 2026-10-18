import { useEffect, useState } from 'react';
import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import GalleryGrid from '../../components/gallery/GalleryGrid';
import Pagination from '../../components/common/Pagination';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import { getGalleryItems } from '../../services/publicApi';

const CATEGORIES = ['All', 'Weddings', 'Buffet Setups', 'Food', 'Live Counters', 'Desserts'];

export default function Gallery() {
  useSeo({ title: 'Gallery | Shree Sanware Sarkar Caters and Supervision', description: 'Browse our food and event photography portfolio.' });

  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    setItems(null);
    setError(null);
    const params = { page, limit: 18 };
    if (activeCategory !== 'All') params.category = activeCategory;

    getGalleryItems(params)
      .then((res) => {
        setItems(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setError('Unable to load the gallery right now.'));
  }, [activeCategory, page]);

  return (
    <>
      <PageHero eyebrow="Gallery" title="Our Food &amp; Event Portfolio" />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Gallery' }]} />

      <section className="container-page py-10">
        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className={`px-4 py-2 text-sm font-medium border transition-colors duration-200 ${
                activeCategory === cat
                  ? 'bg-maroon text-ivory border-maroon'
                  : 'border-border-beige text-espresso hover:border-gold hover:text-maroon'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && <ErrorState message={error} />}
        {!error && !items && <LoadingState label="Loading gallery..." />}
        {items && items.length === 0 && <EmptyState title="No images in this category yet" />}
        {items && items.length > 0 && (
          <>
            <GalleryGrid items={items} />
            <Pagination page={page} totalPages={pagination?.totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </>
  );
}
