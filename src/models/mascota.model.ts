import pool from "../database/mysql";
import { RowDataPacket } from "mysql2";

export interface MascotaInput {
  nombre: string;
  especie: string;
  fecha_nacimiento?: string | null;
  usuario_id: number;
}

export interface MascotaRow extends RowDataPacket {
  id: number;
  nombre: string;
  especie: string;
  fecha_nacimiento: string | null;
  usuario_id: number;
  created_at: string;
}

export const createMascota = async (mascota: MascotaInput): Promise<number> => {
  const [result]: any = await pool.query(
    `INSERT INTO mascotas (nombre, especie, fecha_nacimiento, usuario_id)
     VALUES (?, ?, ?, ?)`,
    [
      mascota.nombre,
      mascota.especie,
      mascota.fecha_nacimiento ?? null,
      mascota.usuario_id,
    ],
  );

  return result.insertId;
};

export const getMascotasByUsuario = async (
  usuarioId: number,
): Promise<MascotaRow[]> => {
  const [rows] = await pool.query<MascotaRow[]>(
    "SELECT id, nombre, especie, fecha_nacimiento, created_at, usuario_id FROM mascotas WHERE usuario_id = ?",
    [usuarioId],
  );

  return rows;
};

export const getMascotaByIdAndUsuario = async (
  mascotaId: number,
  usuarioId: number,
): Promise<MascotaRow | null> => {
  const [rows] = await pool.query<MascotaRow[]>(
    "SELECT id, nombre, especie, fecha_nacimiento, created_at, usuario_id FROM mascotas WHERE id = ? AND usuario_id = ? LIMIT 1",
    [mascotaId, usuarioId],
  );

  return rows.length ? rows[0] : null;
};

export const updateMascotaByIdAndUsuario = async (
  mascotaId: number,
  usuarioId: number,
  fields: Partial<Pick<MascotaInput, "nombre" | "especie" | "fecha_nacimiento">>,
): Promise<number> => {
  const updates: string[] = [];
  const values: Array<string | null> = [];

  if (fields.nombre !== undefined) {
    updates.push("nombre = ?");
    values.push(fields.nombre);
  }
  if (fields.especie !== undefined) {
    updates.push("especie = ?");
    values.push(fields.especie);
  }
  if (fields.fecha_nacimiento !== undefined) {
    updates.push("fecha_nacimiento = ?");
    values.push(fields.fecha_nacimiento ?? null);
  }

  if (!updates.length) {
    return 0;
  }

  const [result]: any = await pool.query(
    `UPDATE mascotas SET ${updates.join(", ")} WHERE id = ? AND usuario_id = ?`,
    [...values, mascotaId, usuarioId],
  );

  return result.affectedRows;
};

export const deleteMascotaByIdAndUsuario = async (
  mascotaId: number,
  usuarioId: number,
): Promise<number> => {
  const [result]: any = await pool.query(
    "DELETE FROM mascotas WHERE id = ? AND usuario_id = ?",
    [mascotaId, usuarioId],
  );

  return result.affectedRows;
};

export const getHistorialByMascotaId = async (
  mascotaId: number,
): Promise<RowDataPacket[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT h.id, h.descripcion, h.fecha_registro, v.nombre as veterinario_nombre, v.apellido as veterinario_apellido, v.matricula
     FROM historiales_clinicos h
     JOIN veterinarios v ON h.id_veterinario = v.id
     WHERE h.id_mascota = ?
     ORDER BY h.fecha_registro DESC`,
    [mascotaId],
  );

  return rows;
};
