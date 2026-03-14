import { Router } from "express";
import { developerLogin, developerSignup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", developerLogin);
router.post("/signup", developerSignup);

export default router;