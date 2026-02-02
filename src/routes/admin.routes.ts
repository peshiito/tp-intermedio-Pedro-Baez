import { Router } from "express";
import { getUsuarios } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

router.get("/usuarios", authMiddleware, adminMiddleware, getUsuarios);

export default router;
