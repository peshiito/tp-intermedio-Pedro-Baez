import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../database/mysql";

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, email, password, telefono, direccion } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    // verificar si existe
    const [exists]: any = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email],
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // rol USER por defecto (id = 2)
    const [result]: any = await pool.query(
      `INSERT INTO usuarios 
      (nombre, apellido, email, password, telefono, direccion, rol_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, email, hashedPassword, telefono, direccion, 2],
    );

    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    res.status(201).json({
      message: "Usuario creado correctamente",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
