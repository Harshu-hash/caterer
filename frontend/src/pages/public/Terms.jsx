import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';

export default function Terms() {
  useSeo({ title: 'Terms of Use | Shree Sanware Sarkar Caters and Supervision' });

  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms' }]} />

      <section className="container-page py-16 max-w-3xl mx-auto space-y-6 text-brown-muted leading-relaxed">
        <p>
          Submitting an inquiry through this website requests a catering quote and does not constitute
          a confirmed booking. Bookings are confirmed only after direct communication with our team and
          mutual agreement on terms.
        </p>
        <p>
          Prices and package inclusions shown on this website are indicative and subject to
          confirmation based on guest count, venue, service style, and menu selections.
        </p>
        <p>
          Replace this page with the business's finalized terms of use before launch.
        </p>
      </section>
    </>
  );
}
