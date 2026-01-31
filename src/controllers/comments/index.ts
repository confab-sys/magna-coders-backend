import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const addComment = async (req: Request, res: Response): Promise<void> => {
  const authorId = req.user as string;
  const { postId, content } = req.body;
  if (!postId || !content) {
    res.status(400).json({ message: 'postId and content are required' });
    return;
  }

  const comment = await prisma.comments.create({
    data: { id: uuidv4(), post_id: postId, author_id: authorId, content }
  });

  res.status(201).json(comment);
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user as string;
  const { id } = req.params;
  const comment = await prisma.comments.findUnique({ where: { id } });
  if (!comment) {
    res.status(404).json({ message: 'Comment not found' });
    return;
  }
  if (comment.author_id !== userId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }
  await prisma.comments.delete({ where: { id } });
  res.status(200).json({ message: 'Comment deleted' });
};

const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  const comments = await prisma.comments.findMany({ where: { post_id: postId }, orderBy: { created_at: 'desc' } });
  res.status(200).json(comments);
};

export { addComment, deleteComment, getCommentsByPost };
