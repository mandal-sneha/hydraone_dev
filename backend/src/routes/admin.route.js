import { Router } from "express";
import { getAllAdminKeys } from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/get-all-admins", protectRoute, getAllAdminKeys);

export default router;