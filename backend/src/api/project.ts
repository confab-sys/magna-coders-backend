import { PrismaClient, Project as PrismaProject, ProjectStatus, ProjectType, BidStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class Project {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // Find project by ID
  async findById(id: string) {
    return await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isVerified: true,
            bio: true,
            portfolioUrl: true,
          }
        },
        assignedTo: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isVerified: true,
            bio: true,
            portfolioUrl: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          }
        },
        bids: {
          include: {
            bidder: {
              select: {
                id: true,
                username: true,
                avatar: true,
                isVerified: true,
                skills: true,
              }
            }
          },
          orderBy: { amount: 'asc' }
        },
        _count: {
          select: { bids: true }
        }
      }
    });
  }

  // Get projects with pagination and filtering
  async findMany(options: {
    page?: number;
    limit?: number;
    status?: ProjectStatus;
    categoryId?: string;
    clientId?: string;
    assignedToId?: string;
    sortBy?: string;
  } = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      categoryId,
      clientId,
      assignedToId,
      sortBy = 'newest'
    } = options;

    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'budget_high':
        orderBy = { budget: 'desc' };
        break;
      case 'budget_low':
        orderBy = { budget: 'asc' };
        break;
      case 'deadline':
        orderBy = { deadline: 'asc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
    }

    const where: any = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (clientId) where.clientId = clientId;
    if (assignedToId) where.assignedToId = assignedToId;

    const totalCount = await this.prisma.project.count({ where });

    const projects = await this.prisma.project.findMany({
      where,
      orderBy,
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
            icon: true,
          }
        },
        bids: {
          include: {
            bidder: {
              select: {
                id: true,
                username: true,
                avatar: true,
                isVerified: true,
              }
            }
          },
          orderBy: { amount: 'asc' }
        },
        _count: {
          select: { bids: true }
        }
      }
    });

    return {
      projects: projects.map(project => ({
        ...project,
        bidsCount: project._count.bids,
        _count: undefined,
      })),
      totalCount,
      page,
      limit,
    };
  }

  // Create new project
  async create(data: {
    title: string;
    description: string;
    projectType: ProjectType;
    technologies: string[];
    budget: number;
    deadline?: Date;
    clientId: string;
    categoryId: string;
  }): Promise<PrismaProject> {
    return await this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        projectType: data.projectType,
        technologies: data.technologies,
        budget: data.budget,
        deadline: data.deadline,
        clientId: data.clientId,
        categoryId: data.categoryId,
        status: 'OPEN',
      }
    });
  }

  // Update project
  async update(id: string, data: Partial<PrismaProject>): Promise<PrismaProject> {
    return await this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });
  }

  // Delete project
  async delete(id: string): Promise<PrismaProject> {
    return await this.prisma.project.delete({
      where: { id }
    });
  }

  // Place bid on project
  async placeBid(projectId: string, bidderId: string, amount: number, proposal: string) {
    // Check if user already bid
    const existingBid = await this.prisma.bid.findFirst({
      where: {
        projectId,
        bidderId,
      }
    });

    if (existingBid) {
      throw new Error('You have already placed a bid on this project');
    }

    return await this.prisma.bid.create({
      data: {
        amount,
        proposal,
        project: { connect: { id: projectId } },
        bidder: { connect: { id: bidderId } },
        status: 'PENDING',
      },
      include: {
        bidder: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isVerified: true,
            skills: true,
          }
        }
      }
    });
  }

  // Accept bid
  async acceptBid(projectId: string, bidId: string, clientId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.clientId !== clientId) {
      throw new Error('Access denied');
    }

    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: { bidder: true }
    });

    if (!bid || bid.projectId !== projectId) {
      throw new Error('Bid not found');
    }

    // Update project
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        assignedToId: bid.bidderId,
        status: 'IN_PROGRESS',
      }
    });

    // Update bid status
    await this.prisma.bid.update({
      where: { id: bidId },
      data: { status: 'ACCEPTED' }
    });

    // Reject other bids
    await this.prisma.bid.updateMany({
      where: {
        projectId,
        id: { not: bidId }
      },
      data: { status: 'REJECTED' }
    });

    return bid;
  }

  // Update project status
  async updateStatus(id: string, status: ProjectStatus, updatedBy: string): Promise<void> {
    await this.prisma.project.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      }
    });
  }

  // Get user's projects (as client or assignee)
  async getUserProjects(userId: string, options: {
    page?: number;
    limit?: number;
    role?: 'client' | 'assignee' | 'both';
  } = {}) {
    const { page = 1, limit = 20, role = 'both' } = options;

    let where: any = {};
    if (role === 'client') {
      where.clientId = userId;
    } else if (role === 'assignee') {
      where.assignedToId = userId;
    } else {
      where.OR = [
        { clientId: userId },
        { assignedToId: userId }
      ];
    }

    return await this.prisma.project.findMany({
      where,
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
        },
        _count: {
          select: { bids: true }
        }
      }
    });
  }
}

export default Project;