import { Router } from "express";
import { getSaved, saveCollege, removeCollege } from "../controllers/savedController";
import { authenticate } from "../middleware/auth";

const router = Router();

// All saved routes require authentication
router.use(authenticate);

router.get("/", (req, res, next) => getSaved(req as any, res, next));
router.post("/", (req, res, next) => saveCollege(req as any, res, next));
router.delete("/:collegeId", (req, res, next) => removeCollege(req as any, res, next));

export default router;
