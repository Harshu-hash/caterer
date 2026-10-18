import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const UPLOAD_DIR = path.resolve('uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const EXT_BY_MIME = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

export const localStorage = {
  provider: 'local',

  async upload(buffer, { mimetype }) {
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
