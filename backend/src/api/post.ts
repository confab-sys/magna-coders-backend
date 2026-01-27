import { PrismaClient, Post as PrismaPost, PostType } from '@prisma/client';

const prisma = new PrismaClient();

export class Post {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // Find post by ID
  async findById(id: string) {
    return await this.prisma.post.findUnique({
      where: { id },
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
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
                isVerified: true,
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
              }
            },
            _count: {
              select: { likes: true, replies: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      }
    });
  }

  // Get posts with pagination and filtering
  async findMany(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    categoryId?: string;
    authorId?: string;
    isVerified?: boolean;
  } = {}) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'new',
      categoryId,
      authorId,
      isVerified = true
    } = options;

    let orderBy: any = { createdAt: 'desc' };

    switch (sortBy) {
      case 'new':
        orderBy = { createdAt: 'desc' };
        break;
      case 'old':
        orderBy = { createdAt: 'asc' };
        break;
      case 'top':
        orderBy = { likesCount: 'desc' };
        break;
      case 'trending':
        orderBy = { commentsCount: 'desc' };
        break;
    }

    const where: any = { isVerified };
    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;

    const totalCount = await this.prisma.post.count({ where });

    const posts = await this.prisma.post.findMany({
      where,
      orderBy,
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
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      }
    });

    return {
      posts: posts.map(post => ({
        ...post,
        commentsCount: post._count.comments,
        likesCount: post._count.likes,
        _count: undefined,
      })),
      totalCount,
      page,
      limit,
    };
  }

  // Create new post
  async create(data: {
    title: string;
    content?: string;
    postType: PostType;
    tags?: string[];
    authorId: string;
    categoryId?: string;
    imageLink?: string;
    imageId?: string;
  }): Promise<PrismaPost> {
    return await this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        postType: data.postType,
        tags: data.tags || [],
        authorId: data.authorId,
        categoryId: data.categoryId,
        // imageLink: data.imageLink,
        // imageId: data.imageId,
        isVerified: false, // Will be verified by admin or auto-verified for trusted users
      }
    });
  }

  // Update post
  async update(id: string, data: Partial<PrismaPost>): Promise<PrismaPost> {
    return await this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });
  }

  // Delete post
  async delete(id: string): Promise<PrismaPost> {
    return await this.prisma.post.delete({
      where: { id }
    });
  }

  // Like/unlike post
  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean }> {
    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId,
        postId,
      }
    });

    if (existingLike) {
      // Unlike
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      await this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } }
      });
      return { liked: false };
    } else {
      // Like
      await this.prisma.like.create({
        data: {
          user: { connect: { id: userId } },
          post: { connect: { id: postId } },
        }
      });
      await this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } }
      });
      return { liked: true };
    }
  }

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { viewsCount: { increment: 1 } }
    });
  }

  // Verify post
  async verifyPost(id: string, verifiedBy: string): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedBy,
        verifiedAt: new Date(),
      }
    });
  }

  // Search posts
  async search(query: string, options: {
    page?: number;
    limit?: number;
    categoryId?: string;
  } = {}) {
    const { page = 1, limit = 20, categoryId } = options;

    const where: any = {
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          content: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ],
      isVerified: true,
    };

    if (categoryId) where.categoryId = categoryId;

    const totalCount = await this.prisma.post.count({ where });

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isVerified: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      }
    });

    return {
      posts: posts.map(post => ({
        ...post,
        commentsCount: post._count.comments,
        likesCount: post._count.likes,
        _count: undefined,
      })),
      totalCount,
      page,
      limit,
    };
  }
}

export default Post;