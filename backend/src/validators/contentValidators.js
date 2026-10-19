import { z } from 'zod';

const slugField = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers, and hyphens')
  .optional();

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: slugField,
  summary: z.string().trim().min(2).max(300),
  description: z.string().optional().default(''),
  image: z.string().optional().default(''),
  gallery: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  faqs: z
    .array(z.object({ question: z.string().min(1), answer: z.string().min(1) }))
    .optional()
    .default([]),
  seoTitle: z.string().optional().default(''),
  seoDescription: z.string().optional().default(''),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  sortOrder: z.coerce.number().optional().default(0),
});

export const menuCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: slugField,
  description: z.string().optional().default(''),
  sortOrder: z.coerce.number().optional().default(0),
  isActive: z.coerce.boolean().optional().default(true),
});

export const menuItemSchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: slugField,
  categoryId: z.string().min(1, 'Select a category'),
  description: z.string().optional().default(''),
  image: z.string().optional().default(''),
  cuisine: z.string().optional().default(''),
  dietaryTags: z.array(z.enum(['veg', 'non-veg', 'egg', 'jain', 'vegan'])).optional().default([]),
  price: z.coerce.number().min(0).optional(),
  availability: z.coerce.boolean().optional().default(true),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  sortOrder: z.coerce.number().optional().default(0),
});

export const packageSchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: slugField,
  description: z.string().optional().default(''),
  startingPrice: z.coerce.number().min(0).optional(),
  minGuests: z.coerce.number().min(0).optional(),
  inclusions: z.array(z.string()).optional().default([]),
  addOns: z.array(z.string()).optional().default([]),
  image: z.string().optional().default(''),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  sortOrder: z.coerce.number().optional().default(0),
});

export const galleryItemSchema = z.object({
  title: z.string().trim().min(1).max(160),
  imageUrl: z.string().min(1, 'Image is required'),
  thumbnailUrl: z.string().optional().default(''),
  storageProvider: z.string().optional().default('local'),
  storageKey: z.string().optional().default(''),
  category: z.string().trim().min(1, 'Select a category'),
  caption: z.string().optional().default(''),
  altText: z.string().optional().default(''),
  eventDate: z.coerce.date().optional(),
  published: z.coerce.boolean().optional().default(false),
  sortOrder: z.coerce.number().optional().default(0),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2).max(160),
  eventType: z.string().optional().default(''),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date().optional(),
  venueName: z.string().trim().min(1, 'Venue name is required').max(200),
  venueAddress: z.string().optional().default(''),
  description: z.string().optional().default(''),
  menuHighlights: z.array(z.string()).optional().default([]),
  dishes: z.array(z.string()).optional().default([]),
  image: z.string().optional().default(''),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  sortOrder: z.coerce.number().optional().default(0),
});

export const reviewSchema = z.object({
  name: z.string().trim().min(1).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  reviewText: z.string().trim().min(2).max(2000),
  status: z.enum(['pending', 'approved', 'rejected']).optional().default('pending'),
  sortOrder: z.coerce.number().optional().default(0),
});

export const siteSettingsSchema = z.object({
  businessName: z.string().trim().min(1).max(160).optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  contact: z
    .object({
      phone: z.string().optional(),
      email: z.string().optional(),
      whatsApp: z.string().optional(),
    })
    .optional(),
  address: z.string().optional(),
  serviceArea: z.string().optional(),
  operatingHours: z.string().optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),
  hero: z
    .object({
      eyebrow: z.string().optional(),
      headline: z.string().optional(),
      subheading: z.string().optional(),
      image: z.string().optional(),
    })
    .optional(),
  brandStory: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    })
    .optional(),
  footer: z.object({ aboutText: z.string().optional() }).optional(),
  defaultSeo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});
