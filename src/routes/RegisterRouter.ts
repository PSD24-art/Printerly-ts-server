import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { registerAdmin, registerCustomer } from "../controller/registration/registerCustomer.js";
import { registerShop } from "../controller/registration/registerShop.js";

const router = express.Router();

//register users
router.post("/customer", asyncHandler(registerCustomer));
router.post("/admin", asyncHandler(registerAdmin));

router.post("/shop", asyncHandler(registerShop));
export default router;
