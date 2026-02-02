import { UserRole } from "./auth";

export interface IUser {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  rol_id: UserRole;
}
