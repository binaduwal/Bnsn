import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaignStatistics {
  wordsUsed: number;
  emailsSent?: number;
  openRate?: number;
}

export interface ICampaign extends Document {
  name: string;
  projectId: mongoose.Types.ObjectId;
  content: string;
  status: 'Draft' | 'Sent' | 'Scheduled';
  userId: mongoose.Types.ObjectId;
  statistics?: ICampaignStatistics;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignStatisticsSchema: Schema = new Schema({
  wordsUsed: { type: Number, default: 0 },
  emailsSent: { type: Number, default: 0 },
  openRate: { type: Number, default: 0 }
}, { _id: false });

const CampaignSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Scheduled'],
    default: 'Draft'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statistics: {
    type: CampaignStatisticsSchema,
    default: () => ({ wordsUsed: 0, emailsSent: 0, openRate: 0 })
  }
}, {
  timestamps: true
});

CampaignSchema.index({ userId: 1, createdAt: -1 });
CampaignSchema.index({ projectId: 1 });
CampaignSchema.index({ userId: 1, status: 1 });

export const Campaign = mongoose.model<ICampaign>('Campaign', CampaignSchema);