import mongoose, { Document } from "mongoose";

interface IBlueprint extends Document {
  title: string;
  description: string;
  offerType: string;
  categories: mongoose.Schema.Types.ObjectId[];
  userId: mongoose.Schema.Types.ObjectId;

}

const BlueprintSchema = new mongoose.Schema<IBlueprint>({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },
  offerType: {
    type: String,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export const Blueprint = mongoose.model<IBlueprint>(
  "Blueprint",
  BlueprintSchema
);
