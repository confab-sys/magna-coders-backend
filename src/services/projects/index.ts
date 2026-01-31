import { createProject } from './create';
import { getProjects, getProjectById, getOpenProjects, getProjectsByCategory, getProjectsByBudgetRange, getUserProjects } from './read';
import { updateProject, updateProjectStatus } from './update';
import { deleteProject } from './delete';
import { placeBid, acceptBid } from './bidding';
import { getProjectStats } from './stats';

class ProjectService {
  private projectModel: any;

  constructor(projectModel?: any) {
    this.projectModel = projectModel || null;
  }

  async createProject(projectData: any) {
    return await createProject(this.projectModel, projectData);
  }

  async getProjects(options: any = {}) {
    return await getProjects(this.projectModel, options);
  }

  async getProjectById(id: string) {
    return await getProjectById(this.projectModel, id);
  }

  async updateProject(id: string, updates: any, clientId: string) {
    return await updateProject(this.projectModel, id, updates, clientId);
  }

  async deleteProject(id: string, clientId: string) {
    return await deleteProject(this.projectModel, id, clientId);
  }

  async placeBid(projectId: string, bidderId: string, amount: number, proposal: string) {
    return await placeBid(this.projectModel, projectId, bidderId, amount, proposal);
  }

  async acceptBid(projectId: string, bidId: string, clientId: string) {
    return await acceptBid(this.projectModel, projectId, bidId, clientId);
  }

  async updateProjectStatus(id: string, status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED', updatedBy: string) {
    return await updateProjectStatus(this.projectModel, id, status, updatedBy);
  }

  async getOpenProjects(options: any = {}) {
    return await getOpenProjects(this.projectModel, options);
  }

  async getProjectsByCategory(categoryId: string, options: any = {}) {
    return await getProjectsByCategory(this.projectModel, categoryId, options);
  }

  async getProjectsByBudgetRange(minBudget: number, maxBudget: number, options: any = {}) {
    return await getProjectsByBudgetRange(this.projectModel, minBudget, maxBudget, options);
  }

  async getUserProjects(userId: string, options: any = {}) {
    return await getUserProjects(this.projectModel, userId, options);
  }

  async getProjectStats() {
    return await getProjectStats(this.projectModel);
  }
}

export default ProjectService;