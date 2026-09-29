import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/globalErrorHandler.js";
import jwt from "jsonwebtoken";
import type { CustomJwtPayload } from "../types/interfaces.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      throw new AppError("Invalid or expired token", 404);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError("Internal Server Configuration Error", 500);
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayload;

    req.user = decoded;
    next();
  } catch (e) {
    next(e);
  }
};
