import { Request, Response } from "express";
import pool from "../database/mysql";
import { JwtPayload } from "../types/auth";

export const createMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { nombre, especie, fecha_nacimiento } = req.body;
    const usuarioId = req.user.id;

    const [result]: any = await pool.query(
      `INSERT INTO mascotas (nombre, especie, fecha_nacimiento, usuario_id)
       VALUES (?, ?, ?, ?)`,
      [nombre, especie, fecha_nacimiento, usuarioId],
    );

    res.status(201).json({
      message: "Mascota registrada",
      mascotaId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear mascota" });
  }
};

export const getMascotas = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const usuarioId = req.user.id;

    const [mascotas] = await pool.query(
      "SELECT id, nombre, especie, fecha_nacimiento, created_at FROM mascotas WHERE usuario_id = ?",
      [usuarioId],
    );

    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mascotas" });
  }
};

export const getHistorialMascota = async (
  req: Request & { user?: JwtPayload },
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { id } = req.params;
    const usuarioId = req.user.id;

    // Verificar que la mascota pertenece al usuario
    const [mascota]: any = await pool.query(
      "SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?",
      [id, usuarioId],
    );

    if (mascota.length === 0) {
      return res.status(404).json({ message: "Mascota no encontrada o no autorizada" });
    }

    const [historiales] = await pool.query(
      `SELECT h.id, h.descripcion, h.fecha_registro, v.nombre as veterinario_nombre, v.apellido as veterinario_apellido, v.matricula
       FROM historiales_clinicos h
       JOIN veterinarios v ON h.id_veterinario = v.id
       WHERE h.id_mascota = ?
       ORDER BY h.fecha_registro DESC`,
      [id],
    );

    res.json(historiales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial" });
  }
};
