import type { JwtPayload } from "jsonwebtoken";

export type role = "admin" | "customer" | "shopkeeper";
export interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: role;
}
