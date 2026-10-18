// Seeds the still-empty content collections (Services, Packages, Gallery,
// Reviews) with placeholder-but-realistic content for Shree Sanware
// Sarkar Caters and Supervision. Does NOT touch MenuCategory/MenuItem (real
// menu already seeded via seed-menu.js), Event (admin-entered already), or
// SiteSettings (already updated with real business info).
import 'dotenv/config';

import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import Service from '../src/models/Service.js';
import Package from '../src/models/Package.js';
import GalleryItem from '../src/models/GalleryItem.js';
import Review from '../src/models/Review.js';

const PLACEHOLDER_IMG = (seed, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function main() {
  await connectDB();

  const [serviceCount, packageCount, galleryCount, reviewCount] = await Promise.all([
    Service.countDocuments({}),
    Package.countDocuments({}),
    GalleryItem.countDocuments({}),
    Review.countDocuments({}),
  ]);

  if (serviceCount === 0) {
    const services = [
      {
        title: 'Full Catering',
        summary: 'Complete end-to-end catering: menu, live counters, service staff, and setup.',
        description:
          'Our signature full catering service covers everything from menu planning to on-site execution — live counters, serving staff, and chilled water service, so you can focus on your guests.',
        features: ['Customizable pure-veg menu', 'Live food counters', 'Dedicated service staff', 'Chilled water service'],
      },
      {
        title: 'Service Catering',
        summary: 'Professional waitstaff and service support for your own food arrangements.',
        description:
          'Already have a menu or kitchen sorted? Our trained service staff handle plating, serving, and guest coordination so your event runs smoothly.',
        features: ['Trained serving staff', 'Buffet & counter setup', 'Table and crockery service'],
      },
      {
        title: 'Event Decoration',
        summary: 'Stage, counter, and venue decoration to match your celebration theme.',
        description:
          'From welcome counters to the main stage, our decoration team designs elegant, photo-ready setups themed to your event.',
        features: ['Stage & entrance decor', 'Counter and buffet styling', 'Theme-based setups'],
      },
      {
        title: 'Live Food Counters',
        summary: 'Interactive chaat, sweets, mocktail, and international food counters.',
        description:
          'Delight your guests with live counters — chaat, South Indian, Chinese, sweets, and mocktail/coffee stalls — prepared fresh in front of them.',
        features: ['Chaat & street food counters', 'Sweets & dessert counters', 'Mocktail & coffee stalls'],
      },
      {
        title: 'Wedding Catering',
        summary: 'Multi-course menus across every ceremony, from Haldi to Reception.',
        description:
          'Regional Indian menus tailored to each ceremony of your wedding, with the scale and polish a wedding celebration deserves.',
        features: ['Menus for every ceremony', 'Regional cuisine options', 'Large-scale guest coordination'],
      },
      {
        title: 'Corporate & Private Events',
        summary: 'Reliable catering for conferences, birthdays, and private celebrations.',
        description:
          'Professional, punctual catering for corporate gatherings and private parties of any size, with menus suited to the occasion.',
        features: ['Flexible guest counts', 'Professional presentation', 'On-time setup and service'],
      },
    ];

    await Service.insertMany(
      services.map((s, i) => ({
        ...s,
        slug: s.title.toLowerCase().replace(/\s+/g, '-'),
        image: PLACEHOLDER_IMG(`service-${i}`),
        status: 'published',
        sortOrder: i,
      }))
    );
    console.log(`Seeded ${services.length} services.`);
  } else {
    console.log('Services already have data, skipping.');
  }

  if (packageCount === 0) {
    const packages = [
      {
        name: 'Essentials Package',
        minGuests: 100,
        startingPrice: 150000,
        description: 'A solid starting point for intimate celebrations — full menu with essential live counters.',
        inclusions: ['Pure-veg multi-course menu', '2 live counters', 'Service staff', 'Chilled water service'],
        addOns: ['Additional live counter', 'Dessert counter upgrade'],
      },
      {
        name: 'Celebration Package',
        minGuests: 250,
        startingPrice: 320000,
        description: 'Our most popular package for weddings and large celebrations, with more counters and decor.',
        inclusions: ['Pure-veg multi-course menu', '4 live counters', 'Service staff', 'Basic counter decoration', 'Chilled water service'],
        addOns: ['Mocktail/coffee stall', 'Premium sweets counter'],
      },
      {
        name: 'Royal Wedding Package',
        minGuests: 500,
        startingPrice: 650000,
        description: 'A grand, fully decorated setup for large weddings with extensive live counters and full-service staff.',
        inclusions: ['Pure-veg multi-course menu', '8+ live counters', 'Full service staff', 'Stage & counter decoration', 'Chilled water service'],
        addOns: ['International food counter', 'Premium dessert & chocolate counter'],
      },
    ];

    await Package.insertMany(
      packages.map((p, i) => ({
        ...p,
        slug: p.name.toLowerCase().replace(/\s+/g, '-'),
        image: PLACEHOLDER_IMG(`package-${i}`),
        status: 'published',
        sortOrder: i,
      }))
    );
    console.log(`Seeded ${packages.length} packages.`);
  } else {
    console.log('Packages already have data, skipping.');
  }

  if (galleryCount === 0) {
    const categories = ['Weddings', 'Buffet Setups', 'Food', 'Live Counters', 'Desserts'];
    const items = categories.flatMap((category, ci) =>
      Array.from({ length: 3 }, (_, i) => ({
        title: `${category} ${i + 1}`,
        imageUrl: PLACEHOLDER_IMG(`gallery-${ci}-${i}`),
        thumbnailUrl: PLACEHOLDER_IMG(`gallery-${ci}-${i}`, 400, 300),
        category,
        caption: `${category} setup from one of our events`,
        altText: `${category} photo`,
        published: true,
        sortOrder: i,
      }))
    );

    await GalleryItem.insertMany(items);
    console.log(`Seeded ${items.length} gallery items.`);
  } else {
    console.log('Gallery already has data, skipping.');
  }

  if (reviewCount === 0) {
    const reviews = [
      { name: 'Placeholder Guest A', rating: 5 },
      { name: 'Placeholder Guest B', rating: 5 },
      { name: 'Placeholder Guest C', rating: 4 },
      { name: 'Placeholder Guest D', rating: 5 },
      { name: 'Placeholder Guest E', rating: 4 },
    ];

    await Review.insertMany(
      reviews.map((r, i) => ({
        ...r,
        reviewText: 'Placeholder review text. Replace with a real, approved visitor review before launch.',
        status: 'approved',
        sortOrder: i,
      }))
    );
    console.log(`Seeded ${reviews.length} reviews.`);
  } else {
    console.log('Reviews already have data, skipping.');
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
