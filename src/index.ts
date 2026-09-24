//External modules
import express, {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
//Internal Modules
import mainRouter from "./routes/mainRouter.js";
import { AppError } from "./utils/globalErrorHandler.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import asyncHandler from "./utils/asyncHandler.js";

//basic config
dotenv.config();
const app = express();

//middlewares
const CLIENT_URL = process.env.CLIENT_URL;

if (!CLIENT_URL) {
  throw new AppError("Client URL is not provided", 404);
}
app.use(
  cors({
    origin: [CLIENT_URL],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Database connection
const DB_URI = process.env.DB_URI || "";
mongoose
  .connect(DB_URI)
  .then(() => console.log("Database Connected"))
  .catch((e) => {
    console.log(e);
  });

//Router start
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

//Auth/me route
app.get(
  "/api/auth/me",
  authMiddleware,
  asyncHandler((req: Request, res: Response) => {
    console.log("authenticated user");
    res.json({ success: true, user: req.user });
  }),
);

//Main app flow
app.use("/api", mainRouter);

//Global error handling express middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught by global handler:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

//Start app
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
