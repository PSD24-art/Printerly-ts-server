import type { Request, Response } from "express";
import { AppError } from "../../utils/globalErrorHandler.js";
import Shop from "../../model/shop.js";
import { countPages, type PageCountResult } from "../../utils/countPdfPages.js";
import calculatePrice, { type PrintConfig } from "../../utils/calculateTotalPrice.js";
import Order from "../../model/Order.js";
import mongoose, { Schema, Types, type ObjectId } from "mongoose";
import { uploadFileToS3 } from "../../services/s3.services.js";
import { File } from "../../model/File.js";

export const createOrder = async (req: Request, res: Response) => {
  const { shopId } = req.body;

  if (!shopId) {
    throw new AppError("Shop not available", 404);
  }
  const customerId = req?.user?.id;

  if (!customerId) {
    throw new AppError("User not available", 404);
  }

  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new AppError("No file uploads found", 404);
  }

  const allPdfs = files.every((file) => file.mimetype === "application/pdf");

  if (!allPdfs) {
    throw new AppError("All uploaded files must be PDFs", 400);
  }

  const shop = await Shop.findOne({
    _id: shopId,
    isActive: true,
  });

  if (!shop) {
    throw new AppError("No shop found", 404);
  }

  const pdfData: PageCountResult[] = await countPages(files);

  let totalPages: number = 0;
  pdfData.forEach((item) => {
    if (item.pages !== undefined) {
      totalPages += item.pages;
    } else {
      console.error(`Skipping file ${item.fileName} due to error: ${item.error}`);
    }
  });

  const printSettings = JSON.parse(req.body.printSettings);

  const printConfig: PrintConfig = {
    copies: printSettings.copies,
    colorMode: printSettings.colorMode,
    pageSize: printSettings.pageSize,
    printSide: printSettings.printSide,
    lamination: printSettings.lamination,
    binding: printSettings.binding,
  };

  const totalPrice = calculatePrice(totalPages, printConfig, shop?.pricing);

  const orderId = new mongoose.Types.ObjectId();

  //Upload to s3
  const uploadedFiles = [];

  for (const file of files) {
    const pdfInfo = pdfData.find((item) => item.fileName === file.originalname);

    if (!pdfInfo?.pages) {
      throw new AppError(`Could not determine pages for ${file.originalname}`, 400);
    }

    const key = `orders/${orderId}/${crypto.randomUUID()}.pdf`;

    await uploadFileToS3(file, key);

    uploadedFiles.push({
      originalName: file.originalname,
      orderId,
      uploadedBy: customerId,
      storageKey: key,
      fileType: file.mimetype,
      fileSize: file.size,
      pages: pdfInfo.pages,
    });
  }

  const createdFiles = await File.insertMany(uploadedFiles);

  if (createdFiles.length === 0) {
    throw new AppError("File save failed", 500);
  }

  const fileIds = createdFiles.map((file) => file._id);

  const order = await Order.create({
    _id: orderId,

    customer: customerId,

    shopId,

    files: fileIds,

    status: "Pending",

    printSettings: {
      totalPages,

      copies: printConfig.copies,

      colorMode: printConfig.colorMode,

      pageSize: printConfig.pageSize,

      printSide: printConfig.printSide,

      binding: printConfig.binding,

      lamination: printConfig.lamination,
    },

    totalPrice,

    paymentStatus: "pending",

    deliveryType: "pickup",
  });

  if (!order) {
    throw new AppError("Unable create order", 500);
  }

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
};

export default createOrder;
