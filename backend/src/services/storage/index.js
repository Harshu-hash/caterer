import { env } from '../../config/env.js';
import { localStorage } from './localStorage.js';
import { cloudinaryStorage } from './cloudinaryStorage.js';

const ADAPTERS = {
  local: localStorage,
  cloudinary: cloudinaryStorage,
};

export function getStorageAdapter(provider = env.storageProvider) {
  const adapter = ADAPTERS[provider];
  if (!adapter) throw new Error(`Unknown storage provider: ${provider}`);
  return adapter;
}

export const activeStorage = getStorageAdapter();
