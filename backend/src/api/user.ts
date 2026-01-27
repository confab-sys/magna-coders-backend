import { PrismaClient, User as PrismaUser, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export class User {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // Find user by ID
  async findById(id: string): Promise<PrismaUser | null> {
    return await this.prisma.user.findUnique({
      where: { id }
    });
  }

  // Find user by username (case insensitive)
  async findByUsername(username: string): Promise<PrismaUser | null> {
    return await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive'
        }
      }
    });
  }

  // Find user by email
  async findByEmail(email: string): Promise<PrismaUser | null> {
    return await this.prisma.user.findUnique({
      where: { email }
    });
  }

  // Create new user
  async create(data: {
    username: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
  }): Promise<PrismaUser> {
    return await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role || 'DEVELOPER',
      }
    });
  }

  // Update user
  async update(id: string, data: Partial<PrismaUser>): Promise<PrismaUser> {
    return await this.prisma.user.update({
      where: { id },
      data
    });
  }

  // Delete user
  async delete(id: string): Promise<PrismaUser> {
    return await this.prisma.user.delete({
      where: { id }
    });
  }

  // Get user profile with relations
  async getProfile(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        role: true,
        postKarma: true,
        commentKarma: true,
        tokens: true,
        isVerified: true,
        verificationBadge: true,
        portfolioUrl: true,
        skills: true,
        experience: true,
        location: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
            clientProjects: true,
            assignedProjects: true,
          }
        },
        createdAt: true,
      }
    });
  }

  // Get user's posts
  async getUserPosts(userId: string, page: number = 1, limit: number = 20) {
    return await this.prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
      include: {
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
  }

  // Get user's projects
  async getUserProjects(userId: string, page: number = 1, limit: number = 20) {
    return await this.prisma.project.findMany({
      where: {
        OR: [
          { clientId: userId },
          { assignedToId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        client: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isVerified: true,
          }
        },
        assignedTo: {
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
        }
      }
    });
  }

  // Award tokens to user
  async awardTokens(userId: string, amount: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokens: {
          increment: amount
        }
      }
    });
  }

  // Award karma to user
  async awardKarma(userId: string, type: 'post' | 'comment', amount: number = 1): Promise<void> {
    const field = type === 'post' ? 'postKarma' : 'commentKarma';
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        [field]: {
          increment: amount
        }
      }
    });
  }

  // Verify user
  async verifyUser(userId: string, badge?: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        verificationBadge: badge,
      }
    });
  }

  // Search users
  async search(query: string, page: number = 1, limit: number = 20) {
    return await this.prisma.user.findMany({
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
  }
}

export default User;