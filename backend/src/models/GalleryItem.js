import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    storageProvider: { type: String, default: 'local' },
    storageKey: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    caption: { type: String, default: '' },
    altText: { type: String, default: '' },
    eventDate: { type: Date },
    published: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

galleryItemSchema.index({ published: 1, category: 1, sortOrder: 1 });

export default mongoose.model('GalleryItem', galleryItemSchema);
