import { Router } from "express";
import { getUsuarios } from "../controllers/admin.controller";
import { verifyToken, adminMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/usuarios", verifyToken, adminMiddleware, getUsuarios);

export default router;
