import { useState } from 'react';

function Star({ filled, className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5-4.7-4.6 6.5-.9z" strokeLinejoin="round" />
    </svg>
  );
}

// Read-only stars, for displaying an existing rating on a review card.
export function StarRatingDisplay({ rating, starClassName = 'w-4 h-4', className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 text-gold ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} filled={n <= rating} className={starClassName} />
      ))}
    </div>
  );
}

// Interactive 1-5 star picker for the review submission form.
export function StarRatingInput({ value, onChange, error }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value || 0;

  return (
    <div>
      <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            aria-pressed={value === n}
            className="p-1 text-gold transition-transform hover:scale-110"
          >
            <Star filled={n <= display} className="w-8 h-8" />
          </button>
        ))}
      </div>
      {error && <span className="block text-xs text-error mt-1">{error}</span>}
    </div>
  );
}
