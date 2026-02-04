import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { JwtPayload } from "../types/auth";
import { AppError } from "../utils/appError";
import * as historialService from "../services/historial.service";

export const createHistorial = async (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || req.user.tipo !== "veterinario") {
      throw new AppError("Acceso solo para veterinarios", 403);
    }

    const { mascota_id, descripcion } = req.body;
    const historialId = await historialService.createHistorialForMascota(
      Number(mascota_id),
      req.user.id,
      descripcion,
    );

    if (!historialId) {
      throw new AppError("Mascota no encontrada", 404);
    }

    res.status(201).json({
      message: "Historial clínico creado",
      historialId,
    });
  } catch (error) {
    next(error);
  }
};
