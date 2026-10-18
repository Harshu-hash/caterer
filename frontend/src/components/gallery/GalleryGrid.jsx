import { useState } from 'react';
import Lightbox from './Lightbox';
import Reveal from '../common/Reveal';

export default function GalleryGrid({ items }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <Reveal key={item._id} delay={(index % 9) * 60}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block w-full aspect-square overflow-hidden border border-transparent transition-colors duration-300 hover:border-gold"
            >
              <img
                src={item.thumbnailUrl || item.imageUrl}
                alt={item.altText || item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-maroon-deep/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </Reveal>
        ))}
      </div>

      {activeIndex !== null && (
        <Lightbox
          items={items}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}
