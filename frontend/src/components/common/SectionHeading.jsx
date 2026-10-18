import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, align = 'left', description, dark = false }) {
  return (
    <Reveal className={align === 'center' ? 'text-center' : 'text-left'}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className={`font-display text-3xl md:text-4xl font-semibold ${dark ? 'text-ivory' : 'text-espresso'}`}>
        {title}
      </h2>
      <div className={`gold-divider mt-4 ${align === 'center' ? 'mx-auto' : ''}`} />
      {description && (
        <p className={`mt-4 max-w-2xl text-base md:text-lg leading-relaxed ${dark ? 'text-ivory/75' : 'text-brown-muted'} ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
