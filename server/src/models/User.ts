import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: "admin" | "user";
  totalWords: number;
  wordsUsed: number;
  wordsLeft: number;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    totalWords: {
      type: Number,
      default: 100000,
    },
    wordsUsed: {
      type: Number,
      default: 0,
    },
    wordsLeft: {
      type: Number,
      default: 100000,
    },
  },
  {
    timestamps: true,
  }
);

// UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
