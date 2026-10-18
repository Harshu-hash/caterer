import { useEffect, useState } from 'react';
import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import ReviewCard from '../../components/reviews/ReviewCard';
import Reveal from '../../components/common/Reveal';
import Pagination from '../../components/common/Pagination';
import { SecondaryButton } from '../../components/common/Buttons';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import { getReviews } from '../../services/publicApi';

export default function Reviews() {
  useSeo({
    title: 'Reviews | Shree Sanware Sarkar Caters and Supervision',
    description: 'Read what our guests have to say about their catering experience.',
  });

  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  function load() {
    setReviews(null);
    setError(null);
    getReviews({ page, limit: 12 })
      .then((res) => {
        setReviews(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setError('Unable to load reviews right now.'));
  }

  useEffect(load, [page]);

  return (
    <>
      <PageHero eyebrow="Reviews" title="What Our Guests Say" description="Real feedback from people we've had the pleasure of catering for." />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Reviews' }]} />

      <section className="container-page py-16">
        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !reviews && <LoadingState label="Loading reviews..." />}
        {reviews && reviews.length === 0 && (
          <EmptyState
            title="No reviews yet"
            description="Be the first to share your experience from one of our events."
            action={<SecondaryButton to="/events">Visit Our Events Page</SecondaryButton>}
          />
        )}
        {reviews && reviews.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <Reveal key={review._id} delay={(i % 6) * 80}>
                  <ReviewCard review={review} />
                </Reveal>
              ))}
            </div>
            <Pagination page={page} totalPages={pagination?.totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </>
  );
}
