import mongoose from 'mongoose';

// Custom (not catalog-linked) dish entries the admin types in per event,
// grouped under an admin-authored section heading (e.g. "Starters", "Main Course").
const eventDishSchema = new mongoose.Schema(
  { name: { type: String, required: true, trim: true }, image: { type: String, default: '' } },
  { _id: false }
);

const eventDishSectionSchema = new mongoose.Schema(
  { heading: { type: String, required: true, trim: true }, dishes: [eventDishSchema] },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    eventType: { type: String, default: '' },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date },
    venueName: { type: String, required: true, trim: true },
    venueAddress: { type: String, default: '' },
    description: { type: String, default: '' },
    menuHighlights: [{ type: String }],
    dishSections: [eventDishSectionSchema],
    image: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, startDateTime: 1 });

export default mongoose.model('Event', eventSchema);
