import { Router } from "express";
import {
  createMascota,
  getMascotas,
  getHistorialMascota,
} from "../controllers/mascotas.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { createMascotaValidator } from "../validators/mascota.validator";

const router = Router();

router.post("/", verifyToken, createMascotaValidator, createMascota);
router.get("/", verifyToken, getMascotas);
router.get("/:id/historial", verifyToken, getHistorialMascota);

export default router;
