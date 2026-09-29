import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/globalErrorHandler.js";
import type { role } from "../types/interfaces.js";

type RolesArray = role[];

export const authorizeRoles = (...roles: RolesArray) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req?.user?.role;

      if (!userRole) {
        return next(new AppError("No role is defined", 400));
      }

      if (!roles.includes(userRole)) {
        return next(new AppError("Unauthorized access", 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
