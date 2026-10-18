import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    eventType: { type: String, default: '' },
    review: { type: String, required: true },
    eventDate: { type: Date },
    published: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.index({ published: 1, sortOrder: 1 });

export default mongoose.model('Testimonial', testimonialSchema);
