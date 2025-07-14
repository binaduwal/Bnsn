import mongoose, { Document, Schema } from 'mongoose';

export interface IBlueprintFormData {
  projectTitle: string;
  firstName: string;
  lastName: string;
  position: string;
  bioPosition: string;
  backstory: string;
  timeActive: string;
  credentials: string[];
  beforeStates: string[];
  afterStates: string[];
  offers: string[];
  pages: string[];
  miscellaneous: string[];
  training: string[];
  bookBuilder: string[];
  custom: string[];
  buyers: string[];
  company: string[];
}

export interface IBlueprint extends Document {
  name: string;
  feedBnsn: string;
  offerType: string;
  formData: IBlueprintFormData;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BlueprintFormDataSchema: Schema = new Schema({
  projectTitle: { type: String, default: '' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  position: { type: String, default: '' },
  bioPosition: { type: String, default: '' },
  backstory: { type: String, default: '' },
  timeActive: { type: String, default: '' },
  credentials: [{ type: String }],
  beforeStates: [{ type: String }],
  afterStates: [{ type: String }],
  offers: [{ type: String }],
  pages: [{ type: String }],
  miscellaneous: [{ type: String }],
  training: [{ type: String }],
  bookBuilder: [{ type: String }],
  custom: [{ type: String }],
  buyers: [{ type: String }],
  company: [{ type: String }]
}, { _id: false });

const BlueprintSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  feedBnsn: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 5000
  },
  offerType: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  formData: {
    type: BlueprintFormDataSchema,
    default: () => ({
      projectTitle: '',
      firstName: '',
      lastName: '',
      position: '',
      bioPosition: '',
      backstory: '',
      timeActive: '',
      credentials: [],
      beforeStates: [],
      afterStates: [],
      offers: [],
      pages: [],
      miscellaneous: [],
      training: [],
      bookBuilder: [],
      custom: [],
      buyers: [],
      company: []
    })
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

BlueprintSchema.index({ userId: 1, createdAt: -1 });
BlueprintSchema.index({ userId: 1, name: 1 });

export const Blueprint = mongoose.model<IBlueprint>('Blueprint', BlueprintSchema);