import { Router } from "express";
import { getUsuarios } from "../controllers/admin.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

router.get("/usuarios", verifyToken, adminMiddleware, getUsuarios);

export default router;
