import { Router } from "express";
import { register, login, loginVeterinario } from "../controllers/auth.controller";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/veterinarios/login", loginValidator, loginVeterinario);

export default router;
