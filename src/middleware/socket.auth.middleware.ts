import { parseCookie } from "cookie";
import type { CustomJwtPayload } from "../types/interfaces.js";
import jwt from "jsonwebtoken";
import type { ExtendedError, Socket } from "socket.io";
import type { NextFunction } from "express";
import Shop from "../model/Shop.js";

export const socketAuthMiddleware = async (socket: Socket, next: (err?: ExtendedError) => void) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Authentication required"));
    }

    const cookies = parseCookie(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return next(new Error("Server configuration error"));
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayload;

    if (decoded.role !== "shopkeeper") {
      return next(new Error("Shopkeeper access required"));
    }

    socket.data.userId = decoded.id;
    const shop = await Shop.findOne({
      ownerId: decoded.id,
    });

    if (!shop) {
      return next(new Error("No shop found for this account"));
    }

    socket.data.shopId = shop._id.toString();

    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
};
