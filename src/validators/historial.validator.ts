import { body } from "express-validator";
import { ValidationChain } from "express-validator";

export const createHistorialValidator: ValidationChain[] = [
  body("mascota_id")
    .isInt({ min: 1 })
    .withMessage("mascota_id debe ser un número válido"),
  body("descripcion")
    .isLength({ min: 5 })
    .withMessage("La descripción debe tener al menos 5 caracteres"),
];
