import { AppError } from '../utils/appError';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary';

const assertCloudinaryReady = (): void => {
  if (!isCloudinaryConfigured) {
    throw new AppError('Cloudinary is not configured', 503);
  }
};

const upload = async (dataUri: string, folder: string) => {
  assertCloudinaryReady();

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'auto'
  });

  return result.secure_url;
};

export const uploadService = {
  async uploadImage(dataUri: string): Promise<string> {
    return upload(dataUri, 'cigali/images');
  },

  async uploadLogo(dataUri: string): Promise<string> {
    return upload(dataUri, 'cigali/logos');
  },

  async uploadPatientFile(dataUri: string): Promise<string> {
    return upload(dataUri, 'cigali/patient-files');
  }
};
