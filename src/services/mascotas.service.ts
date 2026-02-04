import pool from "../database/mysql";
import { UserRole } from "../types/roles";
import { RowDataPacket } from "mysql2";

export interface Mascota {
  id?: number;
  nombre: string;
  especie: string;
  raza?: string;
  fecha_nacimiento?: Date;
  usuario_id: number;
  activa?: boolean;
}

export const createMascota = async (mascotaData: Mascota): Promise<Mascota> => {
  const [result]: any = await pool.query(
    `INSERT INTO mascotas (nombre, especie, raza, fecha_nacimiento, usuario_id, activa)
     VALUES (?, ?, ?, ?, ?, TRUE)`,
    [
      mascotaData.nombre,
      mascotaData.especie,
      mascotaData.raza,
      mascotaData.fecha_nacimiento,
      mascotaData.usuario_id,
    ],
  );

  return {
    id: result.insertId,
    ...mascotaData,
    activa: true,
  };
};

export const getMascotasByUser = async (
  usuarioId: number,
  rolId: UserRole,
  soloActivas: boolean = true,
): Promise<Mascota[]> => {
  let query = `
    SELECT m.id, m.nombre, m.especie, m.raza, m.fecha_nacimiento, 
           m.activa, m.created_at, u.nombre as dueno_nombre
    FROM mascotas m
    JOIN usuarios u ON m.usuario_id = u.id
  `;

  const params: any[] = [];

  if (rolId === UserRole.CLIENTE) {
    // Cliente solo ve sus mascotas
    query += " WHERE m.usuario_id = ?";
    params.push(usuarioId);
  } else if (rolId === UserRole.VETERINARIO) {
    // Veterinario ve todas las mascotas de clientes
    query += " WHERE u.rol_id = ?";
    params.push(UserRole.CLIENTE);
  }
  // Admin ve todas sin filtro

  if (soloActivas && params.length > 0) {
    query += " AND m.activa = TRUE";
  } else if (soloActivas) {
    query += " WHERE m.activa = TRUE";
  }

  query += " ORDER BY m.created_at DESC";

  const [mascotas]: [RowDataPacket[], any] = await pool.query(query, params);
  return mascotas as Mascota[];
};

export const darBajaMascota = async (
  mascotaId: number,
  usuarioId: number,
  rolId: UserRole,
): Promise<boolean> => {
  // Verificar permisos
  if (rolId === UserRole.CLIENTE) {
    // Cliente solo puede dar de baja sus propias mascotas
    const [verificacion]: [RowDataPacket[], any] = await pool.query(
      "SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?",
      [mascotaId, usuarioId],
    );

    if (verificacion.length === 0) {
      throw new Error("No autorizado");
    }
  }
  // Veterinario y Admin pueden dar de baja cualquier mascota

  // Iniciar transacción
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Eliminar historiales clínicos (CASCADE ya lo hace automáticamente)
    // 2. Marcar mascota como inactiva
    const [result]: any = await connection.query(
      "UPDATE mascotas SET activa = FALSE WHERE id = ?",
      [mascotaId],
    );

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
