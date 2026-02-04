import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as adminService from "../services/admin.service";
import { JwtPayload } from "../types/auth";

export const crearUsuario = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const { nombre, apellido, email, password, telefono, direccion, rol_id } =
      req.body;

    // Solo admin puede crear otros admins o veterinarios
    if (rol_id === 1 && req.user.rol_id !== 1) {
      return res.status(403).json({
        message: "Solo administradores pueden crear otros administradores",
      });
    }

    const usuario = await adminService.crearUsuario({
      nombre,
      apellido,
      email,
      password,
      telefono,
      direccion,
      rol_id,
      creado_por: req.user.id,
    });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol_id: usuario.rol_id,
      },
    });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El email ya existe" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const listarUsuarios = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const usuarios = await adminService.listarUsuarios(req.user.rol_id);
    res.json(usuarios);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
