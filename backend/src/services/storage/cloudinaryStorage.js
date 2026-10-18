import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export const cloudinaryStorage = {
  provider: 'cloudinary',

  async upload(buffer, { mimetype }) {
    if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
      throw new ApiError(500, 'Cloudinary is not configured. Set CLOUDINARY_* environment variables.');
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'caterer', resource_type: 'image' },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    return { url: result.secure_url, key: result.public_id };
  },

  async delete(key) {
    await cloudinary.uploader.destroy(key);
  },
};
