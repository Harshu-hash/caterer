// Seeds placeholder demo content so the site is browsable in development.
// Replace every value here with the real business's content before launch.
import 'dotenv/config';

import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import Service from '../src/models/Service.js';
import MenuCategory from '../src/models/MenuCategory.js';
import MenuItem from '../src/models/MenuItem.js';
import Package from '../src/models/Package.js';
import GalleryItem from '../src/models/GalleryItem.js';
import SiteSettings from '../src/models/SiteSettings.js';

const PLACEHOLDER_IMG = (seed, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function main() {
  await connectDB();

  await Promise.all([
    Service.deleteMany({}),
    MenuCategory.deleteMany({}),
    MenuItem.deleteMany({}),
    Package.deleteMany({}),
    GalleryItem.deleteMany({}),
    SiteSettings.deleteMany({}),
  ]);

  await SiteSettings.create({
    businessName: 'Shree Sanware Sarkar Caters and Supervision',
    contact: { phone: '+91 78699 55446', email: 'shriSanwaresarkar@gmail.com', whatsApp: '+917869955446' },
    address: '131-A, Jawahar Nagar, Main Road, Ratlam (M.P.)',
    serviceArea: 'Ratlam and surrounding regions',
    operatingHours: 'Mon-Sun: 9am - 8pm',
    socialLinks: { instagram: '', facebook: '', youtube: '' },
    hero: {
      headline: "An Artful Feast for Life's Grandest Celebrations",
      subheading: 'Premium Indian catering for weddings, receptions, and private celebrations.',
      image: PLACEHOLDER_IMG('hero', 1920, 1080),
    },
    footer: { aboutText: 'Replace with a short, accurate business description.' },
    defaultSeo: {
      title: 'Shree Sanware Sarkar Caters and Supervision | Premium Indian Catering & Events',
      description: 'Premium Indian catering for weddings and celebrations.',
    },
  });

  const services = await Service.insertMany(
    [
      { title: 'Wedding Catering', summary: 'Multi-course Indian wedding menus for every ceremony.' },
      { title: 'Engagement Ceremonies', summary: 'Curated menus for intimate engagement celebrations.' },
      { title: 'Corporate Events', summary: 'Professional catering for conferences and corporate gatherings.' },
      { title: 'Private Parties', summary: 'Personalized menus for birthdays and private celebrations.' },
    ].map((s, i) => ({
      ...s,
      slug: s.title.toLowerCase().replace(/\s+/g, '-'),
      description: `${s.summary} Full details to be provided by the business.`,
      image: PLACEHOLDER_IMG(`service-${i}`),
      status: 'published',
      sortOrder: i,
    }))
  );

  const categories = await MenuCategory.insertMany(
    ['Welcome Drinks', 'Starters', 'Main Course', 'Breads', 'Rice & Biryani', 'Desserts & Sweets'].map(
      (name, i) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), sortOrder: i })
    )
  );

  const sampleItems = [
    { name: 'Masala Chai', cat: 0, cuisine: 'Indian', dietaryTags: ['veg'] },
    { name: 'Paneer Tikka', cat: 1, cuisine: 'North Indian', dietaryTags: ['veg'] },
    { name: 'Chicken Seekh Kebab', cat: 1, cuisine: 'North Indian', dietaryTags: ['non-veg'] },
    { name: 'Paneer Butter Masala', cat: 2, cuisine: 'North Indian', dietaryTags: ['veg'] },
    { name: 'Mutton Rogan Josh', cat: 2, cuisine: 'Kashmiri', dietaryTags: ['non-veg'] },
    { name: 'Butter Naan', cat: 3, cuisine: 'North Indian', dietaryTags: ['veg'] },
    { name: 'Hyderabadi Biryani', cat: 4, cuisine: 'Hyderabadi', dietaryTags: ['non-veg'] },
    { name: 'Gulab Jamun', cat: 5, cuisine: 'Indian', dietaryTags: ['veg'] },
  ];

  await MenuItem.insertMany(
    sampleItems.map((item, i) => ({
      name: item.name,
      slug: item.name.toLowerCase().replace(/\s+/g, '-'),
      categoryId: categories[item.cat]._id,
      description: 'Placeholder description. Update with the real dish description.',
      image: PLACEHOLDER_IMG(`dish-${i}`, 800, 600),
      cuisine: item.cuisine,
      dietaryTags: item.dietaryTags,
      availability: true,
      status: 'published',
      sortOrder: i,
    }))
  );

  await Package.insertMany(
    [
      { name: 'Essentials Package', minGuests: 50, startingPrice: 60000 },
      { name: 'Celebration Package', minGuests: 100, startingPrice: 120000 },
      { name: 'Grand Wedding Package', minGuests: 250, startingPrice: 300000 },
    ].map((p, i) => ({
      ...p,
      slug: p.name.toLowerCase().replace(/\s+/g, '-'),
      description: 'Placeholder package description. Update with real inclusions.',
      inclusions: ['Live counters', 'Dedicated service staff', 'Customizable menu'],
      addOns: ['Dessert counter', 'Mocktail bar'],
      image: PLACEHOLDER_IMG(`package-${i}`),
      status: 'published',
      sortOrder: i,
    }))
  );

  await GalleryItem.insertMany(
    ['Weddings', 'Buffet Setups', 'Food', 'Live Counters', 'Desserts'].flatMap((category, ci) =>
      Array.from({ length: 3 }, (_, i) => ({
        title: `${category} ${i + 1}`,
        imageUrl: PLACEHOLDER_IMG(`gallery-${ci}-${i}`),
        thumbnailUrl: PLACEHOLDER_IMG(`gallery-${ci}-${i}`, 400, 300),
        category,
        caption: `Placeholder ${category.toLowerCase()} photo`,
        altText: `${category} sample image`,
        published: true,
        sortOrder: i,
      }))
    )
  );

  console.log('Seed complete. Services:', services.length);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
