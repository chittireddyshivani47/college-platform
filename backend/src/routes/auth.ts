import { Router } from "express";
import { register, login, me } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, (req, res, next) => me(req as any, res, next));

export default router;
