import {
  createMascota,
  deleteMascotaByIdAndUsuario,
  getHistorialByMascotaId,
  getMascotaById,
  getMascotaByIdAndUsuario,
  getMascotasByUsuario,
  updateMascotaByIdAndUsuario,
} from "../models/mascota.model";
import { JwtPayload } from "../types/auth";

export const createMascotaForUser = async (
  usuarioId: number,
  nombre: string,
  especie: string,
  fecha_nacimiento?: string,
) => {
  return createMascota({
    nombre,
    especie,
    fecha_nacimiento: fecha_nacimiento ?? null,
    usuario_id: usuarioId,
  });
};

export const listMascotasForUser = async (usuarioId: number) => {
  return getMascotasByUsuario(usuarioId);
};

export const updateMascotaForUser = async (
  mascotaId: number,
  usuarioId: number,
  fields: {
    nombre?: string;
    especie?: string;
    fecha_nacimiento?: string | null;
  },
) => {
  return updateMascotaByIdAndUsuario(mascotaId, usuarioId, fields);
};

export const deleteMascotaForUser = async (
  mascotaId: number,
  usuarioId: number,
) => {
  return deleteMascotaByIdAndUsuario(mascotaId, usuarioId);
};

export const getHistorialMascotaForViewer = async (
  mascotaId: number,
  viewer: JwtPayload,
) => {
  if (viewer.tipo === "usuario") {
    const mascota = await getMascotaByIdAndUsuario(mascotaId, viewer.id);
    if (!mascota) {
      return null;
    }

    return getHistorialByMascotaId(mascotaId);
  }

  if (viewer.tipo === "veterinario") {
    const mascota = await getMascotaById(mascotaId);
    if (!mascota) {
      return null;
    }

    return getHistorialByMascotaId(mascotaId, viewer.id);
  }

  return null;
};
