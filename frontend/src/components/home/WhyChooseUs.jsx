import SectionHeading from '../common/SectionHeading';
import BokehLights from '../common/BokehLights';
import Reveal from '../common/Reveal';

const POINTS = [
  { title: 'Customized Menus', description: 'Every menu is tailored to your event, guest preferences, and cuisine style.' },
  { title: 'Presentation & Service', description: 'Thoughtful plating, live counters, and attentive service staff.' },
  { title: 'Hygiene & Quality', description: 'Fresh ingredients and careful food handling at every event.' },
  { title: 'End-to-End Coordination', description: 'From menu planning to on-site setup, we coordinate every detail.' },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden wine-surface text-ivory py-20">
      <BokehLights opacity={0.5} />
      <div className="container-page relative">
        <SectionHeading eyebrow="Why Choose Us" title="Hospitality, Done Right" align="center" dark />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POINTS.map((point, i) => (
            <Reveal key={point.title} delay={i * 90}>
              <div className="text-center p-6 border border-ivory/10 bg-ivory/5 backdrop-blur-sm transition-colors hover:border-gold/40">
                <div className="mx-auto mb-4 h-px w-10 bg-gradient-to-r from-transparent via-gold to-transparent" />
                <h3 className="font-display text-lg mb-2 text-gold-light">{point.title}</h3>
                <p className="text-sm text-ivory/75 leading-relaxed">{point.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
