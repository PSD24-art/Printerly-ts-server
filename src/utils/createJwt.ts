import { configDotenv } from "dotenv";
import type { ObjectId, Types } from "mongoose";
import { AppError } from "./globalErrorHandler.js";
import jwt from "jsonwebtoken";
import type { Schema } from "node:inspector/promises";

type role = "customer" | "shopkeeper" | "admin";

interface TokenPayload {
  id: Types.ObjectId;
  email: string;
  role: role;
}
configDotenv();

export default function createJwt(tokenPayload: TokenPayload) {
  let jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error(
      "CRITICAL CONFIG ERROR: JWT_SECRET environment variable is missing.",
    );
    throw new AppError("Internal server configuration error", 500);
  }

  const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: "7d" });
  if (!token) {
    console.log("Unable to sign token");
    throw new AppError("Unable to sign token", 500);
  }
  console.log("Generated jwt: ", token);

  return token;
}
