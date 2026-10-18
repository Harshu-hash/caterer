import SectionHeading from '../common/SectionHeading';
import { SecondaryButton } from '../common/Buttons';
import Reveal from '../common/Reveal';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const FALLBACK_IMAGE = 'https://picsum.photos/seed/brand-story/900/1100';

export default function BrandStory() {
  const { settings } = useSiteSettings();
  const brandStory = settings.brandStory || {};

  return (
    <section className="bg-ivory py-20">
      <div className="container-page grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <SectionHeading
            eyebrow={brandStory.eyebrow || 'Our Story'}
            title={brandStory.title || 'Tradition, Presented with Understated Luxury'}
          />
          <Reveal delay={80}>
            <p className="mt-6 text-brown-muted leading-relaxed whitespace-pre-line">
              {brandStory.description ||
                'We bring Indian culinary heritage to life with contemporary elegance, careful presentation, and genuine hospitality. Every menu is thoughtfully built around the celebration it is created for.'}
            </p>
            <div className="mt-8">
              <SecondaryButton to="/about">Read Our Story</SecondaryButton>
            </div>
          </Reveal>
        </div>
        <Reveal as="div" delay={150} className="order-1 md:order-2 relative">
          <div className="absolute -inset-3 border border-gold/40 -z-10 hidden md:block" />
          <img
            src={brandStory.image || FALLBACK_IMAGE}
            alt="Traditional Indian catering presentation"
            className="w-full h-[420px] md:h-[520px] object-cover shadow-xl"
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  );
}
