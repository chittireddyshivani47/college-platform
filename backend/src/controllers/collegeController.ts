import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as collegeService from "../services/collegeService";
import { AppError } from "../middleware/errorHandler";

const querySchema = z.object({
  search: z.string().optional(),
  state: z.string().optional(),
  minFees: z.coerce.number().optional(),
  maxFees: z.coerce.number().optional(),
  sortBy: z.enum(["rating", "fees_asc", "fees_desc", "name"]).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
});

export async function getAllColleges(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = querySchema.parse(req.query);
    const result = await collegeService.getColleges(filters);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

export async function getCollegeById(req: Request, res: Response, next: NextFunction) {
  try {
    const college = await collegeService.getCollegeById(req.params.id);
    if (!college) return next(new AppError("College not found", 404));
    res.json({ success: true, college });
  } catch (err) { next(err); }
}

export async function getStates(req: Request, res: Response, next: NextFunction) {
  try {
    const states = await collegeService.getStates();
    res.json({ success: true, states });
  } catch (err) { next(err); }
}
