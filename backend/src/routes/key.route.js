import { Router } from "express";
import { generateAdminKey } from "../controllers/adminkey.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/generate-key", protectRoute, generateAdminKey);

export default router;