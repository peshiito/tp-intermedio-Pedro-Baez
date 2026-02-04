export interface JwtPayload {
  id: number;
  email: string;
  nombre: string;
  rol_id: number;
}

export enum UserRole {
  ADMIN = 1,
  USER = 2,
  VET = 3,
}
