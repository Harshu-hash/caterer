import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SectionHeading from '../../components/common/SectionHeading';
import { PrimaryButton } from '../../components/common/Buttons';
import Reveal from '../../components/common/Reveal';

const CEREMONIES = ['Haldi', 'Mehendi', 'Sangeet', 'Wedding Ceremony', 'Reception'];
const REGIONS = ['North Indian', 'South Indian', 'Gujarati', 'Punjabi', 'Rajasthani', 'Bengali'];

export default function WeddingCatering() {
  useSeo({
    title: 'Wedding Catering | Shree Sanware Sarkar Caters and Supervision',
    description: 'Premium wedding catering across every ceremony, with regional Indian cuisine and live counters.',
  });

  return (
    <>
      <PageHero
        eyebrow="Wedding Catering"
        title="Catering for Every Wedding Ceremony"
        description="From Haldi to Reception, we craft menus for each celebration of your wedding."
        image="https://picsum.photos/seed/wedding-hero/1920/1080"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wedding Catering' }]} />

      <section className="container-page py-16">
        <SectionHeading eyebrow="Multi-Event Arrangements" title="Catering Across the Wedding Timeline" align="center" />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CEREMONIES.map((ceremony, i) => (
            <Reveal key={ceremony} delay={i * 80}>
              <div className="card-elevated bg-white border border-border-beige p-6 text-center">
                <h3 className="font-display text-lg text-espresso">{ceremony}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Regional Cuisine Choices" title="Choose From Diverse Indian Cuisines" align="center" />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {REGIONS.map((region) => (
              <span
                key={region}
                className="px-4 py-2 border border-gold text-sm text-espresso transition-colors hover:bg-gold hover:text-maroon-deep"
              >
                {region}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <SectionHeading eyebrow="Start Planning" title="Let's Design Your Wedding Menu" align="center" />
        <div className="mt-8">
          <PrimaryButton to="/get-a-quote">Request a Wedding Quote</PrimaryButton>
        </div>
      </section>
    </>
  );
}
