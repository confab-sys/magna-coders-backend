import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const senderId = req.user as string;
  const { conversationId, content } = req.body;
  if (!conversationId || !content) {
    res.status(400).json({ message: 'conversationId and content are required' });
    return;
  }

  const message = await prisma.messages.create({
    data: {
      id: uuidv4(),
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    }
  });

  res.status(201).json(message);
};

const getMessages = async (req: Request, res: Response): Promise<void> => {
  const { conversationId } = req.query as Record<string, string>;
  if (!conversationId) {
    res.status(400).json({ message: 'conversationId is required' });
    return;
  }

  const messages = await prisma.messages.findMany({
    where: { conversation_id: conversationId },
    orderBy: { created_at: 'asc' }
  });

  res.status(200).json(messages);
};

export { sendMessage, getMessages };
