import { Router } from "express";
import { createHistorial } from "../controllers/historial.controller";
import { verifyToken, veterinarioMiddleware } from "../middlewares/auth.middleware";
import { createHistorialValidator } from "../validators/historial.validator";

const router = Router();

router.post("/", verifyToken, veterinarioMiddleware, createHistorialValidator, createHistorial);

export default router;
