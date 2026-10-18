import { useEffect, useCallback } from 'react';

export default function Lightbox({ items, activeIndex, onClose, onNavigate }) {
  const item = items[activeIndex];

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((activeIndex + 1) % items.length);
      if (e.key === 'ArrowLeft') onNavigate((activeIndex - 1 + items.length) % items.length);
    },
    [activeIndex, items.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[100] bg-maroon-deep/97 flex items-center justify-center px-4 animate-fade-in"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 text-ivory text-3xl leading-none p-2 transition-colors hover:text-gold"
      >
        &times;
      </button>

      <button
        type="button"
        onClick={() => onNavigate((activeIndex - 1 + items.length) % items.length)}
        aria-label="Previous image"
        className="absolute left-2 md:left-6 text-ivory text-4xl p-2 transition-all hover:text-gold hover:-translate-x-1"
      >
        &#8249;
      </button>

      <figure key={activeIndex} className="max-w-4xl max-h-[85vh] flex flex-col items-center animate-fade-up">
        <img
          src={item.imageUrl}
          alt={item.altText || item.title}
          className="max-h-[75vh] w-auto object-contain shadow-2xl"
        />
        {item.caption && <figcaption className="text-ivory/80 text-sm mt-4">{item.caption}</figcaption>}
      </figure>

      <button
        type="button"
        onClick={() => onNavigate((activeIndex + 1) % items.length)}
        aria-label="Next image"
        className="absolute right-2 md:right-6 text-ivory text-4xl p-2 transition-all hover:text-gold hover:translate-x-1"
      >
        &#8250;
      </button>
    </div>
  );
}
