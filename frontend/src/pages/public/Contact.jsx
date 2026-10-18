import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { PrimaryButton } from '../../components/common/Buttons';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import Reveal from '../../components/common/Reveal';

export default function Contact() {
  useSeo({ title: 'Contact Us | Shree Sanware Sarkar Caters and Supervision', description: 'Get in touch for catering inquiries and event planning.' });
  const { settings } = useSiteSettings();

  return (
    <>
      <PageHero eyebrow="Contact" title="Get in Touch" description="We'd love to hear about your celebration." />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

      <section className="container-page py-16 grid md:grid-cols-2 gap-12">
        <Reveal as="div" className="space-y-6">
          <div>
            <h3 className="eyebrow mb-2">Phone</h3>
            <p className="text-espresso text-lg">{settings.contact?.phone || 'Phone number coming soon'}</p>
          </div>
          <div>
            <h3 className="eyebrow mb-2">Email</h3>
            <p className="text-espresso text-lg">{settings.contact?.email || 'Email coming soon'}</p>
          </div>
          <div>
            <h3 className="eyebrow mb-2">Address</h3>
            <p className="text-espresso text-lg">{settings.address || 'Address coming soon'}</p>
          </div>
          <div>
            <h3 className="eyebrow mb-2">Service Area</h3>
            <p className="text-espresso text-lg">{settings.serviceArea || 'Service area coming soon'}</p>
          </div>
          <div>
            <h3 className="eyebrow mb-2">Operating Hours</h3>
            <p className="text-espresso text-lg">{settings.operatingHours || 'Hours coming soon'}</p>
          </div>
        </Reveal>

        <Reveal
          as="div"
          delay={150}
          className="card-elevated bg-white border border-border-beige p-8 text-center flex flex-col items-center justify-center"
        >
          <h3 className="font-display text-2xl text-espresso mb-3">Ready to Plan Your Event?</h3>
          <p className="text-brown-muted mb-6">Share your event details and we'll get back to you with a quote.</p>
          <PrimaryButton to="/get-a-quote">Get a Quote</PrimaryButton>
        </Reveal>
      </section>
    </>
  );
}
