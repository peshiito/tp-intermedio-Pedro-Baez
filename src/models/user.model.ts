import pool from "../database/mysql";

export const findUserByEmail = async (email: string) => {
  const [rows]: any = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );
  return rows[0];
};

export const createUser = async (
  nombre: string,
  email: string,
  password: string,
  roleId: number,
) => {
  const [result]: any = await pool.execute(
    "INSERT INTO users (nombre, email, password, role_id) VALUES (?, ?, ?, ?)",
    [nombre, email, password, roleId],
  );

  return result.insertId;
};
