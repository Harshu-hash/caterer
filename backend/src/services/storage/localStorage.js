import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Resolved lazily (not at import time) so this module can be safely imported
// even in serverless environments with a read-only filesystem, as long as
// the "local" provider is never actually selected there (use "cloudinary").
export const UPLOAD_DIR = path.resolve('uploads');

const EXT_BY_MIME = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

export const localStorage = {
  provider: 'local',

  async upload(buffer, { mimetype }) {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    const ext = EXT_BY_MIME[mimetype] || '.jpg';
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
    return { url: `/uploads/${filename}`, key: filename };
  },

  async delete(key) {
    const filePath = path.join(UPLOAD_DIR, key);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  },
};
