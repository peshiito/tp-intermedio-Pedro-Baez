import { Router } from "express";
import {
  crearHistorial,
  obtenerHistorialesMascota,
} from "../controllers/historiales.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireVeterinario } from "../middlewares/role.middleware";
import {
  crearHistorialValidator,
  mascotaIdValidator,
} from "../validators/historial.validator";

const router = Router();

// Crear historial - solo veterinarios
router.post(
  "/",
  verifyToken,
  requireVeterinario,
  crearHistorialValidator,
  crearHistorial,
);

// Ver historiales de una mascota - cualquier usuario autenticado (con permisos)
router.get(
  "/mascota/:mascotaId",
  verifyToken,
  mascotaIdValidator,
  obtenerHistorialesMascota,
);

export default router;
