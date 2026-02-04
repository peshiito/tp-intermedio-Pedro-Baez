import { body, param } from "express-validator";

export const crearHistorialValidator = [
  body("id_mascota").isInt({ min: 1 }).withMessage("ID de mascota inválido"),
  body("diagnostico")
    .notEmpty()
    .withMessage("El diagnóstico es requerido")
    .isLength({ min: 5, max: 1000 })
    .withMessage("El diagnóstico debe tener entre 5 y 1000 caracteres")
    .trim(),
  body("tratamiento")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("El tratamiento no puede exceder los 1000 caracteres")
    .trim(),
  body("observaciones")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Las observaciones no pueden exceder los 1000 caracteres")
    .trim(),
  body("fecha_consulta")
    .isISO8601()
    .withMessage("La fecha de consulta debe tener formato YYYY-MM-DD")
    .toDate(),
  body("proxima_visita")
    .optional()
    .isISO8601()
    .withMessage("La próxima visita debe tener formato YYYY-MM-DD")
    .toDate(),
];

export const mascotaIdValidator = [
  param("mascotaId").isInt({ min: 1 }).withMessage("ID de mascota inválido"),
];
