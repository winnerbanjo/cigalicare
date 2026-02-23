import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

const isConfigured = Boolean(
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true
  });
} else {
  // eslint-disable-next-line no-console
  console.warn('[CIGALI] Cloudinary credentials missing. Upload APIs will be unavailable.');
}

export { cloudinary };
export const isCloudinaryConfigured = isConfigured;
