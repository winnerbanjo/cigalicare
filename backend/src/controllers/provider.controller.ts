import { Request, Response } from 'express';
import { providerService } from '../services/provider.service';
import { AppError } from '../utils/appError';
import { uploadService } from '../services/uploadService';

const getAuthUser = (req: Request): Express.AuthUser => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  return req.user;
};

export const providerController = {
  async getPublicProfile(req: Request, res: Response): Promise<void> {
    const profile = await providerService.getPublicProfile(req.params.id);
    res.json({ success: true, data: profile });
  },

  async getMyProvider(req: Request, res: Response): Promise<void> {
    const provider = await providerService.getMyProvider(getAuthUser(req).providerId);
    res.json({ success: true, data: provider });
  },

  async updateMyProvider(req: Request, res: Response): Promise<void> {
    const provider = await providerService.updateMyProvider(getAuthUser(req).providerId, req.body);
    res.json({ success: true, data: provider });
  },

  async uploadMyLogo(req: Request, res: Response): Promise<void> {
    const imageBase64 = req.body?.imageBase64 as string | undefined;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      throw new AppError('imageBase64 is required', 400);
    }

    const secureUrl = await uploadService.uploadLogo(imageBase64);
    const provider = await providerService.updateMyProvider(getAuthUser(req).providerId, {
      logoUrl: secureUrl
    });

    res.json({ success: true, data: provider });
  }
};
