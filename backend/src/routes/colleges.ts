import { Router } from "express";
import { getAllColleges, getCollegeById, getStates } from "../controllers/collegeController";

const router = Router();

// IMPORTANT: /states must come BEFORE /:id or Express will treat "states" as an id
router.get("/states", getStates);
router.get("/", getAllColleges);
router.get("/:id", getCollegeById);

export default router;
