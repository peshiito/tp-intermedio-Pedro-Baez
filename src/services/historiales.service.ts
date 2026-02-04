import pool from "../database/mysql";
import { UserRole } from "../types/roles";
import { RowDataPacket } from "mysql2";

interface CrearHistorialDTO {
  id_mascota: number;
  id_veterinario: number;
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
  fecha_consulta: Date;
  proxima_visita?: Date;
}

export const crearHistorial = async (historialData: CrearHistorialDTO) => {
  // Verificar que la mascota existe
  const [mascota]: [RowDataPacket[], any] = await pool.query(
    "SELECT id, usuario_id FROM mascotas WHERE id = ? AND activa = TRUE",
    [historialData.id_mascota],
  );

  if (mascota.length === 0) {
    throw new Error("La mascota no existe o está inactiva");
  }

  const [result]: any = await pool.query(
    `INSERT INTO historiales_clinicos 
     (id_mascota, id_veterinario, diagnostico, tratamiento, observaciones, fecha_consulta, proxima_visita)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      historialData.id_mascota,
      historialData.id_veterinario,
      historialData.diagnostico,
      historialData.tratamiento,
      historialData.observaciones,
      historialData.fecha_consulta,
      historialData.proxima_visita,
    ],
  );

  return {
    id: result.insertId,
    ...historialData,
  };
};

export const obtenerHistorialesMascota = async (
  mascotaId: number,
  usuarioId: number,
  rolId: UserRole,
) => {
  // Verificar permisos
  if (rolId === UserRole.CLIENTE) {
    // Cliente solo puede ver historiales de sus propias mascotas
    const [verificacion]: [RowDataPacket[], any] = await pool.query(
      `SELECT m.id FROM mascotas m
       WHERE m.id = ? AND m.usuario_id = ? AND m.activa = TRUE`,
      [mascotaId, usuarioId],
    );

    if (verificacion.length === 0) {
      throw new Error("No autorizado");
    }
  } else if (rolId === UserRole.VETERINARIO) {
    // Veterinario puede ver todos los historiales que haya creado
    const [verificacion]: [RowDataPacket[], any] = await pool.query(
      `SELECT h.id FROM historiales_clinicos h
       WHERE h.id_mascota = ? AND h.id_veterinario = ?`,
      [mascotaId, usuarioId],
    );

    if (verificacion.length === 0) {
      // También puede ver si es dueño de la mascota
      const [esPropietario]: [RowDataPacket[], any] = await pool.query(
        "SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?",
        [mascotaId, usuarioId],
      );

      if (esPropietario.length === 0) {
        throw new Error("No autorizado");
      }
    }
  }
  // Admin puede ver todo sin verificación

  const [historiales]: [RowDataPacket[], any] = await pool.query(
    `SELECT h.id, h.diagnostico, h.tratamiento, h.observaciones, 
            h.fecha_consulta, h.proxima_visita, h.created_at,
            v.nombre as veterinario_nombre, v.apellido as veterinario_apellido
     FROM historiales_clinicos h
     JOIN usuarios v ON h.id_veterinario = v.id
     WHERE h.id_mascota = ?
     ORDER BY h.fecha_consulta DESC`,
    [mascotaId],
  );

  return historiales;
};
