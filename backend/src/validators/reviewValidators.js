import { z } from 'zod';

export const createReviewSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(120),
  rating: z.coerce.number().int().min(1, 'Select a star rating').max(5, 'Select a star rating'),
  reviewText: z.string().trim().min(10, 'Please write at least a few words').max(2000),
  honeypot: z.string().max(0).optional().or(z.literal('')),
});
