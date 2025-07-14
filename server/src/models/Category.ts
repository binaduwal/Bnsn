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
export interface ICategory extends Document {
  title: string;
  description: string;
  fields: {
    fieldName: string;
    fieldType: string;
  }[];
}

const CategorySchema: Schema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
    },
    fields: [FieldSchema],
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ title: 1, createdAt: -1 });
export const Category = mongoose.model<ICategory>("Category", CategorySchema);
