import { useSeo } from '../../hooks/useSeo';
import { PrimaryButton } from '../../components/common/Buttons';

export default function NotFound() {
  useSeo({ title: 'Page Not Found | Shree Sanware Sarkar Caters and Supervision' });

  return (
    <section className="container-page py-32 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-3xl md:text-4xl text-espresso mb-4">We Couldn't Find That Page</h1>
      <p className="text-brown-muted mb-8 max-w-md mx-auto">
        The page you're looking for may have moved. Explore our menu or get in touch to plan your event.
      </p>
      <div className="flex justify-center gap-4">
        <PrimaryButton to="/">Back to Home</PrimaryButton>
        <PrimaryButton to="/get-a-quote" className="btn-gold">
          Get a Quote
        </PrimaryButton>
      </div>
    </section>
  );
}
