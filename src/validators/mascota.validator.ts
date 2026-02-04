import { body, param } from "express-validator";

export const createMascotaValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .trim(),
  body("especie")
    .notEmpty()
    .withMessage("La especie es requerida")
    .isLength({ min: 2, max: 30 })
    .withMessage("La especie debe tener entre 2 y 30 caracteres")
    .trim(),
  body("raza")
    .optional()
    .isLength({ max: 50 })
    .withMessage("La raza no puede exceder los 50 caracteres")
    .trim(),
  body("fecha_nacimiento")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe tener formato YYYY-MM-DD")
    .toDate(),
];

export const updateMascotaValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo"),
  body("nombre")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .trim(),
  body("especie")
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage("La especie debe tener entre 2 y 30 caracteres")
    .trim(),
  body("raza")
    .optional()
    .isLength({ max: 50 })
    .withMessage("La raza no puede exceder los 50 caracteres")
    .trim(),
  body("fecha_nacimiento")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe tener formato YYYY-MM-DD")
    .toDate(),
];

export const mascotaIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo"),
];
