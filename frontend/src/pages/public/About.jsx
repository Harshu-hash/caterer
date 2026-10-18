import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SectionHeading from '../../components/common/SectionHeading';
import { PrimaryButton } from '../../components/common/Buttons';
import Reveal from '../../components/common/Reveal';

export default function About() {
  useSeo({ title: 'About Us | Shree Sanware Sarkar Caters and Supervision', description: 'Our story, philosophy, and commitment to hospitality.' });

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Our Story"
        description="Tradition, presented with understated luxury."
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />

      <section className="container-page py-16 grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <img
            src="https://picsum.photos/seed/about-story/900/1100"
            alt="Our catering team at work"
            className="w-full h-[420px] md:h-[520px] object-cover shadow-xl"
            loading="lazy"
          />
        </Reveal>
        <div>
          <SectionHeading eyebrow="Our Philosophy" title="Culinary Heritage, Contemporary Hospitality" />
          <p className="mt-6 text-brown-muted leading-relaxed">
            Replace this section with the business's real founding story, culinary philosophy, and
            hospitality approach. Avoid invented certifications, years of experience, or client claims
            until confirmed by the business owner.
          </p>
          <div className="mt-8">
            <PrimaryButton to="/get-a-quote">Plan Your Celebration</PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
