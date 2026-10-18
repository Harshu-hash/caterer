import { z } from 'zod';

export const createInquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number')
    .max(20, 'Enter a valid phone number')
    .regex(/^[0-9+\-\s()]+$/, 'Enter a valid phone number'),
  email: z.string().trim().email('Enter a valid email address').optional().or(z.literal('')),
  eventType: z.string().trim().min(2, 'Select an event type').max(120),
  eventDate: z.coerce.date().optional(),
  guestCount: z.coerce.number().int().min(1).max(100000).optional(),
  location: z.string().trim().max(200).optional().or(z.literal('')),
  budgetRange: z.string().trim().max(100).optional().or(z.literal('')),
  selectedItems: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(['menuItem', 'package']),
        refId: z.string().optional(),
      })
    )
    .optional(),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  honeypot: z.string().max(0).optional().or(z.literal('')),
});

export const updateInquirySchema = z.object({
  status: z.enum(['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled']).optional(),
  internalNotes: z.string().max(5000).optional(),
  note: z.string().max(500).optional(),
});
