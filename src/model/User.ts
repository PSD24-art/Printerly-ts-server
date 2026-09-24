import mongoose, { model, Schema } from "mongoose";
type role = "customer" | "shopkeeper" | "admin";

interface IUser {
  name: string;
  email: string;
  mobile: number;
  password: string;
  role: role;
  isVerified?: boolean;
  createdAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  mobile: {
    type: Number,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["customer", "shopkeeper", "admin"],
    required: true,
    default: "customer",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const User = model<IUser>("User", userSchema);
