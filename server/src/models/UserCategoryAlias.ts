import mongoose, { Document, Schema } from "mongoose";

export interface IUserCategoryAlias extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  projectId: mongoose.Schema.Types.ObjectId;
  categoryId: mongoose.Schema.Types.ObjectId;
  customAlias: string;
}

const UserCategoryAliasSchema: Schema = new Schema<IUserCategoryAlias>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    customAlias: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique user-project-category combinations
UserCategoryAliasSchema.index({ userId: 1, projectId: 1, categoryId: 1 }, { unique: true });

export const UserCategoryAlias = mongoose.model<IUserCategoryAlias>("UserCategoryAlias", UserCategoryAliasSchema); 