import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ok, paginated } from '../utils/apiResponse.js';
import { getPagination } from '../utils/pagination.js';
import { isValidImageBuffer } from '../utils/verifyImage.js';
import { activeStorage, getStorageAdapter } from '../services/storage/index.js';
import Media from '../models/Media.js';
import GalleryItem from '../models/GalleryItem.js';
import Service from '../models/Service.js';
import MenuItem from '../models/MenuItem.js';
import Package from '../models/Package.js';

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  if (!isValidImageBuffer(req.file.buffer)) {
    throw new ApiError(400, 'Uploaded file is not a valid image');
  }

  const { url, key } = await activeStorage.upload(req.file.buffer, { mimetype: req.file.mimetype });

  const media = await Media.create({
    url,
    filename: key,
    mimeType: req.file.mimetype,
    size: req.file.size,
    storageProvider: activeStorage.provider,
  });

  ok(res, media, 'File uploaded successfully', 201);
});

export const listMedia = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, { defaultLimit: 30, maxLimit: 100 });
  const [items, total] = await Promise.all([
    Media.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Media.countDocuments(),
  ]);
  paginated(res, items, { page, limit, total });
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw new ApiError(404, 'Media not found');

  const [inGallery, inService, inMenuItem, inPackage] = await Promise.all([
    GalleryItem.exists({ imageUrl: media.url }),
    Service.exists({ image: media.url }),
    MenuItem.exists({ image: media.url }),
    Package.exists({ image: media.url }),
  ]);

  if (inGallery || inService || inMenuItem || inPackage) {
    throw new ApiError(409, 'This image is still used by published content. Remove it from there first.');
  }

  const adapter = getStorageAdapter(media.storageProvider);
  await adapter.delete(media.filename);

  await media.deleteOne();
  ok(res, null, 'Media deleted successfully');
});
