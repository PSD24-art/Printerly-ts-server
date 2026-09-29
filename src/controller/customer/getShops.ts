import type { Request, Response } from "express";
import Shop from "../../model/shop.js";
import { AppError } from "../../utils/globalErrorHandler.js";

export const getShopsNearby = async (req: Request, res: Response) => {
  const latitude = req.query.latitude as string;
  const longitude = req.query.longitude as string;

  if (!longitude || !latitude) {
    throw new AppError("No location recieved", 404);
  }
  const geoQuery: any = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)],
  };

  const shops = await Shop.find({
    location: {
      $near: {
        $geometry: geoQuery,
        $maxDistance: 10000,
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: shops.length > 0 ? "Shops fetched successfully" : "No shops found nearby",
    count: shops.length,
    shops,
  });
};

export const getOneShop = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Shop Id is required", 404);
  }

  const shop = await Shop.findById(id);
  if (!shop) throw new AppError("No shoup found witht his id", 409);
  res.status(200).json({ message: "Shop data fetched", success: true, shop });
};
