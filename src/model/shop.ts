// models/shop.model.js

import { model, Schema, type ObjectId } from "mongoose";

const mongoose = require("mongoose");

// interface location
interface IShop {
  ownerId: ObjectId;
  shopId: ObjectId;
  address: string;
  location: {
    type: "Point";
    coordinates: number[];
  };
  locationUrl: string;
  openingHours: string;
  services: string[];
  pricing: {
    blackAndWhite: number;
    colorPrint: number;
    lamination: number;
    binding: number;
  };
  rating?: number;
  isActive: boolean;
  documents?: string[];
}

const shopSchema = new Schema<IShop>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopId: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    locationUrl: String,
    openingHours: {
      type: String,
    },

    services: [
      {
        type: String,
      },
    ],

    pricing: {
      blackAndWhite: Number,
      colorPrint: Number,
      lamination: Number,
      binding: Number,
    },

    rating: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    documents: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

shopSchema.index({ location: "2dsphere" });

const Shop = model<IShop>("Shop", shopSchema);
module.exports = Shop;
