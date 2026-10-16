import type { Request, Response } from "express";
import { AppError } from "../../utils/globalErrorHandler.js";
import Order from "../../model/Order.js";

export const getOrdersById = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  if (!customerId) {
    throw new AppError("Customer Id is required", 400);
  }

  const orders = await Order.find({ customer: customerId }).populate("shop", "shopName locationUrl  ");

  res.status(200).json({ message: "Order fetched successfully", orders: orders, success: true });
};
