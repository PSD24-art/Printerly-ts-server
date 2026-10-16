import type { Request, Response } from "express";
import { AppError } from "../../utils/globalErrorHandler.js";
import Shop from "../../model/Shop.js";
import Order from "../../model/Order.js";
import File from "../../model/File.js";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import s3 from "../../config/s3.js";

//get shop details

export const getShop = async (req: Request, res: Response) => {
  const id = req.user?.id;

  if (!id) {
    throw new AppError("Unable to get the shopkeeper Id", 400);
  }

  const shop = await Shop.findOne({ ownerId: id });

  if (!shop) {
    throw new AppError("No shop found", 404);
  }

  res.status(200).json({ message: "Shop details fetched successfully", success: true, shop: shop });
};

//get all orders
export const getOrders = async (req: Request, res: Response) => {
  const id = req.user?.id;

  if (!id) {
    throw new AppError("Unable to get the shopkeeper Id", 400);
  }

  const shop = await Shop.findOne({ ownerId: id });

  if (!shop) {
    throw new AppError("No shop found", 404);
  }

  const shopId = shop._id;

  const orders = await Order.find({ shop: shopId }).populate("customer", "name email").select("-files");
  if (orders.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No orders found for this shop.",
      orders: [],
    });
  }

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    orders,
  });
};

//get files by orderId
export const getFilesByOrderId = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new AppError("Order is required", 400);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("No order found", 404);
  }

  const files = await File.find({
    orderId: order._id,
  }).select("_id originalName fileType fileSize pages");

  return res.status(200).json({
    success: true,
    message: "Files fetched successfully",
    files,
  });
};

//Get file by File Id
export const getFileById = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  // 1. Validate fileId
  if (!fileId) {
    throw new AppError("File is required", 400);
  }

  // 2. Find file in MongoDB
  const file = await File.findById(fileId);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  const userId = req.user.id;
  const shop = await Shop.findOne({
    ownerId: userId,
  });

  if (!shop) {
    throw new AppError("Shop not found", 404);
  }

  const order = await Order.findOne({
    _id: file.orderId,
    shop: shop._id,
  });

  if (!order) {
    throw new AppError("You are not authorized to access this file", 403);
  }

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: file.storageKey,
  });

  const s3Response = await s3.send(command);

  if (!s3Response.Body) {
    throw new AppError("File could not be retrieved", 404);
  }

  // 6. Tell browser that this is a PDF
  res.setHeader("Content-Type", file.fileType || "application/pdf");

  // 7. Tell browser to display it instead of downloading it
  res.setHeader("Content-Disposition", `inline; filename="${file.originalName}"`);

  // 8. Set file size if S3 provides it
  if (s3Response.ContentLength) {
    res.setHeader("Content-Length", s3Response.ContentLength.toString());
  }

  // 9. Stream S3 response to browser
  const stream = s3Response.Body as NodeJS.ReadableStream;

  stream.pipe(res);
};
