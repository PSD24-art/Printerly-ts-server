import mongoose, { model, Types } from "mongoose";
import { Schema, type ObjectId } from "mongoose";

type colorMode = "black_white" | "color";
type pageSize = "A4" | "A3" | "Letter";
type printSide = "single" | "double";
type paymentStatus = "pending" | "paid" | "failed" | "refunded";
type deliveryType = "pickup" | "delivery";
type status = "Pending" | "Accepted" | "Printing" | "Completed" | "Rejected" | "Cancelled";

interface PrintSettings {
  totalPages: number;
  copies: number;
  colorMode: colorMode;

  pageSize: pageSize;

  printSide: printSide;

  binding: boolean;

  lamination: boolean;
}

interface IOrder {
  customer: Types.ObjectId;
  shop: Types.ObjectId;
  files: Types.ObjectId[];
  placedAt: Date;
  status: status;
  printSettings: PrintSettings;
  totalPrice: number;
  paymentStatus: paymentStatus;
  deliveryType: deliveryType;
  notes?: string;
  otp?: number;
}

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    files: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Rejected", "Cancelled"],
      default: "Pending",
    },

    printSettings: {
      totalPages: {
        type: Number,
        required: true,
      },
      copies: {
        type: Number,
        default: 1,
      },

      colorMode: {
        type: String,
        enum: ["black_white", "color"],
        default: "black_white",
      },

      pageSize: {
        type: String,
        enum: ["A4", "A3", "Letter"],
        default: "A4",
      },

      printSide: {
        type: String,
        enum: ["single", "double"],
        default: "double",
      },

      binding: {
        type: Boolean,
        default: false,
      },

      lamination: {
        type: Boolean,
        default: false,
      },
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    deliveryType: {
      type: String,
      enum: ["pickup", "delivery"],
      default: "pickup",
    },

    notes: {
      type: String,
    },

    otp: Number,
  },
  {
    timestamps: true,
  },
);

orderSchema.index({ shop: 1, customer: 1 });

const Order = model<IOrder>("Order", orderSchema);
export default Order;
