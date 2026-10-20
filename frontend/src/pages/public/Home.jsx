import { useSeo } from '../../hooks/useSeo';
import Hero from '../../components/home/Hero';
import BrandStory from '../../components/home/BrandStory';
import UpcomingEvents from '../../components/home/UpcomingEvents';
import ServicesOverview from '../../components/home/ServicesOverview';
import FeaturedMenu from '../../components/home/FeaturedMenu';
import GalleryPreview from '../../components/home/GalleryPreview';
import PackagesOverview from '../../components/home/PackagesOverview';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import ReviewsCarousel from '../../components/home/ReviewsCarousel';
import StatsBand from '../../components/home/StatsBand';
import InquiryCTA from '../../components/home/InquiryCTA';

export default function Home() {
  useSeo({
    title: 'Shree Sanware Sarkar Caters and Supervision | Premium Indian Catering & Events',
    description: 'Premium Indian catering for weddings, receptions, and private celebrations.',
  });

  return (
    <>
      <Hero />
      <BrandStory />
      <UpcomingEvents />
      <ServicesOverview />
      <FeaturedMenu />
      <GalleryPreview />
      <PackagesOverview />
      <WhyChooseUs />
      <ReviewsCarousel />
      <StatsBand />
      <InquiryCTA />
    </>
  );
}
