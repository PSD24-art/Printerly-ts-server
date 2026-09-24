import type { NextFunction, Request, Response } from "express";
import { User } from "../../model/User.js";
import { AppError } from "../../utils/globalErrorHandler.js";
import bcrypt from "bcryptjs";
import createJwt from "../../utils/createJwt.js";
interface LoginBody {
  email?: string;
  password?: string;
}
export const loginHandler = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and Password is required", 400);
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(
      "No user found, check your credentials and try again",
      404,
    );
  }

  const isSame = bcrypt.compare(password, user.password);

  if (!isSame) {
    throw new AppError("Invalid Password", 400);
  }

  let tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const token = createJwt(tokenPayload);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    user: tokenPayload,
    success: true,
    message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} logged in successfully!`,
  });
};
