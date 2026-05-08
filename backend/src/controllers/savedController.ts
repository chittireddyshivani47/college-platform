import { Request, Response, NextFunction } from "express";
import * as savedService from "../services/savedService";
import { AuthRequest } from "../middleware/auth";

export async function getSaved(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId!;
    const saved = await savedService.getSaved(userId);
    res.json({ success: true, saved });
  } catch (err) { next(err); }
}

export async function saveCollege(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId!;
    const { collegeId } = req.body;
    const result = await savedService.saveCollege(userId, collegeId);
    res.status(201).json({ success: true, saved: result });
  } catch (err) { next(err); }
}

export async function removeCollege(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId!;
    const result = await savedService.removeCollege(userId, req.params.collegeId);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}