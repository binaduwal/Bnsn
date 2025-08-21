import { Activity, IActivity } from '../models/Activity';
import mongoose from 'mongoose';

export interface ActivityData {
  userId: string;
  type: IActivity['type'];
  title: string;
  description: string;
  metadata?: {
    projectId?: string;
    blueprintId?: string;
    oldStatus?: string;
    newStatus?: string;
    [key: string]: any;
  };
}

export class ActivityService {
  /**
   * Log a new activity
   */
  static async logActivity(data: ActivityData): Promise<IActivity> {
    const activity = new Activity({
      userId: new mongoose.Types.ObjectId(data.userId),
      type: data.type,
      title: data.title,
      description: data.description,
      metadata: data.metadata || {}
    });

    return await activity.save();
  }

  /**
   * Get recent activities for a user
   */
  static async getUserActivities(userId: string, limit: number = 10): Promise<IActivity[]> {
    return await Activity.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Log project creation
   */
  static async logProjectCreated(userId: string, projectName: string, projectId: string): Promise<IActivity> {
    return await this.logActivity({
      userId,
      type: 'project_created',
      title: `Created new project "${projectName}"`,
      description: `You created a new project called "${projectName}"`,
      metadata: { projectId }
    });
  }

  /**
   * Log project update
   */
  static async logProjectUpdated(userId: string, projectName: string, projectId: string, oldStatus?: string, newStatus?: string): Promise<IActivity> {
    const statusChange = oldStatus && newStatus && oldStatus !== newStatus 
      ? ` (${oldStatus} → ${newStatus})`
      : '';
    
    return await this.logActivity({
      userId,
      type: 'project_updated',
      title: `Updated project "${projectName}"${statusChange}`,
      description: `You updated the project "${projectName}"`,
      metadata: { projectId, oldStatus, newStatus }
    });
  }

  /**
   * Log project starring
   */
  static async logProjectStarred(userId: string, projectName: string, projectId: string, isStarred: boolean): Promise<IActivity> {
    const action = isStarred ? 'starred' : 'unstarred';
    return await this.logActivity({
      userId,
      type: 'project_starred',
      title: `${isStarred ? 'Starred' : 'Unstarred'} project "${projectName}"`,
      description: `You ${action} the project "${projectName}"`,
      metadata: { projectId }
    });
  }

  /**
   * Log project deletion
   */
  static async logProjectDeleted(userId: string, projectName: string, projectId: string): Promise<IActivity> {
    return await this.logActivity({
      userId,
      type: 'project_deleted',
      title: `Deleted project "${projectName}"`,
      description: `You deleted the project "${projectName}"`,
      metadata: { projectId }
    });
  }

  /**
   * Log blueprint creation
   */
  static async logBlueprintCreated(userId: string, blueprintTitle: string, blueprintId: string): Promise<IActivity> {
    return await this.logActivity({
      userId,
      type: 'blueprint_created',
      title: `Created new blueprint "${blueprintTitle}"`,
      description: `You created a new blueprint template called "${blueprintTitle}"`,
      metadata: { blueprintId }
    });
  }

  /**
   * Log blueprint update
   */
  static async logBlueprintUpdated(userId: string, blueprintTitle: string, blueprintId: string): Promise<IActivity> {
    return await this.logActivity({
      userId,
      type: 'blueprint_updated',
      title: `Updated blueprint "${blueprintTitle}"`,
      description: `You updated the blueprint template "${blueprintTitle}"`,
      metadata: { blueprintId }
    });
  }

  /**
   * Log blueprint starring
   */
  static async logBlueprintStarred(userId: string, blueprintTitle: string, blueprintId: string, isStarred: boolean): Promise<IActivity> {
    const action = isStarred ? 'starred' : 'unstarred';
    return await this.logActivity({
      userId,
      type: 'blueprint_starred',
      title: `${isStarred ? 'Starred' : 'Unstarred'} blueprint "${blueprintTitle}"`,
      description: `You ${action} the blueprint template "${blueprintTitle}"`,
      metadata: { blueprintId }
    });
  }

  /**
   * Log blueprint deletion
   */
  static async logBlueprintDeleted(userId: string, blueprintTitle: string, blueprintId: string): Promise<IActivity> {
    return await this.logActivity({
      userId,
      type: 'blueprint_deleted',
      title: `Deleted blueprint "${blueprintTitle}"`,
      description: `You deleted the blueprint template "${blueprintTitle}"`,
      metadata: { blueprintId }
    });
  }

  /**
   * Log project generation
   */
  static async logProjectGenerated(userId: string, projectName: string, projectId: string): Promise<IActivity> {
    return await this.logActivity({
      userId,
      type: 'project_generated',
      title: `Generated project "${projectName}"`,
      description: `AI generated content for the project "${projectName}"`,
      metadata: { projectId }
    });
  }

  /**
   * Log blueprint cloning
   */
  static async logBlueprintCloned(userId: string, blueprintTitle: string, blueprintId: string): Promise<IActivity> {
    return await this.logActivity({
      userId,
      type: 'blueprint_cloned',
      title: `Cloned blueprint "${blueprintTitle}"`,
      description: `You cloned the blueprint template "${blueprintTitle}"`,
      metadata: { blueprintId }
    });
  }
} 