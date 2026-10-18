import { StarRatingDisplay } from './StarRating';

const DATE_FMT = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ReviewCard({ review }) {
  return (
    <figure className="card-elevated bg-white border border-border-beige p-6 h-full flex flex-col">
      <StarRatingDisplay rating={review.rating} className="mb-3" />
      <blockquote className="text-brown-muted text-sm leading-relaxed flex-1">{review.reviewText}</blockquote>
      <figcaption className="mt-4 pt-4 border-t border-border-beige flex items-center justify-between gap-2">
        <p className="font-semibold text-espresso text-sm">{review.name}</p>
        {review.createdAt && <p className="text-xs text-brown-muted whitespace-nowrap">{DATE_FMT.format(new Date(review.createdAt))}</p>}
      </figcaption>
    </figure>
  );
}
