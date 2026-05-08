import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("No token provided. Please log in.", 401));
  }

  const token = authHeader.split(" ")[1];

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new AppError("Server configuration error: JWT_SECRET not set", 500));
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    next(new AppError("Invalid or expired token. Please log in again.", 401));
  }
}
