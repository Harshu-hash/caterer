import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service.slug}`}
      className="card-elevated group block bg-white border border-border-beige"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-espresso mb-2">{service.title}</h3>
        <p className="text-sm text-brown-muted leading-relaxed">{service.summary}</p>
        <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-maroon group-hover:text-gold group-hover:gap-2 transition-all">
          Learn more &rarr;
        </span>
      </div>
    </Link>
  );
}
