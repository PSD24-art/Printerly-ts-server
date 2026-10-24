import express from "express";
import authRouter from "./auth.js";
import registerRouter from "./RegisterRouter.js";
import customerRouter from "./customerRouter.js";
import shopkeeperRouter from "./shopkeeperRouter.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

//Auth
router.use("/auth", authRouter);

//Register
router.use("/register", registerRouter);

//Customer
router.use("/customer", authMiddleware, authorizeRoles("customer"), customerRouter);

//shopkeeper
router.use("/shopkeeper", authMiddleware, authorizeRoles("shopkeeper"), shopkeeperRouter);

export default router;
