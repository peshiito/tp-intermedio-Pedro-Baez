import {
  createMascota,
  deleteMascotaByIdAndUsuario,
  getHistorialByMascotaId,
  getMascotaByIdAndUsuario,
  getMascotasByUsuario,
  updateMascotaByIdAndUsuario,
} from "../models/mascota.model";

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

export const getHistorialMascotaForUser = async (
  mascotaId: number,
  usuarioId: number,
) => {
  const mascota = await getMascotaByIdAndUsuario(mascotaId, usuarioId);
  if (!mascota) {
    return null;
  }

  const historiales = await getHistorialByMascotaId(mascotaId);
  return historiales;
};
