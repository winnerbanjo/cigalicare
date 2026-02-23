import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5001),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/cigali',
  jwtSecret: process.env.JWT_SECRET ?? 'cigali-dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 12),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://127.0.0.1:5173',
  bindHost: process.env.HOST ?? '0.0.0.0',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? ''
  }
};

if (!process.env.JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn('[CIGALI] JWT_SECRET not set. Using dev fallback secret.');
}
