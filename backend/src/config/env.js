export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.COOKIE_NAME || 'caterer_token',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  storageProvider: process.env.STORAGE_PROVIDER || 'local',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
    notifyTo: process.env.NOTIFY_TO_EMAIL,
  },
};

export function assertRequiredEnv() {
  const missing = [];
  if (!env.mongodbUri) missing.push('MONGODB_URI');
  if (!env.jwtSecret) missing.push('JWT_SECRET');

  if (env.storageProvider === 'cloudinary') {
    if (!env.cloudinary.cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
    if (!env.cloudinary.apiKey) missing.push('CLOUDINARY_API_KEY');
    if (!env.cloudinary.apiSecret) missing.push('CLOUDINARY_API_SECRET');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
