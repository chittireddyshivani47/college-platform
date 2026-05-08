import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as compareService from "../services/compareService";

const compareSchema = z.object({
  ids: z.array(z.string()).min(2).max(3),
});

export async function compare(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids } = compareSchema.parse(req.body);
    const colleges = await compareService.compareColleges(ids);
    res.json({ success: true, colleges });
  } catch (err) { next(err); }
}
