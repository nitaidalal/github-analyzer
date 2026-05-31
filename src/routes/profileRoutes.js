import { Router } from "express";
import {
  analyzeProfile,
  getProfileByUsername,
  getAllProfiles,
} from "../controllers/profileController.js";

const router = Router();

router.post("/analyze", analyzeProfile); // Fetch from GitHub + save
router.get("/", getAllProfiles); 
router.get("/:username", getProfileByUsername); 

export default router;