import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: 'Shree Sanware Sarkar Caters and Supervision' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      whatsApp: { type: String, default: '' },
    },
    address: { type: String, default: '' },
    serviceArea: { type: String, default: '' },
    operatingHours: { type: String, default: '' },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    hero: {
      eyebrow: { type: String, default: 'Premium Indian Catering & Events' },
      headline: { type: String, default: "An Artful Feast for Life's Grandest Celebrations" },
      subheading: { type: String, default: '' },
      image: { type: String, default: '' },
    },
    brandStory: {
      eyebrow: { type: String, default: 'Our Story' },
      title: { type: String, default: 'Tradition, Presented with Understated Luxury' },
      description: {
        type: String,
        default:
          'We bring Indian culinary heritage to life with contemporary elegance, careful presentation, and genuine hospitality. Every menu is thoughtfully built around the celebration it is created for.',
      },
      image: { type: String, default: '' },
    },
    footer: {
      aboutText: { type: String, default: '' },
    },
    defaultSeo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
