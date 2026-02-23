import mongoose from 'mongoose';
import { env } from './env';

const LOCAL_FALLBACK_URI = 'mongodb://127.0.0.1:27017/cigali_local';
const INITIAL_RETRY_DELAY_MS = 3000;
const MAX_RETRY_DELAY_MS = 30000;

let retryDelayMs = INITIAL_RETRY_DELAY_MS;
let isConnecting = false;
let activeMongoUri: string | null = null;

const scheduleReconnect = (): void => {
  setTimeout(() => {
    void connectDb();
  }, retryDelayMs);

  retryDelayMs = Math.min(retryDelayMs * 2, MAX_RETRY_DELAY_MS);
};

const connectWithUri = async (uri: string): Promise<boolean> => {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 4000
  });

  activeMongoUri = uri;
  retryDelayMs = INITIAL_RETRY_DELAY_MS;
  // eslint-disable-next-line no-console
  console.log('CIGALI MongoDB Connected');
  return true;
};

export const isDbConnected = (): boolean => mongoose.connection.readyState === 1;
export const getActiveMongoUri = (): string | null => activeMongoUri;

export const connectDb = async (): Promise<boolean> => {
  if (isConnecting || isDbConnected()) {
    return isDbConnected();
  }

  isConnecting = true;

  try {
    mongoose.set('strictQuery', true);

    try {
      await connectWithUri(env.mongoUri);
      isConnecting = false;
      return true;
    } catch (atlasError) {
      // eslint-disable-next-line no-console
      console.warn(`[CIGALI] Atlas connection failed: ${(atlasError as Error).message}`);

      await connectWithUri(LOCAL_FALLBACK_URI);
      // eslint-disable-next-line no-console
      console.warn('CIGALI using LOCAL database fallback');
      isConnecting = false;
      return true;
    }
  } catch (fallbackError) {
    // eslint-disable-next-line no-console
    console.warn('[CIGALI] MongoDB unavailable (Atlas + Local). Running without DB, retrying in background.');
    // eslint-disable-next-line no-console
    console.warn(`[CIGALI] Mongo connection error: ${(fallbackError as Error).message}`);
    isConnecting = false;
    scheduleReconnect();
    return false;
  }
};
