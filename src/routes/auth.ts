import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { loginHandler } from "../controller/auth/loginUser.js";
const router = express.Router();

router.post("/login", asyncHandler(loginHandler));

export default router;
