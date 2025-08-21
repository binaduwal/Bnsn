import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { User, Project, Blueprint, Campaign } from '../types';
import { createError } from '../middleware/errorHandler';

const DATA_DIR = path.join(process.cwd(), 'data');

export class StorageService {
  constructor() {
    this.ensureDataDirectory();
  }

  private async ensureDataDirectory() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.mkdir(path.join(DATA_DIR, 'users'), { recursive: true });
      await fs.mkdir(path.join(DATA_DIR, 'projects'), { recursive: true });
      await fs.mkdir(path.join(DATA_DIR, 'blueprints'), { recursive: true });
      await fs.mkdir(path.join(DATA_DIR, 'campaigns'), { recursive: true });
    }
  }

  private async readJsonFile<T>(filePath: string): Promise<T | null> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private async writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const filePath = path.join(DATA_DIR, 'users', `${user.id}.json`);
    await this.writeJsonFile(filePath, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const usersDir = path.join(DATA_DIR, 'users');
      const files = await fs.readdir(usersDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const user = await this.readJsonFile<User>(path.join(usersDir, file));
          if (user && user.email === email) {
            return user;
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    const filePath = path.join(DATA_DIR, 'users', `${id}.json`);
    return this.readJsonFile<User>(filePath);
  }

  async createProject(projectData: Omit<Project, 'id' | 'created' | 'lastModified'>): Promise<Project> {
    const project: Project = {
      ...projectData,
      id: uuidv4(),
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const filePath = path.join(DATA_DIR, 'projects', `${project.id}.json`);
    await this.writeJsonFile(filePath, project);
    return project;
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    try {
      const projectsDir = path.join(DATA_DIR, 'projects');
      const files = await fs.readdir(projectsDir);
      const projects: Project[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const project = await this.readJsonFile<Project>(path.join(projectsDir, file));
          if (project && project.userId === userId) {
            projects.push(project);
          }
        }
      }

      return projects.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    } catch {
      return [];
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    const filePath = path.join(DATA_DIR, 'projects', `${id}.json`);
    return this.readJsonFile<Project>(filePath);
  }

  async updateProject(id: string, updateData: Partial<Project>): Promise<Project | null> {
    const project = await this.getProjectById(id);
    if (!project) return null;

    const updatedProject: Project = {
      ...project,
      ...updateData,
      lastModified: new Date().toISOString(),
    };

    const filePath = path.join(DATA_DIR, 'projects', `${id}.json`);
    await this.writeJsonFile(filePath, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const filePath = path.join(DATA_DIR, 'projects', `${id}.json`);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async createBlueprint(blueprintData: Omit<Blueprint, 'id' | 'created' | 'updated'>): Promise<Blueprint> {
    const blueprint: Blueprint = {
      ...blueprintData,
      id: uuidv4(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    const filePath = path.join(DATA_DIR, 'blueprints', `${blueprint.id}.json`);
    await this.writeJsonFile(filePath, blueprint);
    return blueprint;
  }

  async getBlueprintsByUserId(userId: string): Promise<Blueprint[]> {
    try {
      const blueprintsDir = path.join(DATA_DIR, 'blueprints');
      const files = await fs.readdir(blueprintsDir);
      const blueprints: Blueprint[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const blueprint = await this.readJsonFile<Blueprint>(path.join(blueprintsDir, file));
          if (blueprint && blueprint.userId === userId) {
            blueprints.push(blueprint);
          }
        }
      }

      return blueprints.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
    } catch {
      return [];
    }
  }

  async getBlueprintById(id: string): Promise<Blueprint | null> {
    const filePath = path.join(DATA_DIR, 'blueprints', `${id}.json`);
    return this.readJsonFile<Blueprint>(filePath);
  }

  async updateBlueprint(id: string, updateData: Partial<Blueprint>): Promise<Blueprint | null> {
    const blueprint = await this.getBlueprintById(id);
    if (!blueprint) return null;

    const updatedBlueprint: Blueprint = {
      ...blueprint,
      ...updateData,
      updated: new Date().toISOString(),
    };

    const filePath = path.join(DATA_DIR, 'blueprints', `${id}.json`);
    await this.writeJsonFile(filePath, updatedBlueprint);
    return updatedBlueprint;
  }

  async deleteBlueprint(id: string): Promise<boolean> {
    try {
      const filePath = path.join(DATA_DIR, 'blueprints', `${id}.json`);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async createCampaign(campaignData: Omit<Campaign, 'id' | 'created' | 'updated'>): Promise<Campaign> {
    const campaign: Campaign = {
      ...campaignData,
      id: uuidv4(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    const filePath = path.join(DATA_DIR, 'campaigns', `${campaign.id}.json`);
    await this.writeJsonFile(filePath, campaign);
    return campaign;
  }

  async getCampaignsByUserId(userId: string): Promise<Campaign[]> {
    try {
      const campaignsDir = path.join(DATA_DIR, 'campaigns');
      const files = await fs.readdir(campaignsDir);
      const campaigns: Campaign[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const campaign = await this.readJsonFile<Campaign>(path.join(campaignsDir, file));
          if (campaign && campaign.userId === userId) {
            campaigns.push(campaign);
          }
        }
      }

      return campaigns.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
    } catch {
      return [];
    }
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    const filePath = path.join(DATA_DIR, 'campaigns', `${id}.json`);
    return this.readJsonFile<Campaign>(filePath);
  }

  async updateCampaign(id: string, updateData: Partial<Campaign>): Promise<Campaign | null> {
    const campaign = await this.getCampaignById(id);
    if (!campaign) return null;

    const updatedCampaign: Campaign = {
      ...campaign,
      ...updateData,
      updated: new Date().toISOString(),
    };

    const filePath = path.join(DATA_DIR, 'campaigns', `${id}.json`);
    await this.writeJsonFile(filePath, updatedCampaign);
    return updatedCampaign;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    try {
      const filePath = path.join(DATA_DIR, 'campaigns', `${id}.json`);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();