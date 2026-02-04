import { Router } from "express";
import { crearUsuario, listarUsuarios } from "../controllers/admin.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";
import { crearUsuarioValidator } from "../validators/admin.validator";

const router = Router();

router.use(verifyToken, requireAdmin);

router.post("/usuarios", crearUsuarioValidator, crearUsuario);
router.get("/usuarios", listarUsuarios);

export default router;
