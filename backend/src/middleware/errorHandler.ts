import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    return res.status(400).json({ success: false, message });
  }

  // Our custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Prisma unique constraint violation (e.g. duplicate email)
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as any).code === "P2002"
  ) {
    return res.status(409).json({ success: false, message: "Record already exists" });
  }

  // Unknown errors
  console.error("Unhandled error:", err);
  return res.status(500).json({ success: false, message: "Internal server error" });
}
