export default function TestimonialCard({ testimonial }) {
  return (
    <figure className="card-elevated bg-white border border-border-beige p-6 h-full flex flex-col">
      <div className="font-display text-4xl mb-2 leading-none gold-shine-text" aria-hidden="true">
        &ldquo;
      </div>
      <blockquote className="text-brown-muted text-sm leading-relaxed flex-1">
        {testimonial.review}
      </blockquote>
      <figcaption className="mt-4 pt-4 border-t border-border-beige">
        <p className="font-semibold text-espresso text-sm">{testimonial.customerName}</p>
        {testimonial.eventType && <p className="text-xs text-brown-muted">{testimonial.eventType}</p>}
      </figcaption>
    </figure>
  );
}
