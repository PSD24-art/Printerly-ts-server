import type { CustomJwtPayload } from "../middleware/authMiddleware.ts";

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}
