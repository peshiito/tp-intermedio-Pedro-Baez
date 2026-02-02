import { Router } from "express";
import { createMascota } from "../controllers/mascotas.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createMascota);

export default router;
