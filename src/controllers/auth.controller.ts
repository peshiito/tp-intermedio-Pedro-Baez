import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as authService from "../services/auth.service";
import { AppError } from "../utils/appError";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, apellido, email, password, telefono, direccion } = req.body;
    await authService.registerUser(
      nombre,
      apellido,
      email,
      password,
      telefono,
      direccion,
    );

    res.status(201).json({
      message: "Usuario creado correctamente",
    });
  } catch (error: any) {
    console.error("Error en register:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return next(new AppError("El email ya existe", 409));
    }
    return next(new AppError("Error al registrar el usuario", 500));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const token = await authService.loginUser(email, password);

    res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error: any) {
    if (error.message === "Credenciales inválidas") {
      return next(new AppError(error.message, 401));
    }
    return next(new AppError("Error al iniciar sesión", 500));
  }
};
