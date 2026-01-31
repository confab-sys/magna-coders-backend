import { v4 as uuidv4 } from 'uuid';

export async function createProject(projectModel: any, projectData: {
  title: string;
  description: string;
  projectType: 'WEBSITE' | 'MOBILE_APP' | 'DESKTOP_APP' | 'API' | 'OTHER';
  technologies: string[];
  budget: number;
  deadline?: Date;
  clientId: string;
  categoryId?: string;
}) {
  if (!projectData.title?.trim() || !projectData.description?.trim() || !projectData.budget) {
    throw new Error('Title, description, and budget are required');
  }

  if (projectData.budget <= 0) {
    throw new Error('Budget must be greater than 0');
  }

  const payload = {
    ...projectData,
    id: uuidv4(),
  };

  return await projectModel.create(payload);
}