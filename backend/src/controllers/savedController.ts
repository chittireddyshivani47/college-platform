import { Response, NextFunction } from "express";
import * as savedService from "../services/savedService";
import { AuthRequest } from "../middleware/auth";

export async function getSaved(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const saved = await savedService.getSaved(req.userId!);
    res.json({ success: true, saved });
  } catch (err) { next(err); }
}

export async function saveCollege(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { collegeId } = req.body;
    const result = await savedService.saveCollege(req.userId!, collegeId);
    res.status(201).json({ success: true, saved: result });
  } catch (err) { next(err); }
}

export async function removeCollege(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await savedService.removeCollege(req.userId!, req.params.collegeId);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}
