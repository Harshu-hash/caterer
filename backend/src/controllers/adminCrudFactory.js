import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, paginated } from '../utils/apiResponse.js';
import { getPagination } from '../utils/pagination.js';
import { generateUniqueSlug } from '../utils/slugify.js';

/**
 * Builds standard admin CRUD handlers for a content model.
 * `slugSource` names the field slugs should be derived from when absent (e.g. "title" or "name").
 * Leave it unset (null) for models that don't have a `slug` path in their schema at all — passing
 * a `slugSource` for one of those would try to query/write a field Mongoose doesn't know about,
 * which (combined with `strictQuery`) silently strips it from filters and can hang
 * `generateUniqueSlug`'s loop forever instead of erroring.
 */
export function buildAdminCrud(Model, schema, { slugSource = null, populate = null } = {}) {
  const list = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { defaultLimit: 20, maxLimit: 100 });
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    let query = Model.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit);
    if (populate) query = query.populate(populate);

    const [items, total] = await Promise.all([query.lean(), Model.countDocuments(filter)]);
    paginated(res, items, { page, limit, total });
  });

  const getOne = asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (populate) query = query.populate(populate);
    const item = await query;
    if (!item) throw new ApiError(404, 'Record not found');
    ok(res, item);
  });

  const create = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (slugSource) {
      data.slug = await generateUniqueSlug(Model, data.slug || data[slugSource] || 'item');
    }
    const item = await Model.create(data);
    ok(res, item, 'Created successfully', 201);
  });

  const update = asyncHandler(async (req, res) => {
    const existing = await Model.findById(req.params.id);
    if (!existing) throw new ApiError(404, 'Record not found');

    const data = { ...req.body };
    // A field with `.optional().default(x)` in the Zod schema still gets
    // filled in with `x` when the key is simply absent from a partial PATCH
    // body — `.partial()` only makes fields optional, it doesn't suppress
    // `.default()`. Without this guard, omitting a field from a PATCH would
    // silently reset it to the schema default instead of leaving it alone.
    const sentKeys = new Set(req.rawBodyKeys || Object.keys(data));
    for (const key of Object.keys(data)) {
      if (!sentKeys.has(key)) delete data[key];
    }

    if (slugSource && data.slug) {
      data.slug = await generateUniqueSlug(Model, data.slug, existing._id);
    }

    Object.assign(existing, data);
    await existing.save();
    ok(res, existing, 'Updated successfully');
  });

  const remove = asyncHandler(async (req, res) => {
    const existing = await Model.findById(req.params.id);
    if (!existing) throw new ApiError(404, 'Record not found');
    await existing.deleteOne();
    ok(res, null, 'Deleted successfully');
  });

  return { list, getOne, create, update, remove };
}
