import { Router } from "express";
import {
  createMascota,
  getMascotas,
  darBajaMascota,
} from "../controllers/mascotas.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireCliente } from "../middlewares/role.middleware";
import {
  createMascotaValidator,
  mascotaIdValidator,
} from "../validators/mascota.validator";

const router = Router();

router.use(verifyToken);

// Crear mascota - solo clientes
router.post("/", requireCliente, createMascotaValidator, createMascota);

// Listar mascotas - todos los roles (con filtros según rol)
router.get("/", getMascotas);

// Dar de baja mascota - clientes (sus propias), veterinarios y admin (cualquiera)
router.delete("/:id", mascotaIdValidator, darBajaMascota);

export default router;
