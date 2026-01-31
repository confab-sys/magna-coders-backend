import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import paginateResults from '../../utils/paginateResults';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const getProjects = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const categoryId = req.query.category as string;
  const sortBy = req.query.sortby as string;

  let orderBy: any = { created_at: 'desc' };
  switch (sortBy) {
    case 'budget_high':
      orderBy = { created_at: 'desc' };
      break;
    case 'budget_low':
      orderBy = { created_at: 'asc' };
      break;
    case 'deadline':
      orderBy = { created_at: 'asc' };
      break;
    case 'newest':
      orderBy = { created_at: 'desc' };
      break;
  }

  const where: any = {};
  if (categoryId) where.category_id = categoryId;

  const totalCount = await prisma.projects.count({ where });

  const projects = await prisma.projects.findMany({
    where,
    orderBy,
    take: limit,
    skip: (page - 1) * limit,
    select: {
      id: true,
      title: true,
      description: true,
      owner_id: true,
      category_id: true,
      created_at: true,
      updated_at: true
    }
  });

  const paginated = paginateResults(page, limit, totalCount);

  const paginatedProjects = {
    previous: paginated.results.previous,
    results: projects,
    next: paginated.results.next,
  };

  res.status(200).json(paginatedProjects);
};

const getProjectById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const project = await prisma.projects.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          avatar_url: true,
          bio: true,
        }
      },
      categories: {
        select: {
          id: true,
          name: true,
          description: true,
        }
      },
      project_members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar_url: true
            }
          }
        }
      }
    }
  });

  if (!project) {
    res.status(404).send({ message: 'Project not found.' });
    return;
  }

  res.status(200).json(project);
};

const createProject = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user as string;
  const {
    title,
    description,
    categoryId,
  } = req.body;

  if (!title || !description) {
    res.status(400).send({ message: 'Title and description are required.' });
    return;
  }

  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).send({ message: 'User not found.' });
    return;
  }

  if (categoryId) {
    const category = await prisma.categories.findUnique({ where: { id: categoryId } });
    if (!category) {
      res.status(404).send({ message: 'Category not found.' });
      return;
    }
  }

  const project = await prisma.projects.create({
    data: {
      id: uuidv4(),
      title,
      description,
      owner_id: userId,
      category_id: categoryId || null,
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          avatar_url: true,
        }
      },
      categories: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  res.status(201).json(project);
};

const updateProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user as string;
  const { title, description, category_id } = req.body;

  const project = await prisma.projects.findUnique({
    where: { id },
    include: { owner: true }
  });

  if (!project) {
    res.status(404).send({ message: 'Project not found.' });
    return;
  }

  if (project.owner_id !== userId) {
    res.status(403).send({ message: 'Access denied.' });
    return;
  }

  const updatedProject = await prisma.projects.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(category_id && { category_id }),
      updated_at: new Date(),
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          avatar_url: true,
        }
      },
      categories: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  res.status(200).json(updatedProject);
};

const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user as string;

  const project = await prisma.projects.findUnique({
    where: { id },
    include: { owner: true }
  });

  if (!project) {
    res.status(404).send({ message: 'Project not found.' });
    return;
  }

  if (project.owner_id !== userId) {
    res.status(403).send({ message: 'Access denied.' });
    return;
  }

  await prisma.projects.delete({ where: { id } });

  res.status(204).end();
};



export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};