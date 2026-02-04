import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as historialesService from "../services/historiales.service";
import { JwtPayload } from "../types/auth";

export const crearHistorial = async (
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

    const {
      id_mascota,
      diagnostico,
      tratamiento,
      observaciones,
      fecha_consulta,
      proxima_visita,
    } = req.body;

    const historial = await historialesService.crearHistorial({
      id_mascota,
      id_veterinario: req.user.id,
      diagnostico,
      tratamiento,
      observaciones,
      fecha_consulta,
      proxima_visita,
    });

    res.status(201).json({
      message: "Historial clínico creado exitosamente",
      historial,
    });
  } catch (error: any) {
    if (
      error.message.includes("no existe") ||
      error.message.includes("pertenece")
    ) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const obtenerHistorialesMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const { mascotaId } = req.params;
    const historiales = await historialesService.obtenerHistorialesMascota(
      parseInt(mascotaId),
      req.user.id,
      req.user.rol_id,
    );

    res.json(historiales);
  } catch (error: any) {
    if (error.message === "No autorizado") {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
