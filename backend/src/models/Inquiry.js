import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    eventType: { type: String, required: true, trim: true },
    eventDate: { type: Date },
    guestCount: { type: Number, min: 0 },
    location: { type: String, trim: true },
    budgetRange: { type: String, default: '' },
    selectedItems: [
      {
        name: String,
        type: { type: String, enum: ['menuItem', 'package'] },
        refId: { type: mongoose.Schema.Types.ObjectId },
      },
    ],
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'],
      default: 'new',
    },
    internalNotes: { type: String, default: '' },
    source: { type: String, default: 'website' },
    statusHistory: [statusHistorySchema],
    notificationStatus: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ phone: 1 });

export default mongoose.model('Inquiry', inquirySchema);
