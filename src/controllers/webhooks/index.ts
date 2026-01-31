import { Request, Response } from 'express';

const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  // Log and acknowledge webhook payload
  console.log('Webhook received:', req.path, req.body);
  res.status(200).json({ message: 'Webhook received' });
};

export { handleWebhook };
