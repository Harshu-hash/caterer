import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { LoadingState, ErrorState } from '../../components/common/States';
import { PrimaryButton } from '../../components/common/Buttons';
import { getServiceBySlug } from '../../services/publicApi';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setService(null);
    setError(null);
    getServiceBySlug(slug)
      .then(setService)
      .catch(() => setError('This service could not be found.'));
  }, [slug]);

  useSeo({
    title: service ? `${service.seoTitle || service.title} | Shree Sanware Sarkar Caters and Supervision` : 'Service',
    description: service?.seoDescription || service?.summary,
  });

  if (error) {
    return (
      <section className="container-page py-20">
        <ErrorState message={error} />
        <div className="text-center mt-6">
          <Link to="/services" className="btn-secondary">Back to Services</Link>
        </div>
      </section>
    );
  }

  if (!service) return <LoadingState label="Loading service..." />;

  return (
    <>
      <PageHero eyebrow="Our Services" title={service.title} description={service.summary} image={service.image} />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.title }]} />

      <section className="container-page py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <p className="text-brown-muted leading-relaxed whitespace-pre-line">{service.description}</p>

          {service.features?.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl text-espresso mb-4">What's Included</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-brown-muted">
                    <span className="text-gold mt-1">&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.faqs?.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl text-espresso mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {service.faqs.map((faq) => (
                  <div key={faq.question} className="border border-border-beige p-4 bg-white">
                    <h3 className="font-semibold text-espresso mb-1">{faq.question}</h3>
                    <p className="text-sm text-brown-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="bg-white border border-border-beige p-6 h-fit">
          <h3 className="font-display text-xl text-espresso mb-3">Plan This Service</h3>
          <p className="text-sm text-brown-muted mb-6">
            Request a customized quote for {service.title.toLowerCase()}.
          </p>
          <PrimaryButton to="/get-a-quote" className="w-full">Request a Customized Quote</PrimaryButton>
        </aside>
      </section>
    </>
  );
}
