import { body } from "express-validator";
import { UserRole } from "../types/roles";

export const crearUsuarioValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .trim(),
  body("apellido")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una mayúscula"),
  body("rol_id")
    .isIn([UserRole.ADMIN, UserRole.VETERINARIO, UserRole.CLIENTE])
    .withMessage("Rol inválido"),
  body("telefono")
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Teléfono no válido"),
  body("direccion")
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage("La dirección debe tener entre 5 y 200 caracteres")
    .trim(),
];
