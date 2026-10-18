import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    startingPrice: { type: Number, min: 0 },
    minGuests: { type: Number, min: 0 },
    inclusions: [{ type: String }],
    addOns: [{ type: String }],
    image: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

packageSchema.index({ status: 1, sortOrder: 1 });

export default mongoose.model('Package', packageSchema);
