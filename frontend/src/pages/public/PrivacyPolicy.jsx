import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function PrivacyPolicy() {
  useSeo({ title: 'Privacy Policy | Shree Sanware Sarkar Caters and Supervision' });
  const { settings } = useSiteSettings();

  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]} />

      <section className="container-page py-16 max-w-3xl mx-auto space-y-6 text-brown-muted leading-relaxed">
        <p>
          {settings.businessName} collects only the information needed to respond to your catering
          inquiry: your name, phone number, email (if provided), and event details.
        </p>
        <p>
          This information is used solely to contact you about your inquiry and is not sold or shared
          with third parties for marketing purposes. Access to inquiry data is restricted to authorized
          administrators of this website.
        </p>
        <p>
          Replace this page with the business's finalized privacy policy, including data retention and
          deletion practices, before launch.
        </p>
      </section>
    </>
  );
}
