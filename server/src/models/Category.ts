import { string } from "joi";
import mongoose, { Document, Schema } from "mongoose";

const FieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  fieldType: {
    type: String,
    enum: ["text", "number", "date", "boolean"],
    default: "text",
  },
});

const SettingSchema = new mongoose.Schema({
  focus: String,
  tone: String,
  quantity: String,
  contentLenght: Number
});

export interface ICategory extends Document {
  title: string;
  description: string;
  fields: {
    fieldName: string;
    fieldType: string;
  }[];
  settings: {
    focus: string;
    tone: string;
    quantity: string;
    contentLenght: number;
  }
  level: number;
  type: "blueprint" | "project";
  parentId?: mongoose.Schema.Types.ObjectId;
}

const CategorySchema: Schema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: ["blueprint", "project"],
      default: null,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    description: {
      type: String,
    },
    fields: [FieldSchema],
    level: { type: Number, required: true },
    settings: { type: SettingSchema }
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ title: 1, createdAt: -1 });
export const Category = mongoose.model<ICategory>("Category", CategorySchema);
