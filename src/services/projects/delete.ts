export async function deleteProject(projectModel: any, id: string, clientId: string) {
  const project = await projectModel.findById(id);
  if (!project) throw new Error('Project not found');
  if (project.clientId !== clientId) throw new Error('Access denied');
  if (project.status !== 'OPEN') throw new Error('Can only delete open projects');
  await projectModel.delete(id);
  return { message: 'Project deleted successfully' };
}