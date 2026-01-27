import { PrismaClient, Follow as PrismaFollow, Like as PrismaLike, Notification as PrismaNotification } from '@prisma/client';

const prisma = new PrismaClient();

export class Social {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // Follow/unfollow user
  async toggleFollow(followerId: string, followingId: string): Promise<{ following: boolean }> {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        }
      }
    });

    if (existingFollow) {
      // Unfollow
      await this.prisma.follow.delete({ where: { id: existingFollow.id } });
      return { following: false };
    } else {
      // Follow
      await this.prisma.follow.create({
        data: {
          followerId,
          followingId,
        }
      });

      // Create notification
      await this.createNotification({
        userId: followingId,
        type: 'FOLLOW',
        title: 'New Follower',
        message: 'Someone started following you',
      });

      return { following: true };
    }
  }

  // Get followers
  async getFollowers(userId: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    const { page = 1, limit = 20 } = options;

    const followers = await this.prisma.follow.findMany({
      where: { followingId: userId },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
            isVerified: true,
            verificationBadge: true,
            _count: {
              select: {
                followers: true,
                following: true,
              }
            }
          }
        }
      }
    });

    return followers.map(f => ({
      ...f.follower,
      followersCount: f.follower._count.followers,
      followingCount: f.follower._count.following,
      _count: undefined,
    }));
  }

  // Get following
  async getFollowing(userId: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    const { page = 1, limit = 20 } = options;

    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
            isVerified: true,
            verificationBadge: true,
            _count: {
              select: {
                followers: true,
                following: true,
              }
            }
          }
        }
      }
    });

    return following.map(f => ({
      ...f.following,
      followersCount: f.following._count.followers,
      followingCount: f.following._count.following,
      _count: undefined,
    }));
  }

  // Get user feed
  async getUserFeed(userId: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    const { page = 1, limit = 20 } = options;

    // Get users that current user follows
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });

    const followingIds = following.map(f => f.followingId);

    // Include user's own posts and posts from followed users
    const posts = await this.prisma.post.findMany({
      where: {
        OR: [
          { authorId: { in: [...followingIds, userId] } },
          { authorId: userId }
        ],
        isVerified: true,
      },
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

    return posts.map(post => ({
      ...post,
      commentsCount: post._count.comments,
      likesCount: post._count.likes,
      _count: undefined,
    }));
  }

  // Like/unlike content (post, comment, or reply)
  async toggleLike(userId: string, contentType: 'post' | 'comment' | 'reply', contentId: string): Promise<{ liked: boolean }> {
    const where: any = { userId };
    let updateData: any = {};

    switch (contentType) {
      case 'post':
        where.postId = contentId;
        updateData = { post: { connect: { id: contentId } } };
        break;
      case 'comment':
        where.commentId = contentId;
        updateData = { comment: { connect: { id: contentId } } };
        break;
      case 'reply':
        where.replyId = contentId;
        updateData = { reply: { connect: { id: contentId } } };
        break;
    }

    const existingLike = await this.prisma.like.findFirst({ where });

    if (existingLike) {
      // Unlike
      await this.prisma.like.delete({ where: { id: existingLike.id } });

      // Decrement likes count
      switch (contentType) {
        case 'post':
          await this.prisma.post.update({
            where: { id: contentId },
            data: { likesCount: { decrement: 1 } }
          });
          break;
        case 'comment':
          await this.prisma.comment.update({
            where: { id: contentId },
            data: { likesCount: { decrement: 1 } }
          });
          break;
        case 'reply':
          await this.prisma.reply.update({
            where: { id: contentId },
            data: { likesCount: { decrement: 1 } }
          });
          break;
      }

      return { liked: false };
    } else {
      // Like
      await this.prisma.like.create({
        data: {
          userId,
          ...updateData,
        }
      });

      // Increment likes count
      switch (contentType) {
        case 'post':
          await this.prisma.post.update({
            where: { id: contentId },
            data: { likesCount: { increment: 1 } }
          });
          break;
        case 'comment':
          await this.prisma.comment.update({
            where: { id: contentId },
            data: { likesCount: { increment: 1 } }
          });
          break;
        case 'reply':
          await this.prisma.reply.update({
            where: { id: contentId },
            data: { likesCount: { increment: 1 } }
          });
          break;
      }

      return { liked: true };
    }
  }

  // Create notification
  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    postId?: string;
    commentId?: string;
    projectId?: string;
    messageId?: string;
  }): Promise<PrismaNotification> {
    return await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        title: data.title,
        message: data.message,
        postId: data.postId,
        commentId: data.commentId,
        projectId: data.projectId,
        messageId: data.messageId,
      }
    });
  }

  // Get user notifications
  async getUserNotifications(userId: string, options: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  } = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;

    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    // Mark as read if getting all notifications
    if (!unreadOnly) {
      await this.prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: { isRead: true }
      });
    }

    return notifications;
  }

  // Get unread notification count
  async getUnreadNotificationCount(userId: string): Promise<number> {
    return await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      }
    });
  }

  // Search users
  async searchUsers(query: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    const { page = 1, limit = 20 } = options;

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        isVerified: true,
        verificationBadge: true,
        role: true,
        skills: true,
        _count: {
          select: {
            posts: true,
            followers: true,
          }
        }
      }
    });

    return users.map(user => ({
      ...user,
      postsCount: user._count.posts,
      followersCount: user._count.followers,
      _count: undefined,
    }));
  }

  // Report content
  async reportContent(data: {
    reporterId: string;
    reason: string;
    description?: string;
    contentType: 'user' | 'post';
    contentId: string;
  }) {
    const reportData: any = {
      reporterId: data.reporterId,
      reason: data.reason,
      description: data.description,
      status: 'PENDING',
    };

    if (data.contentType === 'user') {
      reportData.reportedUserId = data.contentId;
    } else if (data.contentType === 'post') {
      reportData.reportedPostId = data.contentId;
    }

    return await this.prisma.report.create({
      data: reportData
    });
  }
}

export default Social;