import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { JwtPayload } from "../types/auth";
import { AppError } from "../utils/appError";
import * as mascotaService from "../services/mascota.service";

export const createMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || req.user.tipo !== "usuario") {
      throw new AppError("Acceso solo para usuarios", 403);
    }

    const { nombre, especie, fecha_nacimiento } = req.body;
    const usuarioId = req.user.id;
    const mascotaId = await mascotaService.createMascotaForUser(
      usuarioId,
      nombre,
      especie,
      fecha_nacimiento,
    );

    res.status(201).json({
      message: "Mascota registrada",
      mascotaId,
    });
  } catch (error) {
    next(error);
  }
};

export const getMascotas = async (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || req.user.tipo !== "usuario") {
      throw new AppError("Acceso solo para usuarios", 403);
    }

    const usuarioId = req.user.id;
    const mascotas = await mascotaService.listMascotasForUser(usuarioId);

    res.json(mascotas);
  } catch (error) {
    next(error);
  }
};

export const getHistorialMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const { id } = req.params;
    const mascotaId = Number(id);

    const historiales = await mascotaService.getHistorialMascotaForViewer(
      mascotaId,
      req.user,
    );
    if (!historiales) {
      throw new AppError("Mascota no encontrada o no autorizada", 404);
    }

    res.json(historiales);
  } catch (error) {
    next(error);
  }
};

export const updateMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || req.user.tipo !== "usuario") {
      throw new AppError("Acceso solo para usuarios", 403);
    }

    const { id } = req.params;
    const mascotaId = Number(id);
    const { nombre, especie, fecha_nacimiento } = req.body;
    const affectedRows = await mascotaService.updateMascotaForUser(
      mascotaId,
      req.user.id,
      { nombre, especie, fecha_nacimiento },
    );

    if (!affectedRows) {
      throw new AppError("Mascota no encontrada o no autorizada", 404);
    }

    res.json({ message: "Mascota actualizada" });
  } catch (error) {
    next(error);
  }
};

export const deleteMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || req.user.tipo !== "usuario") {
      throw new AppError("Acceso solo para usuarios", 403);
    }

    const { id } = req.params;
    const mascotaId = Number(id);
    const affectedRows = await mascotaService.deleteMascotaForUser(
      mascotaId,
      req.user.id,
    );

    if (!affectedRows) {
      throw new AppError("Mascota no encontrada o no autorizada", 404);
    }

    res.json({ message: "Mascota eliminada" });
  } catch (error) {
    next(error);
  }
};
