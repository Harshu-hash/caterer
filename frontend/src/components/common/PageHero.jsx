import BokehLights from './BokehLights';

export default function PageHero({ eyebrow, title, description, image }) {
  return (
    <section className="relative overflow-hidden wine-surface text-ivory">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="w-full h-full object-cover opacity-25 mix-blend-luminosity" />
        </div>
      )}
      <BokehLights opacity={0.7} />
      <div className="container-page relative py-20 md:py-28">
        {eyebrow && <p className="eyebrow text-gold-light mb-3">{eyebrow}</p>}
        <h1 className="font-display text-3xl md:text-5xl font-semibold max-w-2xl">{title}</h1>
        {description && <p className="mt-4 max-w-xl text-ivory/85">{description}</p>}
      </div>
    </section>
  );
}
