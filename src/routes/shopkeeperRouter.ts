import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { getFileById, getFilesByOrderId, getOrders, getShop } from "../controller/shopkeeper/shopkeeperDashboard.js";
import { updateOrderStatus } from "../controller/shopkeeper/updateOrderStatus.js";

const router = express.Router();

//get shop
router.get("/shop", asyncHandler(getShop));

//get all orders
router.get("/orders", asyncHandler(getOrders));

//patch status updates for order
router.patch("/orders/:orderId", asyncHandler(updateOrderStatus));

//get files by orderId
router.get("/orders/:orderId/files", asyncHandler(getFilesByOrderId));

//get file by file id
router.get("/files/:fileId", asyncHandler(getFileById));

export default router;
