import pool from "../database/mysql";
import { RowDataPacket } from "mysql2";

export interface VeterinarioRow extends RowDataPacket {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  matricula: string;
  especialidad: string;
  created_at: string;
}

export const findVeterinarioByEmail = async (
  email: string,
): Promise<VeterinarioRow | null> => {
  const [rows] = await pool.query<VeterinarioRow[]>(
    "SELECT * FROM veterinarios WHERE email = ? LIMIT 1",
    [email],
  );

  return rows.length ? rows[0] : null;
};
