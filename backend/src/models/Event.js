import mongoose from 'mongoose';

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
    image: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, startDateTime: 1 });

export default mongoose.model('Event', eventSchema);
