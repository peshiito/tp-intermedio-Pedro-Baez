import { body } from "express-validator";
import { ValidationChain } from "express-validator";

export const createMascotaValidator: ValidationChain[] = [
  body("nombre")
    .isLength({ min: 1 })
    .withMessage("Nombre de la mascota es requerido"),
  body("especie").isLength({ min: 1 }).withMessage("Especie es requerida"),
  body("fecha_nacimiento")
    .optional()
    .isISO8601()
    .withMessage("Fecha de nacimiento debe ser una fecha válida"),
];
