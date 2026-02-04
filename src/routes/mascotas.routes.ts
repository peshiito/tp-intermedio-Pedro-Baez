import { Router } from "express";
import {
  createMascota,
  deleteMascota,
  getMascotas,
  getHistorialMascota,
  updateMascota,
} from "../controllers/mascotas.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  createMascotaValidator,
  updateMascotaValidator,
} from "../validators/mascota.validator";

const router = Router();

router.post("/", verifyToken, createMascotaValidator, createMascota);
router.get("/", verifyToken, getMascotas);
router.patch("/:id", verifyToken, updateMascotaValidator, updateMascota);
router.delete("/:id", verifyToken, deleteMascota);
router.get("/:id/historial", verifyToken, getHistorialMascota);

export default router;
