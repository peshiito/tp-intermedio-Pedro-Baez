import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as mascotasService from "../services/mascotas.service";
import { JwtPayload } from "../types/auth";
import { UserRole } from "../types/roles";

export const createMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Solo clientes pueden crear mascotas
    if (req.user.rol_id !== UserRole.CLIENTE) {
      return res.status(403).json({
        message: "Solo clientes pueden registrar mascotas",
      });
    }

    const mascota = await mascotasService.createMascota({
      ...req.body,
      usuario_id: req.user.id,
    });

    res.status(201).json({
      message: "Mascota registrada exitosamente",
      mascota,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMascotas = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { activas } = req.query;
    const soloActivas = activas !== "false"; // Por defecto true

    const mascotas = await mascotasService.getMascotasByUser(
      req.user.id,
      req.user.rol_id,
      soloActivas,
    );

    res.json(mascotas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const darBajaMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { id } = req.params;
    const baja = await mascotasService.darBajaMascota(
      parseInt(id),
      req.user.id,
      req.user.rol_id,
    );

    if (!baja) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    res.json({
      message:
        "Mascota dada de baja exitosamente. Los historiales también se eliminaron.",
    });
  } catch (error: any) {
    if (error.message === "No autorizado") {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
