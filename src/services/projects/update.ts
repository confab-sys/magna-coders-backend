export async function updateProject(projectModel: any, id: string, updates: any, clientId: string) {
  const project = await projectModel.findById(id);
  if (!project) throw new Error('Project not found');
  if (project.clientId !== clientId) throw new Error('Access denied');
  if (project.status !== 'OPEN') throw new Error('Can only update open projects');
  return await projectModel.update(id, updates);
}

export async function updateProjectStatus(projectModel: any, id: string, status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED', updatedBy: string) {
  await projectModel.updateStatus(id, status, updatedBy);
  return { message: `Project status updated to ${status}` };
}