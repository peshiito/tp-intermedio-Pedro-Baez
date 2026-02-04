import { createHistorial } from "../models/historial.model";
import { getMascotaById } from "../models/mascota.model";

export const createHistorialForMascota = async (
  mascotaId: number,
  veterinarioId: number,
  descripcion: string,
) => {
  const mascota = await getMascotaById(mascotaId);
  if (!mascota) {
    return null;
  }

  return createHistorial(mascotaId, veterinarioId, descripcion);
};
