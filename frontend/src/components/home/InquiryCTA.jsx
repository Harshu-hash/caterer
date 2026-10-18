import { PrimaryButton } from '../common/Buttons';
import BokehLights from '../common/BokehLights';
import Reveal from '../common/Reveal';

export default function InquiryCTA() {
  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <Reveal className="relative overflow-hidden wine-surface text-ivory px-8 py-16 text-center">
          <BokehLights opacity={0.6} />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-2xl mx-auto">
              <span className="gold-shine-text">Let's Plan Your Celebration</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-ivory/85">
              Tell us about your event and we will get back to you with a customized catering quote.
            </p>
            <div className="mt-8">
              <PrimaryButton to="/get-a-quote" className="btn-gold">
                Get a Quote
              </PrimaryButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
