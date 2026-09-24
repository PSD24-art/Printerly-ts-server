import type { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any> | any;

export default function asyncHandler(fn: AsyncController) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
