import { Request, Response } from "express";
import pool from "../database/mysql";

export const getUsuarios = async (_req: Request, res: Response) => {
  const [usuarios] = await pool.query(
    "SELECT id, nombre, apellido, email, rol_id FROM usuarios",
  );

  res.json(usuarios);
};
