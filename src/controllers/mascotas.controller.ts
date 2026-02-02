import { Request, Response } from "express";
import { pool } from "../database/mysql";

export const createMascota = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const { nombre, especie, raza, edad } = req.body;
    const usuarioId = req.user.id;

    const [result]: any = await pool.query(
      `INSERT INTO mascotas (nombre, especie, raza, edad, usuario_id)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, especie, raza, edad, usuarioId],
    );

    res.status(201).json({
      message: "Mascota registrada",
      mascotaId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear mascota" });
  }
};
