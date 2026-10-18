import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true, trim: true },
    // Visitor-submitted reviews start pending and only appear publicly once
    // an admin approves them.
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ status: 1, sortOrder: 1, createdAt: -1 });

export default mongoose.model('Review', reviewSchema);
