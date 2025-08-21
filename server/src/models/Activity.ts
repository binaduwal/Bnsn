import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'project_created' | 'project_updated' | 'project_starred' | 'project_deleted' | 
        'blueprint_created' | 'blueprint_updated' | 'blueprint_starred' | 'blueprint_deleted' |
        'project_generated' | 'blueprint_cloned';
  title: string;
  description: string;
  metadata?: {
    projectId?: mongoose.Types.ObjectId;
    blueprintId?: mongoose.Types.ObjectId;
    oldStatus?: string;
    newStatus?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'project_created', 'project_updated', 'project_starred', 'project_deleted',
      'blueprint_created', 'blueprint_updated', 'blueprint_starred', 'blueprint_deleted',
      'project_generated', 'blueprint_cloned'
    ]
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and recent activities
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ type: 1, createdAt: -1 });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema); 