import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getPosts = async (req: Request, res: Response): Promise<void> => {
	const page = Math.max(Number(req.query.page || 1), 1);
	const limit = Math.max(Number(req.query.limit || 10), 1);
	const skip = (page - 1) * limit;
	const { categoryId, authorId, sortBy } = req.query as Record<string, string>;

	const where: any = {};
	if (categoryId) where.categoryId = categoryId;
	if (authorId) where.authorId = authorId;

	const orderBy: any = {};
	if (sortBy === 'trending') {
		orderBy.likesCount = 'desc';
	} else {
		orderBy.createdAt = 'desc';
	}

	const [posts, total] = await Promise.all([
		prisma.post.findMany({
			where,
			skip,
			take: limit,
			orderBy,
			include: {
				author: {
					select: { id: true, username: true, avatar: true }
				},
				category: {
					select: { id: true, name: true }
				}
			}
		}),
		prisma.post.count({ where })
	]);

	const totalPages = Math.ceil(total / limit);

	res.status(200).json({ posts, totalPages, currentPage: page });
};

const getPostById = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	const post = await prisma.post.update({
		where: { id },
		data: { viewsCount: { increment: 1 } },
		include: {
			author: { select: { id: true, username: true, avatar: true } },
			category: { select: { id: true, name: true } },
			comments: {
				orderBy: { createdAt: 'desc' },
				include: { author: { select: { id: true, username: true, avatar: true } } },
				take: 20
			}
		}
	}).catch(() => null);

	if (!post) {
		res.status(404).json({ message: 'Post not found' });
		return;
	}

	res.status(200).json(post);
};

const createPost = async (req: Request, res: Response): Promise<void> => {
	const authorId = req.user;
	const { title, content, postType, tags, categoryId } = req.body;

	if (!authorId) {
		res.status(401).json({ message: 'Authentication required' });
		return;
	}

	if (!title || typeof title !== 'string' || title.trim().length === 0) {
		res.status(400).json({ message: 'Title is required' });
		return;
	}

	const post = await prisma.post.create({
		data: {
			title: title.trim(),
			content: content || null,
			postType: (postType as any) || 'TEXT',
			tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
			categoryId: categoryId || null,
			authorId,
		}
	});

	res.status(201).json(post);
};

const updatePost = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	const userId = req.user;
	const { title, content, tags, categoryId } = req.body;

	if (!userId) {
		res.status(401).json({ message: 'Authentication required' });
		return;
	}

	const post = await prisma.post.findUnique({ where: { id } });
	if (!post) {
		res.status(404).json({ message: 'Post not found' });
		return;
	}

	if (post.authorId !== userId) {
		res.status(403).json({ message: 'Access denied' });
		return;
	}

	const updated = await prisma.post.update({
		where: { id },
		data: {
			title: title !== undefined ? title : post.title,
			content: content !== undefined ? content : post.content,
			tags: tags !== undefined ? (Array.isArray(tags) ? tags : []) : post.tags,
			categoryId: categoryId !== undefined ? categoryId : post.categoryId,
		}
	});

	res.status(200).json(updated);
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	const userId = req.user;

	if (!userId) {
		res.status(401).json({ message: 'Authentication required' });
		return;
	}

	const post = await prisma.post.findUnique({ where: { id } });
	if (!post) {
		res.status(404).json({ message: 'Post not found' });
		return;
	}

	if (post.authorId !== userId) {
		res.status(403).json({ message: 'Access denied' });
		return;
	}

	await prisma.post.delete({ where: { id } });

	res.status(200).json({ message: 'Post deleted successfully' });
};

const likePost = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params; // post id
	const userId = req.user;

	if (!userId) {
		res.status(401).json({ message: 'Authentication required' });
		return;
	}

	const existing = await prisma.like.findFirst({ where: { postId: id, userId } });

	if (existing) {
		// unlike
		await prisma.$transaction([
			prisma.like.delete({ where: { id: existing.id } }),
			prisma.post.update({ where: { id }, data: { likesCount: { decrement: 1 } } })
		]);

		res.status(200).json({ liked: false });
		return;
	}

	// like
	await prisma.$transaction([
		prisma.like.create({ data: { postId: id, userId } }),
		prisma.post.update({ where: { id }, data: { likesCount: { increment: 1 } } })
	]);

	res.status(200).json({ liked: true });
};

export { getPosts, getPostById, createPost, updatePost, deletePost, likePost };