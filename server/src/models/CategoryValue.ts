import mongoose, { Document } from "mongoose";

interface ICategoryValue extends Document {
  category: mongoose.Schema.Types.ObjectId;
  blueprint: mongoose.Schema.Types.ObjectId;
  project: mongoose.Schema.Types.ObjectId;
  isAiGeneratedContent: string;
  userId: mongoose.Schema.Types.ObjectId; // Reference to the user who created this value
  homepageReference?: string; // Store homepage content for styling reference
  value: {
    key: string;
    value: string[];
  }[];
}

const CategoryValueSchema = new mongoose.Schema<ICategoryValue>({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  blueprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blueprint",
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  isAiGeneratedContent: {
    type: String,
    default: "",
  },

  homepageReference: {
    type: String,
    default: "",
  },

  value: [
    {
      key: {
        type: String,
        required: true,
      },
      value: {
        type: [String],
        required: true,
      },
    },
  ],
}, {
  timestamps: true
});


CategoryValueSchema.index({ project: 1, category: 1 })

export const CategoryValue = mongoose.model<ICategoryValue>(
  "CategoryValue",
  CategoryValueSchema
);
