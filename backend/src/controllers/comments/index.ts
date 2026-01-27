import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getComments = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    res.status(404).send({ message: 'Post not found.' });
    return;
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
          isVerified: true,
          verificationBadge: true,
        }
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
              isVerified: true,
            }
          },
          _count: {
            select: { likes: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      _count: {
        select: { likes: true, replies: true }
      }
    }
  });

  const commentsWithCounts = comments.map(comment => ({
    ...comment,
    likesCount: comment._count.likes,
    repliesCount: comment._count.replies,
    _count: undefined,
  }));

  res.status(200).json(commentsWithCounts);
};

const createComment = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user as string;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    res.status(400).send({ message: 'Comment content is required.' });
    return;
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    res.status(404).send({ message: 'Post not found.' });
    return;
  }

  const author = await prisma.user.findUnique({ where: { id: userId } });
  if (!author) {
    res.status(404).send({ message: 'User not found.' });
    return;
  }

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      post: { connect: { id: postId } },
      author: { connect: { id: userId } },
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
          isVerified: true,
        }
      }
    }
  });

  // Update post comment count
  await prisma.post.update({
    where: { id: postId },
    data: { commentsCount: { increment: 1 } }
  });

  // Award karma and tokens for commenting and use though u will change it later
  await prisma.user.update({
    where: { id: userId },
    data: {
      commentKarma: { increment: 1 },
      tokens: { increment: 2 }
    }
  });

  res.status(201).json(comment);
};

const updateComment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user as string;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    res.status(400).send({ message: 'Comment content is required.' });
    return;
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { author: true }
  });

  if (!comment) {
    res.status(404).send({ message: 'Comment not found.' });
    return;
  }

  if (comment.authorId !== userId) {
    res.status(403).send({ message: 'Access denied.' });
    return;
  }

  const updatedComment = await prisma.comment.update({
    where: { id },
    data: {
      content: content.trim(),
      isEdited: true,
      updatedAt: new Date(),
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        }
      }
    }
  });

  res.status(200).json(updatedComment);
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user as string;

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { author: true, post: true }
  });

  if (!comment) {
    res.status(404).send({ message: 'Comment not found.' });
    return;
  }

  if (comment.authorId !== userId) {
    res.status(403).send({ message: 'Access denied.' });
    return;
  }

  await prisma.comment.delete({ where: { id } });

  // Update post comment count and decrement author's comment karma
  await prisma.post.update({
    where: { id: comment.postId },
    data: { commentsCount: { decrement: 1 } }
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      commentKarma: { decrement: 1 },
      tokens: { decrement: 2 }
    }
  });

  res.status(204).end();
};

const createReply = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const userId = req.user as string;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    res.status(400).send({ message: 'Reply content is required.' });
    return;
  }

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) {
    res.status(404).send({ message: 'Comment not found.' });
    return;
  }

  const author = await prisma.user.findUnique({ where: { id: userId } });
  if (!author) {
    res.status(404).send({ message: 'User not found.' });
    return;
  }

  const reply = await prisma.reply.create({
    data: {
      content: content.trim(),
      comment: { connect: { id: commentId } },
      author: { connect: { id: userId } },
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
          isVerified: true,
        }
      }
    }
  });

  // Update comment reply count
  await prisma.comment.update({
    where: { id: commentId },
    data: { repliesCount: { increment: 1 } }
  });

  // Award tokens
  await prisma.user.update({
    where: { id: userId },
    data: { tokens: { increment: 1 } }
  });

  res.status(201).json(reply);
};

const likeComment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user as string;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    res.status(404).send({ message: 'Comment not found.' });
    return;
  }

  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      commentId: id,
    }
  });

  if (existingLike) {
    // Unlike
    await prisma.like.delete({ where: { id: existingLike.id } });
    await prisma.comment.update({
      where: { id },
      data: { likesCount: { decrement: 1 } }
    });
    res.status(200).json({ liked: false });
  } else {
    // Like
    await prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        comment: { connect: { id } },
      }
    });
    await prisma.comment.update({
      where: { id },
      data: { likesCount: { increment: 1 } }
    });
    res.status(200).json({ liked: true });
  }
};

const likeReply = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user as string;

  const reply = await prisma.reply.findUnique({ where: { id } });
  if (!reply) {
    res.status(404).send({ message: 'Reply not found.' });
    return;
  }

  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      replyId: id,
    }
  });

  if (existingLike) {
    // Unlike
    await prisma.like.delete({ where: { id: existingLike.id } });
    await prisma.reply.update({
      where: { id },
      data: { likesCount: { decrement: 1 } }
    });
    res.status(200).json({ liked: false });
  } else {
    // Like
    await prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        reply: { connect: { id } },
      }
    });
    await prisma.reply.update({
      where: { id },
      data: { likesCount: { increment: 1 } }
    });
    res.status(200).json({ liked: true });
  }
};

export {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  createReply,
  likeComment,
  likeReply,
};