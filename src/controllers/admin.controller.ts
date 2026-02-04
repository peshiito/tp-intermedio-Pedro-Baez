import { NextFunction, Request, Response } from "express";
import pool from "../database/mysql";
import { AppError } from "../utils/appError";

export const getUsuarios = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [usuarios] = await pool.query(
      "SELECT id, nombre, apellido, email, rol_id FROM usuarios",
    );

    res.json(usuarios);
  } catch (error) {
    next(new AppError("Error al obtener usuarios", 500));
  }
};
