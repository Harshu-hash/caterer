import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import Review from '../models/Review.js';

export const createReview = asyncHandler(async (req, res) => {
  const { honeypot, name, rating, reviewText } = req.body;
  if (honeypot) {
    // Silently accept to avoid tipping off bots, but do not persist.
    return ok(res, { reviewId: 'received' }, 'Thank you for your review!');
  }

  // status/sortOrder are never accepted from the client. Visitor reviews are
  // published immediately; an admin can reject one later if needed.
  const review = await Review.create({ name, rating, reviewText, status: 'approved' });

  ok(res, { reviewId: review._id }, 'Thank you for your review!', 201);
});
