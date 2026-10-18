import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuCategory', required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    cuisine: { type: String, default: '' },
    dietaryTags: [{ type: String, enum: ['veg', 'non-veg', 'egg', 'jain', 'vegan'] }],
    price: { type: Number, min: 0 },
    availability: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

menuItemSchema.index({ status: 1, categoryId: 1, sortOrder: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('MenuItem', menuItemSchema);
