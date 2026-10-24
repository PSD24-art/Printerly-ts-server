import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { loginHandler, logoutHandler } from "../controller/auth/auth.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", asyncHandler(loginHandler));
router.post("/logout", authMiddleware, asyncHandler(logoutHandler));

export default router;
