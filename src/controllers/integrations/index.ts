import { Request, Response } from 'express';

const PLATFORMS = ['github', 'linkedin', 'twitter', 'discord'];

const connectPlatform = async (req: Request, res: Response): Promise<void> => {
  const { platform, username } = req.body;
  if (!platform || !PLATFORMS.includes(platform)) {
    res.status(400).json({ message: 'Invalid platform' });
    return;
  }

  // Minimal stub - in production this would perform OAuth and persist
  res.status(200).json({ platform, connected: true, username: username || null, lastSync: new Date().toISOString() });
};

const getPlatforms = async (_req: Request, res: Response): Promise<void> => {
  const data = PLATFORMS.map(p => ({ platform: p, connected: false }));
  res.status(200).json(data);
};

export { connectPlatform, getPlatforms };
