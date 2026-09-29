// models/shop.model.js

import { model, Schema, Types, type ObjectId } from "mongoose";
import mongoose from "mongoose";

// interface location
interface IShop {
  shopName: string;
  ownerId: Types.ObjectId;
  address: string;
  location: {
    type: "Point";
    coordinates: number[];
  };
  openingHours: string;
  locationUrl: string;
  pricing: {
    blackAndWhite: number;
    colorPrint: number;
    lamination: number;
    binding: number;
  };
  services?: string[];
  rating?: number;
  isActive: boolean;
  documents?: string[];
}

const shopSchema = new Schema<IShop>(
  {
    shopName: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
        type: [Number, Number],
        required: true,
      },
    },
    locationUrl: { type: String, required: true },

    openingHours: {
      type: String,
    },

    services: [
      {
        type: String,
        default: "Printing",
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
export default Shop;
