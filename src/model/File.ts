import { model } from "mongoose";
import { Schema, type ObjectId } from "mongoose";

interface IFile {
  originalName: string;
  orderId: ObjectId;
  uploadedBy: ObjectId;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  pages: number;
}

const fileSchema = new Schema<IFile>(
  {
    originalName: {
      type: String,
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
    },

    fileSize: {
      type: Number,
    },
    pages: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

export const File = model<IFile>("File", fileSchema);
