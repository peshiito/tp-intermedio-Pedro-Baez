import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
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
      return res.status(409).json({ error: "El email ya existe" });
    }
    return res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

export const login = async (req: Request, res: Response) => {
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
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
