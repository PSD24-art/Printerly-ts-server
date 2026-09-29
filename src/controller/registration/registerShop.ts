import type { Request, Response } from "express";
import { AppError } from "../../utils/globalErrorHandler.js";
import { User } from "../../model/User.js";
import bcrypt from "bcryptjs";
import createJwt from "../../utils/createJwt.js";
import Shop from "../../model/shop.js";

interface RegisterInterface {
  name?: string;
  email?: string;
  mobile?: number;
  password?: string;
  shopName?: string;
  address?: string;
  location?: {
    type: "Point";
    coordinates: number[];
  };
  locationUrl?: string;
  openingHours?: string;
  services?: string[];
  pricing?: {
    blackAndWhite: number;
    colorPrint: number;
    lamination: number;
    binding: number;
  };
  rating?: number;
  documents?: string[];
}
export const registerShop = async (req: Request<{}, {}, RegisterInterface>, res: Response) => {
  const { name, email, password, address, mobile, shopName, location, locationUrl, openingHours, services, pricing } =
    req.body;

  if (
    !name ||
    !password ||
    !mobile ||
    !email ||
    !shopName ||
    !address ||
    !location ||
    !openingHours ||
    !services ||
    !locationUrl ||
    !pricing
  ) {
    throw new AppError("All fields are mandatory", 400);
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError("User already exists!", 409);
  }

  const hashedPass = await bcrypt.hash(password, 10);

  let user = await User.create({
    name,
    email,
    password: hashedPass,
    mobile,
    role: "shopkeeper",
  });

  if (!user) {
    throw new AppError("Unable to register", 500);
  }

  let shop = await Shop.findOne({ ownerId: user._id });

  if (shop) {
    throw new AppError("Shop Already Exists", 409);
  }
  shop = await Shop.create({
    shopName,
    ownerId: user._id,
    location,
    locationUrl,
    address,
    openingHours,
    services,
    pricing,
  });

  if (!shop) {
    throw new AppError("Unable to register shop", 500);
  }

  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const token = createJwt(tokenPayload);
  console.log("Shopkeeper and Shop registered successfully!");
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: `Shopkeeper and Shop registered successfully!`,
  });
};
