import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import QuoteForm from '../../components/forms/QuoteForm';

export default function GetAQuote() {
  useSeo({ title: 'Get a Quote | Shree Sanware Sarkar Caters and Supervision', description: 'Request a customized catering quote for your event.' });

  return (
    <>
      <PageHero eyebrow="Get a Quote" title="Plan Your Celebration" description="Tell us about your event and we'll get back to you with a customized quote." />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Get a Quote' }]} />

      <section className="container-page py-16 max-w-3xl mx-auto">
        <QuoteForm />
      </section>
    </>
  );
}
