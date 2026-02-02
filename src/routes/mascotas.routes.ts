import { Router } from "express";
import { createMascota } from "../controllers/mascotas.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", verifyToken, createMascota);

export default router;
