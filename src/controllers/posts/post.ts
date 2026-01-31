import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const getPosts = async (req: Request, res: Response): Promise<void> => {
	const page = Math.max(Number(req.query.page || 1), 1);
	const limit = Math.max(Number(req.query.limit || 10), 1);
	const skip = (page - 1) * limit;
	const { categoryId, authorId, sortBy } = req.query as Record<string, string>;

	const where: any = {};
	if (categoryId) where.category_id = categoryId;
	if (authorId) where.author_id = authorId;

	const orderBy: any = {};
	if (sortBy === 'trending') {
		orderBy.likesCount = 'desc';
	} else {
		orderBy.createdAt = 'desc';
	}

	const [posts, total] = await Promise.all([
		prisma.posts.findMany({
			where,
			skip,
			take: limit,
			orderBy,
			include: {
				author: {
					select: { id: true, username: true, avatar_url: true }
				},
				categories: {
					select: { id: true, name: true }
				}
			}
		}),
		prisma.posts.count({ where })
	]);

	const totalPages = Math.ceil(total / limit);

	res.status(200).json({ posts, totalPages, currentPage: page });
};

const getPostById = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	const post = await prisma.posts.findUnique({
		where: { id },
		include: {
			author: { select: { id: true, username: true, avatar_url: true } },
			categories: { select: { id: true, name: true } },
			comments: {
				orderBy: { created_at: 'desc' },
				include: { author: { select: { id: true, username: true, avatar_url: true } } },
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

	const post = await prisma.posts.create({
		data: {
			id: uuidv4(),
			title: title.trim(),
			content: content || null,
			category_id: categoryId || null,
			author_id: authorId,
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

	const post = await prisma.posts.findUnique({ where: { id } });
	if (!post) {
		res.status(404).json({ message: 'Post not found' });
		return;
	}

	if (post.author_id !== userId) {
		res.status(403).json({ message: 'Access denied' });
		return;
	}

	const updated = await prisma.posts.update({
		where: { id },
		data: {
			title: title !== undefined ? title : post.title,
			content: content !== undefined ? content : post.content,
			category_id: categoryId !== undefined ? categoryId : post.category_id,
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

	const post = await prisma.posts.findUnique({ where: { id } });
	if (!post) {
		res.status(404).json({ message: 'Post not found' });
		return;
	}

	if (post.author_id !== userId) {
		res.status(403).json({ message: 'Access denied' });
		return;
	}

	await prisma.posts.delete({ where: { id } });

	res.status(200).json({ message: 'Post deleted successfully' });
};

const likePost = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params; // post id
	const userId = req.user;

	if (!userId || !id) {
		res.status(401).json({ message: 'Authentication required' });
		return;
	}

	const existing = await prisma.likes.findFirst({ where: { post_id: id, user_id: userId } });

	if (existing) {
		// unlike
		await prisma.likes.delete({ where: { id: existing.id } });
		res.status(200).json({ liked: false });
		return;
	}

	// like
	await prisma.likes.create({ data: { id: uuidv4(), post_id: id, user_id: userId } });

	res.status(200).json({ liked: true });
};

export { getPosts, getPostById, createPost, updatePost, deletePost, likePost };