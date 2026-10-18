import { z } from 'zod';

export const quoteFormSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number')
    .max(20, 'Enter a valid phone number')
    .regex(/^[0-9+\-\s()]+$/, 'Enter a valid phone number'),
  email: z.string().trim().email('Enter a valid email address').optional().or(z.literal('')),
  eventType: z.string().trim().min(2, 'Select an event type'),
  eventDate: z.string().optional().or(z.literal('')),
  guestCount: z
    .union([z.string().length(0), z.coerce.number().int().min(1, 'Enter a valid guest count')])
    .optional(),
  location: z.string().trim().max(200).optional().or(z.literal('')),
  budgetRange: z.string().optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  honeypot: z.string().max(0).optional().or(z.literal('')),
});

export const EVENT_TYPES = [
  'Wedding',
  'Engagement',
  'Reception',
  'Corporate Event',
  'Birthday Party',
  'Private Celebration',
  'Other',
];

export const BUDGET_RANGES = [
  'Under ₹1,00,000',
  '₹1,00,000 - ₹3,00,000',
  '₹3,00,000 - ₹5,00,000',
  'Above ₹5,00,000',
  'Not sure yet',
];
