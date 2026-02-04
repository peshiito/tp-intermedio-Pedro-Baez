import pool from "../database/mysql";
import bcrypt from "bcryptjs";
import { UserRole } from "../types/roles";
import { RowDataPacket } from "mysql2";

interface CrearUsuarioDTO {
  nombre: string;
  apellido?: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  rol_id: UserRole;
  creado_por: number;
}

export const crearUsuario = async (usuarioData: CrearUsuarioDTO) => {
  const hashedPassword = await bcrypt.hash(usuarioData.password, 10);

  const [result]: any = await pool.query(
    `INSERT INTO usuarios 
     (nombre, apellido, email, password, telefono, direccion, rol_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      usuarioData.nombre,
      usuarioData.apellido,
      usuarioData.email,
      hashedPassword,
      usuarioData.telefono,
      usuarioData.direccion,
      usuarioData.rol_id,
    ],
  );

  return {
    id: result.insertId,
    ...usuarioData,
    password: undefined, // No devolver la contraseña
  };
};

export const listarUsuarios = async (rolId: UserRole) => {
  let query = `
    SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, 
           u.direccion, u.rol_id, r.nombre as rol_nombre, u.created_at
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
  `;

  // Si no es admin, solo muestra clientes y veterinarios (no otros admins)
  if (rolId !== UserRole.ADMIN) {
    query += " WHERE u.rol_id != 1";
  }

  query += " ORDER BY u.created_at DESC";

  const [usuarios]: [RowDataPacket[], any] = await pool.query(query);
  return usuarios;
};
