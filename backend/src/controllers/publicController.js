import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ok, paginated } from '../utils/apiResponse.js';
import { getPagination } from '../utils/pagination.js';
import Service from '../models/Service.js';
import MenuCategory from '../models/MenuCategory.js';
import MenuItem from '../models/MenuItem.js';
import Package from '../models/Package.js';
import GalleryItem from '../models/GalleryItem.js';
import Event from '../models/Event.js';
import Review from '../models/Review.js';
import SiteSettings from '../models/SiteSettings.js';

export const getSiteSettings = asyncHandler(async (_req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  ok(res, settings);
});

export const listServices = asyncHandler(async (_req, res) => {
  const services = await Service.find({ status: 'published' }).sort({ sortOrder: 1 });
  ok(res, services);
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, status: 'published' });
  if (!service) throw new ApiError(404, 'Service not found');
  ok(res, service);
});

export const listMenuCategories = asyncHandler(async (_req, res) => {
  const categories = await MenuCategory.aggregate([
    { $match: { isActive: true } },
    { $sort: { sortOrder: 1 } },
    {
      $lookup: {
        from: 'menuitems',
        let: { categoryId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$categoryId', '$$categoryId'] }, status: 'published', availability: true } },
          { $count: 'count' },
        ],
        as: 'itemStats',
      },
    },
    {
      $addFields: {
        itemCount: { $ifNull: [{ $first: '$itemStats.count' }, 0] },
      },
    },
    { $project: { itemStats: 0 } },
  ]);
  ok(res, categories);
});

const ALLOWED_SORTS = new Set(['sortOrder', 'name', 'price', '-price', 'createdAt', '-createdAt']);

export const listMenuItems = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, { defaultLimit: 24, maxLimit: 60 });
  const filter = { status: 'published', availability: true };

  if (req.query.category) {
    const category = await MenuCategory.findOne({ slug: req.query.category }).select('_id');
    filter.categoryId = category ? category._id : null;
  }
  if (req.query.cuisine) filter.cuisine = req.query.cuisine;
  if (req.query.diet) filter.dietaryTags = req.query.diet;
  if (req.query.search) filter.$text = { $search: req.query.search };

  const sort = ALLOWED_SORTS.has(req.query.sort) ? req.query.sort : 'sortOrder';
  const sortSpec = sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 };

  const [items, total] = await Promise.all([
    MenuItem.find(filter).populate('categoryId', 'name slug').sort(sortSpec).skip(skip).limit(limit),
    MenuItem.countDocuments(filter),
  ]);

  paginated(res, items, { page, limit, total });
});

export const listPackages = asyncHandler(async (_req, res) => {
  const packages = await Package.find({ status: 'published' }).sort({ sortOrder: 1 });
  ok(res, packages);
});

export const listGalleryItems = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, { defaultLimit: 24, maxLimit: 60 });
  const filter = { published: true };
  if (req.query.category) filter.category = req.query.category;

  const [items, total] = await Promise.all([
    GalleryItem.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
    GalleryItem.countDocuments(filter),
  ]);

  paginated(res, items, { page, limit, total });
});

function withTimingStatus(event) {
  const now = Date.now();
  const start = new Date(event.startDateTime).getTime();
  const end = event.endDateTime ? new Date(event.endDateTime).getTime() : start;
  let timingStatus = 'upcoming';
  if (now >= start && now <= end) timingStatus = 'live';
  else if (now > end) timingStatus = 'past';
  return { ...event, timingStatus };
}

export const listEvents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, { defaultLimit: 12, maxLimit: 60 });
  const filter = { status: 'published' };
  if (req.query.all !== 'true') {
    filter.$or = [{ endDateTime: { $gte: new Date() } }, { endDateTime: null, startDateTime: { $gte: new Date() } }];
  }

  const [events, total] = await Promise.all([
    Event.find(filter).sort({ startDateTime: 1 }).skip(skip).limit(limit).lean(),
    Event.countDocuments(filter),
  ]);

  paginated(res, events.map(withTimingStatus), { page, limit, total });
});

export const listReviews = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, { defaultLimit: 9, maxLimit: 60 });
  const filter = { status: 'approved' };

  const [reviews, total] = await Promise.all([
    Review.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
    Review.countDocuments(filter),
  ]);

  paginated(res, reviews, { page, limit, total });
});
