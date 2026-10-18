import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ok, paginated } from '../utils/apiResponse.js';
import { getPagination } from '../utils/pagination.js';
import Inquiry from '../models/Inquiry.js';
import { sendInquiryNotification } from '../services/notificationService.js';

export const createInquiry = asyncHandler(async (req, res) => {
  const { honeypot, ...payload } = req.body;
  if (honeypot) {
    // Silently accept to avoid tipping off bots, but do not persist.
    return ok(res, { inquiryId: 'received' }, 'Inquiry submitted successfully');
  }

  const inquiry = await Inquiry.create({
    ...payload,
    statusHistory: [{ status: 'new', note: 'Inquiry submitted', changedAt: new Date() }],
  });

  sendInquiryNotification(inquiry)
    .then(() => Inquiry.findByIdAndUpdate(inquiry._id, { notificationStatus: 'sent' }))
    .catch(() => Inquiry.findByIdAndUpdate(inquiry._id, { notificationStatus: 'failed' }));

  ok(res, { inquiryId: inquiry._id }, 'Inquiry submitted successfully', 201);
});

export const listInquiries = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, { defaultLimit: 20, maxLimit: 100 });
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { phone: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Inquiry.countDocuments(filter),
  ]);

  paginated(res, items, { page, limit, total });
});

export const getInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');
  ok(res, inquiry);
});

export const updateInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');

  const { status, internalNotes, note } = req.body;

  if (status && status !== inquiry.status) {
    inquiry.status = status;
    inquiry.statusHistory.push({ status, note: note || '', changedAt: new Date() });
  }
  if (typeof internalNotes === 'string') {
    inquiry.internalNotes = internalNotes;
  }

  await inquiry.save();
  ok(res, inquiry, 'Inquiry updated successfully');
});

export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');
  await inquiry.deleteOne();
  ok(res, null, 'Inquiry deleted successfully');
});
