export async function getProjects(projectModel: any, options: any = {}) {
  return await projectModel.findMany(options);
}

export async function getProjectById(projectModel: any, id: string) {
  const project = await projectModel.findById(id);
  if (!project) throw new Error('Project not found');
  return project;
}

export async function getOpenProjects(projectModel: any, options: any = {}) {
  return await projectModel.findMany({ ...options, status: 'OPEN' });
}

export async function getProjectsByCategory(projectModel: any, categoryId: string, options: any = {}) {
  return await projectModel.findMany({ ...options, categoryId });
}

export async function getProjectsByBudgetRange(projectModel: any, minBudget: number, maxBudget: number, options: any = {}) {
  const projects = await projectModel.findMany({ ...options, limit: 1000 });
  const filtered = projects.projects.filter((p: any) => p.budget && p.budget >= minBudget && p.budget <= maxBudget);
  return { ...projects, projects: filtered.slice(0, options.limit || 20), totalCount: filtered.length };
}

export async function getUserProjects(projectModel: any, userId: string, options: any = {}) {
  return await projectModel.getUserProjects(userId, options);
}