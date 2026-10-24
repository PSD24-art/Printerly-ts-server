import type { Request, Response } from "express";
import { AppError } from "../../utils/globalErrorHandler.js";
import Order from "../../model/Order.js";
import generateSecureOTP from "../../utils/getOtp.js";

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const { orderId } = req.params;
  if (!orderId) {
    throw new AppError("Order Id is required", 400);
  }
  if (!status) {
    throw new AppError("Status is required", 400);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("No order found with this orderid", 404);
  }

  order.status = status;

  if (order.status === "Completed") {
    let otp: number = generateSecureOTP();
    order.otp = otp;
  }

  await order.save();
  res.status(200).json({ success: true, message: "Order status updated successfully", data: order });
};
