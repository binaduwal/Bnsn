import mongoose, { Document } from "mongoose";

interface ICategoryValue extends Document {
  category: mongoose.Schema.Types.ObjectId;
  blueprint: mongoose.Schema.Types.ObjectId;
  project: mongoose.Schema.Types.ObjectId;
  isAiGeneratedContent: string;
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

  isAiGeneratedContent: {
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
});

export const CategoryValue = mongoose.model<ICategoryValue>(
  "CategoryValue",
  CategoryValueSchema
);
