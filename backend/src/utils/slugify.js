import slugifyLib from 'slugify';

export async function generateUniqueSlug(Model, baseText, existingId = null) {
  const base = slugifyLib(baseText, { lower: true, strict: true }) || 'item';
  let slug = base;
  let counter = 2;

  while (true) {
    const query = { slug };
    if (existingId) query._id = { $ne: existingId };
    const found = await Model.findOne(query).select('_id').lean();
    if (!found) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}
