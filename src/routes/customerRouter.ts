import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { getOneShop, getShopsNearby } from "../controller/customer/getShops.js";
import upload from "../middleware/multer.js";
import createOrder from "../controller/customer/createOrder.js";
import { getOrdersById } from "../controller/customer/getAllOrders.js";

const router = express.Router();

//get all shops
router.get("/shoplist", asyncHandler(getShopsNearby));

//get one shop
router.get("/shop/:id", asyncHandler(getOneShop));

//get all orders
router.get("/orders/:customerId", asyncHandler(getOrdersById));

//place order
router.post("/order", upload.array("documents", 10), asyncHandler(createOrder));

export default router;
