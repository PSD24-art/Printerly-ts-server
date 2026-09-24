import type { NextFunction, Request, Response } from "express";
import { User } from "../../model/User.js";
import { AppError } from "../../utils/globalErrorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { dot } from "node:test/reporters";
import createJwt from "../../utils/createJwt.js";

dotenv.config();
interface RegisterInterface {
  name?: string;
  email?: string;
  mobile?: number;
  password?: string;
}

const createRegisterHandler = (role: "customer" | "shopkeeper" | "admin") => {
  return async (req: Request<{}, {}, RegisterInterface>, res: Response) => {
    const { name, email, password, mobile } = req.body;

    if (!name || !password || !mobile || !email) {
      throw new AppError(
        "All fields (name, email, mobile, password) are mandatory",
        400,
      );
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
      role,
    });

    if (!user) {
      throw new AppError("Unable to register", 500);
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = createJwt(tokenPayload);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`,
    });
  };
};

export const registerCustomer = createRegisterHandler("customer");
export const registerShopkeeper = createRegisterHandler("shopkeeper");
export const registerAdmin = createRegisterHandler("admin");
