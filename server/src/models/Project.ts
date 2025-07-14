import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectSettings {
  focus: string;
  tone: string;
  quantity: string;
}

export interface IProject extends Document {
  name: string;
  type: 'project' | 'blueprint';
  status: 'Active' | 'Draft' | 'Archived';
  isStarred: boolean;
  userId: mongoose.Types.ObjectId;
  blueprintId?: mongoose.Types.ObjectId;
  settings?: IProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSettingsSchema: Schema = new Schema({
  focus: { type: String, default: '' },
  tone: { type: String, default: 'professional' },
  quantity: { type: String, default: 'medium' }
}, { _id: false });

const ProjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  type: {
    type: String,
    enum: ['project', 'blueprint'],
    default: 'project'
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Archived'],
    default: 'Draft'
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blueprintId: {
    type: Schema.Types.ObjectId,
    ref: 'Blueprint'
  },
  settings: {
    type: ProjectSettingsSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

ProjectSchema.index({ userId: 1, createdAt: -1 });
ProjectSchema.index({ userId: 1, type: 1 });
ProjectSchema.index({ userId: 1, status: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);