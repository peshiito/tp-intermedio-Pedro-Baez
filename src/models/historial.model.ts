import pool from "../database/mysql";
import { RowDataPacket } from "mysql2";

export interface HistorialRow extends RowDataPacket {
  id: number;
  id_mascota: number;
  id_veterinario: number;
  descripcion: string;
  fecha_registro: string;
}

export const createHistorial = async (
  mascotaId: number,
  veterinarioId: number,
  descripcion: string,
): Promise<number> => {
  const [result]: any = await pool.query(
    `INSERT INTO historiales_clinicos (id_mascota, id_veterinario, descripcion)
     VALUES (?, ?, ?)`,
    [mascotaId, veterinarioId, descripcion],
  );

  return result.insertId;
};
