import pool from "../database/mysql";
import { RowDataPacket } from "mysql2";
import { IUser } from "../types/IUser";

export type UserRow = IUser & RowDataPacket;

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const [rows] = await pool.query<UserRow[]>(
    "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
    [email],
  );

  return rows.length ? rows[0] : null;
};

export const createUser = async (user: Omit<IUser, "id">): Promise<number> => {
  const [userResult] = await pool.query(
    "INSERT INTO usuarios (nombre, apellido, email, password, telefono, direccion, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      user.nombre,
      user.apellido,
      user.email,
      user.password,
      user.telefono,
      user.direccion,
      user.rol_id,
    ],
  );

  return (userResult as any).insertId;
};
