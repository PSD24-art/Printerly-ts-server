import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  registerAdmin,
  registerCustomer,
  registerShopkeeper,
} from "../controller/user/registerUser.js";

const router = express.Router();

//register users
router.post("/register/customer", asyncHandler(registerCustomer));
router.post("/register/shopkeeper", asyncHandler(registerShopkeeper));
router.post("/register/admin", asyncHandler(registerAdmin));

export default router;
