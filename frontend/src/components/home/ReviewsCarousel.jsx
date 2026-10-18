import { useEffect, useRef, useState } from 'react';
import SectionHeading from '../common/SectionHeading';
import ReviewCard from '../reviews/ReviewCard';
import { SecondaryButton } from '../common/Buttons';
import { LoadingState, ErrorState } from '../common/States';
import { getReviews } from '../../services/publicApi';

const PAGE_SIZE = 3;
const AUTOPLAY_MS = 6000;

function chunk(items, size) {
  const pages = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    getReviews({ limit: 15 })
      .then((res) => setReviews(res.data))
      .catch(() => setError('Unable to load reviews right now.'));
  }, []);

  const pages = reviews ? chunk(reviews, PAGE_SIZE) : [];

  useEffect(() => {
    if (pages.length <= 1) return undefined;
    timerRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pages.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [pages.length]);

  function goTo(index) {
    clearInterval(timerRef.current);
    setPage(((index % pages.length) + pages.length) % pages.length);
  }

  // No approved reviews yet — skip the section rather than show an empty shell.
  if (reviews && reviews.length === 0) return null;

  return (
    <section className="bg-ivory py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Kind Words" title="What Our Guests Say" align="center" />
        <div className="mt-12">
          {error && <ErrorState message={error} />}
          {!error && !reviews && <LoadingState label="Loading reviews..." />}

          {pages.length > 0 && (
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  {pages.map((group, i) => (
                    <div key={i} className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                      {group.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {pages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(page - 1)}
                    aria-label="Previous reviews"
                    className="hidden md:flex absolute left-[-3rem] top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center border border-gold/40 text-maroon hover:bg-gold hover:text-maroon-deep transition-colors"
                  >
                    &#8249;
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(page + 1)}
                    aria-label="Next reviews"
                    className="hidden md:flex absolute right-[-3rem] top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center border border-gold/40 text-maroon hover:bg-gold hover:text-maroon-deep transition-colors"
                  >
                    &#8250;
                  </button>

                  <div className="mt-8 flex justify-center gap-2">
                    {pages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to review set ${i + 1}`}
                        aria-current={i === page}
                        className={`h-2 rounded-full transition-all duration-300 ${i === page ? 'w-6 bg-gold' : 'w-2 bg-gold/30 hover:bg-gold/60'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="mt-10 text-center">
          <SecondaryButton to="/reviews">Read All Reviews</SecondaryButton>
        </div>
      </div>
    </section>
  );
}
